import { ExpressionParser } from './core/parser.js';
import { ExpressionEvaluator } from './core/evaluator.js';
import type { ExpressionContext, ExpressionEngineConfig } from './types/expression.js';

// 类型导出
export type {
  ExpressionContext,
  EvaluationResult,
  ExpressionEngineConfig
} from './types/expression.js';

// 核心类导出
export { ExpressionParser } from './core/parser.js';
export { ExpressionEvaluator } from './core/evaluator.js';
export { ContextManager } from './core/context.js';

/**
 * 便捷的表达式引擎门面类
 */
export class ExpressionEngine {
  private evaluator: ExpressionEvaluator;
  
  constructor(config: ExpressionEngineConfig = {}) {
    this.evaluator = new ExpressionEvaluator(config);
  }
  
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
  async process(template: string, context: ExpressionContext): Promise<string> {
    // 如果不是字符串或没有表达式，直接返回
    if (typeof template !== 'string' || !ExpressionParser.hasExpression(template)) {
      return template;
    }
    
    // 提取所有表达式
    const expressions = ExpressionParser.extractExpressions(template);
    const replacements = new Map<string, any>();
    
    // 并行求值所有表达式
    const evaluationPromises = expressions.map(async (expr: string) => {
      const result = await this.evaluator.evaluate(expr, context);
      return { expr, result };
    });
    
    const evaluations = await Promise.all(evaluationPromises);
    
    // 构建替换映射
    evaluations.forEach(({ expr, result }) => {
      if (result.success && result.value !== undefined) {
        replacements.set(expr, result.value);
      } else {
        // 求值失败或值为undefined时保持原表达式
        if (result.success && result.value === undefined) {
          console.warn(`表达式路径不存在: ${expr}`);
        } else {
          console.warn(`表达式求值失败: ${expr}`, result.error);
        }
      }
    });
    
    // 执行替换
    return ExpressionParser.replaceExpressions(template, replacements);
  }
  
  /**
   * 同步处理模板（适用于简单表达式）
   */
  processSync(template: string, context: ExpressionContext): string {
    if (typeof template !== 'string' || !ExpressionParser.hasExpression(template)) {
      return template;
    }
    
    const expressions = ExpressionParser.extractExpressions(template);
    const replacements = new Map<string, any>();
    
    expressions.forEach((expr) => {
      const result = this.evaluator.evaluateSync(expr, context);
      if (result.success && result.value !== undefined) {
        replacements.set(expr, result.value);
      }
    });
    
    return ExpressionParser.replaceExpressions(template, replacements);
  }
  
  /**
   * 求值单个表达式
   */
  async evaluate(expression: string, context: ExpressionContext): Promise<any> {
    const result = await this.evaluator.evaluate(expression, context);
    return result.success ? result.value : undefined;
  }
  
  /**
   * 同步求值单个表达式
   */
  evaluateSync(expression: string, context: ExpressionContext): any {
    const result = this.evaluator.evaluateSync(expression, context);
    return result.success ? result.value : undefined;
  }
  
  /**
   * 添加自定义转换函数
   */
  addTransform(name: string, fn: Function): void {
    this.evaluator.addTransform(name, fn);
  }
  
  /**
   * 添加自定义操作符
   */
  addOperator(operator: string, precedence: number, fn: Function): void {
    this.evaluator.addBinaryOp(operator, precedence, fn);
  }
  
  /**
   * 创建新的引擎实例
   */
  static create(config: ExpressionEngineConfig = {}): ExpressionEngine {
    return new ExpressionEngine(config);
  }
}

/**
 * 默认引擎实例（便于快速使用）
 */
export const defaultEngine = new ExpressionEngine();
