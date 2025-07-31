import type { ExpressionContext, ExpressionEngineConfig } from './types/expression.js';
export type { ExpressionContext, EvaluationResult, ExpressionEngineConfig } from './types/expression.js';
export { ExpressionParser } from './core/parser.js';
export { ExpressionEvaluator } from './core/evaluator.js';
export { ContextManager } from './core/context.js';
/**
 * 便捷的表达式引擎门面类
 */
export declare class ExpressionEngine {
    private evaluator;
    constructor(config?: ExpressionEngineConfig);
    /**
     * 处理模板字符串中的表达式
     *
     * @example
     * const engine = new ExpressionEngine();
     * const result = await engine.process(
     *   "Hello {{state.user.name}}! 您有 {{state.notifications | length}} 条消息",
     *   { state: { user: { name: "张三" }, notifications: [1, 2, 3] } }
     * );
     * // 返回: "Hello 张三! 您有 3 条消息"
     */
    process(template: string, context: ExpressionContext): Promise<string>;
    /**
     * 同步处理模板（适用于简单表达式）
     */
    processSync(template: string, context: ExpressionContext): string;
    /**
     * 求值单个表达式
     */
    evaluate(expression: string, context: ExpressionContext): Promise<any>;
    /**
     * 同步求值单个表达式
     */
    evaluateSync(expression: string, context: ExpressionContext): any;
    /**
     * 添加自定义转换函数
     */
    addTransform(name: string, fn: Function): void;
    /**
     * 添加自定义操作符
     */
    addOperator(operator: string, precedence: number, fn: Function): void;
    /**
     * 创建新的引擎实例
     */
    static create(config?: ExpressionEngineConfig): ExpressionEngine;
}
/**
 * 默认引擎实例（便于快速使用）
 */
export declare const defaultEngine: ExpressionEngine;
