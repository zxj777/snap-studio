import jexl from 'jexl';
import type { 
  ExpressionContext, 
  EvaluationResult, 
  ExpressionEngineConfig 
} from '../types/expression.js';

/**
 * 基于jexl的表达式求值器
 */
export class ExpressionEvaluator {
  private jexlInstance: any;
  private config: ExpressionEngineConfig;
  
  constructor(config: ExpressionEngineConfig = {}) {
    this.config = config;
    this.jexlInstance = new jexl.Jexl();
    this.setupBuiltinTransforms();
    this.setupCustomTransforms();
  }
  
  /**
   * 求值单个表达式
   */
  async evaluate(expression: string, context: ExpressionContext): Promise<EvaluationResult> {
    try {
      if (this.config.debug) {
        console.log('Evaluating expression:', expression, 'with context:', context);
      }
      
      const value = await this.jexlInstance.eval(expression, context);
      
      return {
        success: true,
        value
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '表达式求值失败';
      
      if (this.config.debug) {
        console.error('Expression evaluation failed:', expression, errorMessage);
      }
      
      return {
        success: false,
        value: undefined,
        error: errorMessage
      };
    }
  }
  
  /**
   * 同步求值（适用于简单表达式）
   */
  evaluateSync(expression: string, context: ExpressionContext): EvaluationResult {
    try {
      const value = this.jexlInstance.evalSync(expression, context);
      return {
        success: true,
        value
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '表达式求值失败';
      return {
        success: false,
        value: undefined,
        error: errorMessage
      };
    }
  }
  
  /**
   * 设置内置转换函数
   */
  private setupBuiltinTransforms(): void {
    // 数组操作
    this.jexlInstance.addTransform('length', (val: any[]) => val?.length || 0);
    this.jexlInstance.addTransform('first', (val: any[]) => val?.[0]);
    this.jexlInstance.addTransform('last', (val: any[]) => val?.[val.length - 1]);
    this.jexlInstance.addTransform('join', (val: any[], separator = ',') => val?.join(separator) || '');
    
    // 字符串操作
    this.jexlInstance.addTransform('upper', (val: string) => val?.toString().toUpperCase() || '');
    this.jexlInstance.addTransform('lower', (val: string) => val?.toString().toLowerCase() || '');
    this.jexlInstance.addTransform('trim', (val: string) => val?.toString().trim() || '');
    
    // 数字操作
    this.jexlInstance.addTransform('round', (val: number, digits = 0) => {
      const num = Number(val);
      return isNaN(num) ? 0 : Number(num.toFixed(digits));
    });
    
    // 类型检查
    this.jexlInstance.addTransform('type', (val: any) => typeof val);
    this.jexlInstance.addTransform('isNull', (val: any) => val == null);
    this.jexlInstance.addTransform('isEmpty', (val: any) => {
      if (val == null) return true;
      if (typeof val === 'string') return val.length === 0;
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === 'object') return Object.keys(val).length === 0;
      return false;
    });
  }
  
  /**
   * 设置自定义转换函数
   */
  private setupCustomTransforms(): void {
    if (this.config.transforms) {
      Object.entries(this.config.transforms).forEach(([name, fn]) => {
        this.jexlInstance.addTransform(name, fn);
      });
    }
  }
  
  /**
   * 添加自定义转换函数
   */
  addTransform(name: string, fn: Function): void {
    this.jexlInstance.addTransform(name, fn);
  }
  
  /**
   * 添加自定义二元操作符
   */
  addBinaryOp(operator: string, precedence: number, fn: Function): void {
    this.jexlInstance.addBinaryOp(operator, precedence, fn);
  }
}
