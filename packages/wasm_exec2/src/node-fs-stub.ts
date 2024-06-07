import { decode } from "tinyencdec";
import { createENOSYS } from "./utils.js";

let outputBuffer = "";
export const constants = {
  __proto__: null,
  O_WRONLY: -1,
  O_RDWR: -1,
  O_CREAT: -1,
  O_TRUNC: -1,
  O_APPEND: -1,
  O_EXCL: -1,
};
export function writeSync(
  fd: number,
  buffer: ArrayBufferView,
  offset: number,
  length: number,
  position: null,
) {
  if ((fd !== 1 && fd !== 2) || position != null) {
    throw createENOSYS();
  }
  const bytes = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset + (offset ?? 0),
    length ?? buffer.byteLength - (offset ?? 0),
  );
  outputBuffer += decode(bytes);
  const newlineIndex = outputBuffer.lastIndexOf("\n");
  if (newlineIndex !== -1) {
    const text = outputBuffer.slice(0, newlineIndex);
    outputBuffer = outputBuffer.slice(newlineIndex + 1);
    globalThis.console?.log(text);
  }
  return bytes.length;
}
export function write(
  fd: number,
  buffer: ArrayBufferView,
  offset: number,
  length: number,
  position: null,
  callback: (arg0: unknown, arg1?: number) => void,
) {
  if ((fd !== 1 && fd !== 2) || position != null) {
    throw createENOSYS();
  }
  let x: number;
  try {
    x = writeSync(fd, buffer, offset, length, position);
  } catch (e) {
    callback(e);
    return;
  }
  callback(null, x);
}
export const chmod = (_path: any, _mode: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const chown = (
  _path: any,
  _uid: any,
  _gid: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const close = (_fd: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const fchmod = (_fd: any, _mode: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const fchown = (
  _fd: any,
  _uid: any,
  _gid: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const fstat = (_fd: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const fsync = (_fd: any, callback: (arg0: null) => any) =>
  void callback(null);
export const ftruncate = (
  _fd: any,
  _length: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const lchown = (
  _path: any,
  _uid: any,
  _gid: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const link = (_path: any, _link: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const lstat = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const mkdir = (_path: any, _perm: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const open = (
  _path: any,
  _flags: any,
  _mode: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const read = (
  _fd: any,
  _buffer: any,
  _offset: any,
  _length: any,
  _position: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const readdir = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const readlink = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const rename = (_from: any, _to: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const rmdir = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const stat = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const symlink = (
  _path: any,
  _link: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const truncate = (
  _path: any,
  _length: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
export const unlink = (_path: any, callback: (arg0: Error) => any) =>
  void callback(createENOSYS());
export const utimes = (
  _path: any,
  _atime: any,
  _mtime: any,
  callback: (arg0: Error) => any,
) => void callback(createENOSYS());
