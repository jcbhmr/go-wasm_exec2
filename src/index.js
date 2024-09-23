import { encode, decode } from "tinyencdec";
import { performanceNow, performanceTimeOrigin } from "./tinyperf.js";
import { setTimeout, clearTimeout } from "./tinytimeout.js";
import cryptoGetRandomValues from "./tinycrypto.getrandomvalues.js";
import PromiseWithResolvers from "./tinypromise.withresolvers.js";

/**
 * @typedef {object} GoOptions
 * @property {((specifier: string, options?: ImportCallOptions) => Promise<any>) | null | undefined} [import]
 * @property {ImportMeta | null | undefined} [importMeta]
 * @property {boolean | undefined} [returnOnExit]
 */

/**
 * Inspired by [`node:wasi`](https://nodejs.org/api/wasi.html).
 */
export class Go {
  _import: (
    specifier: string,
    options?: ImportCallOptions,
  ) => Promise<any>;
  protected _importMeta: ImportMeta | null = null;
  #readyState: "created" | "starting" | "running" | "exited" = "created";
  #returnOnExit: boolean;
  constructor(options: GoOptions = {}) {
    if (options.import) {
      this._import = options.import;
    } else {
      try {
        // @ts-ignore
        this._import = new Function("s", "o", "return import(s)");
      } catch {
        this._import = (specifier) => import(specifier);
      }
    }
    this._importMeta = options.importMeta ?? null;
    this.#returnOnExit = options.returnOnExit ?? true;
  }

