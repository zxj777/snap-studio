import type { 
  ActionDefinition,
  UpdateStateConfig,
  FetchDataConfig,
  NavigateConfig,
  ShowMessageConfig,
  ModalConfig,
  ApiCallConfig,
  CompositeConfig,
  ConditionalConfig,
  LoopConfig
} from '@snap-studio/schema';
import type { ExpressionEngine } from '@snap-studio/expression-engine';
import type { StateManager } from '../state/state-manager.js';
import type { DataLoader } from '../data/data-loader.js';

/**
 * 行为执行结果
 */
export interface ActionExecutionResult {
  /** 行为ID */
  actionId: string;
  /** 是否成功 */
  success: boolean;
  /** 返回值 */
  result?: any;
  /** 错误信息 */
  error?: string;
  /** 执行耗时（毫秒） */
  duration?: number;
  /** 子行为结果（适用于组合行为） */
  subResults?: ActionExecutionResult[];
}

/**
 * 行为执行上下文
 */
export interface ActionExecutionContext {
  /** 触发事件 */
  event?: Event;
  /** 触发元素 */
  target?: any;
  /** 额外数据 */
  payload?: any;
  /** 是否为重试执行 */
  isRetry?: boolean;
}

/**
 * 行为执行器配置
 */
export interface ActionExecutorConfig {
  /** 默认超时时间（毫秒） */
  timeout?: number;
  /** 启用调试模式 */
  debug?: boolean;
  /** 最大并发执行数 */
  maxConcurrency?: number;
}

/**
 * 行为执行器
 * 处理用户交互事件和执行 actions 中定义的逻辑
 */
export class ActionExecutor {
  private actions = new Map<string, ActionDefinition>();
  private executingActions = new Set<string>();
  private config: Required<ActionExecutorConfig>;
  private concurrentCount = 0;
  
  constructor(
    private stateManager: StateManager,
    private dataLoader: DataLoader,
    private expressionEngine: ExpressionEngine,
    config: ActionExecutorConfig = {}
  ) {
    this.config = {
      timeout: 30000,
      debug: false,
      maxConcurrency: 10,
      ...config
    };
  }
  
  /**
   * 注册行为
   */
  registerAction(id: string, definition: ActionDefinition): void {
    this.actions.set(id, definition);
  }
  
  /**
   * 批量注册行为
   */
  registerActions(actions: Record<string, ActionDefinition>): void {
    Object.entries(actions).forEach(([id, definition]) => {
      this.registerAction(id, definition);
    });
  }
  
