import type { ExpressionContext } from '../types/expression.js';
/**
 * 表达式上下文管理器
 */
export declare class ContextManager {
    /**
     * 创建标准化的表达式上下文
     */
    static createContext(data?: Partial<ExpressionContext>): ExpressionContext;
    /**
     * 合并多个上下文
     */
    static mergeContext(base: ExpressionContext, ...overrides: Partial<ExpressionContext>[]): ExpressionContext;
    /**
     * 创建局部上下文（继承父上下文）
     */
    static createScopedContext(parentContext: ExpressionContext, localData: Record<string, any>): ExpressionContext;
    /**
     * 安全地获取上下文中的值
     */
    static safeGet(context: ExpressionContext, path: string, defaultValue?: any): any;
    /**
     * 验证上下文结构
     */
    static validateContext(context: any): context is ExpressionContext;
}
