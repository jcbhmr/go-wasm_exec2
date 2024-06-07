import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Go } from "../src/index.ts";

test("hello-world", async () => {
  const go = new Go({
    import: (s, o) => import(s, o),
    importMeta: import.meta,
  });
  const { instance } = await WebAssembly.instantiate(
    await readFile(new URL(import.meta.resolve("./testdata/hello-world.wasm"))),
    go.getImportObject(),
  );
  const exitCode = await go.start(instance);
  assert.equal(exitCode, 0);
});

test("hello-import", async () => {
  const go = new Go({
    import: (s, o) => import(s, o),
    importMeta: import.meta,
  });
  const { instance } = await WebAssembly.instantiate(
    await readFile(
      new URL(import.meta.resolve("./testdata/hello-import.wasm")),
    ),
    go.getImportObject(),
  );
  const exitCode = await go.start(instance);
  assert.equal(exitCode, 0);
});
