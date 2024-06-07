declare global {
  var crypto:
    | {
        getRandomValues?(array: Uint8Array): Uint8Array;
      }
    | undefined;
}

function cryptoGetRandomValuesImpl(array: Uint8Array): Uint8Array {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

const cryptoGetRandomValues =
  globalThis.crypto?.getRandomValues?.bind(crypto) ?? cryptoGetRandomValuesImpl;
export default cryptoGetRandomValues;
