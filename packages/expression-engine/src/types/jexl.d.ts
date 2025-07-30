declare module 'jexl' {
  interface JexlInstance {
    eval(expression: string, context?: any): Promise<any>;
    evalSync(expression: string, context?: any): any;
    addTransform(name: string, fn: Function): void;
    addBinaryOp(operator: string, precedence: number, fn: Function): void;
  }
  
  class Jexl {
    constructor();
    eval(expression: string, context?: any): Promise<any>;
    evalSync(expression: string, context?: any): any;
    addTransform(name: string, fn: Function): void;
    addBinaryOp(operator: string, precedence: number, fn: Function): void;
  }
  
  const jexl: {
    Jexl: typeof Jexl;
  };
  
  export default jexl;
} 