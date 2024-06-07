import { throw_, createENOSYS } from "./utils.js";

export const argv = ["js"];
export const argv0 = "js";
export const env = {};
export const getuid = () => -1;
export const getgid = () => -1;
export const geteuid = () => -1;
export const getegid = () => -1;
export const pid = -1;
export const ppid = -1;
export const getgroups = () => throw_(createENOSYS());
export const umask = () => throw_(createENOSYS());
export const cwd = () => throw_(createENOSYS());
export const chdir = () => throw_(createENOSYS());
export function exit(code = undefined) {
  if (code != null) {
    exitCode = code;
  }
  if (exitCode) {
    globalThis.console?.warn(`exit code: ${exitCode}`);
  }
}
export let exitCode = undefined;

export default {
  __proto__: null,
  get exitCode() {
    return exitCode;
  },
  set exitCode(v) {
    exitCode = v;
  },
};
