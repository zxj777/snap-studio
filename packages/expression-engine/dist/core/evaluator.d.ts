import type { ExpressionContext, EvaluationResult, ExpressionEngineConfig } from '../types/expression.js';
/**
 * 基于jexl的表达式求值器
 */
export declare class ExpressionEvaluator {
    private jexlInstance;
    private config;
    constructor(config?: ExpressionEngineConfig);
    /**
     * 求值单个表达式
     */
    evaluate(expression: string, context: ExpressionContext): Promise<EvaluationResult>;
    /**
     * 同步求值（适用于简单表达式）
     */
    evaluateSync(expression: string, context: ExpressionContext): EvaluationResult;
    /**
     * 设置内置转换函数
     */
    private setupBuiltinTransforms;
    /**
     * 设置自定义转换函数
     */
    private setupCustomTransforms;
    /**
     * 添加自定义转换函数
     */
    addTransform(name: string, fn: Function): void;
    /**
     * 添加自定义二元操作符
     */
    addBinaryOp(operator: string, precedence: number, fn: Function): void;
}
//# sourceMappingURL=evaluator.d.ts.map