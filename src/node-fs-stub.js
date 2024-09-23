import { myDecode } from "./tinyfast-text-encoding.js";

function createENOSYS() {
    const e = new Error("ENOSYS: Function not implemented");
    // @ts-ignore
    e.code = "ENOSYS";
    return e;
}

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
export function writeSync(fd, buffer, offset, length, position) {
    if ((fd !== 1 && fd !== 2) || position != null) {
        throw createENOSYS();
    }
    const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset + (offset ?? 0), length ?? buffer.byteLength - (offset ?? 0));
    outputBuffer += myDecode(bytes);
    const newlineIndex = outputBuffer.lastIndexOf("\n");
    if (newlineIndex !== -1) {
        const text = outputBuffer.slice(0, newlineIndex);
        outputBuffer = outputBuffer.slice(newlineIndex + 1);
        globalThis.console?.log(text);
    }
    return bytes.length;
}
export function write(fd, buffer, offset, length, position, callback) {
    if ((fd !== 1 && fd !== 2) || position != null) {
        throw createENOSYS();
    }
    let x;
    try {
        x = writeSync(fd, buffer, offset, length, position);
    }
    catch (e) {
        callback(e);
        return;
    }
    callback(null, x);
}
export const chmod = (_path, _mode, callback) => void callback(createENOSYS());
export const chown = (_path, _uid, _gid, callback) => void callback(createENOSYS());
export const close = (_fd, callback) => void callback(createENOSYS());
export const fchmod = (_fd, _mode, callback) => void callback(createENOSYS());
export const fchown = (_fd, _uid, _gid, callback) => void callback(createENOSYS());
export const fstat = (_fd, callback) => void callback(createENOSYS());
export const fsync = (_fd, callback) => void callback(null);
export const ftruncate = (_fd, _length, callback) => void callback(createENOSYS());
export const lchown = (_path, _uid, _gid, callback) => void callback(createENOSYS());
export const link = (_path, _link, callback) => void callback(createENOSYS());
export const lstat = (_path, callback) => void callback(createENOSYS());
export const mkdir = (_path, _perm, callback) => void callback(createENOSYS());
export const open = (_path, _flags, _mode, callback) => void callback(createENOSYS());
export const read = (_fd, _buffer, _offset, _length, _position, callback) => void callback(createENOSYS());
export const readdir = (_path, callback) => void callback(createENOSYS());
export const readlink = (_path, callback) => void callback(createENOSYS());
export const rename = (_from, _to, callback) => void callback(createENOSYS());
export const rmdir = (_path, callback) => void callback(createENOSYS());
export const stat = (_path, callback) => void callback(createENOSYS());
export const symlink = (_path, _link, callback) => void callback(createENOSYS());
export const truncate = (_path, _length, callback) => void callback(createENOSYS());
export const unlink = (_path, callback) => void callback(createENOSYS());
export const utimes = (_path, _atime, _mtime, callback) => void callback(createENOSYS());