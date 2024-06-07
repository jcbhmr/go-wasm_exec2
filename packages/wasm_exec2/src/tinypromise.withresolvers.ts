declare global {
  interface PromiseConstructor {
    withResolvers?: <T>() => {
      promise: Promise<T>;
      resolve: (value: T) => void;
      reject: (reason: any) => void;
    };
  }
}

function PromiseWithResolversImpl<T>(_P: PromiseConstructor) {
  let resolve: (value: T) => void;
  let reject: (reason: any) => void;
  const promise = new Promise<T>((resolve2, reject2) => {
    resolve = resolve2;
    reject = reject2;
  });
  // @ts-ignore
  return { promise, resolve, reject };
}
const PromiseWithResolvers = Promise.withResolvers
  ? <T>(_P: PromiseConstructor) => Promise.withResolvers!<T>()
  : PromiseWithResolversImpl;
export default PromiseWithResolvers;
