declare global {
  var setTimeout: ((f: () => void, ms: number) => number) | undefined;
  var clearTimeout: ((id: number) => void) | undefined;
}

let pollPromise = null;
let nextId = 1;
// @ts-ignore
const fns: Record<number, () => void> = { __proto__: null! };
// @ts-ignore
const startTimes: Record<number, number> = { __proto__: null! };
function setTimeoutImpl(f: () => void, ms: number) {
  const id = nextId++;
  fns[id] = f;
  startTimes[id] = Date.now();
  if (!pollPromise) {
    pollPromise = poll();
    void pollPromise.then(() => {
      pollPromise = null;
    });
  }
  return id;
}
async function poll() {
  for (let ids = Object.keys(fns); ids.length; ids = Object.keys(fns)) {
    await Promise.resolve();
    for (const id of ids) {
      const start = startTimes[id];
      const dur = Date.now() - start;
      if (dur >= ms) {
        const f = fns[id];
        delete fns[id];
        delete startTimes[id];
        f();
      }
    }
  }
}
function clearTimeoutImpl(id: number) {
  delete fns[id];
}

export const setTimeout = globalThis.setTimeout ?? setTimeoutImpl;
export const clearTimeout = globalThis.clearTimeout ?? clearTimeoutImpl;
