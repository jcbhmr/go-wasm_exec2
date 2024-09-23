import Uint8ArrayFromBase64 from "./tinyuint8array.frombase64.js";
import { Go } from "./index.js";

const testWASM = await Uint8ArrayFromBase64(__TEST_WASM_BASE64__);
const go = new Go({
  import: async (specifier, _options) => import(specifier),
  importMeta: import.meta,
});
const { instance } = await WebAssembly.instantiate(
  testWASM,
  go.getImportObject(),
);
await go.start(instance);