  /**
   * 执行行为
   */
  async execute(
    actionId: string, 
    context: ActionExecutionContext = {}
  ): Promise<ActionExecutionResult> {
    if (this.concurrentCount >= this.config.maxConcurrency) {
      return {
        actionId,
        success: false,
        error: '并发执行数量超过限制'
      };
    }
    
    if (this.executingActions.has(actionId)) {
      return {
        actionId,
        success: false,
        error: '行为正在执行中，避免重复执行'
      };
    }
    
    const action = this.actions.get(actionId);
    if (!action) {
      return {
        actionId,
        success: false,
        error: `行为 "${actionId}" 未找到`
      };
    }
    
    this.executingActions.add(actionId);
    this.concurrentCount++;
    
    const startTime = Date.now();
    
    try {
      if (this.config.debug) {
        console.log(`执行行为: ${actionId}`, { action, context });
      }
      
      // 检查执行条件
      if (action.condition) {
        const shouldExecute = await this.evaluateCondition(action.condition, context);
        if (!shouldExecute) {
          return {
            actionId,
            success: true,
            result: 'skipped',
            duration: Date.now() - startTime
          };
        }
      }
      
      const result = await this.performAction(action, context);
      
              // 执行成功回调
        if ((action as any).onSuccess) {
          await this.execute((action as any).onSuccess, { ...context, payload: result });
      }
      
      return {
        actionId,
        success: true,
        result: result.result,
        duration: Date.now() - startTime,
        subResults: result.subResults
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '行为执行失败';
      
      if (this.config.debug) {
        console.error(`行为执行失败: ${actionId}`, error);
      }
      
      // 执行失败回调
      if (action.onError) {
        await this.execute(action.onError, { ...context, payload: { error: errorMessage } });
      }
      
      // 重试逻辑
      if (action.retry && !context.isRetry) {
        const retryResult = await this.retryAction(actionId, action, context);
        if (retryResult) {
          return retryResult;
        }
      }
      
      return {
        actionId,
        success: false,
        error: errorMessage,
        duration: Date.now() - startTime
      };
      
    } finally {
      this.executingActions.delete(actionId);
      this.concurrentCount--;
    }
  }
  
  /**
   * 执行具体的行为
   */
  private async performAction(
    action: ActionDefinition, 
    context: ActionExecutionContext
  ): Promise<{ result?: any; subResults?: ActionExecutionResult[] }> {
    switch (action.type) {
      case 'UPDATE_STATE':
        return { result: await this.executeUpdateState(action.config as UpdateStateConfig, context) };
        
      case 'FETCH_DATA':
        return { result: await this.executeFetchData(action.config as FetchDataConfig, context) };
        
      case 'NAVIGATE':
        return { result: await this.executeNavigate(action.config as NavigateConfig, context) };
        
      case 'SHOW_MESSAGE':
        return { result: await this.executeShowMessage(action.config as ShowMessageConfig, context) };
        
      case 'OPEN_MODAL':
      case 'CLOSE_MODAL':
        return { result: await this.executeModal(action.config as ModalConfig, action.type, context) };
        
      case 'CALL_API':
        return { result: await this.executeApiCall(action.config as ApiCallConfig, context) };
        
      case 'COMPOSITE':
        return await this.executeComposite(action.config as CompositeConfig, context);
        
      case 'CONDITIONAL':
        return await this.executeConditional(action.config as ConditionalConfig, context);
        
      case 'LOOP':
        return await this.executeLoop(action.config as LoopConfig, context);
        
      case 'DELAY':
        return { result: await this.executeDelay(action.config.duration, context) };
        
      default:
        throw new Error(`不支持的行为类型: ${action.type}`);
    }
  }
  
  /**
   * 执行状态更新
   */
  private async executeUpdateState(
    config: UpdateStateConfig, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { path, value, operation = 'SET' } = config as any;
    
    // 计算最终值
    const finalValue = typeof value === 'string' && value.startsWith('{{')
      ? await this.evaluateExpression(value, context)
      : value;
    
    switch (operation) {
      case 'SET':
        this.stateManager.set(path!, finalValue);
        break;
      case 'MERGE':
        this.stateManager.merge(path!, finalValue);
        break;
      case 'DELETE':
        this.stateManager.delete(path!);
        break;
      case 'ARRAY_PUSH':
        this.stateManager.arrayPush(path!, finalValue);
        break;
      case 'ARRAY_REMOVE':
        this.stateManager.arrayRemove(path!, finalValue);
        break;
    }
    
    return finalValue;
  }
  
  /**
   * 执行数据获取
   */
  private async executeFetchData(
    config: FetchDataConfig, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { dataSourceId, updateStatePath } = config;
    
    const result = await this.dataLoader.loadSingle(dataSourceId);
    
    if (result.success && updateStatePath) {
      this.stateManager.set(updateStatePath, result.data);
    }
    
    return result;
  }
  
  /**
   * 执行导航
   */
  private async executeNavigate(
    config: NavigateConfig, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { to: url, newWindow } = config;
    const target = newWindow ? '_blank' : '_self';
    const replace = config.type === 'replace';
    
    const finalUrl = typeof url === 'string' && url.includes('{{')
      ? await this.evaluateExpression(url, context)
      : url;
    
    if (replace) {
      window.location.replace(finalUrl);
    } else if (target === '_self') {
      window.location.href = finalUrl;
    } else {
      window.open(finalUrl, target);
    }
    
    return { url: finalUrl, target, replace };
  }
  
  /**
   * 执行消息显示
   */
  private async executeShowMessage(
    config: ShowMessageConfig, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { message, type = 'info', duration = 3000 } = config;
    
    const finalMessage = typeof message === 'string' && message.includes('{{')
      ? await this.evaluateExpression(message, context)
      : message;
    
    // 这里应该调用具体的消息显示组件
    console.log(`[${type.toUpperCase()}] ${finalMessage}`);
    
    return { message: finalMessage, type, duration };
  }
  
  /**
   * 执行模态框操作
   */
  private async executeModal(
    config: ModalConfig, 
    actionType: string, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { modalId, props } = config;
    
    if (actionType === 'OPEN_MODAL') {
      this.stateManager.set(`modals.${modalId}`, { open: true, ...props });
    } else {
      this.stateManager.set(`modals.${modalId}.open`, false);
    }
    
    return { modalId, actionType, props };
  }
  
  /**
   * 执行API调用
   */
  private async executeApiCall(
    config: ApiCallConfig, 
    context: ActionExecutionContext
  ): Promise<any> {
    const { url, method = 'GET', headers, body, updateStatePath } = config;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });
    
