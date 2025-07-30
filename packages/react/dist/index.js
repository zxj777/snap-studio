import O, { useRef as Ye, useState as $, useEffect as Q, useCallback as W, Component as mr, useMemo as J } from "react";
import { createRenderEngine as hr } from "@snap-studio/core";
import { ExpressionEngine as xr } from "@snap-studio/expression-engine";
function br(r = {}) {
  const t = Ye(null), s = Ye(null), [x, u] = $(null), [_, f] = $(!1), [d, a] = $(!1), [g, i] = $(null);
  Q(() => {
    if (!t.current)
      try {
        console.log("🔧 Creating ExpressionEngine..."), s.current = new xr(r.expressionEngine), console.log("✅ ExpressionEngine created:", s.current), console.log("🔧 Creating RenderEngine..."), t.current = hr(
          s.current,
          r
        ), console.log("✅ RenderEngine created:", t.current), u(t.current), r.debug && console.log("🐛 Debug mode enabled for RenderEngine");
      } catch (R) {
        console.error("❌ Failed to create engines:", R), i(`引擎创建失败: ${R.message}`);
      }
    return () => {
      t.current && (t.current.destroy().catch(console.error), t.current = null, s.current = null, u(null), f(!1));
    };
  }, []);
  const C = W(async (R) => {
    if (!t.current)
      throw new Error("渲染引擎未创建");
    a(!0), i(null);
    try {
      const j = await t.current.initialize(R);
      return j.success ? (f(!0), r.debug && console.log("页面初始化成功:", j)) : (i(j.error || "初始化失败"), r.debug && console.error("页面初始化失败:", j.error)), j;
    } catch (j) {
      const p = j instanceof Error ? j.message : "初始化异常";
      return i(p), r.debug && console.error("页面初始化异常:", j), {
        success: !1,
        duration: 0,
        error: p,
        loadedDataSources: 0,
        registeredComponents: 0
      };
    } finally {
      a(!1);
    }
  }, [r.debug]), c = W(async () => {
    t.current && (await t.current.destroy(), t.current = null, s.current = null, u(null), f(!1), i(null));
  }, []), w = W(() => {
    var R;
    return ((R = t.current) == null ? void 0 : R.getStats()) || null;
  }, []);
  return {
    engine: x,
    initializePage: C,
    isInitialized: _,
    isInitializing: d,
    initError: g,
    destroy: c,
    getStats: w
  };
}
function Ir(r, t, s) {
  const [x, u] = $(() => {
    if (!r) return s;
    const i = r.get(t);
    return i !== void 0 ? i : s;
  }), [_, f] = $(!r);
  Q(() => {
    if (!r) {
      f(!0);
      return;
    }
    f(!1);
    const i = r.get(t);
    i !== void 0 && u(i);
    const C = r.subscribe(t, (c, w, R) => {
      if (R === t || R.startsWith(t + ".") || t.startsWith(R + ".")) {
        const j = r.get(t);
        u(j !== void 0 ? j : s);
      }
    });
    return () => {
      r.unsubscribe(C);
    };
  }, [r, t, s]);
  const d = W((i) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    r.set(t, i);
  }, [r, t]), a = W((i) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    typeof i == "object" && i !== null ? r.merge(t, i) : console.warn("mergeValue only works with object values");
  }, [r, t]), g = W(() => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    r.delete(t);
  }, [r, t]);
  return {
    value: x,
    setValue: d,
    mergeValue: a,
    deleteValue: g,
    isLoading: _
  };
}
function Er(r, t, s) {
  const [x, u] = $(() => {
    if (!r) return s || {};
    const a = {};
    return t.forEach((g) => {
      const i = r.get(g);
      a[g] = i !== void 0 ? i : s == null ? void 0 : s[g];
    }), a;
  }), [_, f] = $(!r);
  Q(() => {
    if (!r) {
      f(!0);
      return;
    }
    f(!1);
    const a = [];
    return t.forEach((g) => {
      const i = r.subscribe(g, () => {
        const C = {};
        t.forEach((c) => {
          const w = r.get(c);
          C[c] = w !== void 0 ? w : s == null ? void 0 : s[c];
        }), u(C);
      });
      a.push(i);
    }), () => {
      a.forEach((g) => {
        r.unsubscribe(g);
      });
    };
  }, [r, JSON.stringify(t), JSON.stringify(s)]);
  const d = W((a) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    Object.entries(a).forEach(([g, i]) => {
      t.includes(g) && r.set(g, i);
    });
  }, [r, t]);
  return {
    states: x,
    setStates: d,
    isLoading: _
  };
}
function Rr(r, t = {}) {
  const {
    maxHistory: s = 50,
    autoClearError: x = !0,
    errorClearDelay: u = 5e3
  } = t, [_, f] = $({
    isExecuting: !1,
    lastResult: null,
    error: null,
    history: []
  }), d = W(async (i, C = {}) => {
    if (!r) {
      const c = {
        actionId: i,
        success: !1,
        error: "ActionExecutor not available"
      };
      return f((w) => ({
        ...w,
        lastResult: c,
        error: c.error || null
      })), c;
    }
    f((c) => ({
      ...c,
      isExecuting: !0,
      error: null
    }));
    try {
      const c = await r.execute(i, C);
      return f((w) => {
        const R = [...w.history, c];
        return R.length > s && R.splice(0, R.length - s), {
          ...w,
          isExecuting: !1,
          lastResult: c,
          error: c.success ? null : c.error || "执行失败",
          history: R
        };
      }), !c.success && x && setTimeout(() => {
        f((w) => ({
          ...w,
          error: null
        }));
      }, u), c;
    } catch (c) {
      const w = c instanceof Error ? c.message : "执行异常", R = {
        actionId: i,
        success: !1,
        error: w
      };
      return f((j) => ({
        ...j,
        isExecuting: !1,
        lastResult: R,
        error: w,
        history: [...j.history, R]
      })), x && setTimeout(() => {
        f((j) => ({
          ...j,
          error: null
        }));
      }, u), R;
    }
  }, [r, s, x, u]), a = W(() => {
    f((i) => ({
      ...i,
      history: [],
      error: null
    }));
  }, []), g = W(async () => {
    const i = _.lastResult;
    return !i || i.success ? null : await d(i.actionId, {
      isRetry: !0
    });
  }, [_.lastResult, d]);
  return {
    execute: d,
    state: _,
    clearHistory: a,
    retryLast: g
  };
}
function Pr(r) {
  const [t, s] = $(!1), [x, u] = $([]);
  return {
    executeBatch: W(async (f) => {
      if (!r)
        return f.map((d) => ({
          actionId: d.id,
          success: !1,
          error: "ActionExecutor not available"
        }));
      s(!0);
      try {
        const d = f.map(
          (g) => r.execute(g.id, g.context)
        ), a = await Promise.all(d);
        return u(a), a;
      } finally {
        s(!1);
      }
    }, [r]),
    isExecuting: t,
    results: x
  };
}
var ve = { exports: {} }, X = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ne;
function Sr() {
  if (Ne) return X;
  Ne = 1;
  var r = O, t = Symbol.for("react.element"), s = Symbol.for("react.fragment"), x = Object.prototype.hasOwnProperty, u = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function f(d, a, g) {
    var i, C = {}, c = null, w = null;
    g !== void 0 && (c = "" + g), a.key !== void 0 && (c = "" + a.key), a.ref !== void 0 && (w = a.ref);
    for (i in a) x.call(a, i) && !_.hasOwnProperty(i) && (C[i] = a[i]);
    if (d && d.defaultProps) for (i in a = d.defaultProps, a) C[i] === void 0 && (C[i] = a[i]);
    return { $$typeof: t, type: d, key: c, ref: w, props: C, _owner: u.current };
  }
  return X.Fragment = s, X.jsx = f, X.jsxs = f, X;
}
var Z = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ve;
function _r() {
  return Ve || (Ve = 1, process.env.NODE_ENV !== "production" && function() {
    var r = O, t = Symbol.for("react.element"), s = Symbol.for("react.portal"), x = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), f = Symbol.for("react.provider"), d = Symbol.for("react.context"), a = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), i = Symbol.for("react.suspense_list"), C = Symbol.for("react.memo"), c = Symbol.for("react.lazy"), w = Symbol.for("react.offscreen"), R = Symbol.iterator, j = "@@iterator";
    function p(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = R && e[R] || e[j];
      return typeof n == "function" ? n : null;
    }
    var h = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function E(e) {
      {
        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), l = 1; l < n; l++)
          o[l - 1] = arguments[l];
        P("error", e, o);
      }
    }
    function P(e, n, o) {
      {
        var l = h.ReactDebugCurrentFrame, b = l.getStackAddendum();
        b !== "" && (n += "%s", o = o.concat([b]));
        var S = o.map(function(m) {
          return String(m);
        });
        S.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, S);
      }
    }
    var L = !1, M = !1, ee = !1, re = !1, me = !1, K;
    K = Symbol.for("react.module.reference");
    function z(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === x || e === _ || me || e === u || e === g || e === i || re || e === w || L || M || ee || typeof e == "object" && e !== null && (e.$$typeof === c || e.$$typeof === C || e.$$typeof === f || e.$$typeof === d || e.$$typeof === a || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === K || e.getModuleId !== void 0));
    }
    function Y(e, n, o) {
      var l = e.displayName;
      if (l)
        return l;
      var b = n.displayName || n.name || "";
      return b !== "" ? o + "(" + b + ")" : o;
    }
    function A(e) {
      return e.displayName || "Context";
    }
    function F(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && E("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case x:
          return "Fragment";
        case s:
          return "Portal";
        case _:
          return "Profiler";
        case u:
          return "StrictMode";
        case g:
          return "Suspense";
        case i:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case d:
            var n = e;
            return A(n) + ".Consumer";
          case f:
            var o = e;
            return A(o._context) + ".Provider";
          case a:
            return Y(e, e.render, "ForwardRef");
          case C:
            var l = e.displayName || null;
            return l !== null ? l : F(e.type) || "Memo";
          case c: {
            var b = e, S = b._payload, m = b._init;
            try {
              return F(m(S));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var N = Object.assign, q = 0, he, xe, be, Ee, Re, Se, _e;
    function Ce() {
    }
    Ce.__reactDisabledLog = !0;
    function He() {
      {
        if (q === 0) {
          he = console.log, xe = console.info, be = console.warn, Ee = console.error, Re = console.group, Se = console.groupCollapsed, _e = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ce,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        q++;
      }
    }
    function Ue() {
      {
        if (q--, q === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: N({}, e, {
              value: he
            }),
            info: N({}, e, {
              value: xe
            }),
            warn: N({}, e, {
              value: be
            }),
            error: N({}, e, {
              value: Ee
            }),
            group: N({}, e, {
              value: Re
            }),
            groupCollapsed: N({}, e, {
              value: Se
            }),
            groupEnd: N({}, e, {
              value: _e
            })
          });
        }
        q < 0 && E("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ie = h.ReactCurrentDispatcher, ae;
    function te(e, n, o) {
      {
        if (ae === void 0)
          try {
            throw Error();
          } catch (b) {
            var l = b.stack.trim().match(/\n( *(at )?)/);
            ae = l && l[1] || "";
          }
        return `
` + ae + e;
      }
    }
    var le = !1, ne;
    {
      var Je = typeof WeakMap == "function" ? WeakMap : Map;
      ne = new Je();
    }
    function je(e, n) {
      if (!e || le)
        return "";
      {
        var o = ne.get(e);
        if (o !== void 0)
          return o;
      }
      var l;
      le = !0;
      var b = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var S;
      S = ie.current, ie.current = null, He();
      try {
        if (n) {
          var m = function() {
            throw Error();
          };
          if (Object.defineProperty(m.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(m, []);
            } catch (D) {
              l = D;
            }
            Reflect.construct(e, [], m);
          } else {
            try {
              m.call();
            } catch (D) {
              l = D;
            }
            e.call(m.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (D) {
            l = D;
          }
          e();
        }
      } catch (D) {
        if (D && l && typeof D.stack == "string") {
          for (var v = D.stack.split(`
`), I = l.stack.split(`
`), T = v.length - 1, k = I.length - 1; T >= 1 && k >= 0 && v[T] !== I[k]; )
            k--;
          for (; T >= 1 && k >= 0; T--, k--)
            if (v[T] !== I[k]) {
              if (T !== 1 || k !== 1)
                do
                  if (T--, k--, k < 0 || v[T] !== I[k]) {
                    var B = `
` + v[T].replace(" at new ", " at ");
                    return e.displayName && B.includes("<anonymous>") && (B = B.replace("<anonymous>", e.displayName)), typeof e == "function" && ne.set(e, B), B;
                  }
                while (T >= 1 && k >= 0);
              break;
            }
        }
      } finally {
        le = !1, ie.current = S, Ue(), Error.prepareStackTrace = b;
      }
      var U = e ? e.displayName || e.name : "", V = U ? te(U) : "";
      return typeof e == "function" && ne.set(e, V), V;
    }
    function Me(e, n, o) {
      return je(e, !1);
    }
    function Ke(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function oe(e, n, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return je(e, Ke(e));
      if (typeof e == "string")
        return te(e);
      switch (e) {
        case g:
          return te("Suspense");
        case i:
          return te("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case a:
            return Me(e.render);
          case C:
            return oe(e.type, n, o);
          case c: {
            var l = e, b = l._payload, S = l._init;
            try {
              return oe(S(b), n, o);
            } catch {
            }
          }
        }
      return "";
    }
    var G = Object.prototype.hasOwnProperty, we = {}, Te = h.ReactDebugCurrentFrame;
    function se(e) {
      if (e) {
        var n = e._owner, o = oe(e.type, e._source, n ? n.type : null);
        Te.setExtraStackFrame(o);
      } else
        Te.setExtraStackFrame(null);
    }
    function qe(e, n, o, l, b) {
      {
        var S = Function.call.bind(G);
        for (var m in e)
          if (S(e, m)) {
            var v = void 0;
            try {
              if (typeof e[m] != "function") {
                var I = Error((l || "React class") + ": " + o + " type `" + m + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[m] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw I.name = "Invariant Violation", I;
              }
              v = e[m](n, m, l, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (T) {
              v = T;
            }
            v && !(v instanceof Error) && (se(b), E("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", o, m, typeof v), se(null)), v instanceof Error && !(v.message in we) && (we[v.message] = !0, se(b), E("Failed %s type: %s", o, v.message), se(null));
          }
      }
    }
    var Ge = Array.isArray;
    function ce(e) {
      return Ge(e);
    }
    function Xe(e) {
      {
        var n = typeof Symbol == "function" && Symbol.toStringTag, o = n && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o;
      }
    }
    function Ze(e) {
      try {
        return ke(e), !1;
      } catch {
        return !0;
      }
    }
    function ke(e) {
      return "" + e;
    }
    function Oe(e) {
      if (Ze(e))
        return E("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Xe(e)), ke(e);
    }
    var Ie = h.ReactCurrentOwner, Qe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Pe, De;
    function er(e) {
      if (G.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function rr(e) {
      if (G.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function tr(e, n) {
      typeof e.ref == "string" && Ie.current;
    }
    function nr(e, n) {
      {
        var o = function() {
          Pe || (Pe = !0, E("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: o,
          configurable: !0
        });
      }
    }
    function or(e, n) {
      {
        var o = function() {
          De || (De = !0, E("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var sr = function(e, n, o, l, b, S, m) {
      var v = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: n,
        ref: o,
        props: m,
        // Record the component responsible for creating this element.
        _owner: S
      };
      return v._store = {}, Object.defineProperty(v._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(v, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(v, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: b
      }), Object.freeze && (Object.freeze(v.props), Object.freeze(v)), v;
    };
    function ir(e, n, o, l, b) {
      {
        var S, m = {}, v = null, I = null;
        o !== void 0 && (Oe(o), v = "" + o), rr(n) && (Oe(n.key), v = "" + n.key), er(n) && (I = n.ref, tr(n, b));
        for (S in n)
          G.call(n, S) && !Qe.hasOwnProperty(S) && (m[S] = n[S]);
        if (e && e.defaultProps) {
          var T = e.defaultProps;
          for (S in T)
            m[S] === void 0 && (m[S] = T[S]);
        }
        if (v || I) {
          var k = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          v && nr(m, k), I && or(m, k);
        }
        return sr(e, v, I, b, l, Ie.current, m);
      }
    }
    var ue = h.ReactCurrentOwner, Ae = h.ReactDebugCurrentFrame;
    function H(e) {
      if (e) {
        var n = e._owner, o = oe(e.type, e._source, n ? n.type : null);
        Ae.setExtraStackFrame(o);
      } else
        Ae.setExtraStackFrame(null);
    }
    var fe;
    fe = !1;
    function de(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Fe() {
      {
        if (ue.current) {
          var e = F(ue.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function ar(e) {
      return "";
    }
    var $e = {};
    function lr(e) {
      {
        var n = Fe();
        if (!n) {
          var o = typeof e == "string" ? e : e.displayName || e.name;
          o && (n = `

Check the top-level render call using <` + o + ">.");
        }
        return n;
      }
    }
    function Be(e, n) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var o = lr(n);
        if ($e[o])
          return;
        $e[o] = !0;
        var l = "";
        e && e._owner && e._owner !== ue.current && (l = " It was passed a child from " + F(e._owner.type) + "."), H(e), E('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, l), H(null);
      }
    }
    function We(e, n) {
      {
        if (typeof e != "object")
          return;
        if (ce(e))
          for (var o = 0; o < e.length; o++) {
            var l = e[o];
            de(l) && Be(l, n);
          }
        else if (de(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var b = p(e);
          if (typeof b == "function" && b !== e.entries)
            for (var S = b.call(e), m; !(m = S.next()).done; )
              de(m.value) && Be(m.value, n);
        }
      }
    }
    function cr(e) {
      {
        var n = e.type;
        if (n == null || typeof n == "string")
          return;
        var o;
        if (typeof n == "function")
          o = n.propTypes;
        else if (typeof n == "object" && (n.$$typeof === a || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === C))
          o = n.propTypes;
        else
          return;
        if (o) {
          var l = F(n);
          qe(o, e.props, "prop", l, e);
        } else if (n.PropTypes !== void 0 && !fe) {
          fe = !0;
          var b = F(n);
          E("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", b || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && E("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ur(e) {
      {
        for (var n = Object.keys(e.props), o = 0; o < n.length; o++) {
          var l = n[o];
          if (l !== "children" && l !== "key") {
            H(e), E("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), H(null);
            break;
          }
        }
        e.ref !== null && (H(e), E("Invalid attribute `ref` supplied to `React.Fragment`."), H(null));
      }
    }
    var ze = {};
    function Le(e, n, o, l, b, S) {
      {
        var m = z(e);
        if (!m) {
          var v = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var I = ar();
          I ? v += I : v += Fe();
          var T;
          e === null ? T = "null" : ce(e) ? T = "array" : e !== void 0 && e.$$typeof === t ? (T = "<" + (F(e.type) || "Unknown") + " />", v = " Did you accidentally export a JSX literal instead of a component?") : T = typeof e, E("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", T, v);
        }
        var k = ir(e, n, o, b, S);
        if (k == null)
          return k;
        if (m) {
          var B = n.children;
          if (B !== void 0)
            if (l)
              if (ce(B)) {
                for (var U = 0; U < B.length; U++)
                  We(B[U], e);
                Object.freeze && Object.freeze(B);
              } else
                E("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              We(B, e);
        }
        if (G.call(n, "key")) {
          var V = F(e), D = Object.keys(n).filter(function(gr) {
            return gr !== "key";
          }), pe = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!ze[V + pe]) {
            var yr = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            E(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, pe, V, yr, V), ze[V + pe] = !0;
          }
        }
        return e === x ? ur(k) : cr(k), k;
      }
    }
    function fr(e, n, o) {
      return Le(e, n, o, !0);
    }
    function dr(e, n, o) {
      return Le(e, n, o, !1);
    }
    var pr = dr, vr = fr;
    Z.Fragment = x, Z.jsx = pr, Z.jsxs = vr;
  }()), Z;
}
process.env.NODE_ENV === "production" ? ve.exports = Sr() : ve.exports = _r();
var y = ve.exports;
class ye extends mr {
  constructor(t) {
    super(t), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(t) {
    return {
      hasError: !0,
      error: t
    };
  }
  componentDidCatch(t, s) {
    this.setState({
      error: t,
      errorInfo: s
    }), this.props.onError && this.props.onError(t, s), process.env.NODE_ENV === "development" && (console.group("🚨 Component Error Boundary"), console.error("Error:", t), console.error("Error Info:", s), this.props.componentId && console.error("Component ID:", this.props.componentId), this.props.componentType && console.error("Component Type:", this.props.componentType), console.groupEnd());
  }
  render() {
    var t, s;
    if (this.state.hasError) {
      if (this.props.fallback)
        return this.props.fallback(this.state.error, this.state.errorInfo);
      const x = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        padding: "20px",
        backgroundColor: "#fff2f0",
        border: "2px dashed #ff4d4f",
        borderRadius: "8px",
        margin: "10px 0"
      }, u = {
        textAlign: "center",
        maxWidth: "600px"
      }, _ = {
        color: "#ff4d4f",
        margin: "0 0 16px 0",
        fontSize: "18px"
      }, f = {
        background: "white",
        padding: "12px",
        borderRadius: "4px",
        margin: "16px 0",
        textAlign: "left"
      }, d = {
        margin: "4px 0",
        fontSize: "14px"
      }, a = {
        margin: "16px 0",
        textAlign: "left"
      }, g = {
        background: "#f5f5f5",
        padding: "12px",
        borderRadius: "4px",
        maxHeight: "300px",
        overflow: "auto"
      }, i = {
        margin: "0",
        fontSize: "12px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all"
      }, C = {
        background: "#1890ff",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        marginTop: "16px"
      };
      return /* @__PURE__ */ y.jsx("div", { style: x, children: /* @__PURE__ */ y.jsxs("div", { style: u, children: [
        /* @__PURE__ */ y.jsx("h3", { style: _, children: "⚠️ 组件渲染出错" }),
        /* @__PURE__ */ y.jsxs("div", { style: f, children: [
          this.props.componentType && /* @__PURE__ */ y.jsxs("p", { style: d, children: [
            /* @__PURE__ */ y.jsx("strong", { children: "组件类型:" }),
            " ",
            this.props.componentType
          ] }),
          this.props.componentId && /* @__PURE__ */ y.jsxs("p", { style: d, children: [
            /* @__PURE__ */ y.jsx("strong", { children: "组件ID:" }),
            " ",
            this.props.componentId
          ] })
        ] }),
        (this.props.showErrorDetails || process.env.NODE_ENV === "development") && /* @__PURE__ */ y.jsxs("details", { style: a, children: [
          /* @__PURE__ */ y.jsx("summary", { style: { cursor: "pointer", fontWeight: "bold", marginBottom: "8px" }, children: "错误详情" }),
          /* @__PURE__ */ y.jsxs("div", { style: g, children: [
            /* @__PURE__ */ y.jsx("pre", { style: i, children: (t = this.state.error) == null ? void 0 : t.stack }),
            ((s = this.state.errorInfo) == null ? void 0 : s.componentStack) && /* @__PURE__ */ y.jsxs("div", { children: [
              /* @__PURE__ */ y.jsx("h4", { style: { margin: "16px 0 8px 0" }, children: "组件栈:" }),
              /* @__PURE__ */ y.jsx("pre", { style: i, children: this.state.errorInfo.componentStack })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ y.jsx(
          "button",
          {
            style: C,
            onMouseEnter: (c) => {
              c.target.style.background = "#40a9ff";
            },
            onMouseLeave: (c) => {
              c.target.style.background = "#1890ff";
            },
            onClick: () => this.setState({ hasError: !1, error: void 0, errorInfo: void 0 }),
            children: "重试渲染"
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
function Dr() {
  const [, r] = O.useState(), t = O.useCallback(() => {
    r({});
  }, []), s = O.useCallback((x) => {
    r(() => {
      throw x;
    });
  }, []);
  return { resetError: t, captureError: s };
}
function ge({
  engine: r,
  definition: t,
  componentId: s,
  extraProps: x = {},
  enableErrorBoundary: u = !0
}) {
  const { execute: _ } = Rr(r.actionExecutor), f = r.componentRegistry.get(t.componentType), d = J(() => t.dataBinding ? Object.entries(t.dataBinding).filter(([p, h]) => typeof h == "string").map(([p, h]) => ({ propName: p, dataPath: h })) : [], [t.dataBinding]), { states: a } = Er(
    r.stateManager,
    d.map((p) => p.dataPath),
    {}
  ), g = J(() => {
    if (!t.dataBinding) return {};
    const p = {};
    return d.forEach(({ propName: h, dataPath: E }) => {
      p[h] = a[E];
    }), Object.entries(t.dataBinding).forEach(([h, E]) => {
      typeof E == "object" && (p[h] = E);
    }), p;
  }, [t.dataBinding, d, a]), i = J(() => {
    if (!t.dynamicProps) return {};
    const p = {};
    return Object.entries(t.dynamicProps).forEach(([h, E]) => {
      var P;
      try {
        const L = {
          state: r.stateManager.get()
          // 可以添加更多上下文
        }, M = (P = r.stateManager.expressionEngine) == null ? void 0 : P.evaluateSync(E, L);
        p[h] = M;
      } catch (L) {
        console.warn(`动态属性计算失败: ${h}`, L), p[h] = void 0;
      }
    }), p;
  }, [t.dynamicProps, r.stateManager]), C = J(() => {
    if (!t.events) return {};
    const p = {};
    return Object.entries(t.events).forEach(([h, E]) => {
      p[h] = async (P) => {
        try {
          await _(E, {
            event: P,
            target: P.target,
            payload: { componentId: s, eventName: h }
          });
        } catch (L) {
          console.error(`事件处理失败: ${h}`, L);
        }
      };
    }), p;
  }, [t.events, _, s]), c = J(() => {
    var p;
    if (!t.visibility) return !0;
    try {
      const h = {
        state: r.stateManager.get()
      };
      return !!((p = r.stateManager.expressionEngine) != null && p.evaluateSync(t.visibility, h));
    } catch (h) {
      return console.warn("可见性条件计算失败:", h), !0;
    }
  }, [t.visibility, r.stateManager]), w = W(() => {
    if (t.children)
      return t.children.map((p, h) => {
        var E;
        if (typeof p == "string") {
          const P = (E = r.getCurrentSchema()) == null ? void 0 : E.components[p];
          return P ? O.createElement(ge, {
            key: p,
            engine: r,
            definition: P,
            componentId: p,
            enableErrorBoundary: u
          }) : (console.warn(`子组件未找到: ${p}`), null);
        } else return typeof p == "object" ? O.createElement(ge, {
          key: `inline-${h}`,
          engine: r,
          definition: p,
          componentId: `${s}-child-${h}`,
          enableErrorBoundary: u
        }) : p;
      });
  }, [t.children, r, s, u]);
  if (!c)
    return null;
  if (!f) {
    const p = () => O.createElement(
      "div",
      {
        style: {
          padding: "16px",
          border: "2px dashed #ff4d4f",
          borderRadius: "4px",
          backgroundColor: "#fff2f0",
          color: "#ff4d4f"
        }
      },
      O.createElement("strong", null, `组件类型未注册: ${t.componentType}`),
      s && O.createElement("div", null, `组件ID: ${s}`)
    );
    return u ? O.createElement(
      ye,
      { componentId: s, componentType: t.componentType },
      O.createElement(p)
    ) : O.createElement(p);
  }
  const R = {
    ...t.properties || t.props || {},
    ...g,
    ...i,
    ...C,
    ...x,
    children: w()
  }, j = O.createElement(f, R);
  return u ? O.createElement(
    ye,
    { componentId: s, componentType: t.componentType },
    j
  ) : j;
}
function Ar({
  componentType: r,
  properties: t = {},
  children: s,
  componentRegistry: x
}) {
  const u = x.get(r);
  return u ? O.createElement(u, { ...t, children: s }) : O.createElement(
    "div",
    { style: { color: "red" } },
    `Unknown component: ${r}`
  );
}
const Cr = ({
  progress: r,
  message: t = "页面加载中..."
}) => {
  const s = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    padding: "40px 20px"
  }, x = {
    textAlign: "center",
    maxWidth: "300px"
  }, u = {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #1890ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px"
  }, _ = {
    color: "#666",
    fontSize: "16px",
    marginBottom: "16px"
  }, f = {
    width: "100%",
    height: "4px",
    backgroundColor: "#f3f3f3",
    borderRadius: "2px",
    overflow: "hidden"
  }, d = {
    height: "100%",
    backgroundColor: "#1890ff",
    transition: "width 0.3s ease",
    width: `${r || 0}%`
  };
  return /* @__PURE__ */ y.jsxs("div", { style: s, children: [
    /* @__PURE__ */ y.jsxs("div", { style: x, children: [
      /* @__PURE__ */ y.jsx("div", { style: u }),
      /* @__PURE__ */ y.jsx("div", { style: _, children: t }),
      typeof r == "number" && /* @__PURE__ */ y.jsx("div", { style: f, children: /* @__PURE__ */ y.jsx("div", { style: d }) })
    ] }),
    /* @__PURE__ */ y.jsx("style", { children: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        ` })
  ] });
}, jr = ({
  error: r,
  onRetry: t
}) => {
  const s = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    padding: "40px 20px"
  }, x = {
    textAlign: "center",
    maxWidth: "400px"
  }, u = {
    fontSize: "48px",
    marginBottom: "16px"
  }, _ = {
    color: "#ff4d4f",
    margin: "0 0 16px 0",
    fontSize: "20px"
  }, f = {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "24px",
    background: "#f5f5f5",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "left"
  }, d = {
    background: "#1890ff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  };
  return /* @__PURE__ */ y.jsx("div", { style: s, children: /* @__PURE__ */ y.jsxs("div", { style: x, children: [
    /* @__PURE__ */ y.jsx("div", { style: u, children: "⚠️" }),
    /* @__PURE__ */ y.jsx("h3", { style: _, children: "页面加载失败" }),
    /* @__PURE__ */ y.jsx("div", { style: f, children: r }),
    t && /* @__PURE__ */ y.jsx(
      "button",
      {
        style: d,
        onMouseEnter: (a) => {
          a.target.style.background = "#40a9ff";
        },
        onMouseLeave: (a) => {
          a.target.style.background = "#1890ff";
        },
        onClick: t,
        children: "重新加载"
      }
    )
  ] }) });
};
function wr({
  schema: r,
  engineConfig: t = {},
  loadingComponent: s = Cr,
  errorComponent: x = jr,
  enableErrorBoundary: u = !0,
  className: _,
  style: f,
  onPageLoad: d,
  onPageError: a,
  onPageUnload: g
}) {
  const {
    engine: i,
    initializePage: C,
    isInitialized: c,
    isInitializing: w,
    initError: R,
    destroy: j
  } = br(t), [p, h] = $(0), [E, P] = $("正在初始化页面...");
  Q(() => {
    let z = !0;
    return (async () => {
      if (!(!r || !i))
        try {
          P("正在加载页面配置..."), h(20);
          const A = await C(r);
          if (!z) return;
          A.success ? (h(100), P("加载完成"), d == null || d(r)) : a == null || a(A.error || "页面初始化失败");
        } catch (A) {
          if (!z) return;
          const F = A instanceof Error ? A.message : "未知错误";
          a == null || a(F);
        }
    })(), () => {
      z = !1;
    };
  }, [r, i, C, d, a]), Q(() => () => {
    r && (g == null || g(r)), j();
  }, [r, j, g]);
  const L = J(() => {
    var F;
    if (!r || !c) return null;
    const z = r.layout.root, Y = r.components[z];
    if (!Y) return null;
    const A = (F = r.layout.structure) == null ? void 0 : F[z];
    return A != null && A.children ? {
      ...Y,
      children: A.children
    } : Y;
  }, [r, c]), M = () => {
    r && i && (h(0), P("正在重新加载..."), C(r));
  }, ee = {
    width: "100%",
    minHeight: "100vh",
    ...f
  }, re = [
    "snap-studio-page-container",
    r != null && r.metadata.pageId ? `page-${r.metadata.pageId}` : "",
    _ || ""
  ].filter(Boolean).join(" "), K = R ? /* @__PURE__ */ y.jsx(x, { error: R, onRetry: M }) : w || !c ? /* @__PURE__ */ y.jsx(
    s,
    {
      progress: p,
      message: E
    }
  ) : i && L && r ? /* @__PURE__ */ y.jsx(
    ge,
    {
      engine: i,
      definition: L,
      componentId: r.layout.root,
      enableErrorBoundary: u
    }
  ) : null;
  return u ? /* @__PURE__ */ y.jsx("div", { className: re, style: ee, children: /* @__PURE__ */ y.jsx(
    ye,
    {
      componentId: r == null ? void 0 : r.layout.root,
      componentType: "PageContainer",
      onError: (z, Y) => {
        console.error("页面容器错误:", z, Y), a == null || a(z.message);
      },
      children: K
    }
  ) }) : /* @__PURE__ */ y.jsx("div", { className: re, style: ee, children: K });
}
function Fr({
  schema: r,
  debug: t = !1
}) {
  return /* @__PURE__ */ y.jsx(
    wr,
    {
      schema: r,
      engineConfig: { debug: t },
      onPageLoad: (s) => {
        t && console.log("页面加载完成:", s.metadata);
      },
      onPageError: (s) => {
        t && console.error("页面加载失败:", s);
      }
    }
  );
}
const $r = "1.0.0";
export {
  ge as ComponentRenderer,
  ye as ErrorBoundary,
  wr as PageContainer,
  Ar as SimpleComponentRenderer,
  Fr as SimplePage,
  $r as VERSION,
  Rr as useActionExecutor,
  Pr as useBatchActionExecutor,
  Dr as useErrorBoundary,
  Ir as usePageState,
  Er as usePageStates,
  br as useRenderEngine
};
