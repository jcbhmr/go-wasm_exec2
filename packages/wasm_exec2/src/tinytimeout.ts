declare global {
  var setTimeout: ((f: () => void, ms: number) => number) | undefined;
  var clearTimeout: ((id: number) => void) | undefined;
}

let nextId = 1;
// @ts-ignore
const fns: Record<number, () => void> = { __proto__: null! };
function setTimeoutImpl(f: () => void, ms: number) {
  const id = nextId++;
  fns[id] = f;
  void asyncSpin(id, ms);
  return id;
}
async function asyncSpin(id: number, ms: number) {
  const start = Date.now();
  while (true) {
    await Promise.resolve();
    if (!(id in fns)) {
      return;
    }
    const dur = Date.now() - start;
    if (dur >= ms) {
      const f = fns[id];
      delete fns[id];
      f();
      return;
    }
  }
}
function clearTimeoutImpl(id: number) {
  delete fns[id];
}

export const setTimeout = globalThis.setTimeout ?? setTimeoutImpl;
export const clearTimeout = globalThis.clearTimeout ?? clearTimeoutImpl;
