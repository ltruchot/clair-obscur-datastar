const le = "generated", Ni = "pointerdown", Qi = "pointerup", Et = "pointerleave", Xi = "pointerout", Tt = "pointermove", Yi = "touchstart", Ft = "touchend", ji = "touchmove", Zi = "touchcancel", Ji = "resize", Ki = "visibilitychange", de = "tsParticles - Error";
const M = {
  x: 0,
  y: 0,
  z: 0
}, Ae = {
  a: 1,
  b: 0,
  c: 0,
  d: 1
}, gt = "random", O = 2, es = Math.PI * O, at = 60, bi = "true", Lt = "false", lt = "canvas", At = 0, W = 2, $t = 4, ts = 1, Vt = 1, Ut = 1, is = 4, xi = 1, We = 255, ce = 360, vt = 100, wt = 100, Bt = 0, _t = 0, ss = 60, ns = 0, Qe = 0.25, qt = 0.5 + Qe, os = 1, rs = 0, as = 0, ls = 1, Mt = 1, cs = 1, Ht = 1, Xe = 0, zi = 1, hs = 0, us = 120, fs = 0, ds = 0, ps = 1e4, ms = 0, ys = 1, Ye = 0, Pi = 1, gs = 1, vs = 0, Wt = 1, ws = 0, _s = 0, Gt = -Qe, Nt = 1.5, Qt = 0, bs = 1, xs = 0, bt = 0, Ci = 1, zs = 1, je = 1, Ps = 500, Xt = 50, Cs = 0, xt = 1, ki = 0, Yt = 1, ks = 0, ne = 255, ct = 3, ht = 6, Ms = 1, Ss = 1, Ds = 0, Os = 0, Rs = 0, Is = 0;
var k;
(function(t) {
  t.bottom = "bottom", t.bottomLeft = "bottom-left", t.bottomRight = "bottom-right", t.left = "left", t.none = "none", t.right = "right", t.top = "top", t.topLeft = "top-left", t.topRight = "top-right", t.outside = "outside", t.inside = "inside";
})(k || (k = {}));
function Mi(t) {
  return typeof t == "boolean";
}
function pe(t) {
  return typeof t == "string";
}
function q(t) {
  return typeof t == "number";
}
function ve(t) {
  return typeof t == "object" && t !== null;
}
function L(t) {
  return Array.isArray(t);
}
function d(t) {
  return t == null;
}
class T {
  constructor(e, i, s) {
    if (this._updateFromAngle = (n, o) => {
      this.x = Math.cos(n) * o, this.y = Math.sin(n) * o;
    }, !q(e) && e) {
      this.x = e.x, this.y = e.y;
      const n = e;
      this.z = n.z ? n.z : M.z;
    } else if (e !== void 0 && i !== void 0)
      this.x = e, this.y = i, this.z = s ?? M.z;
    else
      throw new Error(`${de} Vector3d not initialized correctly`);
  }
  static get origin() {
    return T.create(M.x, M.y, M.z);
  }
  get angle() {
    return Math.atan2(this.y, this.x);
  }
  set angle(e) {
    this._updateFromAngle(e, this.length);
  }
  get length() {
    return Math.sqrt(this.getLengthSq());
  }
  set length(e) {
    this._updateFromAngle(this.angle, e);
  }
  static clone(e) {
    return T.create(e.x, e.y, e.z);
  }
  static create(e, i, s) {
    return new T(e, i, s);
  }
  add(e) {
    return T.create(this.x + e.x, this.y + e.y, this.z + e.z);
  }
  addTo(e) {
    this.x += e.x, this.y += e.y, this.z += e.z;
  }
  copy() {
    return T.clone(this);
  }
  distanceTo(e) {
    return this.sub(e).length;
  }
  distanceToSq(e) {
    return this.sub(e).getLengthSq();
  }
  div(e) {
    return T.create(this.x / e, this.y / e, this.z / e);
  }
  divTo(e) {
    this.x /= e, this.y /= e, this.z /= e;
  }
  getLengthSq() {
    return this.x ** W + this.y ** W;
  }
  mult(e) {
    return T.create(this.x * e, this.y * e, this.z * e);
  }
  multTo(e) {
    this.x *= e, this.y *= e, this.z *= e;
  }
  normalize() {
    const e = this.length;
    e != Ye && this.multTo(xi / e);
  }
  rotate(e) {
    return T.create(this.x * Math.cos(e) - this.y * Math.sin(e), this.x * Math.sin(e) + this.y * Math.cos(e), M.z);
  }
  setTo(e) {
    this.x = e.x, this.y = e.y;
    const i = e;
    this.z = i.z ? i.z : M.z;
  }
  sub(e) {
    return T.create(this.x - e.x, this.y - e.y, this.z - e.z);
  }
  subFrom(e) {
    this.x -= e.x, this.y -= e.y, this.z -= e.z;
  }
}
class A extends T {
  constructor(e, i) {
    super(e, i, M.z);
  }
  static get origin() {
    return A.create(M.x, M.y);
  }
  static clone(e) {
    return A.create(e.x, e.y);
  }
  static create(e, i) {
    return new A(e, i);
  }
}
let Es = Math.random;
const Si = {
  nextFrame: (t) => requestAnimationFrame(t),
  cancel: (t) => cancelAnimationFrame(t)
};
function w() {
  return Me(Es(), 0, 1 - Number.EPSILON);
}
function Ts(t) {
  return Si.nextFrame(t);
}
function Fs(t) {
  Si.cancel(t);
}
function Me(t, e, i) {
  return Math.min(Math.max(t, e), i);
}
function I(t) {
  const e = Fe(t), i = 0;
  let s = tt(t);
  return e === s && (s = i), w() * (e - s) + s;
}
function m(t) {
  return q(t) ? t : I(t);
}
function tt(t) {
  return q(t) ? t : t.min;
}
function Fe(t) {
  return q(t) ? t : t.max;
}
function g(t, e) {
  if (t === e || e === void 0 && q(t))
    return t;
  const i = tt(t), s = Fe(t);
  return e !== void 0 ? {
    min: Math.min(i, e),
    max: Math.max(s, e)
  } : g(i, s);
}
function be(t, e) {
  const i = t.x - e.x, s = t.y - e.y, n = 2;
  return { dx: i, dy: s, distance: Math.sqrt(i ** n + s ** n) };
}
function it(t, e) {
  return be(t, e).distance;
}
function K(t) {
  return t * Math.PI / 180;
}
function Ls(t, e, i) {
  if (q(t))
    return K(t);
  switch (t) {
    case k.top:
      return -Math.PI * 0.5;
    case k.topRight:
      return -Math.PI * Qe;
    case k.right:
      return ns;
    case k.bottomRight:
      return Math.PI * Qe;
    case k.bottom:
      return Math.PI * 0.5;
    case k.bottomLeft:
      return Math.PI * qt;
    case k.left:
      return Math.PI;
    case k.topLeft:
      return -Math.PI * qt;
    case k.inside:
      return Math.atan2(i.y - e.y, i.x - e.x);
    case k.outside:
      return Math.atan2(e.y - i.y, e.x - i.x);
    default:
      return w() * es;
  }
}
function As(t) {
  const e = A.origin;
  return e.length = 1, e.angle = t, e;
}
function $s(t) {
  return {
    x: (t.position?.x ?? w() * 100) * t.size.width / 100,
    y: (t.position?.y ?? w() * 100) * t.size.height / 100
  };
}
function Vs(t) {
  const e = {
    x: t.position?.x !== void 0 ? m(t.position.x) : void 0,
    y: t.position?.y !== void 0 ? m(t.position.y) : void 0
  };
  return $s({ size: t.size, position: e });
}
function Us(t) {
  return {
    x: t.position?.x ?? w() * t.size.width,
    y: t.position?.y ?? w() * t.size.height
  };
}
function Di(t) {
  return t ? t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t) : 1;
}
var he;
(function(t) {
  t.auto = "auto", t.increase = "increase", t.decrease = "decrease", t.random = "random";
})(he || (he = {}));
var z;
(function(t) {
  t.increasing = "increasing", t.decreasing = "decreasing";
})(z || (z = {}));
var ee;
(function(t) {
  t.none = "none", t.max = "max", t.min = "min";
})(ee || (ee = {}));
var v;
(function(t) {
  t.bottom = "bottom", t.left = "left", t.right = "right", t.top = "top";
})(v || (v = {}));
var N;
(function(t) {
  t.precise = "precise", t.percent = "percent";
})(N || (N = {}));
var xe;
(function(t) {
  t.max = "max", t.min = "min", t.random = "random";
})(xe || (xe = {}));
const Bs = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  log: console.log,
  verbose: console.log,
  warning: console.warn
};
function Ie() {
  return Bs;
}
function qs(t) {
  const e = /* @__PURE__ */ new Map();
  return (...i) => {
    const s = JSON.stringify(i);
    if (e.has(s))
      return e.get(s);
    const n = t(...i);
    return e.set(s, n), n;
  };
}
function Le() {
  return typeof window > "u" || !window || typeof window.document > "u" || !window.document;
}
function Hs() {
  return !Le() && typeof matchMedia < "u";
}
function St(t) {
  if (Hs())
    return matchMedia(t);
}
function Ws(t) {
  if (!(Le() || typeof IntersectionObserver > "u"))
    return new IntersectionObserver(t);
}
function Gs(t) {
  if (!(Le() || typeof MutationObserver > "u"))
    return new MutationObserver(t);
}
function Oi(t, e) {
  return t === e || L(e) && e.indexOf(t) > -1;
}
function Ri(t) {
  return Math.floor(w() * t.length);
}
function st(t, e, i = !0) {
  return t[e !== void 0 && i ? e % t.length : Ri(t)];
}
function nt(t, e, i, s, n) {
  return Ns(Dt(t, s ?? 0), e, i, n);
}
function Ns(t, e, i, s) {
  let n = !0;
  return (!s || s === v.bottom) && (n = t.top < e.height + i.x), n && (!s || s === v.left) && (n = t.right > i.x), n && (!s || s === v.right) && (n = t.left < e.width + i.y), n && (!s || s === v.top) && (n = t.bottom > i.y), n;
}
function Dt(t, e) {
  return {
    bottom: t.y + e,
    left: t.x - e,
    right: t.x + e,
    top: t.y - e
  };
}
function C(t, ...e) {
  for (const i of e) {
    if (i == null)
      continue;
    if (!ve(i)) {
      t = i;
      continue;
    }
    const s = Array.isArray(i);
    s && (ve(t) || !t || !Array.isArray(t)) ? t = [] : !s && (ve(t) || !t || Array.isArray(t)) && (t = {});
    for (const n in i) {
      if (n === "__proto__")
        continue;
      const o = i, r = o[n], a = t;
      a[n] = ve(r) && Array.isArray(r) ? r.map((l) => C(a[n], l)) : C(a[n], r);
    }
  }
  return t;
}
function te(t, e) {
  return L(t) ? t.map((s, n) => e(s, n)) : e(t, 0);
}
function G(t, e, i) {
  return L(t) ? st(t, e, i) : t;
}
function Ii(t, e) {
  const i = t.value, s = t.animation, n = {
    delayTime: m(s.delay) * 1e3,
    enable: s.enable,
    value: m(t.value) * e,
    max: Fe(i) * e,
    min: tt(i) * e,
    loops: 0,
    maxLoops: m(s.count),
    time: 0
  }, o = 1;
  if (s.enable) {
    switch (n.decay = o - m(s.decay), s.mode) {
      case he.increase:
        n.status = z.increasing;
        break;
      case he.decrease:
        n.status = z.decreasing;
        break;
      case he.random:
        n.status = w() >= 0.5 ? z.increasing : z.decreasing;
        break;
    }
    const r = s.mode === he.auto;
    switch (s.startValue) {
      case xe.min:
        n.value = n.min, r && (n.status = z.increasing);
        break;
      case xe.max:
        n.value = n.max, r && (n.status = z.decreasing);
        break;
      case xe.random:
      default:
        n.value = I(n), r && (n.status = w() >= 0.5 ? z.increasing : z.decreasing);
        break;
    }
  }
  return n.initialValue = n.value, n;
}
function Ei(t, e) {
  if (!(t.mode === N.percent)) {
    const { mode: n, ...o } = t;
    return o;
  }
  return "x" in t ? {
    x: t.x / 100 * e.width,
    y: t.y / 100 * e.height
  } : {
    width: t.width / 100 * e.width,
    height: t.height / 100 * e.height
  };
}
function Ti(t, e) {
  return Ei(t, e);
}
function jt(t, e) {
  return Ei(t, e);
}
function Qs(t, e, i, s, n) {
  switch (e) {
    case ee.max:
      i >= n && t.destroy();
      break;
    case ee.min:
      i <= s && t.destroy();
      break;
  }
}
function ot(t, e, i, s, n) {
  if (t.destroyed || !e || !e.enable || (e.maxLoops ?? 0) > 0 && (e.loops ?? 0) > (e.maxLoops ?? 0))
    return;
  const h = (e.velocity ?? 0) * n.factor, u = e.min, f = e.max, p = e.decay ?? 1;
  if (e.time || (e.time = 0), (e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0) && (e.time += n.value), !((e.delayTime ?? 0) > 0 && e.time < (e.delayTime ?? 0))) {
    switch (e.status) {
      case z.increasing:
        e.value >= f ? (i ? e.status = z.decreasing : e.value -= f, e.loops || (e.loops = 0), e.loops++) : e.value += h;
        break;
      case z.decreasing:
        e.value <= u ? (i ? e.status = z.increasing : e.value += f, e.loops || (e.loops = 0), e.loops++) : e.value -= h;
    }
    e.velocity && p !== 1 && (e.velocity *= p), Qs(t, s, e.value, u, f), t.destroyed || (e.value = Me(e.value, u, f));
  }
}
function Xs(t) {
  const e = document.createElement("div").style;
  if (!t)
    return e;
  for (const i in t) {
    const s = t[i];
    if (!Object.prototype.hasOwnProperty.call(t, i) || d(s))
      continue;
    const n = t.getPropertyValue?.(s);
    if (!n)
      continue;
    const o = t.getPropertyPriority?.(s);
    o ? e.setProperty?.(s, n, o) : e.setProperty?.(s, n);
  }
  return e;
}
function Ys(t) {
  const e = document.createElement("div").style, i = 10, s = {
    width: "100%",
    height: "100%",
    margin: "0",
    padding: "0",
    borderWidth: "0",
    position: "fixed",
    zIndex: t.toString(i),
    "z-index": t.toString(i),
    top: "0",
    left: "0"
  };
  for (const n in s) {
    const o = s[n];
    e.setProperty(n, o);
  }
  return e;
}
const js = qs(Ys);
var X;
(function(t) {
  t.darken = "darken", t.enlighten = "enlighten";
})(X || (X = {}));
function Zs(t, e) {
  if (e) {
    for (const i of t.colorManagers.values())
      if (e.startsWith(i.stringPrefix))
        return i.parseString(e);
  }
}
function ze(t, e, i, s = !0) {
  if (!e)
    return;
  const n = pe(e) ? { value: e } : e;
  if (pe(n.value))
    return Fi(t, n.value, i, s);
  if (L(n.value))
    return ze(t, {
      value: st(n.value, i, s)
    });
  for (const o of t.colorManagers.values()) {
    const r = o.handleRangeColor(n);
    if (r)
      return r;
  }
}
function Fi(t, e, i, s = !0) {
  if (!e)
    return;
  const n = pe(e) ? { value: e } : e;
  if (pe(n.value))
    return n.value === gt ? tn() : Ks(t, n.value);
  if (L(n.value))
    return Fi(t, {
      value: st(n.value, i, s)
    });
  for (const o of t.colorManagers.values()) {
    const r = o.handleColor(n);
    if (r)
      return r;
  }
}
function Ee(t, e, i, s = !0) {
  const n = ze(t, e, i, s);
  return n ? Js(n) : void 0;
}
function Js(t) {
  const e = t.r / We, i = t.g / We, s = t.b / We, n = Math.max(e, i, s), o = Math.min(e, i, s), r = {
    h: Bt,
    l: (n + o) * 0.5,
    s: _t
  };
  return n !== o && (r.s = r.l < 0.5 ? (n - o) / (n + o) : (n - o) / (O - n - o), r.h = e === n ? (i - s) / (n - o) : r.h = i === n ? O + (s - e) / (n - o) : O * O + (e - i) / (n - o)), r.l *= wt, r.s *= vt, r.h *= ss, r.h < Bt && (r.h += ce), r.h >= ce && (r.h -= ce), r;
}
function Ks(t, e) {
  return Zs(t, e);
}
function zt(t) {
  const e = (t.h % ce + ce) % ce, i = Math.max(_t, Math.min(vt, t.s)), s = Math.max(ks, Math.min(wt, t.l)), n = e / ce, o = i / vt, r = s / wt;
  if (i === _t) {
    const y = Math.round(r * ne);
    return { r: y, g: y, b: y };
  }
  const a = (y, _, b) => {
    if (b < 0 && b++, b > 1 && b--, b * ht < 1)
      return y + (_ - y) * ht * b;
    if (b * O < 1)
      return _;
    if (b * ct < 1 * O) {
      const R = O / ct;
      return y + (_ - y) * (R - b) * ht;
    }
    return y;
  }, l = r < 0.5 ? r * (Ms + o) : r + o - r * o, c = O * r - l, h = Ss / ct, u = Math.min(ne, ne * a(c, l, n + h)), f = Math.min(ne, ne * a(c, l, n)), p = Math.min(ne, ne * a(c, l, n - h));
  return { r: Math.round(u), g: Math.round(f), b: Math.round(p) };
}
function en(t) {
  const e = zt(t);
  return {
    a: t.a,
    b: e.b,
    g: e.g,
    r: e.r
  };
}
function tn(t) {
  const e = Ds, i = We + xt;
  return {
    b: Math.floor(I(g(e, i))),
    g: Math.floor(I(g(e, i))),
    r: Math.floor(I(g(e, i)))
  };
}
function Ge(t, e) {
  return `rgba(${t.r}, ${t.g}, ${t.b}, ${e ?? Mt})`;
}
function Zt(t, e) {
  return `hsla(${t.h}, ${t.s}%, ${t.l}%, ${e ?? Mt})`;
}
function Jt(t) {
  return t !== void 0 ? {
    h: t.h.value,
    s: t.s.value,
    l: t.l.value
  } : void 0;
}
function sn(t, e, i) {
  const s = {
    h: {
      enable: !1,
      value: t.h
    },
    s: {
      enable: !1,
      value: t.s
    },
    l: {
      enable: !1,
      value: t.l
    }
  };
  return e && (ut(s.h, e.h, i), ut(s.s, e.s, i), ut(s.l, e.l, i)), s;
}
function ut(t, e, i) {
  t.enable = e.enable, t.enable ? (t.velocity = m(e.speed) / 100 * i, t.decay = Pi - m(e.decay), t.status = z.increasing, t.loops = Rs, t.maxLoops = m(e.count), t.time = Is, t.delayTime = m(e.delay) * 1e3, e.sync || (t.velocity *= w(), t.value *= w()), t.initialValue = t.value, t.offset = g(e.offset)) : t.velocity = Os;
}
function ft(t, e, i, s) {
  if (!t || !t.enable || (t.maxLoops ?? 0) > 0 && (t.loops ?? 0) > (t.maxLoops ?? 0) || (t.time || (t.time = 0), (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0) && (t.time += s.value), (t.delayTime ?? 0) > 0 && t.time < (t.delayTime ?? 0)))
    return;
  const h = t.offset ? I(t.offset) : 0, u = (t.velocity ?? 0) * s.factor + h * 3.6, f = t.decay ?? 1, p = Fe(e), y = tt(e);
  !i || t.status === z.increasing ? (t.value += u, t.value > p && (t.loops || (t.loops = 0), t.loops++, i ? t.status = z.decreasing : t.value -= p)) : (t.value -= u, t.value < 0 && (t.loops || (t.loops = 0), t.loops++, t.status = z.increasing)), t.velocity && f !== 1 && (t.velocity *= f), t.value = Me(t.value, y, p);
}
function nn(t, e) {
  if (!t)
    return;
  const { h: i, s, l: n } = t, o = {
    h: { min: 0, max: 360 },
    s: { min: 0, max: 100 },
    l: { min: 0, max: 100 }
  };
  i && ft(i, o.h, !1, e), s && ft(s, o.s, !0, e), n && ft(n, o.l, !0, e);
}
function on(t, e, i) {
  t.fillStyle = i ?? "rgba(0,0,0,0)", t.fillRect(M.x, M.y, e.width, e.height);
}
function rn(t, e, i, s) {
  i && (t.globalAlpha = s, t.drawImage(i, M.x, M.y, e.width, e.height), t.globalAlpha = 1);
}
function dt(t, e) {
  t.clearRect(M.x, M.y, e.width, e.height);
}
function an(t) {
  const { container: e, context: i, particle: s, delta: n, colorStyles: o, backgroundMask: r, composite: a, radius: l, opacity: c, shadow: h, transform: u } = t, f = s.getPosition(), p = s.rotation + (s.pathRotation ? s.velocity.angle : Cs), y = {
    sin: Math.sin(p),
    cos: Math.cos(p)
  }, _ = !!p, b = {
    a: y.cos * (u.a ?? Ae.a),
    b: _ ? y.sin * (u.b ?? xt) : u.b ?? Ae.b,
    c: _ ? -y.sin * (u.c ?? xt) : u.c ?? Ae.c,
    d: y.cos * (u.d ?? Ae.d)
  };
  i.setTransform(b.a, b.b, b.c, b.d, f.x, f.y), r && (i.globalCompositeOperation = a);
  const $ = s.shadowColor;
  h.enable && $ && (i.shadowBlur = h.blur, i.shadowColor = Ge($), i.shadowOffsetX = h.offset.x, i.shadowOffsetY = h.offset.y), o.fill && (i.fillStyle = o.fill);
  const E = s.strokeWidth ?? ki;
  i.lineWidth = E, o.stroke && (i.strokeStyle = o.stroke);
  const R = {
    container: e,
    context: i,
    particle: s,
    radius: l,
    opacity: c,
    delta: n,
    transformData: b,
    strokeWidth: E
  };
  cn(R), hn(R), ln(R), i.globalCompositeOperation = "source-over", i.resetTransform();
}
function ln(t) {
  const { container: e, context: i, particle: s, radius: n, opacity: o, delta: r, transformData: a } = t;
  if (!s.effect)
    return;
  const l = e.effectDrawers.get(s.effect);
  l && l.draw({
    context: i,
    particle: s,
    radius: n,
    opacity: o,
    delta: r,
    pixelRatio: e.retina.pixelRatio,
    transformData: { ...a }
  });
}
function cn(t) {
  const { container: e, context: i, particle: s, radius: n, opacity: o, delta: r, strokeWidth: a, transformData: l } = t;
  if (!s.shape)
    return;
  const c = e.shapeDrawers.get(s.shape);
  c && (i.beginPath(), c.draw({
    context: i,
    particle: s,
    radius: n,
    opacity: o,
    delta: r,
    pixelRatio: e.retina.pixelRatio,
    transformData: { ...l }
  }), s.shapeClose && i.closePath(), a > ki && i.stroke(), s.shapeFill && i.fill());
}
function hn(t) {
  const { container: e, context: i, particle: s, radius: n, opacity: o, delta: r, transformData: a } = t;
  if (!s.shape)
    return;
  const l = e.shapeDrawers.get(s.shape);
  l?.afterDraw && l.afterDraw({
    context: i,
    particle: s,
    radius: n,
    opacity: o,
    delta: r,
    pixelRatio: e.retina.pixelRatio,
    transformData: { ...a }
  });
}
function un(t, e, i) {
  e.draw && e.draw(t, i);
}
function fn(t, e, i, s) {
  e.drawParticle && e.drawParticle(t, i, s);
}
function dn(t, e, i) {
  return {
    h: t.h,
    s: t.s,
    l: t.l + (e === X.darken ? -Yt : Yt) * i
  };
}
function pn(t, e, i) {
  const s = e[i];
  s !== void 0 && (t[i] = (t[i] ?? os) * s);
}
function Kt(t, e, i = !1) {
  if (!e)
    return;
  const s = t;
  if (!s)
    return;
  const n = s.style;
  if (!n)
    return;
  const o = /* @__PURE__ */ new Set();
  for (const r in n)
    Object.prototype.hasOwnProperty.call(n, r) && o.add(n[r]);
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && o.add(e[r]);
  for (const r of o) {
    const a = e.getPropertyValue(r);
    a ? n.setProperty(r, a, i ? "important" : "") : n.removeProperty(r);
  }
}
class mn {
  constructor(e, i) {
    this.container = e, this._applyPostDrawUpdaters = (o) => {
      for (const r of this._postDrawUpdaters)
        r.afterDraw?.(o);
    }, this._applyPreDrawUpdaters = (o, r, a, l, c, h) => {
      for (const u of this._preDrawUpdaters) {
        if (u.getColorStyles) {
          const { fill: f, stroke: p } = u.getColorStyles(r, o, a, l);
          f && (c.fill = f), p && (c.stroke = p);
        }
        if (u.getTransformValues) {
          const f = u.getTransformValues(r);
          for (const p in f)
            pn(h, f, p);
        }
        u.beforeDraw?.(r);
      }
    }, this._applyResizePlugins = () => {
      for (const o of this._resizePlugins)
        o.resize?.();
    }, this._getPluginParticleColors = (o) => {
      let r, a;
      for (const l of this._colorPlugins)
        if (!r && l.particleFillColor && (r = Ee(this._engine, l.particleFillColor(o))), !a && l.particleStrokeColor && (a = Ee(this._engine, l.particleStrokeColor(o))), r && a)
          break;
      return [r, a];
    }, this._initCover = async () => {
      const o = this.container.actualOptions, r = o.backgroundMask.cover, a = r.color;
      if (a) {
        const l = ze(this._engine, a);
        if (l) {
          const c = {
            ...l,
            a: r.opacity
          };
          this._coverColorStyle = Ge(c, c.a);
        }
      } else
        await new Promise((l, c) => {
          if (!r.image)
            return;
          const h = document.createElement("img");
          h.addEventListener("load", () => {
            this._coverImage = {
              image: h,
              opacity: r.opacity
            }, l();
          }), h.addEventListener("error", (u) => {
            c(u.error);
          }), h.src = r.image;
        });
    }, this._initStyle = () => {
      const o = this.element, r = this.container.actualOptions;
      if (o) {
        this._fullScreen ? this._setFullScreenStyle() : this._resetOriginalStyle();
        for (const a in r.style) {
          if (!a || !r.style || !Object.prototype.hasOwnProperty.call(r.style, a))
            continue;
          const l = r.style[a];
          l && o.style.setProperty(a, l, "important");
        }
      }
    }, this._initTrail = async () => {
      const o = this.container.actualOptions, r = o.particles.move.trail, a = r.fill;
      if (!r.enable)
        return;
      const l = xi / r.length;
      if (a.color) {
        const c = ze(this._engine, a.color);
        if (!c)
          return;
        this._trailFill = {
          color: {
            ...c
          },
          opacity: l
        };
      } else
        await new Promise((c, h) => {
          if (!a.image)
            return;
          const u = document.createElement("img");
          u.addEventListener("load", () => {
            this._trailFill = {
              image: u,
              opacity: l
            }, c();
          }), u.addEventListener("error", (f) => {
            h(f.error);
          }), u.src = a.image;
        });
    }, this._paintBase = (o) => {
      this.draw((r) => on(r, this.size, o));
    }, this._paintImage = (o, r) => {
      this.draw((a) => rn(a, this.size, o, r));
    }, this._repairStyle = () => {
      const o = this.element;
      if (!o)
        return;
      this._safeMutationObserver((a) => a.disconnect()), this._initStyle(), this.initBackground();
      const r = this._pointerEvents;
      o.style.pointerEvents = r, o.setAttribute("pointer-events", r), this._safeMutationObserver((a) => {
        !o || !(o instanceof Node) || a.observe(o, { attributes: !0 });
      });
    }, this._resetOriginalStyle = () => {
      const o = this.element, r = this._originalStyle;
      !o || !r || Kt(o, r, !0);
    }, this._safeMutationObserver = (o) => {
      this._mutationObserver && o(this._mutationObserver);
    }, this._setFullScreenStyle = () => {
      const o = this.element;
      o && Kt(o, js(this.container.actualOptions.fullScreen.zIndex), !0);
    }, this._engine = i, this._standardSize = {
      height: 0,
      width: 0
    };
    const s = e.retina.pixelRatio, n = this._standardSize;
    this.size = {
      height: n.height * s,
      width: n.width * s
    }, this._context = null, this._generated = !1, this._preDrawUpdaters = [], this._postDrawUpdaters = [], this._resizePlugins = [], this._colorPlugins = [], this._pointerEvents = "none";
  }
  get _fullScreen() {
    return this.container.actualOptions.fullScreen.enable;
  }
  clear() {
    const e = this.container.actualOptions, i = e.particles.move.trail, s = this._trailFill;
    e.backgroundMask.enable ? this.paint() : i.enable && i.length > as && s ? s.color ? this._paintBase(Ge(s.color, s.opacity)) : s.image && this._paintImage(s.image, s.opacity) : e.clear && this.draw((n) => {
      dt(n, this.size);
    });
  }
  destroy() {
    this.stop(), this._generated ? (this.element?.remove(), this.element = void 0) : this._resetOriginalStyle(), this._preDrawUpdaters = [], this._postDrawUpdaters = [], this._resizePlugins = [], this._colorPlugins = [];
  }
  draw(e) {
    const i = this._context;
    if (i)
      return e(i);
  }
  drawAsync(e) {
    const i = this._context;
    if (i)
      return e(i);
  }
  drawParticle(e, i) {
    if (e.spawning || e.destroyed)
      return;
    const s = e.getRadius();
    if (s <= rs)
      return;
    const n = e.getFillColor(), o = e.getStrokeColor() ?? n;
    let [r, a] = this._getPluginParticleColors(e);
    r || (r = n), a || (a = o), !(!r && !a) && this.draw((l) => {
      const c = this.container, h = c.actualOptions, u = e.options.zIndex, f = ls - e.zIndexFactor, p = f ** u.opacityRate, y = e.bubble.opacity ?? e.opacity?.value ?? Mt, _ = e.strokeOpacity ?? y, b = y * p, $ = _ * p, E = {}, R = {
        fill: r ? Zt(r, b) : void 0
      };
      R.stroke = a ? Zt(a, $) : R.fill, this._applyPreDrawUpdaters(l, e, s, b, R, E), an({
        container: c,
        context: l,
        particle: e,
        delta: i,
        colorStyles: R,
        backgroundMask: h.backgroundMask.enable,
        composite: h.backgroundMask.composite,
        radius: s * f ** u.sizeRate,
        opacity: b,
        shadow: e.options.shadow,
        transform: E
      }), this._applyPostDrawUpdaters(e);
    });
  }
  drawParticlePlugin(e, i, s) {
    this.draw((n) => fn(n, e, i, s));
  }
  drawPlugin(e, i) {
    this.draw((s) => un(s, e, i));
  }
  async init() {
    this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = Gs((e) => {
      for (const i of e)
        i.type === "attributes" && i.attributeName === "style" && this._repairStyle();
    }), this.resize(), this._initStyle(), await this._initCover();
    try {
      await this._initTrail();
    } catch (e) {
      Ie().error(e);
    }
    this.initBackground(), this._safeMutationObserver((e) => {
      !this.element || !(this.element instanceof Node) || e.observe(this.element, { attributes: !0 });
    }), this.initUpdaters(), this.initPlugins(), this.paint();
  }
  initBackground() {
    const e = this.container.actualOptions, i = e.background, s = this.element;
    if (!s)
      return;
    const n = s.style;
    if (n) {
      if (i.color) {
        const o = ze(this._engine, i.color);
        n.backgroundColor = o ? Ge(o, i.opacity) : "";
      } else
        n.backgroundColor = "";
      n.backgroundImage = i.image || "", n.backgroundPosition = i.position || "", n.backgroundRepeat = i.repeat || "", n.backgroundSize = i.size || "";
    }
  }
  initPlugins() {
    this._resizePlugins = [];
    for (const e of this.container.plugins.values())
      e.resize && this._resizePlugins.push(e), (e.particleFillColor ?? e.particleStrokeColor) && this._colorPlugins.push(e);
  }
  initUpdaters() {
    this._preDrawUpdaters = [], this._postDrawUpdaters = [];
    for (const e of this.container.particles.updaters)
      e.afterDraw && this._postDrawUpdaters.push(e), (e.getColorStyles ?? e.getTransformValues ?? e.beforeDraw) && this._preDrawUpdaters.push(e);
  }
  loadCanvas(e) {
    this._generated && this.element && this.element.remove(), this._generated = e.dataset && le in e.dataset ? e.dataset[le] === "true" : this._generated, this.element = e, this.element.ariaHidden = "true", this._originalStyle = Xs(this.element.style);
    const i = this._standardSize;
    i.height = e.offsetHeight, i.width = e.offsetWidth;
    const s = this.container.retina.pixelRatio, n = this.size;
    e.height = n.height = i.height * s, e.width = n.width = i.width * s, this._context = this.element.getContext("2d"), this._safeMutationObserver((o) => o.disconnect()), this.container.retina.init(), this.initBackground(), this._safeMutationObserver((o) => {
      !this.element || !(this.element instanceof Node) || o.observe(this.element, { attributes: !0 });
    });
  }
  paint() {
    const e = this.container.actualOptions;
    this.draw((i) => {
      e.backgroundMask.enable && e.backgroundMask.cover ? (dt(i, this.size), this._coverImage ? this._paintImage(this._coverImage.image, this._coverImage.opacity) : this._coverColorStyle ? this._paintBase(this._coverColorStyle) : this._paintBase()) : this._paintBase();
    });
  }
  resize() {
    if (!this.element)
      return !1;
    const e = this.container, i = e.canvas._standardSize, s = {
      width: this.element.offsetWidth,
      height: this.element.offsetHeight
    }, n = e.retina.pixelRatio, o = {
      width: s.width * n,
      height: s.height * n
    };
    if (s.height === i.height && s.width === i.width && o.height === this.element.height && o.width === this.element.width)
      return !1;
    const r = { ...i };
    i.height = s.height, i.width = s.width;
    const a = this.size;
    return this.element.width = a.width = o.width, this.element.height = a.height = o.height, this.container.started && e.particles.setResizeFactor({
      width: i.width / r.width,
      height: i.height / r.height
    }), !0;
  }
  setPointerEvents(e) {
    this.element && (this._pointerEvents = e, this._repairStyle());
  }
  stop() {
    this._safeMutationObserver((e) => e.disconnect()), this._mutationObserver = void 0, this.draw((e) => dt(e, this.size));
  }
  async windowResize() {
    if (!this.element || !this.resize())
      return;
    const e = this.container, i = e.updateActualOptions();
    e.particles.setDensity(), this._applyResizePlugins(), i && await e.refresh();
  }
}
var Pe;
(function(t) {
  t.canvas = "canvas", t.parent = "parent", t.window = "window";
})(Pe || (Pe = {}));
function F(t, e, i, s, n) {
  if (s) {
    let o = { passive: !0 };
    Mi(n) ? o.capture = n : n !== void 0 && (o = n), t.addEventListener(e, i, o);
  } else {
    const o = n;
    t.removeEventListener(e, i, o);
  }
}
class yn {
  constructor(e) {
    this.container = e, this._doMouseTouchClick = (i) => {
      const s = this.container, n = s.actualOptions;
      if (this._canPush) {
        const o = s.interactivity.mouse, r = o.position;
        if (!r)
          return;
        o.clickPosition = { ...r }, o.clickTime = (/* @__PURE__ */ new Date()).getTime();
        const a = n.interactivity.events.onClick;
        te(a.mode, (l) => this.container.handleClickMode(l));
      }
      i.type === "touchend" && setTimeout(() => this._mouseTouchFinish(), Ps);
    }, this._handleThemeChange = (i) => {
      const s = i, n = this.container, o = n.options, r = o.defaultThemes, a = s.matches ? r.dark : r.light;
      o.themes.find((c) => c.name === a)?.default.auto && n.loadTheme(a);
    }, this._handleVisibilityChange = () => {
      const i = this.container, s = i.actualOptions;
      this._mouseTouchFinish(), s.pauseOnBlur && (document?.hidden ? (i.pageHidden = !0, i.pause()) : (i.pageHidden = !1, i.animationStatus ? i.play(!0) : i.draw(!0)));
    }, this._handleWindowResize = () => {
      this._resizeTimeout && (clearTimeout(this._resizeTimeout), delete this._resizeTimeout);
      const i = async () => {
        await this.container.canvas?.windowResize();
      };
      this._resizeTimeout = setTimeout(() => void i(), this.container.actualOptions.interactivity.events.resize.delay * 1e3);
    }, this._manageInteractivityListeners = (i, s) => {
      const n = this._handlers, o = this.container, r = o.actualOptions, a = o.interactivity.element;
      if (!a)
        return;
      const l = a, c = o.canvas;
      c.setPointerEvents(l === c.element ? "initial" : "none"), (r.interactivity.events.onHover.enable || r.interactivity.events.onClick.enable) && (F(a, Tt, n.mouseMove, s), F(a, Yi, n.touchStart, s), F(a, ji, n.touchMove, s), r.interactivity.events.onClick.enable ? (F(a, Ft, n.touchEndClick, s), F(a, Qi, n.mouseUp, s), F(a, Ni, n.mouseDown, s)) : F(a, Ft, n.touchEnd, s), F(a, i, n.mouseLeave, s), F(a, Zi, n.touchCancel, s));
    }, this._manageListeners = (i) => {
      const s = this._handlers, n = this.container, o = n.actualOptions, r = o.interactivity.detectsOn, a = n.canvas.element;
      let l = Et;
      r === Pe.window ? (n.interactivity.element = window, l = Xi) : r === Pe.parent && a ? n.interactivity.element = a.parentElement ?? a.parentNode : n.interactivity.element = a, this._manageMediaMatch(i), this._manageResize(i), this._manageInteractivityListeners(l, i), document && F(document, Ki, s.visibilityChange, i, !1);
    }, this._manageMediaMatch = (i) => {
      const s = this._handlers, n = St("(prefers-color-scheme: dark)");
      if (n) {
        if (n.addEventListener !== void 0) {
          F(n, "change", s.themeChange, i);
          return;
        }
        n.addListener !== void 0 && (i ? n.addListener(s.oldThemeChange) : n.removeListener(s.oldThemeChange));
      }
    }, this._manageResize = (i) => {
      const s = this._handlers, n = this.container;
      if (!n.actualOptions.interactivity.events.resize)
        return;
      if (typeof ResizeObserver > "u") {
        F(window, Ji, s.resize, i);
        return;
      }
      const r = n.canvas.element;
      this._resizeObserver && !i ? (r && this._resizeObserver.unobserve(r), this._resizeObserver.disconnect(), delete this._resizeObserver) : !this._resizeObserver && i && r && (this._resizeObserver = new ResizeObserver((a) => {
        a.find((c) => c.target === r) && this._handleWindowResize();
      }), this._resizeObserver.observe(r));
    }, this._mouseDown = () => {
      const { interactivity: i } = this.container;
      if (!i)
        return;
      const { mouse: s } = i;
      s.clicking = !0, s.downPosition = s.position;
    }, this._mouseTouchClick = (i) => {
      const s = this.container, n = s.actualOptions, { mouse: o } = s.interactivity;
      o.inside = !0;
      let r = !1;
      const a = o.position;
      if (!(!a || !n.interactivity.events.onClick.enable)) {
        for (const l of s.plugins.values())
          if (l.clickPositionValid && (r = l.clickPositionValid(a), r))
            break;
        r || this._doMouseTouchClick(i), o.clicking = !1;
      }
    }, this._mouseTouchFinish = () => {
      const i = this.container.interactivity;
      if (!i)
        return;
      const s = i.mouse;
      delete s.position, delete s.clickPosition, delete s.downPosition, i.status = Et, s.inside = !1, s.clicking = !1;
    }, this._mouseTouchMove = (i) => {
      const s = this.container, n = s.actualOptions, o = s.interactivity, r = s.canvas.element;
      if (!o?.element)
        return;
      o.mouse.inside = !0;
      let a;
      if (i.type.startsWith("pointer")) {
        this._canPush = !0;
        const c = i;
        if (o.element === window) {
          if (r) {
            const h = r.getBoundingClientRect();
            a = {
              x: c.clientX - h.left,
              y: c.clientY - h.top
            };
          }
        } else if (n.interactivity.detectsOn === Pe.parent) {
          const h = c.target, u = c.currentTarget;
          if (h && u && r) {
            const f = h.getBoundingClientRect(), p = u.getBoundingClientRect(), y = r.getBoundingClientRect();
            a = {
              x: c.offsetX + O * f.left - (p.left + y.left),
              y: c.offsetY + O * f.top - (p.top + y.top)
            };
          } else
            a = {
              x: c.offsetX ?? c.clientX,
              y: c.offsetY ?? c.clientY
            };
        } else c.target === r && (a = {
          x: c.offsetX ?? c.clientX,
          y: c.offsetY ?? c.clientY
        });
      } else if (this._canPush = i.type !== "touchmove", r) {
        const c = i, h = c.touches[c.touches.length - Ci], u = r.getBoundingClientRect();
        a = {
          x: h.clientX - (u.left ?? Xe),
          y: h.clientY - (u.top ?? Xe)
        };
      }
      const l = s.retina.pixelRatio;
      a && (a.x *= l, a.y *= l), o.mouse.position = a, o.status = Tt;
    }, this._touchEnd = (i) => {
      const s = i, n = Array.from(s.changedTouches);
      for (const o of n)
        this._touches.delete(o.identifier);
      this._mouseTouchFinish();
    }, this._touchEndClick = (i) => {
      const s = i, n = Array.from(s.changedTouches);
      for (const o of n)
        this._touches.delete(o.identifier);
      this._mouseTouchClick(i);
    }, this._touchStart = (i) => {
      const s = i, n = Array.from(s.changedTouches);
      for (const o of n)
        this._touches.set(o.identifier, performance.now());
      this._mouseTouchMove(i);
    }, this._canPush = !0, this._touches = /* @__PURE__ */ new Map(), this._handlers = {
      mouseDown: () => this._mouseDown(),
      mouseLeave: () => this._mouseTouchFinish(),
      mouseMove: (i) => this._mouseTouchMove(i),
      mouseUp: (i) => this._mouseTouchClick(i),
      touchStart: (i) => this._touchStart(i),
      touchMove: (i) => this._mouseTouchMove(i),
      touchEnd: (i) => this._touchEnd(i),
      touchCancel: (i) => this._touchEnd(i),
      touchEndClick: (i) => this._touchEndClick(i),
      visibilityChange: () => this._handleVisibilityChange(),
      themeChange: (i) => this._handleThemeChange(i),
      oldThemeChange: (i) => this._handleThemeChange(i),
      resize: () => {
        this._handleWindowResize();
      }
    };
  }
  addListeners() {
    this._manageListeners(!0);
  }
  removeListeners() {
    this._manageListeners(!1);
  }
}
var D;
(function(t) {
  t.configAdded = "configAdded", t.containerInit = "containerInit", t.particlesSetup = "particlesSetup", t.containerStarted = "containerStarted", t.containerStopped = "containerStopped", t.containerDestroyed = "containerDestroyed", t.containerPaused = "containerPaused", t.containerPlay = "containerPlay", t.containerBuilt = "containerBuilt", t.particleAdded = "particleAdded", t.particleDestroyed = "particleDestroyed", t.particleRemoved = "particleRemoved";
})(D || (D = {}));
class H {
  constructor() {
    this.value = "";
  }
  static create(e, i) {
    const s = new H();
    return s.load(e), i !== void 0 && (pe(i) || L(i) ? s.load({ value: i }) : s.load(i)), s;
  }
  load(e) {
    d(e) || d(e.value) || (this.value = e.value);
  }
}
class gn {
  constructor() {
    this.color = new H(), this.color.value = "", this.image = "", this.position = "", this.repeat = "", this.size = "", this.opacity = 1;
  }
  load(e) {
    d(e) || (e.color !== void 0 && (this.color = H.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.position !== void 0 && (this.position = e.position), e.repeat !== void 0 && (this.repeat = e.repeat), e.size !== void 0 && (this.size = e.size), e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class vn {
  constructor() {
    this.opacity = 1;
  }
  load(e) {
    d(e) || (e.color !== void 0 && (this.color = H.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image), e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class wn {
  constructor() {
    this.composite = "destination-out", this.cover = new vn(), this.enable = !1;
  }
  load(e) {
    if (!d(e)) {
      if (e.composite !== void 0 && (this.composite = e.composite), e.cover !== void 0) {
        const i = e.cover, s = pe(e.cover) ? { color: e.cover } : e.cover;
        this.cover.load(i.color !== void 0 || i.image !== void 0 ? i : { color: s });
      }
      e.enable !== void 0 && (this.enable = e.enable);
    }
  }
}
class _n {
  constructor() {
    this.enable = !0, this.zIndex = 0;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.zIndex !== void 0 && (this.zIndex = e.zIndex));
  }
}
class bn {
  constructor() {
    this.enable = !1, this.mode = [];
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode));
  }
}
var Pt;
(function(t) {
  t.circle = "circle", t.rectangle = "rectangle";
})(Pt || (Pt = {}));
class ei {
  constructor() {
    this.selectors = [], this.enable = !1, this.mode = [], this.type = Pt.circle;
  }
  load(e) {
    d(e) || (e.selectors !== void 0 && (this.selectors = e.selectors), e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), e.type !== void 0 && (this.type = e.type));
  }
}
class xn {
  constructor() {
    this.enable = !1, this.force = 2, this.smooth = 10;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.force !== void 0 && (this.force = e.force), e.smooth !== void 0 && (this.smooth = e.smooth));
  }
}
class zn {
  constructor() {
    this.enable = !1, this.mode = [], this.parallax = new xn();
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.mode !== void 0 && (this.mode = e.mode), this.parallax.load(e.parallax));
  }
}
class Pn {
  constructor() {
    this.delay = 0.5, this.enable = !0;
  }
  load(e) {
    d(e) || (e.delay !== void 0 && (this.delay = e.delay), e.enable !== void 0 && (this.enable = e.enable));
  }
}
class Cn {
  constructor() {
    this.onClick = new bn(), this.onDiv = new ei(), this.onHover = new zn(), this.resize = new Pn();
  }
  load(e) {
    if (d(e))
      return;
    this.onClick.load(e.onClick);
    const i = e.onDiv;
    i !== void 0 && (this.onDiv = te(i, (s) => {
      const n = new ei();
      return n.load(s), n;
    })), this.onHover.load(e.onHover), this.resize.load(e.resize);
  }
}
class kn {
  constructor(e, i) {
    this._engine = e, this._container = i;
  }
  load(e) {
    if (d(e) || !this._container)
      return;
    const i = this._engine.interactors.get(this._container);
    if (i)
      for (const s of i)
        s.loadModeOptions && s.loadModeOptions(this, e);
  }
}
class Li {
  constructor(e, i) {
    this.detectsOn = Pe.window, this.events = new Cn(), this.modes = new kn(e, i);
  }
  load(e) {
    if (d(e))
      return;
    const i = e.detectsOn;
    i !== void 0 && (this.detectsOn = i), this.events.load(e.events), this.modes.load(e.modes);
  }
}
class Mn {
  load(e) {
    d(e) || (e.position && (this.position = {
      x: e.position.x ?? Xt,
      y: e.position.y ?? Xt,
      mode: e.position.mode ?? N.percent
    }), e.options && (this.options = C({}, e.options)));
  }
}
var ue;
(function(t) {
  t.screen = "screen", t.canvas = "canvas";
})(ue || (ue = {}));
class Sn {
  constructor() {
    this.maxWidth = 1 / 0, this.options = {}, this.mode = ue.canvas;
  }
  load(e) {
    d(e) || (d(e.maxWidth) || (this.maxWidth = e.maxWidth), d(e.mode) || (e.mode === ue.screen ? this.mode = ue.screen : this.mode = ue.canvas), d(e.options) || (this.options = C({}, e.options)));
  }
}
var Y;
(function(t) {
  t.any = "any", t.dark = "dark", t.light = "light";
})(Y || (Y = {}));
class Dn {
  constructor() {
    this.auto = !1, this.mode = Y.any, this.value = !1;
  }
  load(e) {
    d(e) || (e.auto !== void 0 && (this.auto = e.auto), e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
  }
}
class On {
  constructor() {
    this.name = "", this.default = new Dn();
  }
  load(e) {
    d(e) || (e.name !== void 0 && (this.name = e.name), this.default.load(e.default), e.options !== void 0 && (this.options = C({}, e.options)));
  }
}
class Ot {
  constructor() {
    this.count = 0, this.enable = !1, this.speed = 1, this.decay = 0, this.delay = 0, this.sync = !1;
  }
  load(e) {
    d(e) || (e.count !== void 0 && (this.count = g(e.count)), e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = g(e.speed)), e.decay !== void 0 && (this.decay = g(e.decay)), e.delay !== void 0 && (this.delay = g(e.delay)), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class Rt extends Ot {
  constructor() {
    super(), this.mode = he.auto, this.startValue = xe.random;
  }
  load(e) {
    super.load(e), !d(e) && (e.mode !== void 0 && (this.mode = e.mode), e.startValue !== void 0 && (this.startValue = e.startValue));
  }
}
class pt extends Ot {
  constructor() {
    super(), this.offset = 0, this.sync = !0;
  }
  load(e) {
    super.load(e), !d(e) && e.offset !== void 0 && (this.offset = g(e.offset));
  }
}
class Rn {
  constructor() {
    this.h = new pt(), this.s = new pt(), this.l = new pt();
  }
  load(e) {
    d(e) || (this.h.load(e.h), this.s.load(e.s), this.l.load(e.l));
  }
}
class Se extends H {
  constructor() {
    super(), this.animation = new Rn();
  }
  static create(e, i) {
    const s = new Se();
    return s.load(e), i !== void 0 && (pe(i) || L(i) ? s.load({ value: i }) : s.load(i)), s;
  }
  load(e) {
    if (super.load(e), d(e))
      return;
    const i = e.animation;
    i !== void 0 && (i.enable !== void 0 ? this.animation.h.load(i) : this.animation.load(e.animation));
  }
}
var Ct;
(function(t) {
  t.absorb = "absorb", t.bounce = "bounce", t.destroy = "destroy";
})(Ct || (Ct = {}));
class In {
  constructor() {
    this.speed = 2;
  }
  load(e) {
    d(e) || e.speed !== void 0 && (this.speed = e.speed);
  }
}
class En {
  constructor() {
    this.enable = !0, this.retries = 0;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.retries !== void 0 && (this.retries = e.retries));
  }
}
class ie {
  constructor() {
    this.value = 0;
  }
  load(e) {
    d(e) || d(e.value) || (this.value = g(e.value));
  }
}
class Tn extends ie {
  constructor() {
    super(), this.animation = new Ot();
  }
  load(e) {
    if (super.load(e), d(e))
      return;
    const i = e.animation;
    i !== void 0 && this.animation.load(i);
  }
}
class Ai extends Tn {
  constructor() {
    super(), this.animation = new Rt();
  }
  load(e) {
    super.load(e);
  }
}
class ti extends ie {
  constructor() {
    super(), this.value = 1;
  }
}
class $i {
  constructor() {
    this.horizontal = new ti(), this.vertical = new ti();
  }
  load(e) {
    d(e) || (this.horizontal.load(e.horizontal), this.vertical.load(e.vertical));
  }
}
class Fn {
  constructor() {
    this.absorb = new In(), this.bounce = new $i(), this.enable = !1, this.maxSpeed = 50, this.mode = Ct.bounce, this.overlap = new En();
  }
  load(e) {
    d(e) || (this.absorb.load(e.absorb), this.bounce.load(e.bounce), e.enable !== void 0 && (this.enable = e.enable), e.maxSpeed !== void 0 && (this.maxSpeed = g(e.maxSpeed)), e.mode !== void 0 && (this.mode = e.mode), this.overlap.load(e.overlap));
  }
}
class Ln {
  constructor() {
    this.close = !0, this.fill = !0, this.options = {}, this.type = [];
  }
  load(e) {
    if (d(e))
      return;
    const i = e.options;
    if (i !== void 0)
      for (const s in i) {
        const n = i[s];
        n && (this.options[s] = C(this.options[s] ?? {}, n));
      }
    e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
  }
}
class An {
  constructor() {
    this.offset = 0, this.value = 90;
  }
  load(e) {
    d(e) || (e.offset !== void 0 && (this.offset = g(e.offset)), e.value !== void 0 && (this.value = g(e.value)));
  }
}
class $n {
  constructor() {
    this.distance = 200, this.enable = !1, this.rotate = {
      x: 3e3,
      y: 3e3
    };
  }
  load(e) {
    if (!d(e) && (e.distance !== void 0 && (this.distance = g(e.distance)), e.enable !== void 0 && (this.enable = e.enable), e.rotate)) {
      const i = e.rotate.x;
      i !== void 0 && (this.rotate.x = i);
      const s = e.rotate.y;
      s !== void 0 && (this.rotate.y = s);
    }
  }
}
class Vn {
  constructor() {
    this.x = 50, this.y = 50, this.mode = N.percent, this.radius = 0;
  }
  load(e) {
    d(e) || (e.x !== void 0 && (this.x = e.x), e.y !== void 0 && (this.y = e.y), e.mode !== void 0 && (this.mode = e.mode), e.radius !== void 0 && (this.radius = e.radius));
  }
}
class Un {
  constructor() {
    this.acceleration = 9.81, this.enable = !1, this.inverse = !1, this.maxSpeed = 50;
  }
  load(e) {
    d(e) || (e.acceleration !== void 0 && (this.acceleration = g(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.inverse !== void 0 && (this.inverse = e.inverse), e.maxSpeed !== void 0 && (this.maxSpeed = g(e.maxSpeed)));
  }
}
class Bn {
  constructor() {
    this.clamp = !0, this.delay = new ie(), this.enable = !1, this.options = {};
  }
  load(e) {
    d(e) || (e.clamp !== void 0 && (this.clamp = e.clamp), this.delay.load(e.delay), e.enable !== void 0 && (this.enable = e.enable), this.generator = e.generator, e.options && (this.options = C(this.options, e.options)));
  }
}
class qn {
  load(e) {
    d(e) || (e.color !== void 0 && (this.color = H.create(this.color, e.color)), e.image !== void 0 && (this.image = e.image));
  }
}
class Hn {
  constructor() {
    this.enable = !1, this.length = 10, this.fill = new qn();
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.fill !== void 0 && this.fill.load(e.fill), e.length !== void 0 && (this.length = e.length));
  }
}
var P;
(function(t) {
  t.bounce = "bounce", t.none = "none", t.out = "out", t.destroy = "destroy", t.split = "split";
})(P || (P = {}));
class Wn {
  constructor() {
    this.default = P.out;
  }
  load(e) {
    d(e) || (e.default !== void 0 && (this.default = e.default), this.bottom = e.bottom ?? e.default, this.left = e.left ?? e.default, this.right = e.right ?? e.default, this.top = e.top ?? e.default);
  }
}
class Gn {
  constructor() {
    this.acceleration = 0, this.enable = !1;
  }
  load(e) {
    d(e) || (e.acceleration !== void 0 && (this.acceleration = g(e.acceleration)), e.enable !== void 0 && (this.enable = e.enable), e.position && (this.position = C({}, e.position)));
  }
}
class Nn {
  constructor() {
    this.angle = new An(), this.attract = new $n(), this.center = new Vn(), this.decay = 0, this.distance = {}, this.direction = k.none, this.drift = 0, this.enable = !1, this.gravity = new Un(), this.path = new Bn(), this.outModes = new Wn(), this.random = !1, this.size = !1, this.speed = 2, this.spin = new Gn(), this.straight = !1, this.trail = new Hn(), this.vibrate = !1, this.warp = !1;
  }
  load(e) {
    if (d(e))
      return;
    this.angle.load(q(e.angle) ? { value: e.angle } : e.angle), this.attract.load(e.attract), this.center.load(e.center), e.decay !== void 0 && (this.decay = g(e.decay)), e.direction !== void 0 && (this.direction = e.direction), e.distance !== void 0 && (this.distance = q(e.distance) ? {
      horizontal: e.distance,
      vertical: e.distance
    } : { ...e.distance }), e.drift !== void 0 && (this.drift = g(e.drift)), e.enable !== void 0 && (this.enable = e.enable), this.gravity.load(e.gravity);
    const i = e.outModes;
    i !== void 0 && (ve(i) ? this.outModes.load(i) : this.outModes.load({
      default: i
    })), this.path.load(e.path), e.random !== void 0 && (this.random = e.random), e.size !== void 0 && (this.size = e.size), e.speed !== void 0 && (this.speed = g(e.speed)), this.spin.load(e.spin), e.straight !== void 0 && (this.straight = e.straight), this.trail.load(e.trail), e.vibrate !== void 0 && (this.vibrate = e.vibrate), e.warp !== void 0 && (this.warp = e.warp);
  }
}
class Qn extends Rt {
  constructor() {
    super(), this.destroy = ee.none, this.speed = 2;
  }
  load(e) {
    super.load(e), !d(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
  }
}
class Xn extends Ai {
  constructor() {
    super(), this.animation = new Qn(), this.value = 1;
  }
  load(e) {
    if (d(e))
      return;
    super.load(e);
    const i = e.animation;
    i !== void 0 && this.animation.load(i);
  }
}
class Yn {
  constructor() {
    this.enable = !1, this.width = 1920, this.height = 1080;
  }
  load(e) {
    if (d(e))
      return;
    e.enable !== void 0 && (this.enable = e.enable);
    const i = e.width;
    i !== void 0 && (this.width = i);
    const s = e.height;
    s !== void 0 && (this.height = s);
  }
}
var Te;
(function(t) {
  t.delete = "delete", t.wait = "wait";
})(Te || (Te = {}));
class jn {
  constructor() {
    this.mode = Te.delete, this.value = 0;
  }
  load(e) {
    d(e) || (e.mode !== void 0 && (this.mode = e.mode), e.value !== void 0 && (this.value = e.value));
  }
}
class Zn {
  constructor() {
    this.density = new Yn(), this.limit = new jn(), this.value = 0;
  }
  load(e) {
    d(e) || (this.density.load(e.density), this.limit.load(e.limit), e.value !== void 0 && (this.value = e.value));
  }
}
class Jn {
  constructor() {
    this.blur = 0, this.color = new H(), this.enable = !1, this.offset = {
      x: 0,
      y: 0
    }, this.color.value = "#000";
  }
  load(e) {
    d(e) || (e.blur !== void 0 && (this.blur = e.blur), this.color = H.create(this.color, e.color), e.enable !== void 0 && (this.enable = e.enable), e.offset !== void 0 && (e.offset.x !== void 0 && (this.offset.x = e.offset.x), e.offset.y !== void 0 && (this.offset.y = e.offset.y)));
  }
}
class Kn {
  constructor() {
    this.close = !0, this.fill = !0, this.options = {}, this.type = "circle";
  }
  load(e) {
    if (d(e))
      return;
    const i = e.options;
    if (i !== void 0)
      for (const s in i) {
        const n = i[s];
        n && (this.options[s] = C(this.options[s] ?? {}, n));
      }
    e.close !== void 0 && (this.close = e.close), e.fill !== void 0 && (this.fill = e.fill), e.type !== void 0 && (this.type = e.type);
  }
}
class eo extends Rt {
  constructor() {
    super(), this.destroy = ee.none, this.speed = 5;
  }
  load(e) {
    super.load(e), !d(e) && e.destroy !== void 0 && (this.destroy = e.destroy);
  }
}
class to extends Ai {
  constructor() {
    super(), this.animation = new eo(), this.value = 3;
  }
  load(e) {
    if (super.load(e), d(e))
      return;
    const i = e.animation;
    i !== void 0 && this.animation.load(i);
  }
}
class ii {
  constructor() {
    this.width = 0;
  }
  load(e) {
    d(e) || (e.color !== void 0 && (this.color = Se.create(this.color, e.color)), e.width !== void 0 && (this.width = g(e.width)), e.opacity !== void 0 && (this.opacity = g(e.opacity)));
  }
}
class io extends ie {
  constructor() {
    super(), this.opacityRate = 1, this.sizeRate = 1, this.velocityRate = 1;
  }
  load(e) {
    super.load(e), !d(e) && (e.opacityRate !== void 0 && (this.opacityRate = e.opacityRate), e.sizeRate !== void 0 && (this.sizeRate = e.sizeRate), e.velocityRate !== void 0 && (this.velocityRate = e.velocityRate));
  }
}
class so {
  constructor(e, i) {
    this._engine = e, this._container = i, this.bounce = new $i(), this.collisions = new Fn(), this.color = new Se(), this.color.value = "#fff", this.effect = new Ln(), this.groups = {}, this.move = new Nn(), this.number = new Zn(), this.opacity = new Xn(), this.reduceDuplicates = !1, this.shadow = new Jn(), this.shape = new Kn(), this.size = new to(), this.stroke = new ii(), this.zIndex = new io();
  }
  load(e) {
    if (d(e))
      return;
    if (e.groups !== void 0)
      for (const s of Object.keys(e.groups)) {
        if (!Object.hasOwn(e.groups, s))
          continue;
        const n = e.groups[s];
        n !== void 0 && (this.groups[s] = C(this.groups[s] ?? {}, n));
      }
    e.reduceDuplicates !== void 0 && (this.reduceDuplicates = e.reduceDuplicates), this.bounce.load(e.bounce), this.color.load(Se.create(this.color, e.color)), this.effect.load(e.effect), this.move.load(e.move), this.number.load(e.number), this.opacity.load(e.opacity), this.shape.load(e.shape), this.size.load(e.size), this.shadow.load(e.shadow), this.zIndex.load(e.zIndex), this.collisions.load(e.collisions), e.interactivity !== void 0 && (this.interactivity = C({}, e.interactivity));
    const i = e.stroke;
    if (i && (this.stroke = te(i, (s) => {
      const n = new ii();
      return n.load(s), n;
    })), this._container) {
      const s = this._engine.updaters.get(this._container);
      if (s)
        for (const o of s)
          o.loadOptions && o.loadOptions(this, e);
      const n = this._engine.interactors.get(this._container);
      if (n)
        for (const o of n)
          o.loadParticlesOptions && o.loadParticlesOptions(this, e);
    }
  }
}
function Vi(t, ...e) {
  for (const i of e)
    t.load(i);
}
function Ui(t, e, ...i) {
  const s = new so(t, e);
  return Vi(s, ...i), s;
}
class no {
  constructor(e, i) {
    this._findDefaultTheme = (s) => this.themes.find((n) => n.default.value && n.default.mode === s) ?? this.themes.find((n) => n.default.value && n.default.mode === Y.any), this._importPreset = (s) => {
      this.load(this._engine.getPreset(s));
    }, this._engine = e, this._container = i, this.autoPlay = !0, this.background = new gn(), this.backgroundMask = new wn(), this.clear = !0, this.defaultThemes = {}, this.delay = 0, this.fullScreen = new _n(), this.detectRetina = !0, this.duration = 0, this.fpsLimit = 120, this.interactivity = new Li(e, i), this.manualParticles = [], this.particles = Ui(this._engine, this._container), this.pauseOnBlur = !0, this.pauseOnOutsideViewport = !0, this.responsive = [], this.smooth = !1, this.style = {}, this.themes = [], this.zLayers = 100;
  }
  load(e) {
    if (d(e))
      return;
    e.preset !== void 0 && te(e.preset, (r) => this._importPreset(r)), e.autoPlay !== void 0 && (this.autoPlay = e.autoPlay), e.clear !== void 0 && (this.clear = e.clear), e.key !== void 0 && (this.key = e.key), e.name !== void 0 && (this.name = e.name), e.delay !== void 0 && (this.delay = g(e.delay));
    const i = e.detectRetina;
    i !== void 0 && (this.detectRetina = i), e.duration !== void 0 && (this.duration = g(e.duration));
    const s = e.fpsLimit;
    s !== void 0 && (this.fpsLimit = s), e.pauseOnBlur !== void 0 && (this.pauseOnBlur = e.pauseOnBlur), e.pauseOnOutsideViewport !== void 0 && (this.pauseOnOutsideViewport = e.pauseOnOutsideViewport), e.zLayers !== void 0 && (this.zLayers = e.zLayers), this.background.load(e.background);
    const n = e.fullScreen;
    Mi(n) ? this.fullScreen.enable = n : this.fullScreen.load(n), this.backgroundMask.load(e.backgroundMask), this.interactivity.load(e.interactivity), e.manualParticles && (this.manualParticles = e.manualParticles.map((r) => {
      const a = new Mn();
      return a.load(r), a;
    })), this.particles.load(e.particles), this.style = C(this.style, e.style), this._engine.loadOptions(this, e), e.smooth !== void 0 && (this.smooth = e.smooth);
    const o = this._engine.interactors.get(this._container);
    if (o)
      for (const r of o)
        r.loadOptions && r.loadOptions(this, e);
    if (e.responsive !== void 0)
      for (const r of e.responsive) {
        const a = new Sn();
        a.load(r), this.responsive.push(a);
      }
    if (this.responsive.sort((r, a) => r.maxWidth - a.maxWidth), e.themes !== void 0)
      for (const r of e.themes) {
        const a = this.themes.find((l) => l.name === r.name);
        if (a)
          a.load(r);
        else {
          const l = new On();
          l.load(r), this.themes.push(l);
        }
      }
    this.defaultThemes.dark = this._findDefaultTheme(Y.dark)?.name, this.defaultThemes.light = this._findDefaultTheme(Y.light)?.name;
  }
  setResponsive(e, i, s) {
    this.load(s);
    const n = this.responsive.find((o) => o.mode === ue.screen && screen ? o.maxWidth > screen.availWidth : o.maxWidth * i > e);
    return this.load(n?.options), n?.maxWidth;
  }
  setTheme(e) {
    if (e) {
      const i = this.themes.find((s) => s.name === e);
      i && this.load(i.options);
    } else {
      const i = St("(prefers-color-scheme: dark)"), s = i?.matches, n = this._findDefaultTheme(s ? Y.dark : Y.light);
      n && this.load(n.options);
    }
  }
}
var Ze;
(function(t) {
  t.external = "external", t.particles = "particles";
})(Ze || (Ze = {}));
class oo {
  constructor(e, i) {
    this.container = i, this._engine = e, this._interactors = [], this._externalInteractors = [], this._particleInteractors = [];
  }
  externalInteract(e) {
    for (const i of this._externalInteractors)
      i.isEnabled() && i.interact(e);
  }
  handleClickMode(e) {
    for (const i of this._externalInteractors)
      i.handleClickMode?.(e);
  }
  async init() {
    this._interactors = await this._engine.getInteractors(this.container, !0), this._externalInteractors = [], this._particleInteractors = [];
    for (const e of this._interactors) {
      switch (e.type) {
        case Ze.external:
          this._externalInteractors.push(e);
          break;
        case Ze.particles:
          this._particleInteractors.push(e);
          break;
      }
      e.init();
    }
  }
  particlesInteract(e, i) {
    for (const s of this._externalInteractors)
      s.clear(e, i);
    for (const s of this._particleInteractors)
      s.isEnabled(e) && s.interact(e, i);
  }
  reset(e) {
    for (const i of this._externalInteractors)
      i.isEnabled() && i.reset(e);
    for (const i of this._particleInteractors)
      i.isEnabled(e) && i.reset(e);
  }
}
var B;
(function(t) {
  t.normal = "normal", t.inside = "inside", t.outside = "outside";
})(B || (B = {}));
function ro(t, e, i, s) {
  const n = e.options[t];
  if (n)
    return C({
      close: e.close,
      fill: e.fill
    }, G(n, i, s));
}
function ao(t, e, i, s) {
  const n = e.options[t];
  if (n)
    return C({
      close: e.close,
      fill: e.fill
    }, G(n, i, s));
}
function si(t) {
  if (!Oi(t.outMode, t.checkModes))
    return;
  const e = t.radius * O;
  t.coord > t.maxCoord - e ? t.setCb(-t.radius) : t.coord < e && t.setCb(t.radius);
}
class lo {
  constructor(e, i) {
    this.container = i, this._calcPosition = (s, n, o, r = At) => {
      for (const y of s.plugins.values()) {
        const _ = y.particlePosition !== void 0 ? y.particlePosition(n, this) : void 0;
        if (_)
          return T.create(_.x, _.y, o);
      }
      const a = s.canvas.size, l = Us({
        size: a,
        position: n
      }), c = T.create(l.x, l.y, o), h = this.getRadius(), u = this.options.move.outModes, f = (y) => {
        si({
          outMode: y,
          checkModes: [P.bounce],
          coord: c.x,
          maxCoord: s.canvas.size.width,
          setCb: (_) => c.x += _,
          radius: h
        });
      }, p = (y) => {
        si({
          outMode: y,
          checkModes: [P.bounce],
          coord: c.y,
          maxCoord: s.canvas.size.height,
          setCb: (_) => c.y += _,
          radius: h
        });
      };
      return f(u.left ?? u.default), f(u.right ?? u.default), p(u.top ?? u.default), p(u.bottom ?? u.default), this._checkOverlap(c, r) ? this._calcPosition(s, void 0, o, r + gs) : c;
    }, this._calculateVelocity = () => {
      const s = As(this.direction), n = s.copy(), o = this.options.move;
      if (o.direction === k.inside || o.direction === k.outside)
        return n;
      const r = K(m(o.angle.value)), a = K(m(o.angle.offset)), l = {
        left: a - r * 0.5,
        right: a + r * 0.5
      };
      return o.straight || (n.angle += I(g(l.left, l.right))), o.random && typeof o.speed == "number" && (n.length *= w()), n;
    }, this._checkOverlap = (s, n = At) => {
      const o = this.options.collisions, r = this.getRadius();
      if (!o.enable)
        return !1;
      const a = o.overlap;
      if (a.enable)
        return !1;
      const l = a.retries;
      if (l >= vs && n > l)
        throw new Error(`${de} particle is overlapping and can't be placed`);
      return !!this.container.particles.find((c) => it(s, c.position) < r + c.getRadius());
    }, this._getRollColor = (s) => {
      if (!s || !this.roll || !this.backColor && !this.roll.alter)
        return s;
      const n = this.roll.horizontal && this.roll.vertical ? O * Wt : Wt, o = this.roll.horizontal ? Math.PI * 0.5 : Ye;
      return Math.floor(((this.roll.angle ?? Ye) + o) / (Math.PI / n)) % O ? this.backColor ? this.backColor : this.roll.alter ? dn(s, this.roll.alter.type, this.roll.alter.value) : s : s;
    }, this._initPosition = (s) => {
      const n = this.container, o = m(this.options.zIndex.value);
      this.position = this._calcPosition(n, s, Me(o, ws, n.zLayers)), this.initialPosition = this.position.copy();
      const r = n.canvas.size;
      switch (this.moveCenter = {
        ...Ti(this.options.move.center, r),
        radius: this.options.move.center.radius ?? _s,
        mode: this.options.move.center.mode ?? N.percent
      }, this.direction = Ls(this.options.move.direction, this.position, this.moveCenter), this.options.move.direction) {
        case k.inside:
          this.outType = B.inside;
          break;
        case k.outside:
          this.outType = B.outside;
          break;
      }
      this.offset = A.origin;
    }, this._engine = e;
  }
  destroy(e) {
    if (this.unbreakable || this.destroyed)
      return;
    this.destroyed = !0, this.bubble.inRange = !1, this.slow.inRange = !1;
    const i = this.container, s = this.pathGenerator;
    i.shapeDrawers.get(this.shape)?.particleDestroy?.(this);
    for (const o of i.plugins.values())
      o.particleDestroyed?.(this, e);
    for (const o of i.particles.updaters)
      o.particleDestroyed?.(this, e);
    s?.reset(this), this._engine.dispatchEvent(D.particleDestroyed, {
      container: this.container,
      data: {
        particle: this
      }
    });
  }
  draw(e) {
    const i = this.container, s = i.canvas;
    for (const n of i.plugins.values())
      s.drawParticlePlugin(n, this, e);
    s.drawParticle(this, e);
  }
  getFillColor() {
    return this._getRollColor(this.bubble.color ?? Jt(this.color));
  }
  getMass() {
    return this.getRadius() ** W * Math.PI * 0.5;
  }
  getPosition() {
    return {
      x: this.position.x + this.offset.x,
      y: this.position.y + this.offset.y,
      z: this.position.z
    };
  }
  getRadius() {
    return this.bubble.radius ?? this.size.value;
  }
  getStrokeColor() {
    return this._getRollColor(this.bubble.color ?? Jt(this.strokeColor));
  }
  init(e, i, s, n) {
    const o = this.container, r = this._engine;
    this.id = e, this.group = n, this.effectClose = !0, this.effectFill = !0, this.shapeClose = !0, this.shapeFill = !0, this.pathRotation = !1, this.lastPathTime = 0, this.destroyed = !1, this.unbreakable = !1, this.isRotating = !1, this.rotation = 0, this.misplaced = !1, this.retina = {
      maxDistance: {}
    }, this.outType = B.normal, this.ignoresResizeRatio = !0;
    const a = o.retina.pixelRatio, l = o.actualOptions, c = Ui(this._engine, o, l.particles), { reduceDuplicates: h } = c, u = c.effect.type, f = c.shape.type;
    this.effect = G(u, this.id, h), this.shape = G(f, this.id, h);
    const p = c.effect, y = c.shape;
    if (s) {
      if (s.effect?.type) {
        const S = s.effect.type, Oe = G(S, this.id, h);
        Oe && (this.effect = Oe, p.load(s.effect));
      }
      if (s.shape?.type) {
        const S = s.shape.type, Oe = G(S, this.id, h);
        Oe && (this.shape = Oe, y.load(s.shape));
      }
    }
    if (this.effect === gt) {
      const S = [...this.container.effectDrawers.keys()];
      this.effect = S[Math.floor(w() * S.length)];
    }
    if (this.shape === gt) {
      const S = [...this.container.shapeDrawers.keys()];
      this.shape = S[Math.floor(w() * S.length)];
    }
    this.effectData = ro(this.effect, p, this.id, h), this.shapeData = ao(this.shape, y, this.id, h), c.load(s);
    const _ = this.effectData;
    _ && c.load(_.particles);
    const b = this.shapeData;
    b && c.load(b.particles);
    const $ = new Li(r, o);
    $.load(o.actualOptions.interactivity), $.load(c.interactivity), this.interactivity = $, this.effectFill = _?.fill ?? c.effect.fill, this.effectClose = _?.close ?? c.effect.close, this.shapeFill = b?.fill ?? c.shape.fill, this.shapeClose = b?.close ?? c.shape.close, this.options = c;
    const E = this.options.move.path;
    this.pathDelay = m(E.delay.value) * 1e3, E.generator && (this.pathGenerator = this._engine.getPathGenerator(E.generator), this.pathGenerator && o.addPath(E.generator, this.pathGenerator) && this.pathGenerator.init(o)), o.retina.initParticle(this), this.size = Ii(this.options.size, a), this.bubble = {
      inRange: !1
    }, this.slow = {
      inRange: !1,
      factor: 1
    }, this._initPosition(i), this.initialVelocity = this._calculateVelocity(), this.velocity = this.initialVelocity.copy(), this.moveDecay = Pi - m(this.options.move.decay);
    const R = o.particles;
    R.setLastZIndex(this.position.z), this.zIndexFactor = this.position.z / o.zLayers, this.sides = 24;
    let se = o.effectDrawers.get(this.effect);
    se || (se = this._engine.getEffectDrawer(this.effect), se && o.effectDrawers.set(this.effect, se)), se?.loadEffect && se.loadEffect(this);
    let Q = o.shapeDrawers.get(this.shape);
    Q || (Q = this._engine.getShapeDrawer(this.shape), Q && o.shapeDrawers.set(this.shape, Q)), Q?.loadShape && Q.loadShape(this);
    const It = Q?.getSidesCount;
    It && (this.sides = It(this)), this.spawning = !1, this.shadowColor = ze(this._engine, this.options.shadow.color);
    for (const S of R.updaters)
      S.init(this);
    for (const S of R.movers)
      S.init?.(this);
    se?.particleInit?.(o, this), Q?.particleInit?.(o, this);
    for (const S of o.plugins.values())
      S.particleCreated?.(this);
  }
  isInsideCanvas() {
    const e = this.getRadius(), i = this.container.canvas.size, s = this.position;
    return s.x >= -e && s.y >= -e && s.y <= i.height + e && s.x <= i.width + e;
  }
  isVisible() {
    return !this.destroyed && !this.spawning && this.isInsideCanvas();
  }
  reset() {
    for (const e of this.container.particles.updaters)
      e.reset?.(this);
  }
}
class co {
  constructor(e, i) {
    this.position = e, this.particle = i;
  }
}
var Ce;
(function(t) {
  t.circle = "circle", t.rectangle = "rectangle";
})(Ce || (Ce = {}));
class Bi {
  constructor(e, i, s) {
    this.position = {
      x: e,
      y: i
    }, this.type = s;
  }
}
class rt extends Bi {
  constructor(e, i, s) {
    super(e, i, Ce.circle), this.radius = s;
  }
  contains(e) {
    return it(e, this.position) <= this.radius;
  }
  intersects(e) {
    const i = this.position, s = e.position, n = { x: Math.abs(s.x - i.x), y: Math.abs(s.y - i.y) }, o = this.radius;
    if (e instanceof rt || e.type === Ce.circle) {
      const r = e, a = o + r.radius, l = Math.sqrt(n.x ** W + n.y ** W);
      return a > l;
    } else if (e instanceof De || e.type === Ce.rectangle) {
      const r = e, { width: a, height: l } = r.size;
      return Math.pow(n.x - a, W) + Math.pow(n.y - l, W) <= o ** W || n.x <= o + a && n.y <= o + l || n.x <= a || n.y <= l;
    }
    return !1;
  }
}
class De extends Bi {
  constructor(e, i, s, n) {
    super(e, i, Ce.rectangle), this.size = {
      height: n,
      width: s
    };
  }
  contains(e) {
    const i = this.size.width, s = this.size.height, n = this.position;
    return e.x >= n.x && e.x <= n.x + i && e.y >= n.y && e.y <= n.y + s;
  }
  intersects(e) {
    if (e instanceof rt)
      return e.intersects(this);
    const i = this.size.width, s = this.size.height, n = this.position, o = e.position, r = e instanceof De ? e.size : { width: 0, height: 0 }, a = r.width, l = r.height;
    return o.x < n.x + i && o.x + a > n.x && o.y < n.y + s && o.y + l > n.y;
  }
}
class Je {
  constructor(e, i) {
    this.rectangle = e, this.capacity = i, this._subdivide = () => {
      const { x: s, y: n } = this.rectangle.position, { width: o, height: r } = this.rectangle.size, { capacity: a } = this;
      for (let l = 0; l < is; l++) {
        const c = l % O;
        this._subs.push(new Je(new De(s + o * 0.5 * c, n + r * 0.5 * (Math.round(l * 0.5) - c), o * 0.5, r * 0.5), a));
      }
      this._divided = !0;
    }, this._points = [], this._divided = !1, this._subs = [];
  }
  insert(e) {
    return this.rectangle.contains(e.position) ? this._points.length < this.capacity ? (this._points.push(e), !0) : (this._divided || this._subdivide(), this._subs.some((i) => i.insert(e))) : !1;
  }
  query(e, i) {
    const s = [];
    if (!e.intersects(this.rectangle))
      return [];
    for (const n of this._points)
      !e.contains(n.position) && it(e.position, n.position) > n.particle.getRadius() && (!i || i(n.particle)) || s.push(n.particle);
    if (this._divided)
      for (const n of this._subs)
        s.push(...n.query(e, i));
    return s;
  }
  queryCircle(e, i, s) {
    return this.query(new rt(e.x, e.y, i), s);
  }
  queryRectangle(e, i, s) {
    return this.query(new De(e.x, e.y, i.width, i.height), s);
  }
}
const ni = (t) => {
  const { height: e, width: i } = t;
  return new De(Gt * i, Gt * e, Nt * i, Nt * e);
};
class ho {
  constructor(e, i) {
    this._addToPool = (...n) => {
      this._pool.push(...n);
    }, this._applyDensity = (n, o, r, a) => {
      const l = n.number;
      if (!n.number.density?.enable) {
        r === void 0 ? this._limit = l.limit.value : (a?.number.limit?.value ?? l.limit.value) && this._groupLimits.set(r, a?.number.limit?.value ?? l.limit.value);
        return;
      }
      const c = this._initDensityFactor(l.density), h = l.value, u = l.limit.value > Qt ? l.limit.value : h, f = Math.min(h, u) * c + o, p = Math.min(this.count, this.filter((y) => y.group === r).length);
      r === void 0 ? this._limit = l.limit.value * c : this._groupLimits.set(r, l.limit.value * c), p < f ? this.push(Math.abs(f - p), void 0, n, r) : p > f && this.removeQuantity(p - f, r);
    }, this._initDensityFactor = (n) => {
      const o = this._container;
      if (!o.canvas.element || !n.enable)
        return zs;
      const r = o.canvas.element, a = o.retina.pixelRatio;
      return r.width * r.height / (n.height * n.width * a ** W);
    }, this._pushParticle = (n, o, r, a) => {
      try {
        let l = this._pool.pop();
        l || (l = new lo(this._engine, this._container)), l.init(this._nextId, n, o, r);
        let c = !0;
        return a && (c = a(l)), c ? (this._array.push(l), this._zArray.push(l), this._nextId++, this._engine.dispatchEvent(D.particleAdded, {
          container: this._container,
          data: {
            particle: l
          }
        }), l) : void 0;
      } catch (l) {
        Ie().warning(`${de} adding particle: ${l}`);
      }
    }, this._removeParticle = (n, o, r) => {
      const a = this._array[n];
      if (!a || a.group !== o)
        return !1;
      const l = this._zArray.indexOf(a);
      return this._array.splice(n, je), this._zArray.splice(l, je), a.destroy(r), this._engine.dispatchEvent(D.particleRemoved, {
        container: this._container,
        data: {
          particle: a
        }
      }), this._addToPool(a), !0;
    }, this._engine = e, this._container = i, this._nextId = 0, this._array = [], this._zArray = [], this._pool = [], this._limit = 0, this._groupLimits = /* @__PURE__ */ new Map(), this._needsSort = !1, this._lastZIndex = 0, this._interactionManager = new oo(e, i), this._pluginsInitialized = !1;
    const s = i.canvas.size;
    this.quadTree = new Je(ni(s), $t), this.movers = [], this.updaters = [];
  }
  get count() {
    return this._array.length;
  }
  addManualParticles() {
    const e = this._container;
    e.actualOptions.manualParticles.forEach((s) => this.addParticle(s.position ? Ti(s.position, e.canvas.size) : void 0, s.options));
  }
  addParticle(e, i, s, n) {
    const o = this._container.actualOptions.particles.number.limit.mode, r = s === void 0 ? this._limit : this._groupLimits.get(s) ?? this._limit, a = this.count;
    if (r > Qt)
      switch (o) {
        case Te.delete: {
          const l = a + bs - r;
          l > xs && this.removeQuantity(l);
          break;
        }
        case Te.wait:
          if (a >= r)
            return;
          break;
      }
    return this._pushParticle(e, i, s, n);
  }
  clear() {
    this._array = [], this._zArray = [], this._pluginsInitialized = !1;
  }
  destroy() {
    this._array = [], this._zArray = [], this.movers = [], this.updaters = [];
  }
  draw(e) {
    const i = this._container, s = i.canvas;
    s.clear(), this.update(e);
    for (const n of i.plugins.values())
      s.drawPlugin(n, e);
    for (const n of this._zArray)
      n.draw(e);
  }
  filter(e) {
    return this._array.filter(e);
  }
  find(e) {
    return this._array.find(e);
  }
  get(e) {
    return this._array[e];
  }
  handleClickMode(e) {
    this._interactionManager.handleClickMode(e);
  }
  async init() {
    const e = this._container, i = e.actualOptions;
    this._lastZIndex = 0, this._needsSort = !1, await this.initPlugins();
    let s = !1;
    for (const n of e.plugins.values())
      if (s = n.particlesInitialization?.() ?? s, s)
        break;
    if (this.addManualParticles(), !s) {
      const n = i.particles, o = n.groups;
      for (const r in o) {
        const a = o[r];
        for (let l = this.count, c = 0; c < a.number?.value && l < n.number.value; l++, c++)
          this.addParticle(void 0, a, r);
      }
      for (let r = this.count; r < n.number.value; r++)
        this.addParticle();
    }
  }
  async initPlugins() {
    if (this._pluginsInitialized)
      return;
    const e = this._container;
    this.movers = await this._engine.getMovers(e, !0), this.updaters = await this._engine.getUpdaters(e, !0), await this._interactionManager.init();
    for (const i of e.pathGenerators.values())
      i.init(e);
  }
  push(e, i, s, n) {
    for (let o = 0; o < e; o++)
      this.addParticle(i?.position, s, n);
  }
  async redraw() {
    this.clear(), await this.init(), this.draw({ value: 0, factor: 0 });
  }
  remove(e, i, s) {
    this.removeAt(this._array.indexOf(e), void 0, i, s);
  }
  removeAt(e, i = ts, s, n) {
    if (e < bt || e > this.count)
      return;
    let o = 0;
    for (let r = e; o < i && r < this.count; r++)
      this._removeParticle(r, s, n) && (r--, o++);
  }
  removeQuantity(e, i) {
    this.removeAt(bt, e, i);
  }
  setDensity() {
    const e = this._container.actualOptions, i = e.particles.groups, s = e.manualParticles.length;
    for (const n in i)
      this._applyDensity(i[n], s, n);
    this._applyDensity(e.particles, s);
  }
  setLastZIndex(e) {
    this._lastZIndex = e, this._needsSort = this._needsSort || this._lastZIndex < e;
  }
  setResizeFactor(e) {
    this._resizeFactor = e;
  }
  update(e) {
    const i = this._container, s = /* @__PURE__ */ new Set();
    this.quadTree = new Je(ni(i.canvas.size), $t);
    for (const o of i.pathGenerators.values())
      o.update();
    for (const o of i.plugins.values())
      o.update?.(e);
    const n = this._resizeFactor;
    for (const o of this._array) {
      n && !o.ignoresResizeRatio && (o.position.x *= n.width, o.position.y *= n.height, o.initialPosition.x *= n.width, o.initialPosition.y *= n.height), o.ignoresResizeRatio = !1, this._interactionManager.reset(o);
      for (const r of this._container.plugins.values()) {
        if (o.destroyed)
          break;
        r.particleUpdate?.(o, e);
      }
      for (const r of this.movers)
        r.isEnabled(o) && r.move(o, e);
      if (o.destroyed) {
        s.add(o);
        continue;
      }
      this.quadTree.insert(new co(o.getPosition(), o));
    }
    if (s.size) {
      const o = (r) => !s.has(r);
      this._array = this.filter(o), this._zArray = this._zArray.filter(o);
      for (const r of s)
        this._engine.dispatchEvent(D.particleRemoved, {
          container: this._container,
          data: {
            particle: r
          }
        });
      this._addToPool(...s);
    }
    this._interactionManager.externalInteract(e);
    for (const o of this._array) {
      for (const r of this.updaters)
        r.update(o, e);
      !o.destroyed && !o.spawning && this._interactionManager.particlesInteract(o, e);
    }
    if (delete this._resizeFactor, this._needsSort) {
      const o = this._zArray;
      o.sort((r, a) => a.position.z - r.position.z || r.id - a.id), this._lastZIndex = o[o.length - Ci].position.z, this._needsSort = !1;
    }
  }
}
class uo {
  constructor(e) {
    this.container = e, this.pixelRatio = Vt, this.reduceFactor = Ut;
  }
  init() {
    const e = this.container, i = e.actualOptions;
    this.pixelRatio = !i.detectRetina || Le() ? Vt : devicePixelRatio, this.reduceFactor = Ut;
    const s = this.pixelRatio, n = e.canvas;
    if (n.element) {
      const a = n.element;
      n.size.width = a.offsetWidth * s, n.size.height = a.offsetHeight * s;
    }
    const o = i.particles, r = o.move;
    this.maxSpeed = m(r.gravity.maxSpeed) * s, this.sizeAnimationSpeed = m(o.size.animation.speed) * s;
  }
  initParticle(e) {
    const i = e.options, s = this.pixelRatio, n = i.move, o = n.distance, r = e.retina;
    r.moveDrift = m(n.drift) * s, r.moveSpeed = m(n.speed) * s, r.sizeAnimationSpeed = m(i.size.animation.speed) * s;
    const a = r.maxDistance;
    a.horizontal = o.horizontal !== void 0 ? o.horizontal * s : void 0, a.vertical = o.vertical !== void 0 ? o.vertical * s : void 0, r.maxSpeed = m(n.gravity.maxSpeed) * s;
  }
}
function x(t) {
  return t && !t.destroyed;
}
function fo(t, e = at, i = !1) {
  return {
    value: t,
    factor: i ? at / e : at * t / 1e3
  };
}
function me(t, e, ...i) {
  const s = new no(t, e);
  return Vi(s, ...i), s;
}
class po {
  constructor(e, i, s) {
    this._intersectionManager = (n) => {
      if (!(!x(this) || !this.actualOptions.pauseOnOutsideViewport))
        for (const o of n)
          o.target === this.interactivity.element && (o.isIntersecting ? this.play() : this.pause());
    }, this._nextFrame = (n) => {
      try {
        if (!this._smooth && this._lastFrameTime !== void 0 && n < this._lastFrameTime + 1e3 / this.fpsLimit) {
          this.draw(!1);
          return;
        }
        this._lastFrameTime ??= n;
        const o = fo(n - this._lastFrameTime, this.fpsLimit, this._smooth);
        if (this.addLifeTime(o.value), this._lastFrameTime = n, o.value > 1e3) {
          this.draw(!1);
          return;
        }
        if (this.particles.draw(o), !this.alive()) {
          this.destroy();
          return;
        }
        this.animationStatus && this.draw(!1);
      } catch (o) {
        Ie().error(`${de} in animation loop`, o);
      }
    }, this._engine = e, this.id = Symbol(i), this.fpsLimit = 120, this._smooth = !1, this._delay = 0, this._duration = 0, this._lifeTime = 0, this._firstStart = !0, this.started = !1, this.destroyed = !1, this._paused = !0, this._lastFrameTime = 0, this.zLayers = 100, this.pageHidden = !1, this._clickHandlers = /* @__PURE__ */ new Map(), this._sourceOptions = s, this._initialSourceOptions = s, this.retina = new uo(this), this.canvas = new mn(this, this._engine), this.particles = new ho(this._engine, this), this.pathGenerators = /* @__PURE__ */ new Map(), this.interactivity = {
      mouse: {
        clicking: !1,
        inside: !1
      }
    }, this.plugins = /* @__PURE__ */ new Map(), this.effectDrawers = /* @__PURE__ */ new Map(), this.shapeDrawers = /* @__PURE__ */ new Map(), this._options = me(this._engine, this), this.actualOptions = me(this._engine, this), this._eventListeners = new yn(this), this._intersectionObserver = Ws((n) => this._intersectionManager(n)), this._engine.dispatchEvent(D.containerBuilt, { container: this });
  }
  get animationStatus() {
    return !this._paused && !this.pageHidden && x(this);
  }
  get options() {
    return this._options;
  }
  get sourceOptions() {
    return this._sourceOptions;
  }
  addClickHandler(e) {
    if (!x(this))
      return;
    const i = this.interactivity.element;
    if (!i)
      return;
    const s = (u, f, p) => {
      if (!x(this))
        return;
      const y = this.retina.pixelRatio, _ = {
        x: f.x * y,
        y: f.y * y
      }, b = this.particles.quadTree.queryCircle(_, p * y);
      e(u, b);
    }, n = (u) => {
      if (!x(this))
        return;
      const f = u, p = {
        x: f.offsetX || f.clientX,
        y: f.offsetY || f.clientY
      };
      s(u, p, cs);
    }, o = () => {
      x(this) && (c = !0, h = !1);
    }, r = () => {
      x(this) && (h = !0);
    }, a = (u) => {
      if (x(this)) {
        if (c && !h) {
          const f = u;
          let p = f.touches[f.touches.length - Ht];
          if (!p && (p = f.changedTouches[f.changedTouches.length - Ht], !p))
            return;
          const y = this.canvas.element, _ = y ? y.getBoundingClientRect() : void 0, b = {
            x: p.clientX - (_ ? _.left : Xe),
            y: p.clientY - (_ ? _.top : Xe)
          };
          s(u, b, Math.max(p.radiusX, p.radiusY));
        }
        c = !1, h = !1;
      }
    }, l = () => {
      x(this) && (c = !1, h = !1);
    };
    let c = !1, h = !1;
    this._clickHandlers.set("click", n), this._clickHandlers.set("touchstart", o), this._clickHandlers.set("touchmove", r), this._clickHandlers.set("touchend", a), this._clickHandlers.set("touchcancel", l);
    for (const [u, f] of this._clickHandlers)
      i.addEventListener(u, f);
  }
  addLifeTime(e) {
    this._lifeTime += e;
  }
  addPath(e, i, s = !1) {
    return !x(this) || !s && this.pathGenerators.has(e) ? !1 : (this.pathGenerators.set(e, i), !0);
  }
  alive() {
    return !this._duration || this._lifeTime <= this._duration;
  }
  clearClickHandlers() {
    if (x(this)) {
      for (const [e, i] of this._clickHandlers)
        this.interactivity.element?.removeEventListener(e, i);
      this._clickHandlers.clear();
    }
  }
  destroy(e = !0) {
    if (x(this)) {
      this.stop(), this.clearClickHandlers(), this.particles.destroy(), this.canvas.destroy();
      for (const i of this.effectDrawers.values())
        i.destroy?.(this);
      for (const i of this.shapeDrawers.values())
        i.destroy?.(this);
      for (const i of this.effectDrawers.keys())
        this.effectDrawers.delete(i);
      for (const i of this.shapeDrawers.keys())
        this.shapeDrawers.delete(i);
      if (this._engine.clearPlugins(this), this.destroyed = !0, e) {
        const i = this._engine.items, s = i.findIndex((n) => n === this);
        s >= hs && i.splice(s, zi);
      }
      this._engine.dispatchEvent(D.containerDestroyed, { container: this });
    }
  }
  draw(e) {
    if (!x(this))
      return;
    let i = e;
    const s = (n) => {
      i && (this._lastFrameTime = void 0, i = !1), this._nextFrame(n);
    };
    this._drawAnimationFrame = Ts((n) => s(n));
  }
  async export(e, i = {}) {
    for (const s of this.plugins.values()) {
      if (!s.export)
        continue;
      const n = await s.export(e, i);
      if (n.supported)
        return n.blob;
    }
    Ie().error(`${de} - Export plugin with type ${e} not found`);
  }
  handleClickMode(e) {
    if (x(this)) {
      this.particles.handleClickMode(e);
      for (const i of this.plugins.values())
        i.handleClickMode?.(e);
    }
  }
  async init() {
    if (!x(this))
      return;
    const e = this._engine.getSupportedEffects();
    for (const c of e) {
      const h = this._engine.getEffectDrawer(c);
      h && this.effectDrawers.set(c, h);
    }
    const i = this._engine.getSupportedShapes();
    for (const c of i) {
      const h = this._engine.getShapeDrawer(c);
      h && this.shapeDrawers.set(c, h);
    }
    await this.particles.initPlugins(), this._options = me(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = me(this._engine, this, this._options);
    const s = await this._engine.getAvailablePlugins(this);
    for (const [c, h] of s)
      this.plugins.set(c, h);
    this.retina.init(), await this.canvas.init(), this.updateActualOptions(), this.canvas.initBackground(), this.canvas.resize();
    const { zLayers: n, duration: o, delay: r, fpsLimit: a, smooth: l } = this.actualOptions;
    this.zLayers = n, this._duration = m(o) * 1e3, this._delay = m(r) * 1e3, this._lifeTime = 0, this.fpsLimit = a > fs ? a : us, this._smooth = l;
    for (const c of this.effectDrawers.values())
      await c.init?.(this);
    for (const c of this.shapeDrawers.values())
      await c.init?.(this);
    for (const c of this.plugins.values())
      await c.init?.();
    this._engine.dispatchEvent(D.containerInit, { container: this }), await this.particles.init(), this.particles.setDensity();
    for (const c of this.plugins.values())
      c.particlesSetup?.();
    this._engine.dispatchEvent(D.particlesSetup, { container: this });
  }
  async loadTheme(e) {
    x(this) && (this._currentTheme = e, await this.refresh());
  }
  pause() {
    if (x(this) && (this._drawAnimationFrame !== void 0 && (Fs(this._drawAnimationFrame), delete this._drawAnimationFrame), !this._paused)) {
      for (const e of this.plugins.values())
        e.pause?.();
      this.pageHidden || (this._paused = !0), this._engine.dispatchEvent(D.containerPaused, { container: this });
    }
  }
  play(e) {
    if (!x(this))
      return;
    const i = this._paused || e;
    if (this._firstStart && !this.actualOptions.autoPlay) {
      this._firstStart = !1;
      return;
    }
    if (this._paused && (this._paused = !1), i)
      for (const s of this.plugins.values())
        s.play && s.play();
    this._engine.dispatchEvent(D.containerPlay, { container: this }), this.draw(i ?? !1);
  }
  async refresh() {
    if (x(this))
      return this.stop(), this.start();
  }
  async reset(e) {
    if (x(this))
      return this._initialSourceOptions = e, this._sourceOptions = e, this._options = me(this._engine, this, this._initialSourceOptions, this.sourceOptions), this.actualOptions = me(this._engine, this, this._options), this.refresh();
  }
  async start() {
    !x(this) || this.started || (await this.init(), this.started = !0, await new Promise((e) => {
      const i = async () => {
        this._eventListeners.addListeners(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.observe(this.interactivity.element);
        for (const s of this.plugins.values())
          await s.start?.();
        this._engine.dispatchEvent(D.containerStarted, { container: this }), this.play(), e();
      };
      this._delayTimeout = setTimeout(() => void i(), this._delay);
    }));
  }
  stop() {
    if (!(!x(this) || !this.started)) {
      this._delayTimeout && (clearTimeout(this._delayTimeout), delete this._delayTimeout), this._firstStart = !0, this.started = !1, this._eventListeners.removeListeners(), this.pause(), this.particles.clear(), this.canvas.stop(), this.interactivity.element instanceof HTMLElement && this._intersectionObserver && this._intersectionObserver.unobserve(this.interactivity.element);
      for (const e of this.plugins.values())
        e.stop?.();
      for (const e of this.plugins.keys())
        this.plugins.delete(e);
      this._sourceOptions = this._options, this._engine.dispatchEvent(D.containerStopped, { container: this });
    }
  }
  updateActualOptions() {
    this.actualOptions.responsive = [];
    const e = this.actualOptions.setResponsive(this.canvas.size.width, this.retina.pixelRatio, this._options);
    return this.actualOptions.setTheme(this._currentTheme), this._responsiveMaxWidth === e ? !1 : (this._responsiveMaxWidth = e, !0);
  }
}
class mo {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  addEventListener(e, i) {
    this.removeEventListener(e, i);
    let s = this._listeners.get(e);
    s || (s = [], this._listeners.set(e, s)), s.push(i);
  }
  dispatchEvent(e, i) {
    this._listeners.get(e)?.forEach((n) => n(i));
  }
  hasEventListener(e) {
    return !!this._listeners.get(e);
  }
  removeAllEventListeners(e) {
    e ? this._listeners.delete(e) : this._listeners = /* @__PURE__ */ new Map();
  }
  removeEventListener(e, i) {
    const s = this._listeners.get(e);
    if (!s)
      return;
    const n = s.length, o = s.indexOf(i);
    o < bt || (n === je ? this._listeners.delete(e) : s.splice(o, je));
  }
}
async function mt(t, e, i, s = !1) {
  let n = e.get(t);
  return (!n || s) && (n = await Promise.all([...i.values()].map((o) => o(t))), e.set(t, n)), n;
}
async function yo(t) {
  const e = G(t.url, t.index);
  if (!e)
    return t.fallback;
  const i = await fetch(e);
  return i.ok ? await i.json() : (Ie().error(`${de} ${i.status} while retrieving config file`), t.fallback);
}
const go = (t) => {
  let e;
  if (t instanceof HTMLCanvasElement || t.tagName.toLowerCase() === lt)
    e = t, e.dataset[le] || (e.dataset[le] = Lt);
  else {
    const s = t.getElementsByTagName(lt);
    s.length ? (e = s[ds], e.dataset[le] = Lt) : (e = document.createElement(lt), e.dataset[le] = bi, t.appendChild(e));
  }
  const i = "100%";
  return e.style.width || (e.style.width = i), e.style.height || (e.style.height = i), e;
}, vo = (t, e) => {
  let i = e ?? document.getElementById(t);
  return i || (i = document.createElement("div"), i.id = t, i.dataset[le] = bi, document.body.append(i), i);
};
class wo {
  constructor() {
    this._configs = /* @__PURE__ */ new Map(), this._domArray = [], this._eventDispatcher = new mo(), this._initialized = !1, this.plugins = [], this.colorManagers = /* @__PURE__ */ new Map(), this.easingFunctions = /* @__PURE__ */ new Map(), this._initializers = {
      interactors: /* @__PURE__ */ new Map(),
      movers: /* @__PURE__ */ new Map(),
      updaters: /* @__PURE__ */ new Map()
    }, this.interactors = /* @__PURE__ */ new Map(), this.movers = /* @__PURE__ */ new Map(), this.updaters = /* @__PURE__ */ new Map(), this.presets = /* @__PURE__ */ new Map(), this.effectDrawers = /* @__PURE__ */ new Map(), this.shapeDrawers = /* @__PURE__ */ new Map(), this.pathGenerators = /* @__PURE__ */ new Map();
  }
  get configs() {
    const e = {};
    for (const [i, s] of this._configs)
      e[i] = s;
    return e;
  }
  get items() {
    return this._domArray;
  }
  get version() {
    return "3.9.1";
  }
  async addColorManager(e, i = !0) {
    this.colorManagers.set(e.key, e), await this.refresh(i);
  }
  addConfig(e) {
    const i = e.key ?? e.name ?? "default";
    this._configs.set(i, e), this._eventDispatcher.dispatchEvent(D.configAdded, { data: { name: i, config: e } });
  }
  async addEasing(e, i, s = !0) {
    this.getEasing(e) || (this.easingFunctions.set(e, i), await this.refresh(s));
  }
  async addEffect(e, i, s = !0) {
    te(e, (n) => {
      this.getEffectDrawer(n) || this.effectDrawers.set(n, i);
    }), await this.refresh(s);
  }
  addEventListener(e, i) {
    this._eventDispatcher.addEventListener(e, i);
  }
  async addInteractor(e, i, s = !0) {
    this._initializers.interactors.set(e, i), await this.refresh(s);
  }
  async addMover(e, i, s = !0) {
    this._initializers.movers.set(e, i), await this.refresh(s);
  }
  async addParticleUpdater(e, i, s = !0) {
    this._initializers.updaters.set(e, i), await this.refresh(s);
  }
  async addPathGenerator(e, i, s = !0) {
    this.getPathGenerator(e) || this.pathGenerators.set(e, i), await this.refresh(s);
  }
  async addPlugin(e, i = !0) {
    this.getPlugin(e.id) || this.plugins.push(e), await this.refresh(i);
  }
  async addPreset(e, i, s = !1, n = !0) {
    (s || !this.getPreset(e)) && this.presets.set(e, i), await this.refresh(n);
  }
  async addShape(e, i = !0) {
    for (const s of e.validTypes)
      this.getShapeDrawer(s) || this.shapeDrawers.set(s, e);
    await this.refresh(i);
  }
  checkVersion(e) {
    if (this.version !== e)
      throw new Error(`The tsParticles version is different from the loaded plugins version. Engine version: ${this.version}. Plugin version: ${e}`);
  }
  clearPlugins(e) {
    this.updaters.delete(e), this.movers.delete(e), this.interactors.delete(e);
  }
  dispatchEvent(e, i) {
    this._eventDispatcher.dispatchEvent(e, i);
  }
  dom() {
    return this.items;
  }
  domItem(e) {
    return this.item(e);
  }
  async getAvailablePlugins(e) {
    const i = /* @__PURE__ */ new Map();
    for (const s of this.plugins)
      s.needsPlugin(e.actualOptions) && i.set(s.id, await s.getPlugin(e));
    return i;
  }
  getEasing(e) {
    return this.easingFunctions.get(e) ?? ((i) => i);
  }
  getEffectDrawer(e) {
    return this.effectDrawers.get(e);
  }
  async getInteractors(e, i = !1) {
    return mt(e, this.interactors, this._initializers.interactors, i);
  }
  async getMovers(e, i = !1) {
    return mt(e, this.movers, this._initializers.movers, i);
  }
  getPathGenerator(e) {
    return this.pathGenerators.get(e);
  }
  getPlugin(e) {
    return this.plugins.find((i) => i.id === e);
  }
  getPreset(e) {
    return this.presets.get(e);
  }
  getShapeDrawer(e) {
    return this.shapeDrawers.get(e);
  }
  getSupportedEffects() {
    return this.effectDrawers.keys();
  }
  getSupportedShapes() {
    return this.shapeDrawers.keys();
  }
  async getUpdaters(e, i = !1) {
    return mt(e, this.updaters, this._initializers.updaters, i);
  }
  init() {
    this._initialized || (this._initialized = !0);
  }
  item(e) {
    const { items: i } = this, s = i[e];
    if (!s || s.destroyed) {
      i.splice(e, zi);
      return;
    }
    return s;
  }
  async load(e) {
    const i = e.id ?? e.element?.id ?? `tsparticles${Math.floor(w() * ps)}`, { index: s, url: n } = e, o = n ? await yo({ fallback: e.options, url: n, index: s }) : e.options, r = G(o, s), { items: a } = this, l = a.findIndex((f) => f.id.description === i), c = new po(this, i, r);
    if (l >= ms) {
      const f = this.item(l), p = f ? ys : Ye;
      f && !f.destroyed && f.destroy(!1), a.splice(l, p, c);
    } else
      a.push(c);
    const h = vo(i, e.element), u = go(h);
    return c.canvas.loadCanvas(u), await c.start(), c;
  }
  loadOptions(e, i) {
    this.plugins.forEach((s) => s.loadOptions?.(e, i));
  }
  loadParticlesOptions(e, i, ...s) {
    const n = this.updaters.get(e);
    n && n.forEach((o) => o.loadOptions?.(i, ...s));
  }
  async refresh(e = !0) {
    e && await Promise.all(this.items.map((i) => i.refresh()));
  }
  removeEventListener(e, i) {
    this._eventDispatcher.removeEventListener(e, i);
  }
  setOnClickHandler(e) {
    const { items: i } = this;
    if (!i.length)
      throw new Error(`${de} can only set click handlers after calling tsParticles.load()`);
    i.forEach((s) => s.addClickHandler(e));
  }
}
function _o() {
  const t = new wo();
  return t.init(), t;
}
var V;
(function(t) {
  t.clockwise = "clockwise", t.counterClockwise = "counter-clockwise", t.random = "random";
})(V || (V = {}));
var oi;
(function(t) {
  t.linear = "linear", t.radial = "radial", t.random = "random";
})(oi || (oi = {}));
var ri;
(function(t) {
  t.easeInBack = "ease-in-back", t.easeInCirc = "ease-in-circ", t.easeInCubic = "ease-in-cubic", t.easeInLinear = "ease-in-linear", t.easeInQuad = "ease-in-quad", t.easeInQuart = "ease-in-quart", t.easeInQuint = "ease-in-quint", t.easeInExpo = "ease-in-expo", t.easeInSine = "ease-in-sine", t.easeOutBack = "ease-out-back", t.easeOutCirc = "ease-out-circ", t.easeOutCubic = "ease-out-cubic", t.easeOutLinear = "ease-out-linear", t.easeOutQuad = "ease-out-quad", t.easeOutQuart = "ease-out-quart", t.easeOutQuint = "ease-out-quint", t.easeOutExpo = "ease-out-expo", t.easeOutSine = "ease-out-sine", t.easeInOutBack = "ease-in-out-back", t.easeInOutCirc = "ease-in-out-circ", t.easeInOutCubic = "ease-in-out-cubic", t.easeInOutLinear = "ease-in-out-linear", t.easeInOutQuad = "ease-in-out-quad", t.easeInOutQuart = "ease-in-out-quart", t.easeInOutQuint = "ease-in-out-quint", t.easeInOutExpo = "ease-in-out-expo", t.easeInOutSine = "ease-in-out-sine";
})(ri || (ri = {}));
const Ne = _o();
Le() || (window.tsParticles = Ne);
const kt = 0.5, bo = 2, J = 0, U = 1, ai = 60, li = 0, xo = 0.01, zo = Math.PI * bo;
function Po(t) {
  const e = t.initialPosition, { dx: i, dy: s } = be(e, t.position), n = Math.abs(i), o = Math.abs(s), { maxDistance: r } = t.retina, a = r.horizontal, l = r.vertical;
  if (!a && !l)
    return;
  const c = (a && n >= a) ?? !1, h = (l && o >= l) ?? !1;
  if ((c || h) && !t.misplaced)
    t.misplaced = !!a && n > a || !!l && o > l, a && (t.velocity.x = t.velocity.y * kt - t.velocity.x), l && (t.velocity.y = t.velocity.x * kt - t.velocity.y);
  else if ((!a || n < a) && (!l || o < l) && t.misplaced)
    t.misplaced = !1;
  else if (t.misplaced) {
    const u = t.position, f = t.velocity;
    a && (u.x < e.x && f.x < J || u.x > e.x && f.x > J) && (f.x *= -w()), l && (u.y < e.y && f.y < J || u.y > e.y && f.y > J) && (f.y *= -w());
  }
}
function Co(t, e, i, s, n, o, r) {
  Mo(t, r);
  const a = t.gravity, l = a?.enable && a.inverse ? -U : U;
  n && i && (t.velocity.x += n * r.factor / (ai * i)), a?.enable && i && (t.velocity.y += l * (a.acceleration * r.factor) / (ai * i));
  const c = t.moveDecay;
  t.velocity.multTo(c);
  const h = t.velocity.mult(i);
  a?.enable && s > J && (!a.inverse && h.y >= J && h.y >= s || a.inverse && h.y <= J && h.y <= -s) && (h.y = l * s, i && (t.velocity.y = h.y / i));
  const u = t.options.zIndex, f = (U - t.zIndexFactor) ** u.velocityRate;
  h.multTo(f), h.multTo(o);
  const { position: p } = t;
  p.addTo(h), e.vibrate && (p.x += Math.sin(p.x * Math.cos(p.y)) * o, p.y += Math.cos(p.y * Math.sin(p.x)) * o);
}
function ko(t, e, i) {
  const s = t.container;
  if (!t.spin)
    return;
  const n = t.spin.direction === V.clockwise, o = {
    x: n ? Math.cos : Math.sin,
    y: n ? Math.sin : Math.cos
  };
  t.position.x = t.spin.center.x + t.spin.radius * o.x(t.spin.angle) * i, t.position.y = t.spin.center.y + t.spin.radius * o.y(t.spin.angle) * i, t.spin.radius += t.spin.acceleration * i;
  const r = Math.max(s.canvas.size.width, s.canvas.size.height), a = r * kt;
  t.spin.radius > a ? (t.spin.radius = a, t.spin.acceleration *= -U) : t.spin.radius < li && (t.spin.radius = li, t.spin.acceleration *= -U), t.spin.angle += e * xo * (U - t.spin.radius / r);
}
function Mo(t, e) {
  const i = t.options, s = i.move.path;
  if (!s.enable)
    return;
  if (t.lastPathTime <= t.pathDelay) {
    t.lastPathTime += e.value;
    return;
  }
  const o = t.pathGenerator?.generate(t, e);
  o && t.velocity.addTo(o), s.clamp && (t.velocity.x = Me(t.velocity.x, -U, U), t.velocity.y = Me(t.velocity.y, -U, U)), t.lastPathTime -= t.pathDelay;
}
function So(t) {
  return t.slow.inRange ? t.slow.factor : U;
}
function Do(t) {
  const e = t.container, i = t.options, s = i.move.spin;
  if (!s.enable)
    return;
  const n = s.position ?? { x: 50, y: 50 }, o = 0.01, r = {
    x: n.x * o * e.canvas.size.width,
    y: n.y * o * e.canvas.size.height
  }, a = t.getPosition(), l = it(a, r), c = m(s.acceleration);
  t.retina.spinAcceleration = c * e.retina.pixelRatio, t.spin = {
    center: r,
    direction: t.velocity.x >= J ? V.clockwise : V.counterClockwise,
    angle: w() * zo,
    radius: l,
    acceleration: t.retina.spinAcceleration
  };
}
const Oo = 2, Ro = 1, Io = 1;
class Eo {
  init(e) {
    const i = e.options, s = i.move.gravity;
    e.gravity = {
      enable: s.enable,
      acceleration: m(s.acceleration),
      inverse: s.inverse
    }, Do(e);
  }
  isEnabled(e) {
    return !e.destroyed && e.options.move.enable;
  }
  move(e, i) {
    const s = e.options, n = s.move;
    if (!n.enable)
      return;
    const o = e.container, r = o.retina.pixelRatio;
    e.retina.moveSpeed ??= m(n.speed) * r, e.retina.moveDrift ??= m(e.options.move.drift) * r;
    const a = So(e), l = o.retina.reduceFactor, c = e.retina.moveSpeed, h = e.retina.moveDrift, u = Fe(s.size.value) * r, f = n.size ? e.getRadius() / u : Ro, p = i.factor || Io, y = c * f * a * p / Oo, _ = e.retina.maxSpeed ?? o.retina.maxSpeed;
    n.spin.enable ? ko(e, y, l) : Co(e, n, y, _, h, l, i), Po(e);
  }
}
async function To(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addMover("base", () => Promise.resolve(new Eo()), e);
}
const Fo = 2, Lo = Math.PI * Fo, Ao = 0, ci = { x: 0, y: 0 };
function $o(t) {
  const { context: e, particle: i, radius: s } = t;
  i.circleRange || (i.circleRange = { min: Ao, max: Lo });
  const n = i.circleRange;
  e.arc(ci.x, ci.y, s, n.min, n.max, !1);
}
const Vo = 12, Uo = 360, hi = 0;
class Bo {
  constructor() {
    this.validTypes = ["circle"];
  }
  draw(e) {
    $o(e);
  }
  getSidesCount() {
    return Vo;
  }
  particleInit(e, i) {
    const s = i.shapeData, n = s?.angle ?? {
      max: Uo,
      min: hi
    };
    i.circleRange = ve(n) ? { min: K(n.min), max: K(n.max) } : {
      min: hi,
      max: K(n)
    };
  }
}
async function qo(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addShape(new Bo(), e);
}
class Ho {
  constructor(e, i) {
    this._container = e, this._engine = i;
  }
  init(e) {
    const i = Ee(this._engine, e.options.color, e.id, e.options.reduceDuplicates);
    i && (e.color = sn(i, e.options.color.animation, this._container.retina.reduceFactor));
  }
  isEnabled(e) {
    const { h: i, s, l: n } = e.options.color.animation, { color: o } = e;
    return !e.destroyed && !e.spawning && (o?.h.value !== void 0 && i.enable || o?.s.value !== void 0 && s.enable || o?.l.value !== void 0 && n.enable);
  }
  update(e, i) {
    nn(e.color, i);
  }
}
async function Wo(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("color", (i) => Promise.resolve(new Ho(i, t)), e);
}
var ae;
(function(t) {
  t[t.r = 1] = "r", t[t.g = 2] = "g", t[t.b = 3] = "b", t[t.a = 4] = "a";
})(ae || (ae = {}));
const Go = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, No = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i, $e = 16, Qo = 1, Xo = 255;
class Yo {
  constructor() {
    this.key = "hex", this.stringPrefix = "#";
  }
  handleColor(e) {
    return this._parseString(e.value);
  }
  handleRangeColor(e) {
    return this._parseString(e.value);
  }
  parseString(e) {
    return this._parseString(e);
  }
  _parseString(e) {
    if (typeof e != "string" || !e?.startsWith(this.stringPrefix))
      return;
    const i = e.replace(Go, (n, o, r, a, l) => o + o + r + r + a + a + (l !== void 0 ? l + l : "")), s = No.exec(i);
    return s ? {
      a: s[ae.a] !== void 0 ? parseInt(s[ae.a], $e) / Xo : Qo,
      b: parseInt(s[ae.b], $e),
      g: parseInt(s[ae.g], $e),
      r: parseInt(s[ae.r], $e)
    } : void 0;
  }
}
async function jo(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addColorManager(new Yo(), e);
}
var we;
(function(t) {
  t[t.h = 1] = "h", t[t.s = 2] = "s", t[t.l = 3] = "l", t[t.a = 5] = "a";
})(we || (we = {}));
class Zo {
  constructor() {
    this.key = "hsl", this.stringPrefix = "hsl";
  }
  handleColor(e) {
    const i = e.value, s = i.hsl ?? e.value;
    if (s.h !== void 0 && s.s !== void 0 && s.l !== void 0)
      return zt(s);
  }
  handleRangeColor(e) {
    const i = e.value, s = i.hsl ?? e.value;
    if (s.h !== void 0 && s.l !== void 0)
      return zt({
        h: m(s.h),
        l: m(s.l),
        s: m(s.s)
      });
  }
  parseString(e) {
    if (!e.startsWith("hsl"))
      return;
    const i = /hsla?\(\s*(\d+)\s*[\s,]\s*(\d+)%\s*[\s,]\s*(\d+)%\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i, s = i.exec(e), n = 4, o = 1, r = 10;
    return s ? en({
      a: s.length > n ? Di(s[we.a]) : o,
      h: parseInt(s[we.h], r),
      l: parseInt(s[we.l], r),
      s: parseInt(s[we.s], r)
    }) : void 0;
  }
}
async function Jo(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addColorManager(new Zo(), e);
}
class Ko {
  constructor(e) {
    this.container = e;
  }
  init(e) {
    const i = e.options.opacity, s = 1;
    e.opacity = Ii(i, s);
    const n = i.animation;
    n.enable && (e.opacity.velocity = m(n.speed) / 100 * this.container.retina.reduceFactor, n.sync || (e.opacity.velocity *= w()));
  }
  isEnabled(e) {
    return !e.destroyed && !e.spawning && !!e.opacity && e.opacity.enable && ((e.opacity.maxLoops ?? 0) <= 0 || (e.opacity.maxLoops ?? 0) > 0 && (e.opacity.loops ?? 0) < (e.opacity.maxLoops ?? 0));
  }
  reset(e) {
    e.opacity && (e.opacity.time = 0, e.opacity.loops = 0);
  }
  update(e, i) {
    !this.isEnabled(e) || !e.opacity || ot(e, e.opacity, !0, e.options.opacity.animation.destroy, i);
  }
}
async function er(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("opacity", (i) => Promise.resolve(new Ko(i)), e);
}
const Ke = 0, ke = 0;
function tr(t) {
  if (t.outMode !== P.bounce && t.outMode !== P.split || t.direction !== v.left && t.direction !== v.right)
    return;
  t.bounds.right < ke && t.direction === v.left ? t.particle.position.x = t.size + t.offset.x : t.bounds.left > t.canvasSize.width && t.direction === v.right && (t.particle.position.x = t.canvasSize.width - t.size - t.offset.x);
  const e = t.particle.velocity.x;
  let i = !1;
  if (t.direction === v.right && t.bounds.right >= t.canvasSize.width && e > Ke || t.direction === v.left && t.bounds.left <= ke && e < Ke) {
    const n = m(t.particle.options.bounce.horizontal.value);
    t.particle.velocity.x *= -n, i = !0;
  }
  if (!i)
    return;
  const s = t.offset.x + t.size;
  t.bounds.right >= t.canvasSize.width && t.direction === v.right ? t.particle.position.x = t.canvasSize.width - s : t.bounds.left <= ke && t.direction === v.left && (t.particle.position.x = s), t.outMode === P.split && t.particle.destroy();
}
function ir(t) {
  if (t.outMode !== P.bounce && t.outMode !== P.split || t.direction !== v.bottom && t.direction !== v.top)
    return;
  t.bounds.bottom < ke && t.direction === v.top ? t.particle.position.y = t.size + t.offset.y : t.bounds.top > t.canvasSize.height && t.direction === v.bottom && (t.particle.position.y = t.canvasSize.height - t.size - t.offset.y);
  const e = t.particle.velocity.y;
  let i = !1;
  if (t.direction === v.bottom && t.bounds.bottom >= t.canvasSize.height && e > Ke || t.direction === v.top && t.bounds.top <= ke && e < Ke) {
    const n = m(t.particle.options.bounce.vertical.value);
    t.particle.velocity.y *= -n, i = !0;
  }
  if (!i)
    return;
  const s = t.offset.y + t.size;
  t.bounds.bottom >= t.canvasSize.height && t.direction === v.bottom ? t.particle.position.y = t.canvasSize.height - s : t.bounds.top <= ke && t.direction === v.top && (t.particle.position.y = s), t.outMode === P.split && t.particle.destroy();
}
class sr {
  constructor(e) {
    this.container = e, this.modes = [
      P.bounce,
      P.split
    ];
  }
  update(e, i, s, n) {
    if (!this.modes.includes(n))
      return;
    const o = this.container;
    let r = !1;
    for (const f of o.plugins.values())
      if (f.particleBounce !== void 0 && (r = f.particleBounce(e, s, i)), r)
        break;
    if (r)
      return;
    const a = e.getPosition(), l = e.offset, c = e.getRadius(), h = Dt(a, c), u = o.canvas.size;
    tr({ particle: e, outMode: n, direction: i, bounds: h, canvasSize: u, offset: l, size: c }), ir({ particle: e, outMode: n, direction: i, bounds: h, canvasSize: u, offset: l, size: c });
  }
}
const Ve = 0;
class nr {
  constructor(e) {
    this.container = e, this.modes = [P.destroy];
  }
  update(e, i, s, n) {
    if (!this.modes.includes(n))
      return;
    const o = this.container;
    switch (e.outType) {
      case B.normal:
      case B.outside:
        if (nt(e.position, o.canvas.size, A.origin, e.getRadius(), i))
          return;
        break;
      case B.inside: {
        const { dx: r, dy: a } = be(e.position, e.moveCenter), { x: l, y: c } = e.velocity;
        if (l < Ve && r > e.moveCenter.radius || c < Ve && a > e.moveCenter.radius || l >= Ve && r < -e.moveCenter.radius || c >= Ve && a < -e.moveCenter.radius)
          return;
        break;
      }
    }
    o.particles.remove(e, e.group, !0);
  }
}
const Ue = 0;
class or {
  constructor(e) {
    this.container = e, this.modes = [P.none];
  }
  update(e, i, s, n) {
    if (!this.modes.includes(n) || ((e.options.move.distance.horizontal && (i === v.left || i === v.right)) ?? (e.options.move.distance.vertical && (i === v.top || i === v.bottom))))
      return;
    const o = e.options.move.gravity, r = this.container, a = r.canvas.size, l = e.getRadius();
    if (o.enable) {
      const c = e.position;
      (!o.inverse && c.y > a.height + l && i === v.bottom || o.inverse && c.y < -l && i === v.top) && r.particles.remove(e);
    } else {
      if (e.velocity.y > Ue && e.position.y <= a.height + l || e.velocity.y < Ue && e.position.y >= -l || e.velocity.x > Ue && e.position.x <= a.width + l || e.velocity.x < Ue && e.position.x >= -l)
        return;
      nt(e.position, r.canvas.size, A.origin, l, i) || r.particles.remove(e);
    }
  }
}
const Be = 0, qe = 0;
class rr {
  constructor(e) {
    this.container = e, this.modes = [P.out];
  }
  update(e, i, s, n) {
    if (!this.modes.includes(n))
      return;
    const o = this.container;
    switch (e.outType) {
      case B.inside: {
        const { x: r, y: a } = e.velocity, l = A.origin;
        l.length = e.moveCenter.radius, l.angle = e.velocity.angle + Math.PI, l.addTo(A.create(e.moveCenter));
        const { dx: c, dy: h } = be(e.position, l);
        if (r <= Be && c >= qe || a <= Be && h >= qe || r >= Be && c <= qe || a >= Be && h <= qe)
          return;
        e.position.x = Math.floor(I({
          min: 0,
          max: o.canvas.size.width
        })), e.position.y = Math.floor(I({
          min: 0,
          max: o.canvas.size.height
        }));
        const { dx: u, dy: f } = be(e.position, e.moveCenter);
        e.direction = Math.atan2(-f, -u), e.velocity.angle = e.direction;
        break;
      }
      default: {
        if (nt(e.position, o.canvas.size, A.origin, e.getRadius(), i))
          return;
        switch (e.outType) {
          case B.outside: {
            e.position.x = Math.floor(I({
              min: -e.moveCenter.radius,
              max: e.moveCenter.radius
            })) + e.moveCenter.x, e.position.y = Math.floor(I({
              min: -e.moveCenter.radius,
              max: e.moveCenter.radius
            })) + e.moveCenter.y;
            const { dx: r, dy: a } = be(e.position, e.moveCenter);
            e.moveCenter.radius && (e.direction = Math.atan2(a, r), e.velocity.angle = e.direction);
            break;
          }
          case B.normal: {
            const r = e.options.move.warp, a = o.canvas.size, l = {
              bottom: a.height + e.getRadius() + e.offset.y,
              left: -e.getRadius() - e.offset.x,
              right: a.width + e.getRadius() + e.offset.x,
              top: -e.getRadius() - e.offset.y
            }, c = e.getRadius(), h = Dt(e.position, c);
            i === v.right && h.left > a.width + e.offset.x ? (e.position.x = l.left, e.initialPosition.x = e.position.x, r || (e.position.y = w() * a.height, e.initialPosition.y = e.position.y)) : i === v.left && h.right < -e.offset.x && (e.position.x = l.right, e.initialPosition.x = e.position.x, r || (e.position.y = w() * a.height, e.initialPosition.y = e.position.y)), i === v.bottom && h.top > a.height + e.offset.y ? (r || (e.position.x = w() * a.width, e.initialPosition.x = e.position.x), e.position.y = l.top, e.initialPosition.y = e.position.y) : i === v.top && h.bottom < -e.offset.y && (r || (e.position.x = w() * a.width, e.initialPosition.x = e.position.x), e.position.y = l.bottom, e.initialPosition.y = e.position.y);
            break;
          }
        }
        break;
      }
    }
  }
}
const ar = (t, e) => t.default === e || t.bottom === e || t.left === e || t.right === e || t.top === e;
class lr {
  constructor(e) {
    this._addUpdaterIfMissing = (i, s, n) => {
      const o = i.options.move.outModes;
      !this.updaters.has(s) && ar(o, s) && this.updaters.set(s, n(this.container));
    }, this._updateOutMode = (i, s, n, o) => {
      for (const r of this.updaters.values())
        r.update(i, o, s, n);
    }, this.container = e, this.updaters = /* @__PURE__ */ new Map();
  }
  init(e) {
    this._addUpdaterIfMissing(e, P.bounce, (i) => new sr(i)), this._addUpdaterIfMissing(e, P.out, (i) => new rr(i)), this._addUpdaterIfMissing(e, P.destroy, (i) => new nr(i)), this._addUpdaterIfMissing(e, P.none, (i) => new or(i));
  }
  isEnabled(e) {
    return !e.destroyed && !e.spawning;
  }
  update(e, i) {
    const s = e.options.move.outModes;
    this._updateOutMode(e, i, s.bottom ?? s.default, v.bottom), this._updateOutMode(e, i, s.left ?? s.default, v.left), this._updateOutMode(e, i, s.right ?? s.default, v.right), this._updateOutMode(e, i, s.top ?? s.default, v.top);
  }
}
async function cr(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("outModes", (i) => Promise.resolve(new lr(i)), e);
}
var _e;
(function(t) {
  t[t.r = 1] = "r", t[t.g = 2] = "g", t[t.b = 3] = "b", t[t.a = 5] = "a";
})(_e || (_e = {}));
class hr {
  constructor() {
    this.key = "rgb", this.stringPrefix = "rgb";
  }
  handleColor(e) {
    const i = e.value, s = i.rgb ?? e.value;
    if (s.r !== void 0)
      return s;
  }
  handleRangeColor(e) {
    const i = e.value, s = i.rgb ?? e.value;
    if (s.r !== void 0)
      return {
        r: m(s.r),
        g: m(s.g),
        b: m(s.b)
      };
  }
  parseString(e) {
    if (!e.startsWith(this.stringPrefix))
      return;
    const i = /rgba?\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*([\s,]\s*(0|1|0?\.\d+|(\d{1,3})%)\s*)?\)/i, s = i.exec(e), n = 10;
    return s ? {
      a: s.length > 4 ? Di(s[_e.a]) : 1,
      b: parseInt(s[_e.b], n),
      g: parseInt(s[_e.g], n),
      r: parseInt(s[_e.r], n)
    } : void 0;
  }
}
async function ur(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addColorManager(new hr(), e);
}
const oe = 0;
class fr {
  init(e) {
    const i = e.container, s = e.options.size, n = s.animation;
    n.enable && (e.size.velocity = (e.retina.sizeAnimationSpeed ?? i.retina.sizeAnimationSpeed) / 100 * i.retina.reduceFactor, n.sync || (e.size.velocity *= w()));
  }
  isEnabled(e) {
    return !e.destroyed && !e.spawning && e.size.enable && ((e.size.maxLoops ?? oe) <= oe || (e.size.maxLoops ?? oe) > oe && (e.size.loops ?? oe) < (e.size.maxLoops ?? oe));
  }
  reset(e) {
    e.size.loops = oe;
  }
  update(e, i) {
    this.isEnabled(e) && ot(e, e.size, !0, e.options.size.animation.destroy, i);
  }
}
async function dr(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("size", () => Promise.resolve(new fr()), e);
}
async function pr(t, e = !0) {
  t.checkVersion("3.9.1"), await jo(t, !1), await Jo(t, !1), await ur(t, !1), await To(t, !1), await qo(t, !1), await Wo(t, !1), await er(t, !1), await cr(t, !1), await dr(t, !1), await t.refresh(e);
}
class mr {
  constructor() {
    this.wait = !1;
  }
  load(e) {
    d(e) || (e.count !== void 0 && (this.count = e.count), e.delay !== void 0 && (this.delay = g(e.delay)), e.duration !== void 0 && (this.duration = g(e.duration)), e.wait !== void 0 && (this.wait = e.wait));
  }
}
class yr {
  constructor() {
    this.quantity = 1, this.delay = 0.1;
  }
  load(e) {
    d(e) || (e.quantity !== void 0 && (this.quantity = g(e.quantity)), e.delay !== void 0 && (this.delay = g(e.delay)));
  }
}
class gr {
  constructor() {
    this.color = !1, this.opacity = !1;
  }
  load(e) {
    d(e) || (e.color !== void 0 && (this.color = e.color), e.opacity !== void 0 && (this.opacity = e.opacity));
  }
}
class vr {
  constructor() {
    this.options = {}, this.replace = new gr(), this.type = "square";
  }
  load(e) {
    d(e) || (e.options !== void 0 && (this.options = C({}, e.options ?? {})), this.replace.load(e.replace), e.type !== void 0 && (this.type = e.type));
  }
}
class qi {
  constructor() {
    this.mode = N.percent, this.height = 0, this.width = 0;
  }
  load(e) {
    d(e) || (e.mode !== void 0 && (this.mode = e.mode), e.height !== void 0 && (this.height = e.height), e.width !== void 0 && (this.width = e.width));
  }
}
class j {
  constructor() {
    this.autoPlay = !0, this.fill = !0, this.life = new mr(), this.rate = new yr(), this.shape = new vr(), this.startCount = 0;
  }
  load(e) {
    d(e) || (e.autoPlay !== void 0 && (this.autoPlay = e.autoPlay), e.size !== void 0 && (this.size || (this.size = new qi()), this.size.load(e.size)), e.direction !== void 0 && (this.direction = e.direction), this.domId = e.domId, e.fill !== void 0 && (this.fill = e.fill), this.life.load(e.life), this.name = e.name, this.particles = te(e.particles, (i) => C({}, i)), this.rate.load(e.rate), this.shape.load(e.shape), e.position !== void 0 && (this.position = {}, e.position.x !== void 0 && (this.position.x = g(e.position.x)), e.position.y !== void 0 && (this.position.y = g(e.position.y))), e.spawnColor !== void 0 && (this.spawnColor === void 0 && (this.spawnColor = new Se()), this.spawnColor.load(e.spawnColor)), e.startCount !== void 0 && (this.startCount = e.startCount));
  }
}
var et;
(function(t) {
  t.emitter = "emitter";
})(et || (et = {}));
const ui = 0.5, fi = 0, He = 0, di = 0, wr = 0, _r = -1, br = 1;
function pi(t, e) {
  t.color ? t.color.value = e : t.color = {
    value: e
  };
}
class xr {
  constructor(e, i, s, n, o) {
    this.emitters = i, this.container = s, this._destroy = () => {
      this._mutationObserver?.disconnect(), this._mutationObserver = void 0, this._resizeObserver?.disconnect(), this._resizeObserver = void 0, this.emitters.removeEmitter(this), this._engine.dispatchEvent("emitterDestroyed", {
        container: this.container,
        data: {
          emitter: this
        }
      });
    }, this._prepareToDie = () => {
      if (this._paused)
        return;
      const c = this.options.life?.duration !== void 0 ? m(this.options.life.duration) : void 0;
      (this._lifeCount > 0 || this._immortal) && c !== void 0 && c > 0 && (this._duration = c * 1e3);
    }, this._setColorAnimation = (c, h, u, f = br) => {
      const p = this.container;
      if (!c.enable)
        return h;
      const y = I(c.offset), _ = m(this.options.rate.delay), b = p.retina.reduceFactor ? _ * 1e3 / p.retina.reduceFactor : 1 / 0, $ = 0, E = m(c.speed ?? $);
      return (h + E * p.fpsLimit / b + y * f) % u;
    }, this._engine = e, this._currentDuration = 0, this._currentEmitDelay = 0, this._currentSpawnDelay = 0, this._initialPosition = o, n instanceof j ? this.options = n : (this.options = new j(), this.options.load(n)), this._spawnDelay = s.retina.reduceFactor ? m(this.options.life.delay ?? fi) * 1e3 / s.retina.reduceFactor : 1 / 0, this.position = this._initialPosition ?? this._calcPosition(), this.name = this.options.name, this.fill = this.options.fill, this._firstSpawn = !this.options.life.wait, this._startParticlesAdded = !1;
    let r = C({}, this.options.particles);
    if (r ??= {}, r.move ??= {}, r.move.direction ??= this.options.direction, this.options.spawnColor && (this.spawnColor = Ee(this._engine, this.options.spawnColor)), this._paused = !this.options.autoPlay, this._particlesOptions = r, this._size = this._calcSize(), this.size = jt(this._size, this.container.canvas.size), this._lifeCount = this.options.life.count ?? _r, this._immortal = this._lifeCount <= He, this.options.domId) {
      const c = document.getElementById(this.options.domId);
      c && (this._mutationObserver = new MutationObserver(() => {
        this.resize();
      }), this._resizeObserver = new ResizeObserver(() => {
        this.resize();
      }), this._mutationObserver.observe(c, {
        attributes: !0,
        attributeFilter: ["style", "width", "height"]
      }), this._resizeObserver.observe(c));
    }
    const a = this.options.shape, l = this._engine.emitterShapeManager?.getShapeGenerator(a.type);
    l && (this._shape = l.generate(this.position, this.size, this.fill, a.options)), this._engine.dispatchEvent("emitterCreated", {
      container: s,
      data: {
        emitter: this
      }
    }), this.play();
  }
  externalPause() {
    this._paused = !0, this.pause();
  }
  externalPlay() {
    this._paused = !1, this.play();
  }
  async init() {
    await this._shape?.init();
  }
  pause() {
    this._paused || delete this._emitDelay;
  }
  play() {
    if (this._paused || !((this._lifeCount > He || this._immortal || !this.options.life.count) && (this._firstSpawn || this._currentSpawnDelay >= (this._spawnDelay ?? di))))
      return;
    const e = this.container;
    if (this._emitDelay === void 0) {
      const i = m(this.options.rate.delay);
      this._emitDelay = e.retina.reduceFactor ? i * 1e3 / e.retina.reduceFactor : 1 / 0;
    }
    (this._lifeCount > He || this._immortal) && this._prepareToDie();
  }
  resize() {
    const e = this._initialPosition, i = this.container;
    this.position = e && nt(e, i.canvas.size, A.origin) ? e : this._calcPosition(), this._size = this._calcSize(), this.size = jt(this._size, i.canvas.size), this._shape?.resize(this.position, this.size);
  }
  update(e) {
    if (this._paused)
      return;
    const i = this.container;
    this._firstSpawn && (this._firstSpawn = !1, this._currentSpawnDelay = this._spawnDelay ?? di, this._currentEmitDelay = this._emitDelay ?? wr), this._startParticlesAdded || (this._startParticlesAdded = !0, this._emitParticles(this.options.startCount)), this._duration !== void 0 && (this._currentDuration += e.value, this._currentDuration >= this._duration && (this.pause(), this._spawnDelay !== void 0 && delete this._spawnDelay, this._immortal || this._lifeCount--, this._lifeCount > He || this._immortal ? (this.position = this._calcPosition(), this._shape?.resize(this.position, this.size), this._spawnDelay = i.retina.reduceFactor ? m(this.options.life.delay ?? fi) * 1e3 / i.retina.reduceFactor : 1 / 0) : this._destroy(), this._currentDuration -= this._duration, delete this._duration)), this._spawnDelay !== void 0 && (this._currentSpawnDelay += e.value, this._currentSpawnDelay >= this._spawnDelay && (this._engine.dispatchEvent("emitterPlay", {
      container: this.container
    }), this.play(), this._currentSpawnDelay -= this._currentSpawnDelay, delete this._spawnDelay)), this._emitDelay !== void 0 && (this._currentEmitDelay += e.value, this._currentEmitDelay >= this._emitDelay && (this._emit(), this._currentEmitDelay -= this._emitDelay));
  }
  _calcPosition() {
    const e = this.container;
    if (this.options.domId) {
      const i = document.getElementById(this.options.domId);
      if (i) {
        const s = i.getBoundingClientRect(), n = e.retina.pixelRatio;
        return {
          x: (s.x + s.width * ui) * n,
          y: (s.y + s.height * ui) * n
        };
      }
    }
    return Vs({
      size: e.canvas.size,
      position: this.options.position
    });
  }
  _calcSize() {
    const e = this.container;
    if (this.options.domId) {
      const i = document.getElementById(this.options.domId);
      if (i) {
        const s = i.getBoundingClientRect();
        return {
          width: s.width * e.retina.pixelRatio,
          height: s.height * e.retina.pixelRatio,
          mode: N.precise
        };
      }
    }
    return this.options.size ?? (() => {
      const i = new qi();
      return i.load({
        height: 0,
        mode: N.percent,
        width: 0
      }), i;
    })();
  }
  _emit() {
    if (this._paused)
      return;
    const e = m(this.options.rate.quantity);
    this._emitParticles(e);
  }
  _emitParticles(e) {
    const i = G(this._particlesOptions), s = this.container.retina.reduceFactor;
    for (let n = 0; n < e * s; n++) {
      const o = C({}, i);
      if (this.spawnColor) {
        const l = this.options.spawnColor?.animation;
        if (l) {
          const c = {
            h: 360,
            s: 100,
            l: 100
          }, h = 3.6;
          this.spawnColor.h = this._setColorAnimation(l.h, this.spawnColor.h, c.h, h), this.spawnColor.s = this._setColorAnimation(l.s, this.spawnColor.s, c.s), this.spawnColor.l = this._setColorAnimation(l.l, this.spawnColor.l, c.l);
        }
        pi(o, this.spawnColor);
      }
      const r = this.options.shape;
      let a = this.position;
      if (this._shape) {
        const l = this._shape.randomPosition();
        if (l) {
          a = l.position;
          const c = r.replace;
          c.color && l.color && pi(o, l.color), c.opacity && (o.opacity ? o.opacity.value = l.opacity : o.opacity = {
            value: l.opacity
          });
        } else
          a = null;
      }
      a && this.container.particles.addParticle(a, o);
    }
  }
}
class zr {
  constructor(e, i) {
    this.container = i, this._engine = e, this.array = [], this.emitters = [], this.interactivityEmitters = {
      random: {
        count: 1,
        enable: !1
      },
      value: []
    };
    const s = 0;
    i.getEmitter = (n) => n === void 0 || q(n) ? this.array[n ?? s] : this.array.find((o) => o.name === n), i.addEmitter = async (n, o) => this.addEmitter(n, o), i.removeEmitter = (n) => {
      const o = i.getEmitter(n);
      o && this.removeEmitter(o);
    }, i.playEmitter = (n) => {
      const o = i.getEmitter(n);
      o && o.externalPlay();
    }, i.pauseEmitter = (n) => {
      const o = i.getEmitter(n);
      o && o.externalPause();
    };
  }
  async addEmitter(e, i) {
    const s = new j();
    s.load(e);
    const n = new xr(this._engine, this, this.container, s, i);
    return await n.init(), this.array.push(n), n;
  }
  handleClickMode(e) {
    const i = this.emitters, s = this.interactivityEmitters;
    if (e !== et.emitter)
      return;
    let n;
    if (s && L(s.value))
      if (s.value.length > 0 && s.random.enable) {
        n = [];
        const l = [];
        for (let c = 0; c < s.random.count; c++) {
          const h = Ri(s.value);
          if (l.includes(h) && l.length < s.value.length) {
            c--;
            continue;
          }
          l.push(h), n.push(st(s.value, h));
        }
      } else
        n = s.value;
    else
      n = s?.value;
    const o = n ?? i, r = this.container.interactivity.mouse.clickPosition;
    te(o, async (a) => {
      await this.addEmitter(a, r);
    });
  }
  async init() {
    if (this.emitters = this.container.actualOptions.emitters, this.interactivityEmitters = this.container.actualOptions.interactivity.modes.emitters, !!this.emitters)
      if (L(this.emitters))
        for (const e of this.emitters)
          await this.addEmitter(e);
      else
        await this.addEmitter(this.emitters);
  }
  pause() {
    for (const e of this.array)
      e.pause();
  }
  play() {
    for (const e of this.array)
      e.play();
  }
  removeEmitter(e) {
    const i = this.array.indexOf(e);
    i >= 0 && this.array.splice(i, 1);
  }
  resize() {
    for (const e of this.array)
      e.resize();
  }
  stop() {
    this.array = [];
  }
  update(e) {
    for (const i of this.array)
      i.update(e);
  }
}
class Pr {
  constructor(e) {
    this._engine = e, this.id = "emitters";
  }
  getPlugin(e) {
    return Promise.resolve(new zr(this._engine, e));
  }
  loadOptions(e, i) {
    if (!this.needsPlugin(e) && !this.needsPlugin(i))
      return;
    i?.emitters && (e.emitters = te(i.emitters, (n) => {
      const o = new j();
      return o.load(n), o;
    }));
    const s = i?.interactivity?.modes?.emitters;
    if (s)
      if (L(s))
        e.interactivity.modes.emitters = {
          random: {
            count: 1,
            enable: !0
          },
          value: s.map((n) => {
            const o = new j();
            return o.load(n), o;
          })
        };
      else {
        const n = s;
        if (n.value !== void 0)
          if (L(n.value))
            e.interactivity.modes.emitters = {
              random: {
                count: n.random.count ?? 1,
                enable: n.random.enable ?? !1
              },
              value: n.value.map((r) => {
                const a = new j();
                return a.load(r), a;
              })
            };
          else {
            const r = new j();
            r.load(n.value), e.interactivity.modes.emitters = {
              random: {
                count: n.random.count ?? 1,
                enable: n.random.enable ?? !1
              },
              value: r
            };
          }
        else
          (e.interactivity.modes.emitters = {
            random: {
              count: 1,
              enable: !1
            },
            value: new j()
          }).value.load(s);
      }
  }
  needsPlugin(e) {
    if (!e)
      return !1;
    const i = e.emitters;
    return L(i) && !!i.length || i !== void 0 || !!e.interactivity?.events?.onClick?.mode && Oi(et.emitter, e.interactivity.events.onClick.mode);
  }
}
const yt = /* @__PURE__ */ new Map();
class Cr {
  constructor(e) {
    this._engine = e;
  }
  addShapeGenerator(e, i) {
    this.getShapeGenerator(e) || yt.set(e, i);
  }
  getShapeGenerator(e) {
    return yt.get(e);
  }
  getSupportedShapeGenerators() {
    return yt.keys();
  }
}
async function kr(t, e = !0) {
  t.checkVersion("3.9.1"), t.emitterShapeManager || (t.emitterShapeManager = new Cr(t)), t.addEmitterShapeGenerator || (t.addEmitterShapeGenerator = (s, n) => {
    t.emitterShapeManager?.addShapeGenerator(s, n);
  });
  const i = new Pr(t);
  await t.addPlugin(i, e);
}
class Mr extends ie {
  constructor() {
    super(), this.sync = !1;
  }
  load(e) {
    d(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class Sr extends ie {
  constructor() {
    super(), this.sync = !1;
  }
  load(e) {
    d(e) || (super.load(e), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class Dr {
  constructor() {
    this.count = 0, this.delay = new Mr(), this.duration = new Sr();
  }
  load(e) {
    d(e) || (e.count !== void 0 && (this.count = e.count), this.delay.load(e.delay), this.duration.load(e.duration));
  }
}
const ye = 0, Or = -1, mi = 0, yi = 0;
function Rr(t, e, i) {
  if (!t.life)
    return;
  const s = t.life;
  let n = !1;
  if (t.spawning)
    if (s.delayTime += e.value, s.delayTime >= t.life.delay)
      n = !0, t.spawning = !1, s.delayTime = ye, s.time = ye;
    else
      return;
  if (s.duration === Or || t.spawning || (n ? s.time = ye : s.time += e.value, s.time < s.duration))
    return;
  if (s.time = ye, t.life.count > mi && t.life.count--, t.life.count === mi) {
    t.destroy();
    return;
  }
  const o = g(yi, i.width), r = g(yi, i.width);
  t.position.x = I(o), t.position.y = I(r), t.spawning = !0, s.delayTime = ye, s.time = ye, t.reset();
  const a = t.options.life;
  a && (s.delay = m(a.delay.value) * 1e3, s.duration = m(a.duration.value) * 1e3);
}
const re = 0, gi = 1, vi = -1;
class Ir {
  constructor(e) {
    this.container = e;
  }
  init(e) {
    const i = this.container, s = e.options, n = s.life;
    n && (e.life = {
      delay: i.retina.reduceFactor ? m(n.delay.value) * (n.delay.sync ? gi : w()) / i.retina.reduceFactor * 1e3 : re,
      delayTime: re,
      duration: i.retina.reduceFactor ? m(n.duration.value) * (n.duration.sync ? gi : w()) / i.retina.reduceFactor * 1e3 : re,
      time: re,
      count: n.count
    }, e.life.duration <= re && (e.life.duration = vi), e.life.count <= re && (e.life.count = vi), e.life && (e.spawning = e.life.delay > re));
  }
  isEnabled(e) {
    return !e.destroyed;
  }
  loadOptions(e, ...i) {
    e.life || (e.life = new Dr());
    for (const s of i)
      e.life.load(s?.life);
  }
  update(e, i) {
    !this.isEnabled(e) || !e.life || Rr(e, i, this.container.canvas.size);
  }
}
async function Er(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("life", async (i) => Promise.resolve(new Ir(i)), e);
}
class Tr {
  constructor() {
    this.factor = 4, this.value = !0;
  }
  load(e) {
    d(e) || (e.factor !== void 0 && (this.factor = e.factor), e.value !== void 0 && (this.value = e.value));
  }
}
class Fr {
  constructor() {
    this.disable = !0, this.reduce = new Tr();
  }
  load(e) {
    d(e) || (e.disable !== void 0 && (this.disable = e.disable), this.reduce.load(e.reduce));
  }
}
const wi = 1, Lr = 1, Ar = 0, $r = 1;
class Vr {
  constructor(e, i) {
    this._handleMotionChange = (s) => {
      const n = this._container, o = n.actualOptions.motion;
      o && (s.matches ? o.disable ? n.retina.reduceFactor = Ar : n.retina.reduceFactor = o.reduce.value ? $r / o.reduce.factor : wi : n.retina.reduceFactor = Lr);
    }, this._container = e, this._engine = i;
  }
  async init() {
    const e = this._container, i = e.actualOptions.motion;
    if (!(i && (i.disable || i.reduce.value))) {
      e.retina.reduceFactor = 1;
      return;
    }
    const s = St("(prefers-reduced-motion: reduce)");
    if (!s) {
      e.retina.reduceFactor = wi;
      return;
    }
    this._handleMotionChange(s);
    const n = () => {
      (async () => {
        this._handleMotionChange(s);
        try {
          await e.refresh();
        } catch {
        }
      })();
    };
    s.addEventListener !== void 0 ? s.addEventListener("change", n) : s.addListener !== void 0 && s.addListener(n), await Promise.resolve();
  }
}
class Ur {
  constructor(e) {
    this.id = "motion", this._engine = e;
  }
  getPlugin(e) {
    return Promise.resolve(new Vr(e, this._engine));
  }
  loadOptions(e, i) {
    if (!this.needsPlugin())
      return;
    let s = e.motion;
    s?.load || (e.motion = s = new Fr()), s.load(i?.motion);
  }
  needsPlugin() {
    return !0;
  }
}
async function Br(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addPlugin(new Ur(t), e);
}
var fe;
(function(t) {
  t.both = "both", t.horizontal = "horizontal", t.vertical = "vertical";
})(fe || (fe = {}));
const qr = 2, Hi = Math.PI * qr, Hr = 360;
function Wr(t, e) {
  const i = e.options.roll;
  if (!i?.enable) {
    e.roll = {
      enable: !1,
      horizontal: !1,
      vertical: !1,
      angle: 0,
      speed: 0
    };
    return;
  }
  if (e.roll = {
    enable: i.enable,
    horizontal: i.mode === fe.horizontal || i.mode === fe.both,
    vertical: i.mode === fe.vertical || i.mode === fe.both,
    angle: w() * Hi,
    speed: m(i.speed) / Hr
  }, i.backColor)
    e.backColor = Ee(t, i.backColor);
  else if (i.darken.enable && i.enlighten.enable) {
    const s = w() >= 0.5 ? X.darken : X.enlighten;
    e.roll.alter = {
      type: s,
      value: m(s === X.darken ? i.darken.value : i.enlighten.value)
    };
  } else i.darken.enable ? e.roll.alter = {
    type: X.darken,
    value: m(i.darken.value)
  } : i.enlighten.enable && (e.roll.alter = {
    type: X.enlighten,
    value: m(i.enlighten.value)
  });
}
function Gr(t, e) {
  const i = t.options.roll, s = t.roll;
  if (!s || !i?.enable)
    return;
  const n = s.speed * e.factor, o = Hi;
  s.angle += n, s.angle > o && (s.angle -= o);
}
class _i {
  constructor() {
    this.enable = !1, this.value = 0;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.value !== void 0 && (this.value = g(e.value)));
  }
}
class Nr {
  constructor() {
    this.darken = new _i(), this.enable = !1, this.enlighten = new _i(), this.mode = fe.vertical, this.speed = 25;
  }
  load(e) {
    d(e) || (e.backColor !== void 0 && (this.backColor = H.create(this.backColor, e.backColor)), this.darken.load(e.darken), e.enable !== void 0 && (this.enable = e.enable), this.enlighten.load(e.enlighten), e.mode !== void 0 && (this.mode = e.mode), e.speed !== void 0 && (this.speed = g(e.speed)));
  }
}
class Qr {
  constructor(e) {
    this._engine = e;
  }
  getTransformValues(e) {
    const i = e.roll?.enable && e.roll, s = i && i.horizontal, n = i && i.vertical;
    return {
      a: s ? Math.cos(i.angle) : void 0,
      d: n ? Math.sin(i.angle) : void 0
    };
  }
  init(e) {
    Wr(this._engine, e);
  }
  isEnabled(e) {
    const i = e.options.roll;
    return !e.destroyed && !e.spawning && !!i?.enable;
  }
  loadOptions(e, ...i) {
    e.roll || (e.roll = new Nr());
    for (const s of i)
      e.roll.load(s?.roll);
  }
  update(e, i) {
    this.isEnabled(e) && Gr(e, i);
  }
}
async function Xr(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("roll", () => Promise.resolve(new Qr(t)), e);
}
class Yr {
  constructor() {
    this.enable = !1, this.speed = 0, this.decay = 0, this.sync = !1;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = g(e.speed)), e.decay !== void 0 && (this.decay = g(e.decay)), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class jr extends ie {
  constructor() {
    super(), this.animation = new Yr(), this.direction = V.clockwise, this.path = !1, this.value = 0;
  }
  load(e) {
    d(e) || (super.load(e), e.direction !== void 0 && (this.direction = e.direction), this.animation.load(e.animation), e.path !== void 0 && (this.path = e.path));
  }
}
const Wi = 2, Zr = Math.PI * Wi, Jr = 1, Kr = 360;
class ea {
  constructor(e) {
    this.container = e;
  }
  init(e) {
    const i = e.options.rotate;
    if (!i)
      return;
    e.rotate = {
      enable: i.animation.enable,
      value: K(m(i.value)),
      min: 0,
      max: Zr
    }, e.pathRotation = i.path;
    let s = i.direction;
    switch (s === V.random && (s = Math.floor(w() * Wi) > 0 ? V.counterClockwise : V.clockwise), s) {
      case V.counterClockwise:
      case "counterClockwise":
        e.rotate.status = z.decreasing;
        break;
      case V.clockwise:
        e.rotate.status = z.increasing;
        break;
    }
    const n = i.animation;
    n.enable && (e.rotate.decay = Jr - m(n.decay), e.rotate.velocity = m(n.speed) / Kr * this.container.retina.reduceFactor, n.sync || (e.rotate.velocity *= w())), e.rotation = e.rotate.value;
  }
  isEnabled(e) {
    const i = e.options.rotate;
    return i ? !e.destroyed && !e.spawning && (!!i.value || i.animation.enable || i.path) : !1;
  }
  loadOptions(e, ...i) {
    e.rotate || (e.rotate = new jr());
    for (const s of i)
      e.rotate.load(s?.rotate);
  }
  update(e, i) {
    this.isEnabled(e) && (e.isRotating = !!e.rotate, e.rotate && (ot(e, e.rotate, !1, ee.none, i), e.rotation = e.rotate.value));
  }
}
async function ta(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("rotate", (i) => Promise.resolve(new ea(i)), e);
}
const ia = 2, sa = Math.sqrt(ia), na = 2;
function oa(t) {
  const { context: e, radius: i } = t, s = i / sa, n = s * na;
  e.rect(-s, -s, n, n);
}
const ra = 4;
class aa {
  constructor() {
    this.validTypes = ["edge", "square"];
  }
  draw(e) {
    oa(e);
  }
  getSidesCount() {
    return ra;
  }
}
async function la(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addShape(new aa(), e);
}
var Z;
(function(t) {
  t.clockwise = "clockwise", t.counterClockwise = "counter-clockwise", t.random = "random";
})(Z || (Z = {}));
class ca {
  constructor() {
    this.enable = !1, this.speed = 0, this.decay = 0, this.sync = !1;
  }
  load(e) {
    d(e) || (e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0 && (this.speed = g(e.speed)), e.decay !== void 0 && (this.decay = g(e.decay)), e.sync !== void 0 && (this.sync = e.sync));
  }
}
class ha extends ie {
  constructor() {
    super(), this.animation = new ca(), this.direction = Z.clockwise, this.enable = !1, this.value = 0;
  }
  load(e) {
    super.load(e), !d(e) && (this.animation.load(e.animation), e.direction !== void 0 && (this.direction = e.direction), e.enable !== void 0 && (this.enable = e.enable));
  }
}
const Re = 1, Gi = 2, ua = Math.PI * Gi, fa = 360;
class da {
  constructor(e) {
    this.container = e;
  }
  getTransformValues(e) {
    const i = e.tilt?.enable && e.tilt;
    return {
      b: i ? Math.cos(i.value) * i.cosDirection : void 0,
      c: i ? Math.sin(i.value) * i.sinDirection : void 0
    };
  }
  init(e) {
    const i = e.options.tilt;
    if (!i)
      return;
    e.tilt = {
      enable: i.enable,
      value: K(m(i.value)),
      sinDirection: w() >= 0.5 ? Re : -Re,
      cosDirection: w() >= 0.5 ? Re : -Re,
      min: 0,
      max: ua
    };
    let s = i.direction;
    switch (s === Z.random && (s = Math.floor(w() * Gi) > 0 ? Z.counterClockwise : Z.clockwise), s) {
      case Z.counterClockwise:
      case "counterClockwise":
        e.tilt.status = z.decreasing;
        break;
      case Z.clockwise:
        e.tilt.status = z.increasing;
        break;
    }
    const n = e.options.tilt?.animation;
    n?.enable && (e.tilt.decay = Re - m(n.decay), e.tilt.velocity = m(n.speed) / fa * this.container.retina.reduceFactor, n.sync || (e.tilt.velocity *= w()));
  }
  isEnabled(e) {
    const i = e.options.tilt?.animation;
    return !e.destroyed && !e.spawning && !!i?.enable;
  }
  loadOptions(e, ...i) {
    e.tilt || (e.tilt = new ha());
    for (const s of i)
      e.tilt.load(s?.tilt);
  }
  async update(e, i) {
    !this.isEnabled(e) || !e.tilt || (ot(e, e.tilt, !1, ee.none, i), await Promise.resolve());
  }
}
async function pa(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("tilt", (i) => Promise.resolve(new da(i)), e);
}
class ma {
  constructor() {
    this.angle = 50, this.move = 10;
  }
  load(e) {
    d(e) || (e.angle !== void 0 && (this.angle = g(e.angle)), e.move !== void 0 && (this.move = g(e.move)));
  }
}
class ya {
  constructor() {
    this.distance = 5, this.enable = !1, this.speed = new ma();
  }
  load(e) {
    if (!d(e) && (e.distance !== void 0 && (this.distance = g(e.distance)), e.enable !== void 0 && (this.enable = e.enable), e.speed !== void 0))
      if (q(e.speed))
        this.speed.load({ angle: e.speed });
      else {
        const i = e.speed;
        i.min !== void 0 ? this.speed.load({ angle: i }) : this.speed.load(e.speed);
      }
  }
}
const ga = 0, va = 2, wa = Math.PI * va, _a = 60;
function ba(t, e) {
  const { wobble: i } = t.options, { container: s, wobble: n } = t;
  if (!i?.enable || !n)
    return;
  const o = s.retina.reduceFactor, r = n.angleSpeed * e.factor * o, a = n.moveSpeed * e.factor * o, l = a * (t.retina.wobbleDistance ?? ga) / (1e3 / _a), c = wa, { position: h } = t;
  n.angle += r, n.angle > c && (n.angle -= c), h.x += l * Math.cos(n.angle), h.y += l * Math.abs(Math.sin(n.angle));
}
const xa = 2, za = Math.PI * xa, Pa = 360, Ca = 10, ka = 0;
class Ma {
  constructor(e) {
    this.container = e;
  }
  init(e) {
    const i = e.options.wobble;
    i?.enable ? e.wobble = {
      angle: w() * za,
      angleSpeed: m(i.speed.angle) / Pa,
      moveSpeed: m(i.speed.move) / Ca
    } : e.wobble = {
      angle: 0,
      angleSpeed: 0,
      moveSpeed: 0
    }, e.retina.wobbleDistance = m(i?.distance ?? ka) * this.container.retina.pixelRatio;
  }
  isEnabled(e) {
    return !e.destroyed && !e.spawning && !!e.options.wobble?.enable;
  }
  loadOptions(e, ...i) {
    e.wobble || (e.wobble = new ya());
    for (const s of i)
      e.wobble.load(s?.wobble);
  }
  update(e, i) {
    this.isEnabled(e) && ba(e, i);
  }
}
async function Sa(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addParticleUpdater("wobble", (i) => Promise.resolve(new Ma(i)), e);
}
const Da = 20, Oa = 6, Ra = Da / Oa, Ia = {
  fullScreen: {
    enable: !0,
    zIndex: 100
  },
  fpsLimit: 120,
  particles: {
    number: {
      value: 0
    },
    color: {
      value: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"]
    },
    shape: {
      type: ["square", "circle"]
    },
    opacity: {
      value: { min: 0, max: 1 },
      animation: {
        enable: !0,
        speed: 0.5,
        startValue: "max",
        destroy: "min"
      }
    },
    size: {
      value: 5
    },
    links: {
      enable: !1
    },
    life: {
      duration: {
        sync: !0,
        value: Ra
      },
      count: 1
    },
    move: {
      angle: {
        value: 45,
        offset: 0
      },
      drift: 0,
      enable: !0,
      gravity: {
        enable: !0,
        acceleration: 9.81
      },
      speed: 45,
      decay: 0.1,
      direction: -90,
      random: !0,
      straight: !1,
      outModes: {
        default: "none",
        bottom: "destroy"
      }
    },
    rotate: {
      value: {
        min: 0,
        max: 360
      },
      direction: "random",
      animation: {
        enable: !0,
        speed: 60
      }
    },
    tilt: {
      direction: "random",
      enable: !0,
      value: {
        min: 0,
        max: 360
      },
      animation: {
        enable: !0,
        speed: 60
      }
    },
    roll: {
      darken: {
        enable: !0,
        value: 25
      },
      enable: !0,
      speed: {
        min: 15,
        max: 25
      }
    },
    wobble: {
      distance: 30,
      enable: !0,
      speed: {
        min: -15,
        max: 15
      }
    }
  },
  detectRetina: !0,
  motion: {
    disable: !0
  },
  emitters: {
    name: "confetti",
    startCount: 50,
    position: {
      x: 50,
      y: 50
    },
    size: {
      width: 0,
      height: 0
    },
    rate: {
      delay: 0,
      quantity: 0
    },
    life: {
      duration: 0.1,
      count: 1
    }
  }
};
async function Ea(t, e = !0) {
  await pr(t, !1), await la(t, !1), await kr(t, !1), await Br(t, !1), await Sa(t, !1), await Xr(t, !1), await ta(t, !1), await pa(t, !1), await Er(t, !1), await t.addPreset("confetti", Ia, !1), await t.refresh(e);
}
async function Ta(t) {
  await Ea(t);
}
const Fa = 2, ge = { x: 0, y: 0 };
function La(t) {
  const { context: e, particle: i, radius: s } = t, n = i.sides, o = i.starInset ?? Fa;
  e.moveTo(ge.x, ge.y - s);
  for (let r = 0; r < n; r++)
    e.rotate(Math.PI / n), e.lineTo(ge.x, ge.y - s * o), e.rotate(Math.PI / n), e.lineTo(ge.x, ge.y - s);
}
const Aa = 2, $a = 5;
class Va {
  constructor() {
    this.validTypes = ["star"];
  }
  draw(e) {
    La(e);
  }
  getSidesCount(e) {
    const i = e.shapeData;
    return Math.round(m(i?.sides ?? $a));
  }
  particleInit(e, i) {
    const s = i.shapeData;
    i.starInset = m(s?.inset ?? Aa);
  }
}
async function Ua(t, e = !0) {
  t.checkVersion("3.9.1"), await t.addShape(new Va(), e);
}
class Ba extends HTMLElement {
  _shadowRoot;
  _won = !1;
  _container = null;
  _particlesInitialized = !1;
  _permanentContainers = [];
  _timeoutIds = [];
  _particleContainers = [];
  static get observedAttributes() {
    return ["won"];
  }
  constructor() {
    super(), this._shadowRoot = this.attachShadow({ mode: "open" });
  }
  attributeChangedCallback(e, i, s) {
    e === "won" && (this._won = s === "true", this._updateDisplay());
  }
  connectedCallback() {
    this._render(), this._createPermanentContainers(), this._initializeParticles();
  }
  _createPermanentContainers() {
    for (let e = 0; e < 4; e++) {
      const i = document.createElement("div");
      i.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `, i.id = `permanent-confetti-${e}`, document.body.appendChild(i), this._permanentContainers.push(i);
    }
  }
  async _initializeParticles() {
    if (console.log("initializeParticles"), !this._particlesInitialized) {
      await Ta(Ne), await Ua(Ne);
      const e = {
        ticks: 500,
        decay: 0.94,
        startVelocity: 30,
        gravity: 0
      }, i = [
        { star: 3, circle: 2 },
        { star: 10, circle: 5 },
        { star: 25, circle: 15 },
        { star: 60, circle: 40 }
      ];
      for (let s = 0; s < 4; s++) {
        const n = this._permanentContainers[s];
        if (!n) continue;
        const o = i[s];
        if (!o) continue;
        const r = await Ne.load({
          id: n.id,
          element: n,
          options: {
            preset: "confetti",
            fpsLimit: 120,
            reduceDuplicates: !0,
            particles: {
              number: {
                value: 0
              },
              color: {
                value: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"]
              },
              shape: {
                type: ["star", "circle"]
              },
              life: {
                duration: {
                  value: e.ticks / 60
                }
              },
              move: {
                enable: !0,
                speed: e.startVelocity,
                decay: 1 - e.decay,
                gravity: {
                  enable: e.gravity > 0,
                  acceleration: e.gravity
                },
                direction: "none",
                outModes: {
                  default: "destroy"
                }
              },
              size: {
                value: { min: 6, max: 8 }
              }
            },
            emitters: [
              {
                autoPlay: !1,
                name: `confetti-star-${s}`,
                life: {
                  count: 1,
                  duration: 0.1
                },
                rate: {
                  delay: 0,
                  quantity: o.star
                },
                position: {
                  x: 50,
                  y: 50
                },
                particles: {
                  shape: {
                    type: "star"
                  },
                  size: {
                    value: 8
                  }
                }
              },
              {
                autoPlay: !1,
                name: `confetti-circle-${s}`,
                life: {
                  count: 1,
                  duration: 0.1
                },
                rate: {
                  delay: 0,
                  quantity: o.circle
                },
                position: {
                  x: 50,
                  y: 50
                },
                particles: {
                  shape: {
                    type: "circle"
                  },
                  size: {
                    value: 7.5
                  }
                }
              }
            ]
          }
        });
        this._particleContainers[s] = r;
      }
      await new Promise((s) => requestAnimationFrame(() => s(void 0))), this._particlesInitialized = !0;
    }
  }
  disconnectedCallback() {
    this._cleanupAnimation(), this._particleContainers.forEach((e) => {
      e && typeof e == "object" && e.destroy();
    }), this._particleContainers = [], this._permanentContainers.forEach((e) => {
      e.parentNode && e.parentNode.removeChild(e);
    }), this._permanentContainers = [];
  }
  get shadowRoot() {
    return this._shadowRoot;
  }
  _render() {
    console.log("render");
    const e = document.createElement("style");
    e.textContent = `
      .victory-container {
        width: fit-content;
        margin: 0 auto;
        background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        font-size: 35px;

      }
      .victory-container.visible {
        opacity: 1;
      }
    `, this._container = document.createElement("div"), this._container.className = "victory-container", this._container.textContent = "⭐⭐⭐⭐🌟✨ Victory ✨🌟⭐⭐⭐⭐", this._shadowRoot.replaceChildren(e, this._container), this._updateDisplay();
  }
  _updateDisplay() {
    console.log("updateDisplay"), this._container && (this._won ? (this._timeoutIds.forEach((e) => clearTimeout(e)), this._timeoutIds = [], this._container.classList.add("visible"), this._timeoutIds.push(setTimeout(() => void this._shoot(0), 2e3)), this._timeoutIds.push(setTimeout(() => void this._shoot(1), 2500)), this._timeoutIds.push(setTimeout(() => void this._shoot(2), 3500)), this._timeoutIds.push(setTimeout(() => void this._shoot(3), 5e3))) : this._cleanupAnimation());
  }
  _cleanupAnimation() {
    this._container?.classList.remove("visible"), this._timeoutIds.forEach((e) => clearTimeout(e)), this._timeoutIds = [], this._particleContainers.forEach((e) => {
      e && typeof e == "object" && e.refresh();
    });
  }
  _shoot(e) {
    console.log("shoot", e);
    const i = this._particleContainers[e];
    if (!i || typeof i != "object") return;
    const s = i;
    s.playEmitter(`confetti-star-${e}`), s.playEmitter(`confetti-circle-${e}`);
  }
}
function qa() {
  customElements.get("victory-stars") || customElements.define("victory-stars", Ba);
}
qa();
export {
  Ba as VictoryStarsElement,
  qa as registerVictoryStarsElement
};