    const result = await response.json();
    
    if (updateStatePath) {
      this.stateManager.set(updateStatePath, result);
    }
    
    return result;
  }
  
  /**
   * 执行组合行为
   */
  private async executeComposite(
    config: CompositeConfig, 
    context: ActionExecutionContext
  ): Promise<{ result?: any; subResults: ActionExecutionResult[] }> {
    const { steps, parallel = false } = config;
    const subResults: ActionExecutionResult[] = [];
    
    if (parallel) {
      // 并行执行
      const promises = steps.map(step => this.execute(step, context));
      const results = await Promise.all(promises);
      subResults.push(...results);
    } else {
      // 串行执行
      for (const step of steps) {
        const result = await this.execute(step, context);
        subResults.push(result);
        
        // 如果某步失败且配置了 stopOnError，则停止执行
        if (!result.success && config.stopOnError) {
          break;
        }
      }
    }
    
    return { subResults };
  }
  
  /**
   * 执行条件行为
   */
  private async executeConditional(
    config: ConditionalConfig, 
    context: ActionExecutionContext
  ): Promise<{ result?: any; subResults?: ActionExecutionResult[] }> {
    const { condition, thenAction, elseAction } = config;
    
    const conditionResult = await this.evaluateCondition(condition, context);
    
    const actionToExecute = conditionResult ? thenAction : elseAction;
    
    if (actionToExecute) {
      const result = await this.execute(actionToExecute, context);
      return { result: result.result, subResults: [result] };
    }
    
    return { result: conditionResult };
  }
  
  /**
   * 执行循环行为
   */
  private async executeLoop(
    config: LoopConfig, 
    context: ActionExecutionContext
  ): Promise<{ result?: any; subResults: ActionExecutionResult[] }> {
    const { iterable, itemAction, maxIterations = 1000 } = config;
    const subResults: ActionExecutionResult[] = [];
    
    const items = await this.evaluateExpression(iterable, context);
    
    if (!Array.isArray(items)) {
      throw new Error('循环的可迭代对象必须是数组');
    }
    
    const iterations = Math.min(items.length, maxIterations);
    
    for (let i = 0; i < iterations; i++) {
      const itemContext = {
        ...context,
        payload: {
          ...context.payload,
          item: items[i],
          index: i,
          total: items.length
        }
      };
      
      const result = await this.execute(itemAction, itemContext);
      subResults.push(result);
    }
    
    return { result: items, subResults };
  }
  
  /**
   * 执行延迟
   */
  private async executeDelay(duration: number, context: ActionExecutionContext): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }
  
  /**
   * 重试行为执行
   */
  private async retryAction(
    actionId: string,
    action: ActionDefinition,
    context: ActionExecutionContext
  ): Promise<ActionExecutionResult | null> {
    const { retry } = action;
    if (!retry) return null;
    
    const { count = 3, delay = 1000 } = retry;
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        return await this.execute(actionId, { ...context, isRetry: true });
      } catch (error) {
        if (i === count - 1) {
          throw error;
        }
      }
    }
    
    return null;
  }
  
  /**
   * 计算表达式
   */
  private async evaluateExpression(expression: string, context: ActionExecutionContext): Promise<any> {
    const evaluationContext = {
      state: this.stateManager.get(),
      event: context.event,
      payload: context.payload,
      target: context.target
    };
    
    return await this.expressionEngine.evaluate(expression, evaluationContext);
  }
  
  /**
   * 评估条件
   */
  private async evaluateCondition(condition: string, context: ActionExecutionContext): Promise<boolean> {
    const result = await this.evaluateExpression(condition, context);
    return Boolean(result);
  }
  
  /**
   * 检查行为是否正在执行
   */
  isExecuting(actionId: string): boolean {
    return this.executingActions.has(actionId);
  }
  
  /**
   * 获取执行状态统计
   */
  getExecutionStats(): {
    concurrentCount: number;
    executingActions: string[];
    registeredActionsCount: number;
  } {
    return {
      concurrentCount: this.concurrentCount,
      executingActions: Array.from(this.executingActions),
      registeredActionsCount: this.actions.size
    };
  }
}