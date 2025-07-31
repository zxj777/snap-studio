/**
 * 表达式解析器 - 处理模板中的表达式语法
 */
export declare class ExpressionParser {
    private static readonly EXPRESSION_REGEX;
    /**
     * 检查字符串是否包含表达式
     */
    static hasExpression(input: string): boolean;
    /**
     * 提取字符串中的所有表达式
     */
    static extractExpressions(input: string): string[];
    /**
     * 替换字符串中的表达式占位符
     */
    static replaceExpressions(template: string, replacements: Map<string, any>): string;
    /**
     * 检查是否为纯表达式（整个字符串就是一个表达式）
     */
    static isPureExpression(input: string): boolean;
    /**
     * 提取纯表达式的内容
     */
    static extractPureExpression(input: string): string | null;
}