  /** @type {DataView | null} */
  #dataViewCache: DataView | null = null;
  get #dataView() {
    if (!this.#dataViewCache) {
      const memory = /** @type {WebAssembly.Memory} */ this.#instance!.exports
        .mem as WebAssembly.Memory;
      this.#dataViewCache = new DataView(memory.buffer);
    }
    return this.#dataViewCache;
  }

  #setInt64(addr: number, v: number) {
    this.#dataView.setUint32(addr + 0, v, true);
    this.#dataView.setUint32(addr + 4, Math.floor(v / 4294967296), true);
  }
  #getInt64(addr: number) {
    const low = this.#dataView.getUint32(addr + 0, true);
    const high = this.#dataView.getInt32(addr + 4, true);
    return low + high * 4294967296;
  }
  #loadValue(addr: number) {
    const f = this.#dataView.getFloat64(addr, true);
    if (f === 0) {
      return undefined;
    }
    if (!isNaN(f)) {
      return f;
    }

    const id = this.#dataView.getUint32(addr, true);
    return this.#values![id];
  }
  #storeValue(addr: number, v: any) {
    const nanHead = 0x7ff80000;

    if (typeof v === "number" && v !== 0) {
      if (isNaN(v)) {
        this.#dataView.setUint32(addr + 4, nanHead, true);
        this.#dataView.setUint32(addr, 0, true);
        return;
      }
      this.#dataView.setFloat64(addr, v, true);
      return;
    }

    if (v === undefined) {
      this.#dataView.setFloat64(addr, 0, true);
      return;
    }

    let id = this.#ids!.get(v);
    if (id === undefined) {
      this.#idPool!.pop();
      if (id === undefined) {
        id = this.#values!.length;
      }
      this.#values![id] = v;
      this.#goRefCounts![id] = 0;
      this.#ids!.set(v, id);
    }
    this.#goRefCounts![id]++;
    let typeFlag = 0;
    switch (typeof v) {
      case "object":
        if (v !== null) {
          typeFlag = 1;
        }
        break;
      case "string":
        typeFlag = 2;
        break;
      case "symbol":
        typeFlag = 3;
        break;
      case "function":
        typeFlag = 4;
        break;
    }
    this.#dataView.setUint32(addr + 4, nanHead | typeFlag, true);
    this.#dataView.setUint32(addr, id, true);
  }
  #loadSlice(addr: number) {
    const array = this.#getInt64(addr + 0);
    const len = this.#getInt64(addr + 8);
    return new Uint8Array(this.#dataView.buffer, array, len);
  }
  #loadSliceOfValues(addr: number) {
    const array = this.#getInt64(addr + 0);
    const len = this.#getInt64(addr + 8);
    const a = new Array(len);
    for (let i = 0; i < len; i++) {
      a[i] = this.#loadValue(array + i * 8);
    }
    return a;
  }
  #loadString(addr: number) {
    const saddr = this.#getInt64(addr + 0);
    const len = this.#getInt64(addr + 8);
    return decode(new Uint8Array(this.#dataView.buffer, saddr, len));
  }

  /** @returns {WebAssembly.Imports} */
  getImportObject(): WebAssembly.Imports {
    return { gojs: this.gojs };
  }

  /** @type {WebAssembly.ModuleImports} */
  _gotest: WebAssembly.ModuleImports = {
    add: (a: any, b: any) => a + b,
  };

  /** @type {WebAssembly.ModuleImports} */
  gojs: WebAssembly.ModuleImports = {
    // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
    // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
    // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
    // This changes the SP, thus we have to update the SP used by the imported function.

    // func wasmExit(code int32)
    "runtime.wasmExit": (sp: number) => {
      sp >>>= 0;
      const code = this.#dataView.getInt32(sp + 8, true);
      // Unsure what order to a) exit() and b) destroy instance data.
      if (this.#returnOnExit && this.#process.default) {
        this.#process.default.exitCode = code;
      } else {
        this.#process.exit(code);
      }
      this.#readyState = "exited";
      this.#startDeferred!.resolve(code);
      this.#instance = null;
      this.#dataViewCache = null;
      this.#values = null;
      this.#goRefCounts = null;
      this.#ids = null;
      this.#idPool = null;
      this.#startDeferred = null;
      this.#fs = null;
      this.#process = null;
      this._pendingEvent = null;
    },

    // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
    "runtime.wasmWrite": (sp: number) => {
      sp >>>= 0;
      const fd = this.#getInt64(sp + 8);
      const p = this.#getInt64(sp + 16);
      const n = this.#dataView.getInt32(sp + 24, true);
      this.#fs.writeSync(fd, new Uint8Array(this.#dataView.buffer, p, n));
    },

    // func resetMemoryDataView()
    "runtime.resetMemoryDataView": (sp: number) => {
      sp >>>= 0;
      const memory = this.#instance!.exports.mem as WebAssembly.Memory;
      this.#dataViewCache = new DataView(memory.buffer);
    },

    // func nanotime1() int64
    "runtime.nanotime1": (sp: number) => {
      sp >>>= 0;
      this.#setInt64(
        sp + 8,
        (performanceTimeOrigin + performanceNow()) * 1000000,
      );
    },

    // func walltime() (sec int64, nsec int32)
    "runtime.walltime": (sp: number) => {
      sp >>>= 0;
      const msec = new Date().getTime();
      this.#setInt64(sp + 8, msec / 1000);
      this.#dataView.setInt32(sp + 16, (msec % 1000) * 1000000, true);
    },

    // func scheduleTimeoutEvent(delay int64) int32
    "runtime.scheduleTimeoutEvent": (sp: number) => {
      sp >>>= 0;
      const id = this.#nextCallbackTimeoutID;
      this.#nextCallbackTimeoutID++;
      this.#scheduledTimeouts!.set(
        id,
        setTimeout(
          () => {
            this.#resume();
            while (this.#scheduledTimeouts!.has(id)) {
              // for some reason Go failed to register the timeout event, log and try again
              // (temporary workaround for https://github.com/golang/go/issues/28975)
              globalThis.console?.warn(
                "scheduleTimeoutEvent: missed timeout event",
              );
              this.#resume();
            }
          },
          this.#getInt64(sp + 8),
        ),
      );
      this.#dataView.setInt32(sp + 16, id, true);
    },

    // func clearTimeoutEvent(id int32)
    "runtime.clearTimeoutEvent": (sp: number) => {
      sp >>>= 0;
      const id = this.#dataView.getInt32(sp + 8, true);
      clearTimeout(this.#scheduledTimeouts!.get(id)!);
      this.#scheduledTimeouts!.delete(id);
    },

    // func getRandomData(r []byte)
    "runtime.getRandomData": (sp: number) => {
      sp >>>= 0;
      cryptoGetRandomValues(this.#loadSlice(sp + 8));
    },

    // func finalizeRef(v ref)
    "syscall/js.finalizeRef": (sp: number) => {
      sp >>>= 0;
      const id = this.#dataView.getUint32(sp + 8, true);
      this.#goRefCounts![id]--;
      if (this.#goRefCounts![id] === 0) {
        const v = this.#values![id];
        this.#values![id] = null;
        this.#ids!.delete(v);
        this.#idPool!.push(id);
      }
    },

    // func stringVal(value string) ref
    "syscall/js.stringVal": (sp: number) => {
      sp >>>= 0;
      this.#storeValue(sp + 24, this.#loadString(sp + 8));
    },

    // func valueGet(v ref, p string) ref
    "syscall/js.valueGet": (sp: number) => {
      sp >>>= 0;
      const result = Reflect.get(
        this.#loadValue(sp + 8),
        this.#loadString(sp + 16),
      );
      const getsp = this.#instance!.exports.getsp as () => number;
      sp = getsp() >>> 0; // see comment above
      this.#storeValue(sp + 32, result);
    },

    // func valueSet(v ref, p string, x ref)
    "syscall/js.valueSet": (sp: number) => {
      sp >>>= 0;
      Reflect.set(
        this.#loadValue(sp + 8),
        this.#loadString(sp + 16),
        this.#loadValue(sp + 32),
      );
    },

    // func valueDelete(v ref, p string)
    "syscall/js.valueDelete": (sp: number) => {
      sp >>>= 0;
      Reflect.deleteProperty(
        this.#loadValue(sp + 8),
        this.#loadString(sp + 16),
      );
    },

    // func valueIndex(v ref, i int) ref
    "syscall/js.valueIndex": (sp: number) => {
      sp >>>= 0;
      this.#storeValue(
        sp + 24,
        Reflect.get(this.#loadValue(sp + 8), this.#getInt64(sp + 16)),
      );
    },

    // valueSetIndex(v ref, i int, x ref)
    "syscall/js.valueSetIndex": (sp: number) => {
      sp >>>= 0;
      Reflect.set(
        this.#loadValue(sp + 8),
        this.#getInt64(sp + 16),
        this.#loadValue(sp + 24),
      );
    },

    // func valueCall(v ref, m string, args []ref) (ref, bool)
    "syscall/js.valueCall": (sp: number) => {
      sp >>>= 0;
      try {
        const v = this.#loadValue(sp + 8);
        const m = Reflect.get(v, this.#loadString(sp + 16));
        const args = this.#loadSliceOfValues(sp + 32);
        const result = Reflect.apply(m, v, args);
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 56, result);
        this.#dataView.setUint8(sp + 64, 1);
      } catch (err) {
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 56, err);
        this.#dataView.setUint8(sp + 64, 0);
      }
    },

    // func valueInvoke(v ref, args []ref) (ref, bool)
    "syscall/js.valueInvoke": (sp: number) => {
      sp >>>= 0;
      try {
        const v = this.#loadValue(sp + 8);
        const args = this.#loadSliceOfValues(sp + 16);
        const result = Reflect.apply(v, undefined, args);
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 40, result);
        this.#dataView.setUint8(sp + 48, 1);
      } catch (err) {
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 40, err);
        this.#dataView.setUint8(sp + 48, 0);
      }
    },

    // func valueNew(v ref, args []ref) (ref, bool)
    "syscall/js.valueNew": (sp: number) => {
      sp >>>= 0;
      try {
        const v = this.#loadValue(sp + 8);
        const args = this.#loadSliceOfValues(sp + 16);
        const result = Reflect.construct(v, args);
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 40, result);
        this.#dataView.setUint8(sp + 48, 1);
      } catch (err) {
        const getsp = this.#instance!.exports.getsp as () => number;
        sp = getsp() >>> 0; // see comment above
        this.#storeValue(sp + 40, err);
        this.#dataView.setUint8(sp + 48, 0);
      }
    },

    // func valueLength(v ref) int
    "syscall/js.valueLength": (sp: number) => {
      sp >>>= 0;
      this.#setInt64(sp + 16, parseInt(this.#loadValue(sp + 8).length));
    },

    // valuePrepareString(v ref) (ref, int)
    "syscall/js.valuePrepareString": (sp: number) => {
      sp >>>= 0;
      const str = encode(String(this.#loadValue(sp + 8)));
      this.#storeValue(sp + 16, str);
      this.#setInt64(sp + 24, str.length);
    },

    // valueLoadString(v ref, b []byte)
    "syscall/js.valueLoadString": (sp: number) => {
      sp >>>= 0;
      const str = this.#loadValue(sp + 8);
      this.#loadSlice(sp + 16).set(str);
    },

    // func valueInstanceOf(v ref, t ref) bool
    "syscall/js.valueInstanceOf": (sp: number) => {
      sp >>>= 0;
      this.#dataView.setUint8(
        sp + 24,
        this.#loadValue(sp + 8) instanceof this.#loadValue(sp + 16) ? 1 : 0,
      );
    },

    // func copyBytesToGo(dst []byte, src ref) (int, bool)
    "syscall/js.copyBytesToGo": (sp: number) => {
      sp >>>= 0;
      const dst = this.#loadSlice(sp + 8);
      const src = this.#loadValue(sp + 32);
      if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
        this.#dataView.setUint8(sp + 48, 0);
        return;
      }
      const toCopy = src.subarray(0, dst.length);
      dst.set(toCopy);
      this.#setInt64(sp + 40, toCopy.length);
      this.#dataView.setUint8(sp + 48, 1);
    },

    // func copyBytesToJS(dst ref, src []byte) (int, bool)
    "syscall/js.copyBytesToJS": (sp: number) => {
      sp >>>= 0;
      const dst = this.#loadValue(sp + 8);
      const src = this.#loadSlice(sp + 16);
      if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
        this.#dataView.setUint8(sp + 48, 0);
        return;
      }
      const toCopy = src.subarray(0, dst.length);
      dst.set(toCopy);
      this.#setInt64(sp + 40, toCopy.length);
      this.#dataView.setUint8(sp + 48, 1);
    },

    debug: (value: any) => {
      globalThis.console?.log(value);
    },
  };

  protected _pendingEvent: { id: number; this: any; args: any[] } | null = null;
  #resume() {
    if (this.#readyState !== "running") {
      throw new Error("Go program has already exited");
    }
    const resume = this.#instance!.exports.resume as () => void;
    resume();
  }
  protected _makeFuncWrapper(id: number) {
    const go = this;
    return function (this: any, ...args: any) {
      const event = { id: id, this: this, args: args };
      go._pendingEvent = event;
      go.#resume();
      return (event as typeof event & { result: any }).result;
    };
  }

  #fs: any | null = null;
  #process: any | null = null;
  #instance: WebAssembly.Instance | null = null;
  #startDeferred: {
    promise: Promise<number>;
    resolve: (value: number) => void;
    reject: (reason: any) => void;
  } | null = null;
  #values: any[] | null = null;
  #goRefCounts: number[] | null = null;
  #ids: Map<any, number> | null = null;
  #idPool: number[] | null = null;
  #nextCallbackTimeoutID: number = 1;
  #scheduledTimeouts: Map<number, number> | null = null;
  async start(instance: WebAssembly.Instance) {
    if (this.#readyState !== "created") {
      throw new Error("Go program already started");
    }
    this.#readyState = "starting";
    this.#instance = instance;

    this.#fs = await this._import("node:fs");
    this.#process = await this._import("node:process");

    // Go code uses `js.Global().Get("fs")` and `js.Global().Get("process")`.
    // Ideally it would use `js.Import()` instead.
    const fakeGlobalThis = new Proxy(globalThis, {
      get: (target, p) => {
        if (p === "fs") {
          return this.#fs;
        } else if (p === "process") {
          return this.#process;
        } else {
          return Reflect.get(target, p);
        }
      },
      set: (target, p, value) => {
        if (p === "fs") {
          this.#fs = value;
          return true;
        } else if (p === "process") {
          this.#process = value;
          return true;
        } else {
          return Reflect.set(target, p, value);
        }
      },
    });

    this.#values = [NaN, 0, null, true, false, fakeGlobalThis, this];
    this.#goRefCounts = new Array(this.#values.length).fill(Infinity);
    this.#ids = new Map([
      [0, 1],
      [null, 2],
      [true, 3],
      [false, 4],
      [fakeGlobalThis, 5],
      [this, 6],
    ] as [any, number][]);
    this.#idPool = [];
    this.#scheduledTimeouts = new Map();

    // Pass command line arguments and environment variables to WebAssembly by writing them to the linear memory.
    let offset = 4096;

    const strPtr = (str: string) => {
      const ptr = offset;
      const bytes = encode(str + "\0");
      new Uint8Array(this.#dataView.buffer, offset, bytes.length).set(bytes);
      offset += bytes.length;
      if (offset % 8 !== 0) {
        offset += 8 - (offset % 8);
      }
      return ptr;
    };

    const args = this.#process.argv.slice();
    args[0] = this.#process.argv0;
    const argc = args.length;

    const argvPtrs: number[] = [];
    for (const arg of args) {
      argvPtrs.push(strPtr(arg));
    }
    argvPtrs.push(0);
    for (const [key, value] of Object.entries(this.#process.env)) {
      argvPtrs.push(strPtr(`${key}=${value}`));
    }
    argvPtrs.push(0);

    const argvPtr = offset;
    for (const ptr of argvPtrs) {
      this.#dataView.setUint32(offset, ptr, true);
      this.#dataView.setUint32(offset + 4, 0, true);
      offset += 8;
    }

    // The linker guarantees global data starts from at least wasmMinDataAddr.
    // Keep in sync with cmd/link/internal/ld/data.go:wasmMinDataAddr.
    const wasmMinDataAddr = 4096 + 8192;
    if (offset >= wasmMinDataAddr) {
      throw new Error(
        "total length of command line and environment variables exceeds limit",
      );
    }

    this.#startDeferred = PromiseWithResolvers<number>(Promise);
    this.#readyState = "running";
    const run = this.#instance.exports.run as (
      argc: number,
      argvPtr: number,
    ) => void;
    run(argc, argvPtr);
    return this.#startDeferred.promise;
  }
}
