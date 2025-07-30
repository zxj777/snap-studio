/**
 * 表达式解析器 - 处理模板中的表达式语法
 */
export class ExpressionParser {
  private static readonly EXPRESSION_REGEX = /\{\{([^}]+)\}\}/g;
  
  /**
   * 检查字符串是否包含表达式
   */
  static hasExpression(input: string): boolean {
    if (typeof input !== 'string') return false;
    // 创建新的正则实例避免lastIndex问题
    const regex = new RegExp(this.EXPRESSION_REGEX.source, this.EXPRESSION_REGEX.flags);
    return regex.test(input);
  }
  
  /**
   * 提取字符串中的所有表达式
   */
  static extractExpressions(input: string): string[] {
    if (typeof input !== 'string') return [];
    
    const expressions: string[] = [];
    // 创建新的正则实例避免lastIndex问题
    const regex = new RegExp(this.EXPRESSION_REGEX.source, this.EXPRESSION_REGEX.flags);
    const matches = input.matchAll(regex);
    
    for (const match of matches) {
      expressions.push(match[1].trim());
    }
    
    return expressions;
  }
  
  /**
   * 替换字符串中的表达式占位符
   */
  static replaceExpressions(
    template: string, 
    replacements: Map<string, any>
  ): string {
    if (typeof template !== 'string') return template;
    
    // 创建新的正则实例避免lastIndex问题
    const regex = new RegExp(this.EXPRESSION_REGEX.source, this.EXPRESSION_REGEX.flags);
    return template.replace(regex, (match, expression) => {
      const trimmedExpr = expression.trim();
      if (replacements.has(trimmedExpr)) {
        const value = replacements.get(trimmedExpr);
        return value?.toString() || '';
      }
      return match; // 保持原样
    });
  }
  
  /**
   * 检查是否为纯表达式（整个字符串就是一个表达式）
   */
  static isPureExpression(input: string): boolean {
    if (typeof input !== 'string') return false;
    
    const trimmed = input.trim();
    return trimmed.startsWith('{{') && trimmed.endsWith('}}') && 
           trimmed.indexOf('{{', 2) === -1; // 确保只有一个表达式
  }
  
  /**
   * 提取纯表达式的内容
   */
  static extractPureExpression(input: string): string | null {
    if (!this.isPureExpression(input)) return null;
    
    const match = input.match(this.EXPRESSION_REGEX);
    return match ? match[1].trim() : null;
  }
}

