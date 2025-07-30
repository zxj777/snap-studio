class d {
  constructor() {
    this.components = /* @__PURE__ */ new Map(), this.aliases = /* @__PURE__ */ new Map();
  }
  /**
   * 注册组件
   */
  register(t) {
    const { type: e, component: s } = t;
    if (!e || !s)
      throw new Error("组件类型和构造函数不能为空");
    this.components.has(e) && console.warn(`组件类型 "${e}" 已存在，将被覆盖`), this.components.set(e, t);
  }
  /**
   * 批量注册组件
   */
  registerBatch(t) {
    t.forEach((e) => {
      this.register(e);
    });
  }
  /**
   * 获取组件
   */
  get(t) {
    const e = this.aliases.get(t) || t, s = this.components.get(e);
    return s == null ? void 0 : s.component;
  }
  /**
   * 获取组件注册信息
   */
  getRegistration(t) {
    const e = this.aliases.get(t) || t;
    return this.components.get(e);
  }
  /**
   * 检查组件是否已注册
   */
  has(t) {
    const e = this.aliases.get(t) || t;
    return this.components.has(e);
  }
  /**
   * 取消注册组件
   */
  unregister(t) {
    return this.components.delete(t);
  }
  /**
   * 创建组件别名
   */
  createAlias(t, e) {
    if (!this.components.has(e))
      throw new Error(`目标组件类型 "${e}" 不存在`);
    this.aliases.set(t, e);
  }
  /**
   * 获取所有已注册的组件类型
   */
  getRegisteredTypes() {
    return Array.from(this.components.keys());
  }
  /**
   * 获取所有别名
   */
  getAliases() {
    return Object.fromEntries(this.aliases);
  }
  /**
   * 清空注册表
   */
  clear() {
    this.components.clear(), this.aliases.clear();
  }
  /**
   * 获取注册表统计信息
   */
  getStats() {
    return {
      componentCount: this.components.size,
      aliasCount: this.aliases.size,
      types: this.getRegisteredTypes()
    };
  }
  /**
   * 验证组件定义是否有对应的注册组件
   */
  validateComponentDefinition(t) {
    const e = [];
    return ((a) => {
      this.has(a) || e.push(a);
    })(t.componentType), t.children && t.children.forEach((a) => {
      if (typeof a == "object" && a.componentType) {
        const i = this.validateComponentDefinition(a);
        e.push(...i.missingTypes);
      }
    }), {
      isValid: e.length === 0,
      missingTypes: [...new Set(e)]
      // 去重
    };
  }
}
const h = new d();
class f {
  constructor(t = {}, e) {
    this.state = {}, this.subscriptions = /* @__PURE__ */ new Map(), this.subscriptionIdCounter = 0, this.state = { ...t }, this.expressionEngine = e;
  }
  /**
   * 获取状态值
   */
  get(t) {
    return !t || t === "" ? this.state : this.getValueByPath(this.state, t);
  }
  /**
   * 设置状态值
   */
  set(t, e, s) {
    this.updateState({
      type: "SET",
      path: t,
      value: e,
      options: s
    });
  }
  /**
   * 合并状态值（适用于对象）
   */
  merge(t, e, s) {
    this.updateState({
      type: "MERGE",
      path: t,
      value: e,
      options: s
    });
  }
  /**
   * 删除状态值
   */
  delete(t, e) {
    this.updateState({
      type: "DELETE",
      path: t,
      options: e
    });
  }
  /**
   * 数组操作：添加元素
   */
  arrayPush(t, e, s) {
    this.updateState({
      type: "ARRAY_PUSH",
      path: t,
      value: e,
      options: s
    });
  }
  /**
   * 数组操作：移除元素
   */
  arrayRemove(t, e, s) {
    this.updateState({
      type: "ARRAY_REMOVE",
      path: t,
      value: e,
      options: s
    });
  }
  /**
   * 批量更新状态
   */
  batchUpdate(t) {
    const e = { ...this.state };
    t.forEach((s) => {
      this.performUpdate(s);
    }), this.notifySubscribers(this.state, e, "");
  }
  /**
   * 订阅状态变化
   */
  subscribe(t, e, s) {
    const a = `sub_${++this.subscriptionIdCounter}`;
    return this.subscriptions.set(a, {
      id: a,
      pathPattern: t,
      callback: e,
      once: s == null ? void 0 : s.once
    }), a;
  }
  /**
   * 取消订阅
   */
  unsubscribe(t) {
    return this.subscriptions.delete(t);
  }
  /**
   * 清空所有订阅
   */
  clearSubscriptions() {
    this.subscriptions.clear();
  }
  /**
   * 计算属性求值
   */
  async computeValue(t) {
    if (!this.expressionEngine)
      throw new Error("Expression engine not configured");
    const e = {
      state: this.state
      // 可以添加其他上下文
    };
    return await this.expressionEngine.evaluate(t, e);
  }
  /**
   * 获取状态快照
   */
  getSnapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }
  /**
   * 重置状态
   */
  reset(t) {
    const e = { ...this.state };
    this.state = t ? { ...t } : {}, this.notifySubscribers(this.state, e, "");
  }
  /**
   * 执行状态更新
   */
  updateState(t) {
    var s;
    const e = { ...this.state };
    this.performUpdate(t), (s = t.options) != null && s.silent || this.notifySubscribers(this.state, e, t.path);
  }
  /**
   * 执行具体的更新操作
   */
  performUpdate(t) {
    const { type: e, path: s, value: a, options: i } = t;
    switch (e) {
      case "SET":
        this.setValueByPath(this.state, s, a);
        break;
      case "MERGE":
        const r = this.getValueByPath(this.state, s);
        if (typeof r == "object" && typeof a == "object") {
          const c = i != null && i.deep ? this.deepMerge(r, a) : { ...r, ...a };
          this.setValueByPath(this.state, s, c);
        } else
          this.setValueByPath(this.state, s, a);
        break;
      case "DELETE":
        this.deleteValueByPath(this.state, s);
        break;
      case "ARRAY_PUSH":
        const n = this.getValueByPath(this.state, s);
        Array.isArray(n) && n.push(a);
        break;
      case "ARRAY_REMOVE":
        const o = this.getValueByPath(this.state, s);
        if (Array.isArray(o)) {
          const c = o.indexOf(a);
          c > -1 && o.splice(c, 1);
        }
        break;
    }
  }
  /**
   * 通知订阅者
   */
  notifySubscribers(t, e, s) {
    const a = [];
    this.subscriptions.forEach((i) => {
      if (this.pathMatches(s, i.pathPattern))
        try {
          i.callback(t, e, s), i.once && a.push(i.id);
        } catch (r) {
          console.error("State subscription callback error:", r);
        }
    }), a.forEach((i) => {
      this.subscriptions.delete(i);
    });
  }
  /**
   * 根据路径获取值
   */
  getValueByPath(t, e) {
    const s = e.split(".");
    let a = t;
    for (const i of s) {
      if (a == null) return;
      a = a[i];
    }
    return a;
  }
  /**
   * 根据路径设置值
   */
  setValueByPath(t, e, s) {
    const a = e.split("."), i = a.pop();
    let r = t;
    for (const n of a)
      (r[n] == null || typeof r[n] != "object") && (r[n] = {}), r = r[n];
    r[i] = s;
  }
  /**
   * 根据路径删除值
   */
  deleteValueByPath(t, e) {
    const s = e.split("."), a = s.pop();
    let i = t;
    for (const r of s) {
      if (i[r] == null) return;
      i = i[r];
    }
    delete i[a];
  }
  /**
   * 深度合并对象
   */
  deepMerge(t, e) {
    const s = { ...t };
    for (const a in e)
      e.hasOwnProperty(a) && (typeof e[a] == "object" && typeof t[a] == "object" ? s[a] = this.deepMerge(t[a], e[a]) : s[a] = e[a]);
    return s;
  }
  /**
   * 检查路径是否匹配模式
   */
  pathMatches(t, e) {
    return e === "*" || e === "" || e === t ? !0 : new RegExp(
      "^" + e.replace(/\*/g, ".*").replace(/\./g, "\\.") + "$"
    ).test(t);
  }
}
class p {
  constructor(t, e, s = {}) {
    this.stateManager = t, this.expressionEngine = e, this.dataSources = /* @__PURE__ */ new Map(), this.cache = /* @__PURE__ */ new Map(), this.loadingPromises = /* @__PURE__ */ new Map(), this.config = {
      timeout: 3e4,
      retryCount: 3,
      retryDelay: 1e3,
      enableCache: !0,
      cacheExpiry: 5 * 60 * 1e3,
      // 5分钟
      ...s
    };
  }
  /**
   * 注册数据源
   */
  registerDataSource(t, e) {
    this.dataSources.set(t, e);
  }
  /**
   * 批量注册数据源
   */
  registerDataSources(t) {
    Object.entries(t).forEach(([e, s]) => {
      this.registerDataSource(e, s);
    });
  }
  /**
   * 根据加载策略执行初始化加载
   */
  async loadInitial(t) {
    const { initial: e } = t;
    return !e || e.length === 0 ? [] : await this.loadMultiple(e);
  }
  /**
   * 执行预加载
   */
  async preload(t) {
    const { preload: e } = t;
    return !e || e.length === 0 ? [] : await this.loadMultiple(e);
  }
  /**
   * 按需加载数据
   */
  async loadOnDemand(t, e) {
    const { onDemand: s } = t;
    return !s || !s[e] ? [] : await this.loadMultiple(s[e]);
  }
  /**
   * 加载单个数据源
   */
  async loadSingle(t) {
    const e = this.loadingPromises.get(t);
    if (e)
      return await e;
    if (this.config.enableCache) {
      const i = this.getCachedData(t);
      if (i)
        return {
          dataSourceId: t,
          success: !0,
          data: i.data,
          fromCache: !0,
          duration: 0
        };
    }
    const s = this.dataSources.get(t);
    if (!s)
      return {
        dataSourceId: t,
        success: !1,
        error: `数据源 "${t}" 未找到`
      };
    const a = this.performLoad(t, s);
    this.loadingPromises.set(t, a);
    try {
      const i = await a;
      return i.success && this.config.enableCache && this.setCachedData(t, i.data), i;
    } finally {
      this.loadingPromises.delete(t);
    }
  }
  /**
   * 批量加载数据源
   */
  async loadMultiple(t) {
    const e = t.map((s) => this.loadSingle(s));
    return await Promise.all(e);
  }
  /**
   * 执行具体的数据加载
   */
  async performLoad(t, e) {
    const s = Date.now();
    try {
      let a;
      switch (e.type) {
        case "API_REQUEST":
          a = await this.loadApiData(e.config);
          break;
        case "STATIC_DATA":
          a = e.config.value;
          break;
        case "LOCAL_STORAGE":
          a = this.loadFromStorage(e.config.key);
          break;
        case "COMPUTED":
          a = await this.loadComputedData(e.config);
          break;
        case "MOCK":
          a = e.config.value || this.generateMockData(e.config);
          break;
        default:
          throw new Error(`不支持的数据源类型: ${e.type}`);
      }
      return e.transformer && (a = await this.applyTransform(a, e.transformer)), {
        dataSourceId: t,
        success: !0,
        data: a,
        duration: Date.now() - s
      };
    } catch (a) {
      const i = a instanceof Error ? a.message : "未知错误";
      return {
        dataSourceId: t,
        success: !1,
        error: i,
        duration: Date.now() - s
      };
    }
  }
  /**
   * 加载API数据
   */
  async loadApiData(t) {
    const { url: e, method: s = "GET", params: a, headers: i, body: r } = t;
    let n = e;
    if (a) {
      const u = new URLSearchParams(a);
      n += (e.includes("?") ? "&" : "?") + u.toString();
    }
    const o = {
      method: s,
      headers: {
        "Content-Type": "application/json",
        ...i
      },
      signal: AbortSignal.timeout(this.config.timeout)
    };
    r && (s === "POST" || s === "PUT" || s === "PATCH") && (o.body = typeof r == "string" ? r : JSON.stringify(r));
    const c = await fetch(n, o);
    if (!c.ok)
      throw new Error(`HTTP ${c.status}: ${c.statusText}`);
    return await c.json();
  }
  /**
   * 从本地存储加载数据
   */
  loadFromStorage(t) {
    try {
      const e = localStorage.getItem(t);
      return e ? JSON.parse(e) : null;
    } catch (e) {
      return console.warn(`Failed to load from localStorage: ${t}`, e), null;
    }
  }
  /**
   * 加载计算属性数据
   */
  async loadComputedData(t) {
    const e = {
      state: this.stateManager.get()
      // 可以添加其他上下文
    };
    return await this.expressionEngine.evaluate(t.expression, e);
  }
  /**
   * 生成模拟数据
   */
  generateMockData(t) {
    return t.template ? t.template : {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      mock: !0
    };
  }
  /**
   * 应用数据转换
   */
  async applyTransform(t, e) {
    if (typeof e == "string") {
      const s = { data: t, state: this.stateManager.get() };
      return await this.expressionEngine.evaluate(e, s);
    }
    return typeof e == "function" ? e(t) : t;
  }
  /**
   * 获取缓存数据
   */
  getCachedData(t) {
    const e = this.cache.get(t);
    if (!e)
      return null;
    const s = Date.now(), a = e.expiry || e.timestamp + this.config.cacheExpiry;
    return s > a ? (this.cache.delete(t), null) : e;
  }
  /**
   * 设置缓存数据
   */
  setCachedData(t, e, s) {
    const a = {
      data: e,
      timestamp: Date.now(),
      expiry: s ? Date.now() + s : void 0
    };
    this.cache.set(t, a);
  }
  /**
   * 清空缓存
   */
  clearCache(t) {
    t ? this.cache.delete(t) : this.cache.clear();
  }
  /**
   * 获取加载状态
   */
  isLoading(t) {
    return this.loadingPromises.has(t);
  }
  /**
   * 获取缓存统计
   */
  getCacheStats() {
    const t = Array.from(this.cache.entries()).map(([e, s]) => ({
      id: e,
      timestamp: s.timestamp,
      size: JSON.stringify(s.data).length
    }));
    return {
      size: this.cache.size,
      entries: t
    };
  }
}
class y {
  constructor(t, e, s, a = {}) {
    this.stateManager = t, this.dataLoader = e, this.expressionEngine = s, this.actions = /* @__PURE__ */ new Map(), this.executingActions = /* @__PURE__ */ new Set(), this.concurrentCount = 0, this.config = {
      timeout: 3e4,
      debug: !1,
      maxConcurrency: 10,
      ...a
    };
  }
  /**
   * 注册行为
   */
  registerAction(t, e) {
    this.actions.set(t, e);
  }
  /**
   * 批量注册行为
   */
  registerActions(t) {
    Object.entries(t).forEach(([e, s]) => {
      this.registerAction(e, s);
    });
  }
  /**
   * 执行行为
   */
  async execute(t, e = {}) {
    if (this.concurrentCount >= this.config.maxConcurrency)
      return {
        actionId: t,
        success: !1,
        error: "并发执行数量超过限制"
      };
    if (this.executingActions.has(t))
      return {
        actionId: t,
        success: !1,
        error: "行为正在执行中，避免重复执行"
      };
    const s = this.actions.get(t);
    if (!s)
      return {
        actionId: t,
        success: !1,
        error: `行为 "${t}" 未找到`
      };
    this.executingActions.add(t), this.concurrentCount++;
    const a = Date.now();
    try {
      if (this.config.debug && console.log(`执行行为: ${t}`, { action: s, context: e }), s.condition && !await this.evaluateCondition(s.condition, e))
        return {
          actionId: t,
          success: !0,
          result: "skipped",
          duration: Date.now() - a
        };
      const i = await this.performAction(s, e);
      return s.onSuccess && await this.execute(s.onSuccess, { ...e, payload: i }), {
        actionId: t,
        success: !0,
        result: i.result,
        duration: Date.now() - a,
        subResults: i.subResults
      };
    } catch (i) {
      const r = i instanceof Error ? i.message : "行为执行失败";
      if (this.config.debug && console.error(`行为执行失败: ${t}`, i), s.onError && await this.execute(s.onError, { ...e, payload: { error: r } }), s.retry && !e.isRetry) {
        const n = await this.retryAction(t, s, e);
        if (n)
          return n;
      }
      return {
        actionId: t,
        success: !1,
        error: r,
        duration: Date.now() - a
      };
    } finally {
      this.executingActions.delete(t), this.concurrentCount--;
    }
  }
  /**
   * 执行具体的行为
   */
  async performAction(t, e) {
    switch (t.type) {
      case "UPDATE_STATE":
        return { result: await this.executeUpdateState(t.config, e) };
      case "FETCH_DATA":
        return { result: await this.executeFetchData(t.config, e) };
      case "NAVIGATE":
        return { result: await this.executeNavigate(t.config, e) };
      case "SHOW_MESSAGE":
        return { result: await this.executeShowMessage(t.config, e) };
      case "OPEN_MODAL":
      case "CLOSE_MODAL":
        return { result: await this.executeModal(t.config, t.type, e) };
      case "CALL_API":
        return { result: await this.executeApiCall(t.config, e) };
      case "COMPOSITE":
        return await this.executeComposite(t.config, e);
      case "CONDITIONAL":
        return await this.executeConditional(t.config, e);
      case "LOOP":
        return await this.executeLoop(t.config, e);
      case "DELAY":
        return { result: await this.executeDelay(t.config.duration, e) };
      default:
        throw new Error(`不支持的行为类型: ${t.type}`);
    }
  }
  /**
   * 执行状态更新
   */
  async executeUpdateState(t, e) {
    const { path: s, value: a, operation: i = "SET" } = t, r = typeof a == "string" && a.startsWith("{{") ? await this.evaluateExpression(a, e) : a;
    switch (i) {
      case "SET":
        this.stateManager.set(s, r);
        break;
      case "MERGE":
        this.stateManager.merge(s, r);
        break;
      case "DELETE":
        this.stateManager.delete(s);
        break;
      case "ARRAY_PUSH":
        this.stateManager.arrayPush(s, r);
        break;
      case "ARRAY_REMOVE":
        this.stateManager.arrayRemove(s, r);
        break;
    }
    return r;
  }
  /**
   * 执行数据获取
   */
  async executeFetchData(t, e) {
    const { dataSourceId: s, updateStatePath: a } = t, i = await this.dataLoader.loadSingle(s);
    return i.success && a && this.stateManager.set(a, i.data), i;
  }
  /**
   * 执行导航
   */
  async executeNavigate(t, e) {
    const { to: s, newWindow: a } = t, i = a ? "_blank" : "_self", r = t.type === "replace", n = typeof s == "string" && s.includes("{{") ? await this.evaluateExpression(s, e) : s;
    return r ? window.location.replace(n) : i === "_self" ? window.location.href = n : window.open(n, i), { url: n, target: i, replace: r };
  }
  /**
   * 执行消息显示
   */
  async executeShowMessage(t, e) {
    const { message: s, type: a = "info", duration: i = 3e3 } = t, r = typeof s == "string" && s.includes("{{") ? await this.evaluateExpression(s, e) : s;
    return console.log(`[${a.toUpperCase()}] ${r}`), { message: r, type: a, duration: i };
  }
  /**
   * 执行模态框操作
   */
  async executeModal(t, e, s) {
    const { modalId: a, props: i } = t;
    return e === "OPEN_MODAL" ? this.stateManager.set(`modals.${a}`, { open: !0, ...i }) : this.stateManager.set(`modals.${a}.open`, !1), { modalId: a, actionType: e, props: i };
  }
  /**
   * 执行API调用
   */
  async executeApiCall(t, e) {
    const { url: s, method: a = "GET", headers: i, body: r, updateStatePath: n } = t, c = await (await fetch(s, {
      method: a,
      headers: {
        "Content-Type": "application/json",
        ...i
      },
      body: a !== "GET" ? JSON.stringify(r) : void 0
    })).json();
    return n && this.stateManager.set(n, c), c;
  }
  /**
   * 执行组合行为
   */
  async executeComposite(t, e) {
    const { steps: s, parallel: a = !1 } = t, i = [];
    if (a) {
      const r = s.map((o) => this.execute(o, e)), n = await Promise.all(r);
      i.push(...n);
    } else
      for (const r of s) {
        const n = await this.execute(r, e);
        if (i.push(n), !n.success && t.stopOnError)
          break;
      }
    return { subResults: i };
  }
  /**
   * 执行条件行为
   */
  async executeConditional(t, e) {
    const { condition: s, thenAction: a, elseAction: i } = t, r = await this.evaluateCondition(s, e), n = r ? a : i;
    if (n) {
      const o = await this.execute(n, e);
      return { result: o.result, subResults: [o] };
    }
    return { result: r };
  }
  /**
   * 执行循环行为
   */
  async executeLoop(t, e) {
    const { iterable: s, itemAction: a, maxIterations: i = 1e3 } = t, r = [], n = await this.evaluateExpression(s, e);
    if (!Array.isArray(n))
      throw new Error("循环的可迭代对象必须是数组");
    const o = Math.min(n.length, i);
    for (let c = 0; c < o; c++) {
      const u = {
        ...e,
        payload: {
          ...e.payload,
          item: n[c],
          index: c,
          total: n.length
        }
      }, g = await this.execute(a, u);
      r.push(g);
    }
    return { result: n, subResults: r };
  }
  /**
   * 执行延迟
   */
  async executeDelay(t, e) {
    return new Promise((s) => {
      setTimeout(s, t);
    });
  }
  /**
   * 重试行为执行
   */
  async retryAction(t, e, s) {
    const { retry: a } = e;
    if (!a) return null;
    const { count: i = 3, delay: r = 1e3 } = a;
    for (let n = 0; n < i; n++) {
      await new Promise((o) => setTimeout(o, r));
      try {
        return await this.execute(t, { ...s, isRetry: !0 });
      } catch (o) {
        if (n === i - 1)
          throw o;
      }
    }
    return null;
  }
  /**
   * 计算表达式
   */
  async evaluateExpression(t, e) {
    const s = {
      state: this.stateManager.get(),
      event: e.event,
      payload: e.payload,
      target: e.target
    };
    return await this.expressionEngine.evaluate(t, s);
  }
  /**
   * 评估条件
   */
  async evaluateCondition(t, e) {
    return !!await this.evaluateExpression(t, e);
  }
  /**
   * 检查行为是否正在执行
   */
  isExecuting(t) {
    return this.executingActions.has(t);
  }
  /**
   * 获取执行状态统计
   */
  getExecutionStats() {
    return {
      concurrentCount: this.concurrentCount,
      executingActions: Array.from(this.executingActions),
      registeredActionsCount: this.actions.size
    };
  }
}
class m {
  constructor(t, e = {}) {
    this.dataLoader = t, this.loadingTasks = /* @__PURE__ */ new Map(), this.loadHistory = [], this.concurrentCount = 0, this.config = {
      maxConcurrency: 5,
      preloadDelay: 100,
      enablePrediction: !0,
      priorityWeights: {
        critical: 1e3,
        high: 100,
        normal: 10,
        low: 1
      },
      ...e
    };
  }
  /**
   * 分析加载策略并生成加载计划
   */
  analyzeStrategy(t, e) {
    const s = {
      initialTasks: [],
      preloadTasks: [],
      onDemandTasks: {}
    };
    return t.initial && (s.initialTasks = this.createLoadTasks(
      t.initial,
      "initial",
      e
    )), t.preload && (s.preloadTasks = this.createLoadTasks(
      t.preload,
      "preload",
      e
    )), t.onDemand && Object.entries(t.onDemand).forEach(([a, i]) => {
      s.onDemandTasks[a] = this.createLoadTasks(
        i,
        "onDemand",
        e
      );
    }), this.optimizeLoadPlan(s), this.loadPlan = s, s;
  }
  /**
   * 执行初始化加载
   */
  async executeInitialLoad() {
    if (!this.loadPlan)
      throw new Error("加载计划未生成，请先调用 analyzeStrategy");
    const { initialTasks: t } = this.loadPlan;
    if (t.length === 0)
      return [];
    console.log("开始执行初始化加载...", t);
    const e = this.sortTasksByPriorityAndDependencies(t);
    return await this.executeTasks(e);
  }
  /**
   * 执行预加载
   */
  async executePreload() {
    if (!this.loadPlan)
      return [];
    const { preloadTasks: t } = this.loadPlan;
    return t.length === 0 ? [] : (await new Promise((e) => setTimeout(e, this.config.preloadDelay)), console.log("开始执行预加载...", t), await this.executeTasks(t, !0));
  }
  /**
   * 执行按需加载
   */
  async executeOnDemandLoad(t) {
    if (!this.loadPlan)
      return [];
    const e = this.loadPlan.onDemandTasks[t];
    return !e || e.length === 0 ? [] : (console.log(`开始执行按需加载: ${t}`, e), await this.executeTasks(e));
  }
  /**
   * 创建加载任务
   */
  createLoadTasks(t, e, s) {
    const a = [];
    let i = 0;
    return t.forEach((r) => {
      if (s[r]) {
        const n = s[r];
        a.push({
          id: `task_${++i}`,
          type: "component",
          targetId: r,
          phase: e,
          priority: this.calculatePriority(n, e),
          dependencies: this.extractDependencies(n)
        }), n.dataBinding && Object.values(n.dataBinding).forEach((o) => {
          typeof o == "string" && o.startsWith("ds_") && a.push({
            id: `task_${++i}`,
            type: "dataSource",
            targetId: o,
            phase: e,
            priority: this.calculateDataSourcePriority(e),
            dependencies: []
          });
        });
      } else
        a.push({
          id: `task_${++i}`,
          type: "dataSource",
          targetId: r,
          phase: e,
          priority: this.calculateDataSourcePriority(e),
          dependencies: []
        });
    }), a;
  }
  /**
   * 计算组件优先级
   */
  calculatePriority(t, e) {
    let s = 0;
    switch (e) {
      case "initial":
        s = this.config.priorityWeights.critical;
        break;
      case "preload":
        s = this.config.priorityWeights.high;
        break;
      case "onDemand":
        s = this.config.priorityWeights.normal;
        break;
    }
    return t.componentType === "PageContainer" ? s += this.config.priorityWeights.critical : (t.componentType.includes("Header") || t.componentType.includes("Nav")) && (s += this.config.priorityWeights.high), t.visibility && (s *= 0.8), Math.floor(s);
  }
  /**
   * 计算数据源优先级
   */
  calculateDataSourcePriority(t) {
    switch (t) {
      case "initial":
        return this.config.priorityWeights.critical;
      case "preload":
        return this.config.priorityWeights.high;
      case "onDemand":
        return this.config.priorityWeights.normal;
      default:
        return this.config.priorityWeights.low;
    }
  }
  /**
   * 提取组件依赖
   */
  extractDependencies(t) {
    const e = [];
    return t.dataBinding && Object.values(t.dataBinding).forEach((s) => {
      typeof s == "string" && s.startsWith("ds_") && e.push(s);
    }), t.children && t.children.forEach((s) => {
      typeof s == "string" && e.push(s);
    }), e;
  }
  /**
   * 优化加载计划
   */
  optimizeLoadPlan(t) {
    t.initialTasks = this.deduplicateTasks(t.initialTasks), t.preloadTasks = this.deduplicateTasks(t.preloadTasks), Object.keys(t.onDemandTasks).forEach((e) => {
      t.onDemandTasks[e] = this.deduplicateTasks(t.onDemandTasks[e]);
    }), this.config.enablePrediction && this.optimizeWithPrediction(t);
  }
  /**
   * 去重任务
   */
  deduplicateTasks(t) {
    const e = /* @__PURE__ */ new Set();
    return t.filter((s) => {
      const a = `${s.type}:${s.targetId}`;
      return e.has(a) ? !1 : (e.add(a), !0);
    });
  }
  /**
   * 基于预测优化加载计划
   */
  optimizeWithPrediction(t) {
    this.analyzeLoadHistory().forEach((s) => {
      const a = this.findTaskInOnDemand(t, s);
      a && t.preloadTasks.push({
        ...a,
        phase: "preload",
        priority: this.calculateDataSourcePriority("preload")
      });
    });
  }
  /**
   * 分析加载历史
   */
  analyzeLoadHistory() {
    const t = /* @__PURE__ */ new Map();
    return this.loadHistory.forEach((e) => {
      const s = t.get(e.taskId) || 0;
      t.set(e.taskId, s + 1);
    }), Array.from(t.entries()).filter(([e, s]) => s >= 3).sort(([e, s], [a, i]) => i - s).slice(0, 5).map(([e]) => e);
  }
  /**
   * 在按需加载任务中查找任务
   */
  findTaskInOnDemand(t, e) {
    for (const s of Object.values(t.onDemandTasks)) {
      const a = s.find((i) => i.targetId === e);
      if (a) return a;
    }
  }
  /**
   * 按优先级和依赖关系排序任务
   */
  sortTasksByPriorityAndDependencies(t) {
    const e = [...t];
    return e.sort((s, a) => {
      var i, r;
      return (i = s.dependencies) != null && i.includes(a.targetId) ? 1 : (r = a.dependencies) != null && r.includes(s.targetId) ? -1 : a.priority - s.priority;
    }), e;
  }
  /**
   * 执行任务列表
   */
  async executeTasks(t, e = !1) {
    const s = [], a = e ? this.config.maxConcurrency * 2 : this.config.maxConcurrency;
    for (let i = 0; i < t.length; i += a) {
      const n = t.slice(i, i + a).map((c) => this.executeTask(c)), o = await Promise.all(n);
      s.push(...o);
    }
    return this.loadHistory.push(...s), this.loadHistory.length > 1e3 && (this.loadHistory = this.loadHistory.slice(-500)), s;
  }
  /**
   * 执行单个任务
   */
  async executeTask(t) {
    const e = Date.now();
    try {
      if (t.type === "dataSource") {
        const s = await this.dataLoader.loadSingle(t.targetId);
        return {
          taskId: t.id,
          success: s.success,
          duration: Date.now() - e,
          error: s.error,
          fromCache: s.fromCache
        };
      } else
        return {
          taskId: t.id,
          success: !0,
          duration: Date.now() - e
        };
    } catch (s) {
      return {
        taskId: t.id,
        success: !1,
        duration: Date.now() - e,
        error: s instanceof Error ? s.message : "任务执行失败"
      };
    }
  }
  /**
   * 获取加载统计信息
   */
  getLoadStats() {
    const t = this.loadHistory.length, e = this.loadHistory.filter((r) => r.success).length, s = t > 0 ? this.loadHistory.reduce((r, n) => r + n.duration, 0) / t : 0, a = this.loadHistory.filter((r) => r.fromCache).length, i = t > 0 ? a / t : 0;
    return {
      planGenerated: !!this.loadPlan,
      totalTasks: t,
      completedTasks: e,
      avgLoadTime: Math.round(s),
      cacheHitRate: Math.round(i * 100) / 100
    };
  }
  /**
   * 清空加载历史
   */
  clearHistory() {
    this.loadHistory = [];
  }
}
class w {
  constructor(t, e = {}) {
    this.expressionEngine = t, this.isInitialized = !1, this.config = {
      debug: !1,
      dataLoader: {
        timeout: 3e4,
        retryCount: 3,
        enableCache: !0,
        ...e.dataLoader
      },
      actionExecutor: {
        timeout: 3e4,
        maxConcurrency: 10,
        ...e.actionExecutor
      },
      loadStrategy: {
        maxConcurrency: 5,
        preloadDelay: 100,
        enablePrediction: !0,
        ...e.loadStrategy
      }
    }, this.componentRegistry = new d(), this.stateManager = new f({}, t), this.dataLoader = new p(
      this.stateManager,
      t,
      this.config.dataLoader
    ), this.actionExecutor = new y(
      this.stateManager,
      this.dataLoader,
      t,
      this.config.actionExecutor
    ), this.loadStrategyManager = new m(
      this.dataLoader,
      this.config.loadStrategy
    ), this.config.debug && console.log("RenderEngine initialized with config:", this.config);
  }
  /**
   * 初始化页面Schema
   */
  async initialize(t) {
    var s;
    const e = Date.now();
    try {
      this.config.debug && console.log("开始初始化页面Schema:", t.metadata), this.validateSchema(t), this.currentSchema = t, this.stateManager.reset(t.initialState), this.dataLoader.registerDataSources(t.dataSource), this.actionExecutor.registerActions(t.actions);
      const a = this.loadStrategyManager.analyzeStrategy(
        t.loadStrategy,
        t.components
      ), r = (await this.loadStrategyManager.executeInitialLoad()).filter((c) => c.success).length, n = this.componentRegistry.validateComponentDefinition(
        t.components[t.layout.root]
      );
      n.isValid || console.warn("存在未注册的组件类型:", n.missingTypes), (s = t.lifecycle) != null && s.onLoad && await Promise.all(
        t.lifecycle.onLoad.map(
          (c) => this.actionExecutor.execute(c)
        )
      ), this.loadStrategyManager.executePreload().catch((c) => {
        console.warn("预加载失败:", c);
      }), this.isInitialized = !0;
      const o = {
        success: !0,
        duration: Date.now() - e,
        loadedDataSources: r,
        registeredComponents: this.componentRegistry.getStats().componentCount
      };
      return this.config.debug && console.log("页面初始化完成:", o), o;
    } catch (a) {
      const i = a instanceof Error ? a.message : "初始化失败";
      return this.config.debug && console.error("页面初始化失败:", a), {
        success: !1,
        duration: Date.now() - e,
        error: i,
        loadedDataSources: 0,
        registeredComponents: 0
      };
    }
  }
  /**
   * 获取当前页面Schema
   */
  getCurrentSchema() {
    return this.currentSchema;
  }
  /**
   * 检查是否已初始化
   */
  getInitializationStatus() {
    return this.isInitialized;
  }
  /**
   * 动态更新组件
   */
  async updateComponent(t, e) {
    if (!this.currentSchema)
      throw new Error("渲染引擎未初始化");
    if (this.currentSchema.components[t] = e, e.dataBinding) {
      const s = Object.values(e.dataBinding).filter((a) => typeof a == "string");
      for (const a of s)
        this.currentSchema.dataSource[a] && await this.dataLoader.loadSingle(a);
    }
    this.config.debug && console.log(`组件 ${t} 已更新`);
  }
  /**
   * 动态添加数据源
   */
  async addDataSource(t, e) {
    if (!this.currentSchema)
      throw new Error("渲染引擎未初始化");
    this.currentSchema.dataSource[t] = e, this.dataLoader.registerDataSource(t, e), this.config.debug && console.log(`数据源 ${t} 已添加`);
  }
  /**
   * 动态添加行为
   */
  addAction(t, e) {
    if (!this.currentSchema)
      throw new Error("渲染引擎未初始化");
    this.currentSchema.actions[t] = e, this.actionExecutor.registerAction(t, e), this.config.debug && console.log(`行为 ${t} 已添加`);
  }
  /**
   * 执行按需加载
   */
  async executeOnDemandLoad(t) {
    if (!this.isInitialized)
      throw new Error("渲染引擎未初始化");
    await this.loadStrategyManager.executeOnDemandLoad(t), this.config.debug && console.log(`按需加载已完成: ${t}`);
  }
  /**
   * 销毁渲染引擎
   */
  async destroy() {
    var t, e;
    this.config.debug && console.log("开始销毁渲染引擎..."), (e = (t = this.currentSchema) == null ? void 0 : t.lifecycle) != null && e.onUnload && await Promise.all(
      this.currentSchema.lifecycle.onUnload.map(
        (s) => this.actionExecutor.execute(s)
      )
    ), this.stateManager.clearSubscriptions(), this.dataLoader.clearCache(), this.componentRegistry.clear(), this.loadStrategyManager.clearHistory(), this.currentSchema = void 0, this.isInitialized = !1, this.config.debug && console.log("渲染引擎已销毁");
  }
  /**
   * 获取引擎统计信息
   */
  getStats() {
    var t, e, s;
    return {
      initialized: this.isInitialized,
      currentPageId: (t = this.currentSchema) == null ? void 0 : t.metadata.pageId,
      components: this.componentRegistry.getStats().componentCount,
      dataSources: Object.keys(((e = this.currentSchema) == null ? void 0 : e.dataSource) || {}).length,
      actions: Object.keys(((s = this.currentSchema) == null ? void 0 : s.actions) || {}).length,
      loadStats: this.loadStrategyManager.getLoadStats(),
      executionStats: this.actionExecutor.getExecutionStats()
    };
  }
  /**
   * 验证Schema
   */
  validateSchema(t) {
    var e, s;
    if (!((e = t.metadata) != null && e.pageId))
      throw new Error("Schema必须包含有效的页面ID");
    if (!((s = t.layout) != null && s.root))
      throw new Error("Schema必须包含根布局组件");
    if (!t.components[t.layout.root])
      throw new Error("根布局组件在components中未找到");
  }
}
const S = "1.0.0";
function E(l, t) {
  const e = new w(l, t), s = h.getRegisteredTypes();
  return s.forEach((a) => {
    const i = h.getRegistration(a);
    i && e.componentRegistry.register(i);
  }), t != null && t.debug && console.log("🔧 Copied components from defaultComponentRegistry:", s), e;
}
export {
  y as ActionExecutor,
  d as ComponentRegistry,
  p as DataLoader,
  m as LoadStrategyManager,
  w as RenderEngine,
  f as StateManager,
  S as VERSION,
  E as createRenderEngine,
  h as defaultComponentRegistry
};
