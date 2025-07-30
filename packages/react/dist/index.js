import k, { useRef as Ye, useState as F, useEffect as Z, useCallback as $, Component as mr, useMemo as U } from "react";
import { createRenderEngine as hr } from "@snap-studio/core";
import { ExpressionEngine as xr } from "@snap-studio/expression-engine";
function br(r = {}) {
  const t = Ye(null), s = Ye(null), [x, u] = F(!1), [_, d] = F(!1), [f, i] = F(null);
  Z(() => (t.current || (s.current = new xr(r.expressionEngine), t.current = hr(
    s.current,
    r
  ), r.debug && console.log("RenderEngine created:", t.current)), () => {
    t.current && (t.current.destroy().catch(console.error), t.current = null, s.current = null, u(!1));
  }), []);
  const y = $(async (c) => {
    if (!t.current)
      throw new Error("渲染引擎未创建");
    d(!0), i(null);
    try {
      const b = await t.current.initialize(c);
      return b.success ? (u(!0), r.debug && console.log("页面初始化成功:", b)) : (i(b.error || "初始化失败"), r.debug && console.error("页面初始化失败:", b.error)), b;
    } catch (b) {
      const C = b instanceof Error ? b.message : "初始化异常";
      return i(C), r.debug && console.error("页面初始化异常:", b), {
        success: !1,
        duration: 0,
        error: C,
        loadedDataSources: 0,
        registeredComponents: 0
      };
    } finally {
      d(!1);
    }
  }, [r.debug]), a = $(async () => {
    t.current && (await t.current.destroy(), u(!1), i(null));
  }, []), j = $(() => {
    var c;
    return ((c = t.current) == null ? void 0 : c.getStats()) || null;
  }, []);
  return {
    engine: t.current,
    initializePage: y,
    isInitialized: x,
    isInitializing: _,
    initError: f,
    destroy: a,
    getStats: j
  };
}
function Ir(r, t, s) {
  const [x, u] = F(() => {
    if (!r) return s;
    const a = r.get(t);
    return a !== void 0 ? a : s;
  }), [_, d] = F(!r);
  Z(() => {
    if (!r) {
      d(!0);
      return;
    }
    d(!1);
    const a = r.get(t);
    a !== void 0 && u(a);
    const j = r.subscribe(t, (c, b, C) => {
      if (C === t || C.startsWith(t + ".") || t.startsWith(C + ".")) {
        const O = r.get(t);
        u(O !== void 0 ? O : s);
      }
    });
    return () => {
      r.unsubscribe(j);
    };
  }, [r, t, s]);
  const f = $((a) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    r.set(t, a);
  }, [r, t]), i = $((a) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    typeof a == "object" && a !== null ? r.merge(t, a) : console.warn("mergeValue only works with object values");
  }, [r, t]), y = $(() => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    r.delete(t);
  }, [r, t]);
  return {
    value: x,
    setValue: f,
    mergeValue: i,
    deleteValue: y,
    isLoading: _
  };
}
function Er(r, t, s) {
  const [x, u] = F(() => {
    if (!r) return s || {};
    const i = {};
    return t.forEach((y) => {
      const a = r.get(y);
      i[y] = a !== void 0 ? a : s == null ? void 0 : s[y];
    }), i;
  }), [_, d] = F(!r);
  Z(() => {
    if (!r) {
      d(!0);
      return;
    }
    d(!1);
    const i = [];
    return t.forEach((y) => {
      const a = r.subscribe(y, () => {
        const j = {};
        t.forEach((c) => {
          const b = r.get(c);
          j[c] = b !== void 0 ? b : s == null ? void 0 : s[c];
        }), u(j);
      });
      i.push(a);
    }), () => {
      i.forEach((y) => {
        r.unsubscribe(y);
      });
    };
  }, [r, JSON.stringify(t), JSON.stringify(s)]);
  const f = $((i) => {
    if (!r) {
      console.warn("StateManager not available");
      return;
    }
    Object.entries(i).forEach(([y, a]) => {
      t.includes(y) && r.set(y, a);
    });
  }, [r, t]);
  return {
    states: x,
    setStates: f,
    isLoading: _
  };
}
function Rr(r, t = {}) {
  const {
    maxHistory: s = 50,
    autoClearError: x = !0,
    errorClearDelay: u = 5e3
  } = t, [_, d] = F({
    isExecuting: !1,
    lastResult: null,
    error: null,
    history: []
  }), f = $(async (a, j = {}) => {
    if (!r) {
      const c = {
        actionId: a,
        success: !1,
        error: "ActionExecutor not available"
      };
      return d((b) => ({
        ...b,
        lastResult: c,
        error: c.error || null
      })), c;
    }
    d((c) => ({
      ...c,
      isExecuting: !0,
      error: null
    }));
    try {
      const c = await r.execute(a, j);
      return d((b) => {
        const C = [...b.history, c];
        return C.length > s && C.splice(0, C.length - s), {
          ...b,
          isExecuting: !1,
          lastResult: c,
          error: c.success ? null : c.error || "执行失败",
          history: C
        };
      }), !c.success && x && setTimeout(() => {
        d((b) => ({
          ...b,
          error: null
        }));
      }, u), c;
    } catch (c) {
      const b = c instanceof Error ? c.message : "执行异常", C = {
        actionId: a,
        success: !1,
        error: b
      };
      return d((O) => ({
        ...O,
        isExecuting: !1,
        lastResult: C,
        error: b,
        history: [...O.history, C]
      })), x && setTimeout(() => {
        d((O) => ({
          ...O,
          error: null
        }));
      }, u), C;
    }
  }, [r, s, x, u]), i = $(() => {
    d((a) => ({
      ...a,
      history: [],
      error: null
    }));
  }, []), y = $(async () => {
    const a = _.lastResult;
    return !a || a.success ? null : await f(a.actionId, {
      isRetry: !0
    });
  }, [_.lastResult, f]);
  return {
    execute: f,
    state: _,
    clearHistory: i,
    retryLast: y
  };
}
function Pr(r) {
  const [t, s] = F(!1), [x, u] = F([]);
  return {
    executeBatch: $(async (d) => {
      if (!r)
        return d.map((f) => ({
          actionId: f.id,
          success: !1,
          error: "ActionExecutor not available"
        }));
      s(!0);
      try {
        const f = d.map(
          (y) => r.execute(y.id, y.context)
        ), i = await Promise.all(f);
        return u(i), i;
      } finally {
        s(!1);
      }
    }, [r]),
    isExecuting: t,
    results: x
  };
}
var ve = { exports: {} }, G = {};
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
  if (Ne) return G;
  Ne = 1;
  var r = k, t = Symbol.for("react.element"), s = Symbol.for("react.fragment"), x = Object.prototype.hasOwnProperty, u = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function d(f, i, y) {
    var a, j = {}, c = null, b = null;
    y !== void 0 && (c = "" + y), i.key !== void 0 && (c = "" + i.key), i.ref !== void 0 && (b = i.ref);
    for (a in i) x.call(i, a) && !_.hasOwnProperty(a) && (j[a] = i[a]);
    if (f && f.defaultProps) for (a in i = f.defaultProps, i) j[a] === void 0 && (j[a] = i[a]);
    return { $$typeof: t, type: f, key: c, ref: b, props: j, _owner: u.current };
  }
  return G.Fragment = s, G.jsx = d, G.jsxs = d, G;
}
var X = {};
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
    var r = k, t = Symbol.for("react.element"), s = Symbol.for("react.portal"), x = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), d = Symbol.for("react.provider"), f = Symbol.for("react.context"), i = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), a = Symbol.for("react.suspense_list"), j = Symbol.for("react.memo"), c = Symbol.for("react.lazy"), b = Symbol.for("react.offscreen"), C = Symbol.iterator, O = "@@iterator";
    function g(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = C && e[C] || e[O];
      return typeof n == "function" ? n : null;
    }
    var h = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function R(e) {
      {
        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), l = 1; l < n; l++)
          o[l - 1] = arguments[l];
        P("error", e, o);
      }
    }
    function P(e, n, o) {
      {
        var l = h.ReactDebugCurrentFrame, E = l.getStackAddendum();
        E !== "" && (n += "%s", o = o.concat([E]));
        var S = o.map(function(m) {
          return String(m);
        });
        S.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, S);
      }
    }
    var B = !1, J = !1, Q = !1, ee = !1, me = !1, M;
    M = Symbol.for("react.module.reference");
    function W(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === x || e === _ || me || e === u || e === y || e === a || ee || e === b || B || J || Q || typeof e == "object" && e !== null && (e.$$typeof === c || e.$$typeof === j || e.$$typeof === d || e.$$typeof === f || e.$$typeof === i || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === M || e.getModuleId !== void 0));
    }
    function re(e, n, o) {
      var l = e.displayName;
      if (l)
        return l;
      var E = n.displayName || n.name || "";
      return E !== "" ? o + "(" + E + ")" : o;
    }
    function L(e) {
      return e.displayName || "Context";
    }
    function z(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && R("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
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
        case y:
          return "Suspense";
        case a:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case f:
            var n = e;
            return L(n) + ".Consumer";
          case d:
            var o = e;
            return L(o._context) + ".Provider";
          case i:
            return re(e, e.render, "ForwardRef");
          case j:
            var l = e.displayName || null;
            return l !== null ? l : z(e.type) || "Memo";
          case c: {
            var E = e, S = E._payload, m = E._init;
            try {
              return z(m(S));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Y = Object.assign, K = 0, he, xe, be, Ee, Re, Se, _e;
    function je() {
    }
    je.__reactDisabledLog = !0;
    function He() {
      {
        if (K === 0) {
          he = console.log, xe = console.info, be = console.warn, Ee = console.error, Re = console.group, Se = console.groupCollapsed, _e = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: je,
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
        K++;
      }
    }
    function Ue() {
      {
        if (K--, K === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Y({}, e, {
              value: he
            }),
            info: Y({}, e, {
              value: xe
            }),
            warn: Y({}, e, {
              value: be
            }),
            error: Y({}, e, {
              value: Ee
            }),
            group: Y({}, e, {
              value: Re
            }),
            groupCollapsed: Y({}, e, {
              value: Se
            }),
            groupEnd: Y({}, e, {
              value: _e
            })
          });
        }
        K < 0 && R("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ie = h.ReactCurrentDispatcher, ae;
    function te(e, n, o) {
      {
        if (ae === void 0)
          try {
            throw Error();
          } catch (E) {
            var l = E.stack.trim().match(/\n( *(at )?)/);
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
    function Ce(e, n) {
      if (!e || le)
        return "";
      {
        var o = ne.get(e);
        if (o !== void 0)
          return o;
      }
      var l;
      le = !0;
      var E = Error.prepareStackTrace;
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
          for (var p = D.stack.split(`
`), I = l.stack.split(`
`), w = p.length - 1, T = I.length - 1; w >= 1 && T >= 0 && p[w] !== I[T]; )
            T--;
          for (; w >= 1 && T >= 0; w--, T--)
            if (p[w] !== I[T]) {
              if (w !== 1 || T !== 1)
                do
                  if (w--, T--, T < 0 || p[w] !== I[T]) {
                    var A = `
` + p[w].replace(" at new ", " at ");
                    return e.displayName && A.includes("<anonymous>") && (A = A.replace("<anonymous>", e.displayName)), typeof e == "function" && ne.set(e, A), A;
                  }
                while (w >= 1 && T >= 0);
              break;
            }
        }
      } finally {
        le = !1, ie.current = S, Ue(), Error.prepareStackTrace = E;
      }
      var H = e ? e.displayName || e.name : "", N = H ? te(H) : "";
      return typeof e == "function" && ne.set(e, N), N;
    }
    function Me(e, n, o) {
      return Ce(e, !1);
    }
    function Ke(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function oe(e, n, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Ce(e, Ke(e));
      if (typeof e == "string")
        return te(e);
      switch (e) {
        case y:
          return te("Suspense");
        case a:
          return te("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case i:
            return Me(e.render);
          case j:
            return oe(e.type, n, o);
          case c: {
            var l = e, E = l._payload, S = l._init;
            try {
              return oe(S(E), n, o);
            } catch {
            }
          }
        }
      return "";
    }
    var q = Object.prototype.hasOwnProperty, we = {}, Te = h.ReactDebugCurrentFrame;
    function se(e) {
      if (e) {
        var n = e._owner, o = oe(e.type, e._source, n ? n.type : null);
        Te.setExtraStackFrame(o);
      } else
        Te.setExtraStackFrame(null);
    }
    function qe(e, n, o, l, E) {
      {
        var S = Function.call.bind(q);
        for (var m in e)
          if (S(e, m)) {
            var p = void 0;
            try {
              if (typeof e[m] != "function") {
                var I = Error((l || "React class") + ": " + o + " type `" + m + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[m] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw I.name = "Invariant Violation", I;
              }
              p = e[m](n, m, l, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (w) {
              p = w;
            }
            p && !(p instanceof Error) && (se(E), R("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", o, m, typeof p), se(null)), p instanceof Error && !(p.message in we) && (we[p.message] = !0, se(E), R("Failed %s type: %s", o, p.message), se(null));
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
        return R("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Xe(e)), ke(e);
    }
    var Ie = h.ReactCurrentOwner, Qe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Pe, De;
    function er(e) {
      if (q.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function rr(e) {
      if (q.call(e, "key")) {
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
          Pe || (Pe = !0, R("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
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
          De || (De = !0, R("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var sr = function(e, n, o, l, E, S, m) {
      var p = {
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
      return p._store = {}, Object.defineProperty(p._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(p, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(p, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: E
      }), Object.freeze && (Object.freeze(p.props), Object.freeze(p)), p;
    };
    function ir(e, n, o, l, E) {
      {
        var S, m = {}, p = null, I = null;
        o !== void 0 && (Oe(o), p = "" + o), rr(n) && (Oe(n.key), p = "" + n.key), er(n) && (I = n.ref, tr(n, E));
        for (S in n)
          q.call(n, S) && !Qe.hasOwnProperty(S) && (m[S] = n[S]);
        if (e && e.defaultProps) {
          var w = e.defaultProps;
          for (S in w)
            m[S] === void 0 && (m[S] = w[S]);
        }
        if (p || I) {
          var T = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          p && nr(m, T), I && or(m, T);
        }
        return sr(e, p, I, E, l, Ie.current, m);
      }
    }
    var ue = h.ReactCurrentOwner, Ae = h.ReactDebugCurrentFrame;
    function V(e) {
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
          var e = z(ue.current.type);
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
        e && e._owner && e._owner !== ue.current && (l = " It was passed a child from " + z(e._owner.type) + "."), V(e), R('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, l), V(null);
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
          var E = g(e);
          if (typeof E == "function" && E !== e.entries)
            for (var S = E.call(e), m; !(m = S.next()).done; )
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
        else if (typeof n == "object" && (n.$$typeof === i || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === j))
          o = n.propTypes;
        else
          return;
        if (o) {
          var l = z(n);
          qe(o, e.props, "prop", l, e);
        } else if (n.PropTypes !== void 0 && !fe) {
          fe = !0;
          var E = z(n);
          R("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", E || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && R("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ur(e) {
      {
        for (var n = Object.keys(e.props), o = 0; o < n.length; o++) {
          var l = n[o];
          if (l !== "children" && l !== "key") {
            V(e), R("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), V(null);
            break;
          }
        }
        e.ref !== null && (V(e), R("Invalid attribute `ref` supplied to `React.Fragment`."), V(null));
      }
    }
    var ze = {};
    function Le(e, n, o, l, E, S) {
      {
        var m = W(e);
        if (!m) {
          var p = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (p += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var I = ar();
          I ? p += I : p += Fe();
          var w;
          e === null ? w = "null" : ce(e) ? w = "array" : e !== void 0 && e.$$typeof === t ? (w = "<" + (z(e.type) || "Unknown") + " />", p = " Did you accidentally export a JSX literal instead of a component?") : w = typeof e, R("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", w, p);
        }
        var T = ir(e, n, o, E, S);
        if (T == null)
          return T;
        if (m) {
          var A = n.children;
          if (A !== void 0)
            if (l)
              if (ce(A)) {
                for (var H = 0; H < A.length; H++)
                  We(A[H], e);
                Object.freeze && Object.freeze(A);
              } else
                R("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              We(A, e);
        }
        if (q.call(n, "key")) {
          var N = z(e), D = Object.keys(n).filter(function(gr) {
            return gr !== "key";
          }), pe = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!ze[N + pe]) {
            var yr = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            R(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, pe, N, yr, N), ze[N + pe] = !0;
          }
        }
        return e === x ? ur(T) : cr(T), T;
      }
    }
    function fr(e, n, o) {
      return Le(e, n, o, !0);
    }
    function dr(e, n, o) {
      return Le(e, n, o, !1);
    }
    var pr = dr, vr = fr;
    X.Fragment = x, X.jsx = pr, X.jsxs = vr;
  }()), X;
}
process.env.NODE_ENV === "production" ? ve.exports = Sr() : ve.exports = _r();
var v = ve.exports;
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
      }, d = {
        background: "white",
        padding: "12px",
        borderRadius: "4px",
        margin: "16px 0",
        textAlign: "left"
      }, f = {
        margin: "4px 0",
        fontSize: "14px"
      }, i = {
        margin: "16px 0",
        textAlign: "left"
      }, y = {
        background: "#f5f5f5",
        padding: "12px",
        borderRadius: "4px",
        maxHeight: "300px",
        overflow: "auto"
      }, a = {
        margin: "0",
        fontSize: "12px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all"
      }, j = {
        background: "#1890ff",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        marginTop: "16px"
      };
      return /* @__PURE__ */ v.jsx("div", { style: x, children: /* @__PURE__ */ v.jsxs("div", { style: u, children: [
        /* @__PURE__ */ v.jsx("h3", { style: _, children: "⚠️ 组件渲染出错" }),
        /* @__PURE__ */ v.jsxs("div", { style: d, children: [
          this.props.componentType && /* @__PURE__ */ v.jsxs("p", { style: f, children: [
            /* @__PURE__ */ v.jsx("strong", { children: "组件类型:" }),
            " ",
            this.props.componentType
          ] }),
          this.props.componentId && /* @__PURE__ */ v.jsxs("p", { style: f, children: [
            /* @__PURE__ */ v.jsx("strong", { children: "组件ID:" }),
            " ",
            this.props.componentId
          ] })
        ] }),
        (this.props.showErrorDetails || process.env.NODE_ENV === "development") && /* @__PURE__ */ v.jsxs("details", { style: i, children: [
          /* @__PURE__ */ v.jsx("summary", { style: { cursor: "pointer", fontWeight: "bold", marginBottom: "8px" }, children: "错误详情" }),
          /* @__PURE__ */ v.jsxs("div", { style: y, children: [
            /* @__PURE__ */ v.jsx("pre", { style: a, children: (t = this.state.error) == null ? void 0 : t.stack }),
            ((s = this.state.errorInfo) == null ? void 0 : s.componentStack) && /* @__PURE__ */ v.jsxs("div", { children: [
              /* @__PURE__ */ v.jsx("h4", { style: { margin: "16px 0 8px 0" }, children: "组件栈:" }),
              /* @__PURE__ */ v.jsx("pre", { style: a, children: this.state.errorInfo.componentStack })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ v.jsx(
          "button",
          {
            style: j,
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
  const [, r] = k.useState(), t = k.useCallback(() => {
    r({});
  }, []), s = k.useCallback((x) => {
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
  const { execute: _ } = Rr(r.actionExecutor), d = r.componentRegistry.get(t.componentType), f = U(() => t.dataBinding ? Object.entries(t.dataBinding).filter(([g, h]) => typeof h == "string").map(([g, h]) => ({ propName: g, dataPath: h })) : [], [t.dataBinding]), { states: i } = Er(
    r.stateManager,
    f.map((g) => g.dataPath),
    {}
  ), y = U(() => {
    if (!t.dataBinding) return {};
    const g = {};
    return f.forEach(({ propName: h, dataPath: R }) => {
      g[h] = i[R];
    }), Object.entries(t.dataBinding).forEach(([h, R]) => {
      typeof R == "object" && (g[h] = R);
    }), g;
  }, [t.dataBinding, f, i]), a = U(() => {
    if (!t.dynamicProps) return {};
    const g = {};
    return Object.entries(t.dynamicProps).forEach(([h, R]) => {
      var P;
      try {
        const B = {
          state: r.stateManager.get()
          // 可以添加更多上下文
        }, J = (P = r.stateManager.expressionEngine) == null ? void 0 : P.evaluateSync(R, B);
        g[h] = J;
      } catch (B) {
        console.warn(`动态属性计算失败: ${h}`, B), g[h] = void 0;
      }
    }), g;
  }, [t.dynamicProps, r.stateManager]), j = U(() => {
    if (!t.events) return {};
    const g = {};
    return Object.entries(t.events).forEach(([h, R]) => {
      g[h] = async (P) => {
        try {
          await _(R, {
            event: P,
            target: P.target,
            payload: { componentId: s, eventName: h }
          });
        } catch (B) {
          console.error(`事件处理失败: ${h}`, B);
        }
      };
    }), g;
  }, [t.events, _, s]), c = U(() => {
    var g;
    if (!t.visibility) return !0;
    try {
      const h = {
        state: r.stateManager.get()
      };
      return !!((g = r.stateManager.expressionEngine) != null && g.evaluateSync(t.visibility, h));
    } catch (h) {
      return console.warn("可见性条件计算失败:", h), !0;
    }
  }, [t.visibility, r.stateManager]), b = $(() => {
    if (t.children)
      return t.children.map((g, h) => {
        var R;
        if (typeof g == "string") {
          const P = (R = r.getCurrentSchema()) == null ? void 0 : R.components[g];
          return P ? k.createElement(ge, {
            key: g,
            engine: r,
            definition: P,
            componentId: g,
            enableErrorBoundary: u
          }) : (console.warn(`子组件未找到: ${g}`), null);
        } else return typeof g == "object" ? k.createElement(ge, {
          key: `inline-${h}`,
          engine: r,
          definition: g,
          componentId: `${s}-child-${h}`,
          enableErrorBoundary: u
        }) : g;
      });
  }, [t.children, r, s, u]);
  if (!c)
    return null;
  if (!d) {
    const g = () => k.createElement(
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
      k.createElement("strong", null, `组件类型未注册: ${t.componentType}`),
      s && k.createElement("div", null, `组件ID: ${s}`)
    );
    return u ? k.createElement(
      ye,
      { componentId: s, componentType: t.componentType },
      k.createElement(g)
    ) : k.createElement(g);
  }
  const C = {
    ...t.properties || t.props || {},
    ...y,
    ...a,
    ...j,
    ...x,
    children: b()
  }, O = k.createElement(d, C);
  return u ? k.createElement(
    ye,
    { componentId: s, componentType: t.componentType },
    O
  ) : O;
}
function Ar({
  componentType: r,
  properties: t = {},
  children: s,
  componentRegistry: x
}) {
  const u = x.get(r);
  return u ? k.createElement(u, { ...t, children: s }) : k.createElement(
    "div",
    { style: { color: "red" } },
    `Unknown component: ${r}`
  );
}
const jr = ({
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
  }, d = {
    width: "100%",
    height: "4px",
    backgroundColor: "#f3f3f3",
    borderRadius: "2px",
    overflow: "hidden"
  }, f = {
    height: "100%",
    backgroundColor: "#1890ff",
    transition: "width 0.3s ease",
    width: `${r || 0}%`
  };
  return /* @__PURE__ */ v.jsxs("div", { style: s, children: [
    /* @__PURE__ */ v.jsxs("div", { style: x, children: [
      /* @__PURE__ */ v.jsx("div", { style: u }),
      /* @__PURE__ */ v.jsx("div", { style: _, children: t }),
      typeof r == "number" && /* @__PURE__ */ v.jsx("div", { style: d, children: /* @__PURE__ */ v.jsx("div", { style: f }) })
    ] }),
    /* @__PURE__ */ v.jsx("style", { children: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        ` })
  ] });
}, Cr = ({
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
  }, d = {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "24px",
    background: "#f5f5f5",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "left"
  }, f = {
    background: "#1890ff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  };
  return /* @__PURE__ */ v.jsx("div", { style: s, children: /* @__PURE__ */ v.jsxs("div", { style: x, children: [
    /* @__PURE__ */ v.jsx("div", { style: u, children: "⚠️" }),
    /* @__PURE__ */ v.jsx("h3", { style: _, children: "页面加载失败" }),
    /* @__PURE__ */ v.jsx("div", { style: d, children: r }),
    t && /* @__PURE__ */ v.jsx(
      "button",
      {
        style: f,
        onMouseEnter: (i) => {
          i.target.style.background = "#40a9ff";
        },
        onMouseLeave: (i) => {
          i.target.style.background = "#1890ff";
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
  loadingComponent: s = jr,
  errorComponent: x = Cr,
  enableErrorBoundary: u = !0,
  className: _,
  style: d,
  onPageLoad: f,
  onPageError: i,
  onPageUnload: y
}) {
  const {
    engine: a,
    initializePage: j,
    isInitialized: c,
    isInitializing: b,
    initError: C,
    destroy: O
  } = br(t), [g, h] = F(0), [R, P] = F("正在初始化页面...");
  Z(() => {
    let W = !0;
    return (async () => {
      if (!(!r || !a))
        try {
          P("正在加载页面配置..."), h(20);
          const L = await j(r);
          if (!W) return;
          L.success ? (h(100), P("加载完成"), f == null || f(r)) : i == null || i(L.error || "页面初始化失败");
        } catch (L) {
          if (!W) return;
          const z = L instanceof Error ? L.message : "未知错误";
          i == null || i(z);
        }
    })(), () => {
      W = !1;
    };
  }, [r, a, j, f, i]), Z(() => () => {
    r && (y == null || y(r)), O();
  }, [r, O, y]);
  const B = U(() => {
    if (!r || !c) return null;
    const W = r.layout.root;
    return r.components[W];
  }, [r, c]), J = () => {
    r && a && (h(0), P("正在重新加载..."), j(r));
  }, Q = {
    width: "100%",
    minHeight: "100vh",
    ...d
  }, ee = [
    "snap-studio-page-container",
    r != null && r.metadata.pageId ? `page-${r.metadata.pageId}` : "",
    _ || ""
  ].filter(Boolean).join(" "), M = C ? /* @__PURE__ */ v.jsx(x, { error: C, onRetry: J }) : b || !c ? /* @__PURE__ */ v.jsx(
    s,
    {
      progress: g,
      message: R
    }
  ) : a && B && r ? /* @__PURE__ */ v.jsx(
    ge,
    {
      engine: a,
      definition: B,
      componentId: r.layout.root,
      enableErrorBoundary: u
    }
  ) : null;
  return u ? /* @__PURE__ */ v.jsx("div", { className: ee, style: Q, children: /* @__PURE__ */ v.jsx(
    ye,
    {
      componentId: r == null ? void 0 : r.layout.root,
      componentType: "PageContainer",
      onError: (W, re) => {
        console.error("页面容器错误:", W, re), i == null || i(W.message);
      },
      children: M
    }
  ) }) : /* @__PURE__ */ v.jsx("div", { className: ee, style: Q, children: M });
}
function Fr({
  schema: r,
  debug: t = !1
}) {
  return /* @__PURE__ */ v.jsx(
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
