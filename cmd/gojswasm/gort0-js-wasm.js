function At(n) {
  for (var t = 0, e = Math.min(256 * 256, n.length + 1), r = new Uint16Array(e), i = [], s = 0; ; ) {
    var a = t < n.length;
    if (!a || s >= e - 1) {
      var c = r.subarray(0, s), g = (
        /** @type {number[]} */
        /** @type {unknown} */
        c
      );
      if (i.push(String.fromCharCode.apply(null, g)), !a)
        return i.join("");
      n = n.subarray(t), t = 0, s = 0;
    }
    var d = n[t++];
    if (!(d & 128))
      r[s++] = d;
    else if ((d & 224) === 192) {
      var v = n[t++] & 63;
      r[s++] = (d & 31) << 6 | v;
    } else if ((d & 240) === 224) {
      var v = n[t++] & 63, o = n[t++] & 63;
      r[s++] = (d & 31) << 12 | v << 6 | o;
    } else if ((d & 248) === 240) {
      var v = n[t++] & 63, o = n[t++] & 63, l = n[t++] & 63, u = (d & 7) << 18 | v << 12 | o << 6 | l;
      u > 65535 && (u -= 65536, r[s++] = u >>> 10 & 1023 | 55296, u = 56320 | u & 1023), r[s++] = u;
    }
  }
}
function kt(n) {
  for (var t = 0, e = n.length, r = 0, i = Math.max(32, e + (e >>> 1) + 7), s = new Uint8Array(i >>> 3 << 3); t < e; ) {
    var a = n.charCodeAt(t++);
    if (a >= 55296 && a <= 56319) {
      if (t < e) {
        var c = n.charCodeAt(t);
        (c & 64512) === 56320 && (++t, a = ((a & 1023) << 10) + (c & 1023) + 65536);
      }
      if (a >= 55296 && a <= 56319)
        continue;
    }
    if (r + 4 > s.length) {
      i += 8, i *= 1 + t / n.length * 2, i = i >>> 3 << 3;
      var g = new Uint8Array(i);
      g.set(s), s = g;
    }
    if (a & 4294967168)
      if (!(a & 4294965248))
        s[r++] = a >>> 6 & 31 | 192;
      else if (!(a & 4294901760))
        s[r++] = a >>> 12 & 15 | 224, s[r++] = a >>> 6 & 63 | 128;
      else if (!(a & 4292870144))
        s[r++] = a >>> 18 & 7 | 240, s[r++] = a >>> 12 & 63 | 128, s[r++] = a >>> 6 & 63 | 128;
      else
        continue;
    else {
      s[r++] = a;
      continue;
    }
    s[r++] = a & 63 | 128;
  }
  return s.slice(0, r);
}
let q = null;
function K(n) {
  return globalThis.TextEncoder ? (q || (q = new TextEncoder()), q.encode(n)) : kt(n);
}
let J = null;
function ft(n) {
  return globalThis.TextDecoder ? (J || (J = new TextDecoder()), J.decode(n)) : At(n);
}
const jt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let b = null;
function It(n) {
  b ??= Object.fromEntries(
    Array.from(jt).map((a, c) => [a.charCodeAt(0), c])
  ), b[61] = 0, b[45] = 62, b[95] = 63, n = n.replace(/=/g, "");
  let t = n.length, e = t % 4, r = e && e - 1, i = (t >> 2) * 3 + r, s = K(n + "===");
  for (let a = 0, c = 0; a < t; a += 4, c += 3) {
    let g = (b[s[a]] << 18) + (b[s[a + 1]] << 12) + (b[s[a + 2]] << 6) + b[s[a + 3]];
    s[c] = g >> 16, s[c + 1] = g >> 8 & 255, s[c + 2] = g & 255;
  }
  return new Uint8Array(s.buffer, 0, i);
}
const Et = Uint8Array.fromBase64 ?? It;
var w = Uint8Array, R = Uint16Array, Ot = Int32Array, ht = new w([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), ut = new w([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Rt = new w([
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
]), gt = function(n, t) {
  for (var e = new R(31), r = 0; r < 31; ++r)
    e[r] = t += 1 << n[r - 1];
  for (var i = new Ot(e[30]), r = 1; r < 30; ++r)
    for (var s = e[r]; s < e[r + 1]; ++s)
      i[s] = s - e[r] << 5 | r;
  return { b: e, r: i };
}, vt = gt(ht, 2), dt = vt.b, Ct = vt.r;
dt[28] = 258, Ct[258] = 28;
var Pt = gt(ut, 0), Mt = Pt.b, mt = new R(32768);
for (var h = 0; h < 32768; ++h) {
  var U = (h & 43690) >> 1 | (h & 21845) << 1;
  U = (U & 52428) >> 2 | (U & 13107) << 2, U = (U & 61680) >> 4 | (U & 3855) << 4, mt[h] = ((U & 65280) >> 8 | (U & 255) << 8) >> 1;
}
var C = function(n, t, e) {
  for (var r = n.length, i = 0, s = new R(t); i < r; ++i)
    n[i] && ++s[n[i] - 1];
  var a = new R(t);
  for (i = 1; i < t; ++i)
    a[i] = a[i - 1] + s[i - 1] << 1;
  var c;
  {
    c = new R(1 << t);
    var g = 15 - t;
    for (i = 0; i < r; ++i)
      if (n[i])
        for (var d = i << 4 | n[i], v = t - n[i], o = a[n[i] - 1]++ << v, l = o | (1 << v) - 1; o <= l; ++o)
          c[mt[o] >> g] = d;
  }
  return c;
}, M = new w(288);
for (var h = 0; h < 144; ++h)
  M[h] = 8;
for (var h = 144; h < 256; ++h)
  M[h] = 9;
for (var h = 256; h < 280; ++h)
  M[h] = 7;
for (var h = 280; h < 288; ++h)
  M[h] = 8;
var wt = new w(32);
for (var h = 0; h < 32; ++h)
  wt[h] = 5;
var Dt = /* @__PURE__ */ C(M, 9), Nt = /* @__PURE__ */ C(wt, 5), X = function(n) {
  for (var t = n[0], e = 1; e < n.length; ++e)
    n[e] > t && (t = n[e]);
  return t;
}, x = function(n, t, e) {
  var r = t / 8 | 0;
  return (n[r] | n[r + 1] << 8) >> (t & 7) & e;
}, Z = function(n, t) {
  var e = t / 8 | 0;
  return (n[e] | n[e + 1] << 8 | n[e + 2] << 16) >> (t & 7);
}, Ft = function(n) {
  return (n + 7) / 8 | 0;
}, zt = function(n, t, e) {
  return (e == null || e > n.length) && (e = n.length), new w(n.subarray(t, e));
}, Vt = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], _ = function(n, t, e) {
  var r = new Error(t || Vt[n]);
  if (r.code = n, Error.captureStackTrace && Error.captureStackTrace(r, _), !e)
    throw r;
  return r;
}, Wt = function(n, t, e, r) {
  var i = n.length, s = 0;
  if (!i || t.f && !t.l)
    return e || new w(0);
  var a = !e, c = a || t.i != 2, g = t.i;
  a && (e = new w(i * 3));
  var d = function(at) {
    var lt = e.length;
    if (at > lt) {
      var ct = new w(Math.max(lt * 2, at));
      ct.set(e), e = ct;
    }
  }, v = t.f || 0, o = t.p || 0, l = t.b || 0, u = t.l, D = t.d, k = t.m, j = t.n, z = i * 8;
  do {
    if (!u) {
      v = x(n, o, 1);
      var V = x(n, o + 1, 3);
      if (o += 3, V)
        if (V == 1)
          u = Dt, D = Nt, k = 9, j = 5;
        else if (V == 2) {
          var B = x(n, o, 31) + 257, Q = x(n, o + 10, 15) + 4, tt = B + x(n, o + 5, 31) + 1;
          o += 14;
          for (var I = new w(tt), Y = new w(19), m = 0; m < Q; ++m)
            Y[Rt[m]] = x(n, o + m * 3, 7);
          o += Q * 3;
          for (var et = X(Y), pt = (1 << et) - 1, bt = C(Y, et), m = 0; m < tt; ) {
            var nt = bt[x(n, o, pt)];
            o += nt & 15;
            var y = nt >> 4;
            if (y < 16)
              I[m++] = y;
            else {
              var T = 0, N = 0;
              for (y == 16 ? (N = 3 + x(n, o, 3), o += 2, T = I[m - 1]) : y == 17 ? (N = 3 + x(n, o, 7), o += 3) : y == 18 && (N = 11 + x(n, o, 127), o += 7); N--; )
                I[m++] = T;
            }
          }
          var rt = I.subarray(0, B), p = I.subarray(B);
          k = X(rt), j = X(p), u = C(rt, k), D = C(p, j);
        } else
          _(1);
      else {
        var y = Ft(o) + 4, W = n[y - 4] | n[y - 3] << 8, G = y + W;
        if (G > i) {
          g && _(0);
          break;
        }
        c && d(l + W), e.set(n.subarray(y, G), l), t.b = l += W, t.p = o = G * 8, t.f = v;
        continue;
      }
      if (o > z) {
        g && _(0);
        break;
      }
    }
    c && d(l + 131072);
    for (var Ut = (1 << k) - 1, Tt = (1 << j) - 1, H = o; ; H = o) {
      var T = u[Z(n, o) & Ut], S = T >> 4;
      if (o += T & 15, o > z) {
        g && _(0);
        break;
      }
      if (T || _(2), S < 256)
        e[l++] = S;
      else if (S == 256) {
        H = o, u = null;
        break;
      } else {
        var it = S - 254;
        if (S > 264) {
          var m = S - 257, E = ht[m];
          it = x(n, o, (1 << E) - 1) + dt[m], o += E;
        }
        var L = D[Z(n, o) & Tt], $ = L >> 4;
        L || _(3), o += L & 15;
        var p = Mt[$];
        if ($ > 3) {
          var E = ut[$];
          p += Z(n, o) & (1 << E) - 1, o += E;
        }
        if (o > z) {
          g && _(0);
          break;
        }
        c && d(l + 131072);
        var st = l + it;
        if (l < p) {
          var ot = s - p, St = Math.min(p, st);
          for (ot + l < 0 && _(3); l < St; ++l)
            e[l] = r[ot + l];
        }
        for (; l < st; ++l)
          e[l] = e[l - p];
      }
    }
    t.l = u, t.p = H, t.b = l, t.f = v, u && (v = 1, t.m = k, t.d = D, t.n = j);
  } while (!v);
  return l != e.length && a ? zt(e, 0, l) : e.subarray(0, l);
}, Gt = function(n) {
  (n[0] != 31 || n[1] != 139 || n[2] != 8) && _(6, "invalid gzip data");
  var t = n[3], e = 10;
  t & 4 && (e += (n[10] | n[11] << 8) + 2);
  for (var r = (t >> 3 & 1) + (t >> 4 & 1); r > 0; r -= !n[e++])
    ;
  return e + (t & 2);
}, Bt = function(n) {
  var t = n.length;
  return (n[t - 4] | n[t - 3] << 8 | n[t - 2] << 16 | n[t - 1] << 24) >>> 0;
};
function Yt(n, t) {
  var e = Gt(n);
  return e + 8 > n.length && _(6, "invalid gzip data"), Wt(
    n.subarray(e, -8),
    { i: 2 },
    new w(Bt(n)),
    t
  );
}
async function Ht(n) {
  if (globalThis.DecompressionStream) {
    const t = [];
    await new ReadableStream({
      start(i) {
        i.enqueue(n), i.close();
      }
    }).pipeThrough(new DecompressionStream("gzip")).pipeTo(
      new WritableStream({
        write(i, s) {
          t.push(i);
        }
      })
    );
    const e = new Uint8Array(
      t.reduce((i, s) => i + s.length, 0)
    );
    let r = 0;
    for (const i of t)
      e.set(i, r), r += i.byteLength;
    return e;
  } else
    return Yt(n);
}
const xt = globalThis.performance?.timeOrigin ?? Date.now(), Lt = globalThis.performance?.now ? () => performance.now() : () => Date.now() - xt;
let $t = 1;
const P = { __proto__: null };
function qt(n, t) {
  const e = $t++;
  return P[e] = n, Jt(e, t), e;
}
async function Jt(n, t) {
  const e = Date.now();
  for (; ; ) {
    if (await Promise.resolve(), !(n in P))
      return;
    if (Date.now() - e >= t) {
      const i = P[n];
      delete P[n], i();
      return;
    }
  }
}
function Xt(n) {
  delete P[n];
}
const Zt = globalThis.setTimeout ?? qt, Kt = globalThis.clearTimeout ?? Xt;
function Qt(n) {
  for (let t = 0; t < n.length; t++)
    n[t] = Math.floor(Math.random() * 256);
  return n;
}
const te = globalThis.crypto?.getRandomValues?.bind(crypto) ?? Qt;
function ee(n) {
  let t, e;
  return { promise: new Promise((i, s) => {
    t = i, e = s;
  }), resolve: t, reject: e };
}
const ne = Promise.withResolvers ? (n) => Promise.withResolvers() : ee;
class re {
  _import;
  _importMeta = null;
  #c = "created";
  #y;
  constructor(t = {}) {
    if (t.import)
      this._import = t.import;
    else
      try {
        this._import = new Function("s", "o", "return import(s)");
      } catch {
        this._import = (e) => import(e);
      }
    this._importMeta = t.importMeta ?? null, this.#y = t.returnOnExit ?? !0;
  }
  /** @type {DataView | null} */
  #f = null;
  get #t() {
    if (!this.#f) {
      const t = (
        /** @type {WebAssembly.Memory} */
        this.#n.exports.mem
      );
      this.#f = new DataView(t.buffer);
    }
    return this.#f;
  }
  #a(t, e) {
    this.#t.setUint32(t + 0, e, !0), this.#t.setUint32(t + 4, Math.floor(e / 4294967296), !0);
  }
  #r(t) {
    const e = this.#t.getUint32(t + 0, !0), r = this.#t.getInt32(t + 4, !0);
    return e + r * 4294967296;
  }
  #e(t) {
    const e = this.#t.getFloat64(t, !0);
    if (e === 0)
      return;
    if (!isNaN(e))
      return e;
    const r = this.#t.getUint32(t, !0);
    return this.#o[r];
  }
  #i(t, e) {
    if (typeof e == "number" && e !== 0) {
      if (isNaN(e)) {
        this.#t.setUint32(t + 4, 2146959360, !0), this.#t.setUint32(t, 0, !0);
        return;
      }
      this.#t.setFloat64(t, e, !0);
      return;
    }
    if (e === void 0) {
      this.#t.setFloat64(t, 0, !0);
      return;
    }
    let i = this.#g.get(e);
    i === void 0 && (this.#w.pop(), i === void 0 && (i = this.#o.length), this.#o[i] = e, this.#l[i] = 0, this.#g.set(e, i)), this.#l[i]++;
    let s = 0;
    switch (typeof e) {
      case "object":
        e !== null && (s = 1);
        break;
      case "string":
        s = 2;
        break;
      case "symbol":
        s = 3;
        break;
      case "function":
        s = 4;
        break;
    }
    this.#t.setUint32(t + 4, 2146959360 | s, !0), this.#t.setUint32(t, i, !0);
  }
  #d(t) {
    const e = this.#r(t + 0), r = this.#r(t + 8);
    return new Uint8Array(this.#t.buffer, e, r);
  }
  #x(t) {
    const e = this.#r(t + 0), r = this.#r(t + 8), i = new Array(r);
    for (let s = 0; s < r; s++)
      i[s] = this.#e(e + s * 8);
    return i;
  }
  #h(t) {
    const e = this.#r(t + 0), r = this.#r(t + 8);
    return ft(new Uint8Array(this.#t.buffer, e, r));
  }
  /** @returns {WebAssembly.Imports} */
  getImportObject() {
    return { gojs: this.gojs };
  }
  /** @type {WebAssembly.ModuleImports} */
  _gotest = {
    add: (t, e) => t + e
  };
  /** @type {WebAssembly.ModuleImports} */
  gojs = {
    // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
    // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
    // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
    // This changes the SP, thus we have to update the SP used by the imported function.
    // func wasmExit(code int32)
    "runtime.wasmExit": (t) => {
      t >>>= 0;
      const e = this.#t.getInt32(t + 8, !0);
      this.#y && this.#s.default ? this.#s.default.exitCode = e : this.#s.exit(e), this.#c = "exited", this.#m.resolve(e), this.#n = null, this.#f = null, this.#o = null, this.#l = null, this.#g = null, this.#w = null, this.#m = null, this.#u = null, this.#s = null, this._pendingEvent = null;
    },
    // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
    "runtime.wasmWrite": (t) => {
      t >>>= 0;
      const e = this.#r(t + 8), r = this.#r(t + 16), i = this.#t.getInt32(t + 24, !0);
      this.#u.writeSync(e, new Uint8Array(this.#t.buffer, r, i));
    },
    // func resetMemoryDataView()
    "runtime.resetMemoryDataView": (t) => {
      const e = this.#n.exports.mem;
      this.#f = new DataView(e.buffer);
    },
    // func nanotime1() int64
    "runtime.nanotime1": (t) => {
      t >>>= 0, this.#a(t + 8, (xt + Lt()) * 1e6);
    },
    // func walltime() (sec int64, nsec int32)
    "runtime.walltime": (t) => {
      t >>>= 0;
      const e = (/* @__PURE__ */ new Date()).getTime();
      this.#a(t + 8, e / 1e3), this.#t.setInt32(t + 16, e % 1e3 * 1e6, !0);
    },
    // func scheduleTimeoutEvent(delay int64) int32
    "runtime.scheduleTimeoutEvent": (t) => {
      t >>>= 0;
      const e = this.#p;
      this.#p++, this.#v.set(e, Zt(() => {
        for (this.#_(); this.#v.has(e); )
          globalThis.console?.warn("scheduleTimeoutEvent: missed timeout event"), this.#_();
      }, this.#r(t + 8))), this.#t.setInt32(t + 16, e, !0);
    },
    // func clearTimeoutEvent(id int32)
    "runtime.clearTimeoutEvent": (t) => {
      t >>>= 0;
      const e = this.#t.getInt32(t + 8, !0);
      Kt(this.#v.get(e)), this.#v.delete(e);
    },
    // func getRandomData(r []byte)
    "runtime.getRandomData": (t) => {
      t >>>= 0, te(this.#d(t + 8));
    },
    // func finalizeRef(v ref)
    "syscall/js.finalizeRef": (t) => {
      t >>>= 0;
      const e = this.#t.getUint32(t + 8, !0);
      if (this.#l[e]--, this.#l[e] === 0) {
        const r = this.#o[e];
        this.#o[e] = null, this.#g.delete(r), this.#w.push(e);
      }
    },
    // func stringVal(value string) ref
    "syscall/js.stringVal": (t) => {
      t >>>= 0, this.#i(t + 24, this.#h(t + 8));
    },
    // func valueGet(v ref, p string) ref
    "syscall/js.valueGet": (t) => {
      t >>>= 0;
      const e = Reflect.get(this.#e(t + 8), this.#h(t + 16)), r = this.#n.exports.getsp;
      t = r() >>> 0, this.#i(t + 32, e);
    },
    // func valueSet(v ref, p string, x ref)
    "syscall/js.valueSet": (t) => {
      t >>>= 0, Reflect.set(this.#e(t + 8), this.#h(t + 16), this.#e(t + 32));
    },
    // func valueDelete(v ref, p string)
    "syscall/js.valueDelete": (t) => {
      t >>>= 0, Reflect.deleteProperty(this.#e(t + 8), this.#h(t + 16));
    },
    // func valueIndex(v ref, i int) ref
    "syscall/js.valueIndex": (t) => {
      t >>>= 0, this.#i(t + 24, Reflect.get(this.#e(t + 8), this.#r(t + 16)));
    },
    // valueSetIndex(v ref, i int, x ref)
    "syscall/js.valueSetIndex": (t) => {
      t >>>= 0, Reflect.set(this.#e(t + 8), this.#r(t + 16), this.#e(t + 24));
    },
    // func valueCall(v ref, m string, args []ref) (ref, bool)
    "syscall/js.valueCall": (t) => {
      t >>>= 0;
      try {
        const e = this.#e(t + 8), r = Reflect.get(e, this.#h(t + 16)), i = this.#x(t + 32), s = Reflect.apply(r, e, i), a = this.#n.exports.getsp;
        t = a() >>> 0, this.#i(t + 56, s), this.#t.setUint8(t + 64, 1);
      } catch (e) {
        const r = this.#n.exports.getsp;
        t = r() >>> 0, this.#i(t + 56, e), this.#t.setUint8(t + 64, 0);
      }
    },
    // func valueInvoke(v ref, args []ref) (ref, bool)
    "syscall/js.valueInvoke": (t) => {
      t >>>= 0;
      try {
        const e = this.#e(t + 8), r = this.#x(t + 16), i = Reflect.apply(e, void 0, r), s = this.#n.exports.getsp;
        t = s() >>> 0, this.#i(t + 40, i), this.#t.setUint8(t + 48, 1);
      } catch (e) {
        const r = this.#n.exports.getsp;
        t = r() >>> 0, this.#i(t + 40, e), this.#t.setUint8(t + 48, 0);
      }
    },
    // func valueNew(v ref, args []ref) (ref, bool)
    "syscall/js.valueNew": (t) => {
      t >>>= 0;
      try {
        const e = this.#e(t + 8), r = this.#x(t + 16), i = Reflect.construct(e, r), s = this.#n.exports.getsp;
        t = s() >>> 0, this.#i(t + 40, i), this.#t.setUint8(t + 48, 1);
      } catch (e) {
        const r = this.#n.exports.getsp;
        t = r() >>> 0, this.#i(t + 40, e), this.#t.setUint8(t + 48, 0);
      }
    },
    // func valueLength(v ref) int
    "syscall/js.valueLength": (t) => {
      t >>>= 0, this.#a(t + 16, parseInt(this.#e(t + 8).length));
    },
    // valuePrepareString(v ref) (ref, int)
    "syscall/js.valuePrepareString": (t) => {
      t >>>= 0;
      const e = K(String(this.#e(t + 8)));
      this.#i(t + 16, e), this.#a(t + 24, e.length);
    },
    // valueLoadString(v ref, b []byte)
    "syscall/js.valueLoadString": (t) => {
      t >>>= 0;
      const e = this.#e(t + 8);
      this.#d(t + 16).set(e);
    },
    // func valueInstanceOf(v ref, t ref) bool
    "syscall/js.valueInstanceOf": (t) => {
      t >>>= 0, this.#t.setUint8(t + 24, this.#e(t + 8) instanceof this.#e(t + 16) ? 1 : 0);
    },
    // func copyBytesToGo(dst []byte, src ref) (int, bool)
    "syscall/js.copyBytesToGo": (t) => {
      t >>>= 0;
      const e = this.#d(t + 8), r = this.#e(t + 32);
      if (!(r instanceof Uint8Array || r instanceof Uint8ClampedArray)) {
        this.#t.setUint8(t + 48, 0);
        return;
      }
      const i = r.subarray(0, e.length);
      e.set(i), this.#a(t + 40, i.length), this.#t.setUint8(t + 48, 1);
    },
    // func copyBytesToJS(dst ref, src []byte) (int, bool)
    "syscall/js.copyBytesToJS": (t) => {
      t >>>= 0;
      const e = this.#e(t + 8), r = this.#d(t + 16);
      if (!(e instanceof Uint8Array || e instanceof Uint8ClampedArray)) {
        this.#t.setUint8(t + 48, 0);
        return;
      }
      const i = r.subarray(0, e.length);
      e.set(i), this.#a(t + 40, i.length), this.#t.setUint8(t + 48, 1);
    },
    debug: (t) => {
      globalThis.console?.log(t);
    }
  };
  _pendingEvent = null;
  #_() {
    if (this.#c !== "running")
      throw new Error("Go program has already exited");
    const t = this.#n.exports.resume;
    t();
  }
  _makeFuncWrapper(t) {
    const e = this;
    return function(...r) {
      const i = { id: t, this: this, args: r };
      return e._pendingEvent = i, e.#_(), i.result;
    };
  }
  #u = null;
  #s = null;
  #n = null;
  #m = null;
  #o = null;
  #l = null;
  #g = null;
  #w = null;
  #p = 1;
  #v = null;
  async start(t) {
    if (this.#c !== "created")
      throw new Error("Go program already started");
    this.#c = "starting", this.#n = t, this.#u = await this._import("node:fs"), this.#s = await this._import("node:process");
    const e = new Proxy(globalThis, {
      get: (o, l) => l === "fs" ? this.#u : l === "process" ? this.#s : Reflect.get(o, l),
      set: (o, l, u) => l === "fs" ? (this.#u = u, !0) : l === "process" ? (this.#s = u, !0) : Reflect.set(o, l, u)
    });
    this.#o = [NaN, 0, null, !0, !1, e, this], this.#l = new Array(this.#o.length).fill(1 / 0), this.#g = /* @__PURE__ */ new Map([
      [0, 1],
      [null, 2],
      [!0, 3],
      [!1, 4],
      [e, 5],
      [this, 6]
    ]), this.#w = [], this.#v = /* @__PURE__ */ new Map();
    let r = 4096;
    const i = (o) => {
      const l = r, u = K(o + "\0");
      return new Uint8Array(this.#t.buffer, r, u.length).set(u), r += u.length, r % 8 !== 0 && (r += 8 - r % 8), l;
    }, s = this.#s.argv.slice();
    s[0] = this.#s.argv0;
    const a = s.length, c = [];
    for (const o of s)
      c.push(i(o));
    c.push(0);
    for (const [o, l] of Object.entries(this.#s.env))
      c.push(i(`${o}=${l}`));
    c.push(0);
    const g = r;
    for (const o of c)
      this.#t.setUint32(r, o, !0), this.#t.setUint32(r + 4, 0, !0), r += 8;
    if (r >= 12288)
      throw new Error("total length of command line and environment variables exceeds limit");
    this.#m = ne(), this.#c = "running";
    const v = this.#n.exports.run;
    return v(a, g), this.#m.promise;
  }
}
function f() {
  const n = new Error("ENOSYS: Function not implemented");
  return n.code = "ENOSYS", n;
}
function F(n) {
  throw n;
}
let O = "";
const ie = {
  __proto__: null,
  O_WRONLY: -1,
  O_RDWR: -1,
  O_CREAT: -1,
  O_TRUNC: -1,
  O_APPEND: -1,
  O_EXCL: -1
};
function _t(n, t, e, r, i) {
  if (n !== 1 && n !== 2 || i != null)
    throw f();
  const s = new Uint8Array(t.buffer, t.byteOffset + (e ?? 0), r ?? t.byteLength - (e ?? 0));
  O += ft(s);
  const a = O.lastIndexOf(`
`);
  if (a !== -1) {
    const c = O.slice(0, a);
    O = O.slice(a + 1), globalThis.console?.log(c);
  }
  return s.length;
}
function se(n, t, e, r, i, s) {
  if (n !== 1 && n !== 2 || i != null)
    throw f();
  let a;
  try {
    a = _t(n, t, e, r, i);
  } catch (c) {
    s(c);
    return;
  }
  s(null, a);
}
const oe = (n, t, e) => void e(f()), ae = (n, t, e, r) => void r(f()), le = (n, t) => void t(f()), ce = (n, t, e) => void e(f()), fe = (n, t, e, r) => void r(f()), he = (n, t) => void t(f()), ue = (n, t) => void t(null), ge = (n, t, e) => void e(f()), ve = (n, t, e, r) => void r(f()), de = (n, t, e) => void e(f()), me = (n, t) => void t(f()), we = (n, t, e) => void e(f()), xe = (n, t, e, r) => void r(f()), _e = (n, t, e, r, i, s) => void s(f()), ye = (n, t) => void t(f()), pe = (n, t) => void t(f()), be = (n, t, e) => void e(f()), Ue = (n, t) => void t(f()), Te = (n, t) => void t(f()), Se = (n, t, e) => void e(f()), Ae = (n, t, e) => void e(f()), ke = (n, t) => void t(f()), je = (n, t, e, r) => void r(f()), Ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  chmod: oe,
  chown: ae,
  close: le,
  constants: ie,
  fchmod: ce,
  fchown: fe,
  fstat: he,
  fsync: ue,
  ftruncate: ge,
  lchown: ve,
  link: de,
  lstat: me,
  mkdir: we,
  open: xe,
  read: _e,
  readdir: ye,
  readlink: pe,
  rename: be,
  rmdir: Ue,
  stat: Te,
  symlink: Se,
  truncate: Ae,
  unlink: ke,
  utimes: je,
  write: se,
  writeSync: _t
}, Symbol.toStringTag, { value: "Module" })), Ee = ["js"], Oe = "js", Re = {}, Ce = () => -1, Pe = () => -1, Me = () => -1, De = () => -1, Ne = -1, Fe = -1, ze = () => F(f()), Ve = () => F(f()), We = () => F(f()), Ge = () => F(f());
function Be(n = void 0) {
  n != null && (A = n), A && globalThis.console?.warn(`exit code: ${A}`);
}
let A;
const Ye = {
  __proto__: null,
  get exitCode() {
    return A;
  },
  set exitCode(n) {
    A = n;
  }
}, He = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  argv: Ee,
  argv0: Oe,
  chdir: Ge,
  cwd: We,
  default: Ye,
  env: Re,
  exit: Be,
  get exitCode() {
    return A;
  },
  getegid: De,
  geteuid: Me,
  getgid: Pe,
  getgroups: ze,
  getuid: Ce,
  pid: Ne,
  ppid: Fe,
  umask: Ve
}, Symbol.toStringTag, { value: "Module" })), Le = await Ht(Et(__APP_WASM_GZ_BASE64__)), yt = new re({
  import: (n, t) => import(n).catch((e) => {
    if (n === "node:fs" || n === "fs")
      return Ie;
    if (n === "node:process" || n === "process")
      return He;
    throw e;
  }),
  importMeta: import.meta
}), { instance: $e } = await WebAssembly.instantiate(
  Le,
  yt.getImportObject()
);
await yt.start($e);
