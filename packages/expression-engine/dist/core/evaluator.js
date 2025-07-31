import jexl from 'jexl';
/**
 * 基于jexl的表达式求值器
 */
export class ExpressionEvaluator {
    constructor(config = {}) {
        this.config = config;
        this.jexlInstance = new jexl.Jexl();
        this.setupBuiltinTransforms();
        this.setupCustomTransforms();
    }
    /**
     * 求值单个表达式
     */
    async evaluate(expression, context) {
        try {
            if (this.config.debug) {
                console.log('Evaluating expression:', expression, 'with context:', context);
            }
            const value = await this.jexlInstance.eval(expression, context);
            return {
                success: true,
                value
            };
        }
        catch (error) {
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
    evaluateSync(expression, context) {
        try {
            const value = this.jexlInstance.evalSync(expression, context);
            return {
                success: true,
                value
            };
        }
        catch (error) {
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
    setupBuiltinTransforms() {
        // 数组操作
        this.jexlInstance.addTransform('length', (val) => val?.length || 0);
        this.jexlInstance.addTransform('first', (val) => val?.[0]);
        this.jexlInstance.addTransform('last', (val) => val?.[val.length - 1]);
        this.jexlInstance.addTransform('join', (val, separator = ',') => val?.join(separator) || '');
        // 字符串操作
        this.jexlInstance.addTransform('upper', (val) => val?.toString().toUpperCase() || '');
        this.jexlInstance.addTransform('lower', (val) => val?.toString().toLowerCase() || '');
        this.jexlInstance.addTransform('trim', (val) => val?.toString().trim() || '');
        // 数字操作
        this.jexlInstance.addTransform('round', (val, digits = 0) => {
            const num = Number(val);
            return isNaN(num) ? 0 : Number(num.toFixed(digits));
        });
        // 类型检查
        this.jexlInstance.addTransform('type', (val) => typeof val);
        this.jexlInstance.addTransform('isNull', (val) => val == null);
        this.jexlInstance.addTransform('isEmpty', (val) => {
            if (val == null)
                return true;
            if (typeof val === 'string')
                return val.length === 0;
            if (Array.isArray(val))
                return val.length === 0;
            if (typeof val === 'object')
                return Object.keys(val).length === 0;
            return false;
        });
    }
    /**
     * 设置自定义转换函数
     */
    setupCustomTransforms() {
        if (this.config.transforms) {
            Object.entries(this.config.transforms).forEach(([name, fn]) => {
                this.jexlInstance.addTransform(name, fn);
            });
        }
    }
    /**
     * 添加自定义转换函数
     */
    addTransform(name, fn) {
        this.jexlInstance.addTransform(name, fn);
    }
    /**
     * 添加自定义二元操作符
     */
    addBinaryOp(operator, precedence, fn) {
        this.jexlInstance.addBinaryOp(operator, precedence, fn);
    }
}
