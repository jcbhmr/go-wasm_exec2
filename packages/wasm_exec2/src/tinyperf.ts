declare global {
  var performance: { timeOrigin?: number; now?(): number } | undefined;
}
export const performanceTimeOrigin =
  globalThis.performance?.timeOrigin ?? Date.now();
export const performanceNow = globalThis.performance?.now
  ? () => performance!.now!()
  : () => Date.now() - performanceTimeOrigin;
