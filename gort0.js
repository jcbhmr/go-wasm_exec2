import Uint8ArrayFromBase64 from "./tinyuint8array.frombase64.js";
import { myGunzip } from "./tinyfflate.js";
import { Go } from "./index.js";
import * as fsStub from "./node-fs-stub.js";
import * as fsPromisesStub from "./node-fs-promises-stub.js";
import * as processStub from "./node-process-stub.js";

const testWASM = await myGunzip(Uint8ArrayFromBase64(__TEST_WASM_GZ_BASE64__));
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
        if (specifierString === "fs" || specifierString === "node:fs") {
          return fsStub;
        } else if (specifierString === "fs/promises" || specifierString === "node:fs/promises") {
          return fsPromisesStub;
        } else if (specifierString === "process" || specifierString === "node:process") {
          return processStub;
        } else {
          return await import(specifierString);
        }
      }
    } else {
      try {
        return await import(specifierString);
      } catch (error) {
        if (specifierString === "fs" || specifierString === "node:fs") {
          return fsStub;
        } else if (specifierString === "fs/promises" || specifierString === "node:fs/promises") {
          return fsPromisesStub;
        } else if (specifierString === "process" || specifierString === "node:process") {
          return processStub;
        } else {
          throw error;
        }
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
