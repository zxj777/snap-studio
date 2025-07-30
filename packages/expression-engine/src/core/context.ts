import type { ExpressionContext } from '../types/expression.js';

/**
 * 表达式上下文管理器
 */
export class ContextManager {
  /**
   * 创建标准化的表达式上下文
   */
  static createContext(data: Partial<ExpressionContext> = {}): ExpressionContext {
    return {
      state: data.state || {},
      props: data.props || {},
      theme: data.theme || {},
      utils: data.utils || {},
      i18n: data.i18n || {}
    };
  }
  
  /**
   * 合并多个上下文
   */
  static mergeContext(
    base: ExpressionContext, 
    ...overrides: Partial<ExpressionContext>[]
  ): ExpressionContext {
    const result = { ...base };
    
    overrides.forEach(override => {
      if (override.state) result.state = { ...result.state, ...override.state };
      if (override.props) result.props = { ...result.props, ...override.props };
      if (override.theme) result.theme = { ...result.theme, ...override.theme };
      if (override.utils) result.utils = { ...result.utils, ...override.utils };
      if (override.i18n) result.i18n = { ...result.i18n, ...override.i18n };
    });
    
    return result;
  }
  
  /**
   * 创建局部上下文（继承父上下文）
   */
  static createScopedContext(
    parentContext: ExpressionContext,
    localData: Record<string, any>
  ): ExpressionContext {
    return {
      ...parentContext,
      // 局部数据可以覆盖全局状态
      state: { ...parentContext.state, ...localData }
    };
  }
  
  /**
   * 安全地获取上下文中的值
   */
  static safeGet(context: ExpressionContext, path: string, defaultValue?: any): any {
    try {
      const keys = path.split('.');
      let current: any = context;
      
      for (const key of keys) {
        if (current == null || typeof current !== 'object') {
          return defaultValue;
        }
        current = current[key];
      }
      
      return current !== undefined ? current : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  /**
   * 验证上下文结构
   */
  static validateContext(context: any): context is ExpressionContext {
    return context != null && 
           typeof context === 'object' &&
           typeof context.state === 'object';
  }
}

