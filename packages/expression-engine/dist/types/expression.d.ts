/**
 * 表达式上下文 - 表达式执行时可访问的数据
 */
export interface ExpressionContext {
    /** 全局状态 */
    state: Record<string, any>;
    /** 组件属性 */
    props?: Record<string, any>;
    /** 主题变量 */
    theme?: Record<string, any>;
    /** 工具函数 */
    utils?: Record<string, any>;
    /** 国际化函数 */
    i18n?: Record<string, any>;
}
/**
 * 表达式求值结果
 */
export interface EvaluationResult {
    success: boolean;
    value: any;
    error?: string;
}
/**
 * 表达式引擎配置
 */
export interface ExpressionEngineConfig {
    /** 是否启用调试模式 */
    debug?: boolean;
    /** 自定义函数 */
    transforms?: Record<string, Function>;
    /** 表达式超时时间（毫秒） */
    timeout?: number;
}
