#!/usr/bin/env node
import { glob } from "node:fs/promises";
import { $ } from "execa";

async function generate() {
  const srcFiles = await Array.fromAsync(glob("test/testdata/*.go"));
  for (const srcFile of srcFiles) {
    const outFile = srcFile.replace(/\.go$/, ".wasm");
    await $({
      verbose: true,
      env: {
        GOOS: "js",
        GOARCH: "wasm",
      },
    })`go build -o ${outFile} ${srcFile}`;
  }
}

function fatal(message) {
  console.error(message);
  process.exit(1);
}

const tasks = { __proto__: null, generate };
const taskName = process.argv[2] ?? fatal("No task specified");
const task = tasks[taskName] ?? fatal(`Unknown task: ${taskName}`);
await task();
