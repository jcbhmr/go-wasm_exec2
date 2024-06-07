import Uint8ArrayFromBase64 from "./tinyuint8array.frombase64.ts";
import gunzip from "./gunzip.ts";
import { Go } from "wasm_exec2";
import * as fsStub from "wasm_exec2/node-fs-stub";
import * as processStub from "wasm_exec2/node-process-stub";

const appWASM = await gunzip(Uint8ArrayFromBase64(__APP_WASM_GZ_BASE64__));
const go = new Go({
  import: (specifier: string, _options?: ImportCallOptions) =>
    import(specifier).catch((e) => {
      if (specifier === "node:fs" || specifier === "fs") {
        return fsStub;
      } else if (specifier === "node:process" || specifier === "process") {
        return processStub;
      } else {
        throw e;
      }
    }),
  importMeta: import.meta,
});
const { instance } = await WebAssembly.instantiate(
  appWASM,
  go.getImportObject(),
);
await go.start(instance);
