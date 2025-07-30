import type { ExpressionEngine } from '@snap-studio/expression-engine';

/**
 * 状态更新类型
 */
export type StateUpdateType = 'SET' | 'MERGE' | 'DELETE' | 'ARRAY_PUSH' | 'ARRAY_REMOVE';

/**
 * 状态更新操作
 */
export interface StateUpdate {
  /** 更新类型 */
  type: StateUpdateType;
  /** 状态路径 */
  path: string;
  /** 更新值 */
  value?: any;
  /** 额外选项 */
  options?: {
    /** 是否触发订阅者通知 */
    silent?: boolean;
    /** 是否深度合并（仅对 MERGE 有效） */
    deep?: boolean;
  };
}

/**
 * 状态订阅者
 */
export type StateSubscriber = (newState: any, oldState: any, path: string) => void;

/**
 * 状态订阅信息
 */
interface StateSubscription {
  /** 订阅ID */
  id: string;
  /** 监听的路径模式 */
  pathPattern: string;
  /** 回调函数 */
  callback: StateSubscriber;
  /** 是否只触发一次 */
  once?: boolean;
}

/**
 * 响应式状态管理器
 * 提供全局状态管理和订阅机制
 */
export class StateManager {
  private state: Record<string, any> = {};
  private subscriptions = new Map<string, StateSubscription>();
  public expressionEngine?: ExpressionEngine;
  private subscriptionIdCounter = 0;
  
  constructor(initialState: Record<string, any> = {}, expressionEngine?: ExpressionEngine) {
    this.state = { ...initialState };
    this.expressionEngine = expressionEngine;
  }
  
  /**
   * 获取状态值
   */
  get(path?: string): any {
    if (!path || path === '') {
      return this.state;
    }
    
    return this.getValueByPath(this.state, path);
  }
  
  /**
   * 设置状态值
   */
  set(path: string, value: any, options?: StateUpdate['options']): void {
    this.updateState({
      type: 'SET',
      path,
      value,
      options
    });
  }
  
  /**
   * 合并状态值（适用于对象）
   */
  merge(path: string, value: Record<string, any>, options?: StateUpdate['options']): void {
    this.updateState({
      type: 'MERGE',
      path,
      value,
      options
    });
  }
  
  /**
   * 删除状态值
   */
  delete(path: string, options?: StateUpdate['options']): void {
    this.updateState({
      type: 'DELETE',
      path,
      options
    });
  }
  
  /**
   * 数组操作：添加元素
   */
  arrayPush(path: string, value: any, options?: StateUpdate['options']): void {
    this.updateState({
      type: 'ARRAY_PUSH',
      path,
      value,
      options
    });
  }
  
  /**
   * 数组操作：移除元素
   */
  arrayRemove(path: string, value: any, options?: StateUpdate['options']): void {
    this.updateState({
      type: 'ARRAY_REMOVE',
      path,
      value,
      options
    });
  }
  
  /**
   * 批量更新状态
   */
  batchUpdate(updates: StateUpdate[]): void {
    const oldState = { ...this.state };
    
    updates.forEach(update => {
      this.performUpdate(update);
    });
    
    // 批量更新完成后统一通知订阅者
    this.notifySubscribers(this.state, oldState, '');
  }
  
  /**
   * 订阅状态变化
   */
  subscribe(pathPattern: string, callback: StateSubscriber, options?: { once?: boolean }): string {
    const id = `sub_${++this.subscriptionIdCounter}`;
    
    this.subscriptions.set(id, {
      id,
      pathPattern,
      callback,
      once: options?.once
    });
    
    return id;
  }
  
  /**
   * 取消订阅
   */
  unsubscribe(id: string): boolean {
    return this.subscriptions.delete(id);
  }
  
  /**
   * 清空所有订阅
   */
  clearSubscriptions(): void {
    this.subscriptions.clear();
  }
  
  /**
   * 计算属性求值
   */
  async computeValue(expression: string): Promise<any> {
    if (!this.expressionEngine) {
      throw new Error('Expression engine not configured');
    }
    
    const context = {
      state: this.state,
      // 可以添加其他上下文
    };
    
    return await this.expressionEngine.evaluate(expression, context);
  }
  
  /**
   * 获取状态快照
   */
  getSnapshot(): Record<string, any> {
    return JSON.parse(JSON.stringify(this.state));
  }
  
  /**
   * 重置状态
   */
  reset(newState?: Record<string, any>): void {
    const oldState = { ...this.state };
    this.state = newState ? { ...newState } : {};
    this.notifySubscribers(this.state, oldState, '');
  }
  
  /**
   * 执行状态更新
   */
  private updateState(update: StateUpdate): void {
    const oldState = { ...this.state };
    this.performUpdate(update);
    
    if (!update.options?.silent) {
      this.notifySubscribers(this.state, oldState, update.path);
    }
  }
  
  /**
   * 执行具体的更新操作
   */
  private performUpdate(update: StateUpdate): void {
    const { type, path, value, options } = update;
    
    switch (type) {
      case 'SET':
        this.setValueByPath(this.state, path, value);
        break;
        
      case 'MERGE':
        const currentValue = this.getValueByPath(this.state, path);
        if (typeof currentValue === 'object' && typeof value === 'object') {
          const mergedValue = options?.deep 
            ? this.deepMerge(currentValue, value)
            : { ...currentValue, ...value };
          this.setValueByPath(this.state, path, mergedValue);
        } else {
          this.setValueByPath(this.state, path, value);
        }
        break;
        
      case 'DELETE':
        this.deleteValueByPath(this.state, path);
        break;
        
      case 'ARRAY_PUSH':
        const arrayValue = this.getValueByPath(this.state, path);
        if (Array.isArray(arrayValue)) {
          arrayValue.push(value);
        }
        break;
        
      case 'ARRAY_REMOVE':
        const array = this.getValueByPath(this.state, path);
        if (Array.isArray(array)) {
          const index = array.indexOf(value);
          if (index > -1) {
            array.splice(index, 1);
          }
        }
        break;
    }
  }
  
  /**
   * 通知订阅者
   */
  private notifySubscribers(newState: any, oldState: any, changedPath: string): void {
    const subscriptionsToRemove: string[] = [];
    
    this.subscriptions.forEach((subscription) => {
      if (this.pathMatches(changedPath, subscription.pathPattern)) {
        try {
          subscription.callback(newState, oldState, changedPath);
          
          if (subscription.once) {
            subscriptionsToRemove.push(subscription.id);
          }
        } catch (error) {
          console.error('State subscription callback error:', error);
        }
      }
    });
    
    // 移除一次性订阅
    subscriptionsToRemove.forEach(id => {
      this.subscriptions.delete(id);
    });
  }
  
  /**
   * 根据路径获取值
   */
  private getValueByPath(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current == null) return undefined;
      current = current[key];
    }
    
    return current;
  }
  
  /**
   * 根据路径设置值
   */
  private setValueByPath(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const key of keys) {
      if (current[key] == null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  }
  
  /**
   * 根据路径删除值
   */
  private deleteValueByPath(obj: any, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const key of keys) {
      if (current[key] == null) return;
      current = current[key];
    }
    
    delete current[lastKey];
  }
  
  /**
   * 深度合并对象
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && typeof target[key] === 'object') {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }
  
  /**
   * 检查路径是否匹配模式
   */
  private pathMatches(path: string, pattern: string): boolean {
    if (pattern === '*' || pattern === '') return true;
    if (pattern === path) return true;
    
    // 支持通配符 *
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$'
    );
    
    return regex.test(path);
  }
}