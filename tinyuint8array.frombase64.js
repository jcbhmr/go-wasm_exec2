import { myEncode } from "./tinyfast-text-encoding.js";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let lookup = null;
function Uint8ArrayFromBase64Impl(base64) {
  lookup ??= Object.fromEntries(
    Array.from(alphabet).map((a, i) => [a.charCodeAt(0), i]),
  );
  lookup["=".charCodeAt(0)] = 0;
  lookup["-".charCodeAt(0)] = 62;
  lookup["_".charCodeAt(0)] = 63;

  base64 = base64.replace(/=/g, "");
  let n = base64.length;
  let rem = n % 4;
  let k = rem && rem - 1; // how many bytes the last base64 chunk encodes
  let m = (n >> 2) * 3 + k; // total encoded bytes

  let encoded = myEncode(base64 + "===");

  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    let x =
      (lookup[encoded[i]] << 18) +
      (lookup[encoded[i + 1]] << 12) +
      (lookup[encoded[i + 2]] << 6) +
      lookup[encoded[i + 3]];
    encoded[j] = x >> 16;
    encoded[j + 1] = (x >> 8) & 0xff;
    encoded[j + 2] = x & 0xff;
  }
  return new Uint8Array(encoded.buffer, 0, m);
}
const Uint8ArrayFromBase64 = Uint8Array.fromBase64 ?? Uint8ArrayFromBase64Impl;
export default Uint8ArrayFromBase64;
