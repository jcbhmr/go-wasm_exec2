export function createENOSYS() {
  const e = new Error("ENOSYS: Function not implemented");
  // @ts-ignore
  e.code = "ENOSYS";
  return e;
}

export function throw_(v: any) {
  throw v;
}
