import Uint8ArrayFromBase64 from "./tinyuint8array.frombase64.js";
import { Go } from "./index.js";
import * as fsStub from "./node-fs-stub.js";
import * as processStub from "./node-process-stub.js";

// Can't wait for throw expressions!
// https://github.com/tc39/proposal-throw-expressions
const throw_ = (error) => { throw error; };

const testWASM = await Uint8ArrayFromBase64(__TEST_WASM_BASE64__);
const go = new Go({
  import: async (specifier, _options) => {
    const specifierString = `${specifier}`;
    if (typeof import.meta?.resolve === "function") {
      /** @type {string | undefined} */
      let resolved;
      try {
        // Some older Node.js & Bun implementations of import.meta.resolve() return promises.
        resolved = await import.meta.resolve(specifierString);
      } catch {}
      if (resolved) {
        return await import(resolved);
      } else {
        return {
          __proto__: null,
          "fs": fsStub,
          "node:fs": fsStub,
          "process": processStub,
          "node:process": processStub,
        }[specifierString] ?? await import(specifierString);
      }
    } else {
      try {
        return await import(specifierString);
      } catch (error) {
        return {
          __proto__: null,
          "fs": fsStub,
          "node:fs": fsStub,
          "process": processStub,
          "node:process": processStub,
        }[specifierString] ?? throw_(error);
      }
    }
  },
  importMeta: import.meta,
});
const { instance } = await WebAssembly.instantiate(
  testWASM,
  go.getImportObject(),
);
await go.start(instance);
