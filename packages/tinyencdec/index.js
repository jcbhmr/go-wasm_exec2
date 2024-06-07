import {
  encodeFallback,
  decodeFallback,
} from "./fast-text-encoding/lowlevel.js";

let encoder = null;
export function encode(str) {
  if (globalThis.TextEncoder) {
    if (!encoder) {
      encoder = new TextEncoder();
    }
    return encoder.encode(str);
  }
  return encodeFallback(str);
}

let decoder = null;
export function decode(bytes) {
  if (globalThis.TextDecoder) {
    if (!decoder) {
      decoder = new TextDecoder();
    }
    return decoder.decode(bytes);
  }
  return decodeFallback(bytes);
}
