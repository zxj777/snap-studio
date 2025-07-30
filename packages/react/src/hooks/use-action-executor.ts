import { useCallback, useState } from 'react';
import type { ActionExecutor, ActionExecutionResult, ActionExecutionContext } from '@snap-studio/core';

/**
 * 行为执行状态
 */
export interface ActionExecutionState {
  /** 是否正在执行 */
  isExecuting: boolean;
  /** 最后执行结果 */
  lastResult: ActionExecutionResult | null;
  /** 执行错误 */
  error: string | null;
  /** 执行历史 */
  history: ActionExecutionResult[];
}

/**
 * 行为执行Hook返回值
 */
export interface UseActionExecutorReturn {
  /** 执行行为 */
  execute: (actionId: string, context?: ActionExecutionContext) => Promise<ActionExecutionResult>;
  /** 执行状态 */
  state: ActionExecutionState;
  /** 清空历史记录 */
  clearHistory: () => void;
  /** 重试最后失败的行为 */
  retryLast: () => Promise<ActionExecutionResult | null>;
}

/**
 * 行为执行Hook
 * 用于在React组件中执行渲染引擎的行为
 * 
 * @param actionExecutor 行为执行器实例
 * @param options 配置选项
 * 
 * @example
 * ```tsx
 * function UserActions({ engine }) {
 *   const { execute, state } = useActionExecutor(engine.actionExecutor, {
 *     maxHistory: 10
 *   });
 *   
 *   const handleSave = async () => {
 *     const result = await execute('act_save_user', {
 *       payload: { userId: 123 }
 *     });
 *     
 *     if (result.success) {
 *       console.log('保存成功');
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={handleSave}
 *         disabled={state.isExecuting}
 *       >
 *         {state.isExecuting ? '保存中...' : '保存'}
 *       </button>
 *       
 *       {state.error && (
 *         <div className="error">{state.error}</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useActionExecutor(
  actionExecutor: ActionExecutor | null,
  options: {
    /** 最大历史记录数 */
    maxHistory?: number;
    /** 是否自动清除错误 */
    autoClearError?: boolean;
    /** 错误清除延迟（毫秒） */
    errorClearDelay?: number;
  } = {}
): UseActionExecutorReturn {
  const { 
    maxHistory = 50, 
    autoClearError = true, 
    errorClearDelay = 5000 
  } = options;
  
  const [state, setState] = useState<ActionExecutionState>({
    isExecuting: false,
    lastResult: null,
    error: null,
    history: []
  });
  
  /**
   * 执行行为
   */
  const execute = useCallback(async (
    actionId: string, 
    context: ActionExecutionContext = {}
  ): Promise<ActionExecutionResult> => {
    if (!actionExecutor) {
      const errorResult: ActionExecutionResult = {
        actionId,
        success: false,
        error: 'ActionExecutor not available'
      };
      
      setState(prev => ({
        ...prev,
        lastResult: errorResult,
        error: errorResult.error || null
      }));
      
      return errorResult;
    }
    
    // 设置执行状态
    setState(prev => ({
      ...prev,
      isExecuting: true,
      error: null
    }));
    
    try {
      const result = await actionExecutor.execute(actionId, context);
      
      // 更新状态
      setState(prev => {
        const newHistory = [...prev.history, result];
        
        // 限制历史记录长度
        if (newHistory.length > maxHistory) {
          newHistory.splice(0, newHistory.length - maxHistory);
        }
        
        return {
          ...prev,
          isExecuting: false,
          lastResult: result,
          error: result.success ? null : (result.error || '执行失败'),
          history: newHistory
        };
      });
      
      // 自动清除错误
      if (!result.success && autoClearError) {
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            error: null
          }));
        }, errorClearDelay);
      }
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '执行异常';
      const errorResult: ActionExecutionResult = {
        actionId,
        success: false,
        error: errorMessage
      };
      
      setState(prev => ({
        ...prev,
        isExecuting: false,
        lastResult: errorResult,
        error: errorMessage,
        history: [...prev.history, errorResult]
      }));
      
      // 自动清除错误
      if (autoClearError) {
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            error: null
          }));
        }, errorClearDelay);
      }
      
      return errorResult;
    }
  }, [actionExecutor, maxHistory, autoClearError, errorClearDelay]);
  
  /**
   * 清空历史记录
   */
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
      error: null
    }));
  }, []);
  
  /**
   * 重试最后失败的行为
   */
  const retryLast = useCallback(async (): Promise<ActionExecutionResult | null> => {
    const lastResult = state.lastResult;
    
    if (!lastResult || lastResult.success) {
      return null;
    }
    
    return await execute(lastResult.actionId, {
      isRetry: true
    });
  }, [state.lastResult, execute]);
  
  return {
    execute,
    state,
    clearHistory,
    retryLast
  };
}

/**
 * 批量行为执行Hook
 * 用于批量执行多个行为
 */
export function useBatchActionExecutor(
  actionExecutor: ActionExecutor | null
): {
  executeBatch: (actions: Array<{ id: string; context?: ActionExecutionContext }>) => Promise<ActionExecutionResult[]>;
  isExecuting: boolean;
  results: ActionExecutionResult[];
} {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<ActionExecutionResult[]>([]);
  
  const executeBatch = useCallback(async (
    actions: Array<{ id: string; context?: ActionExecutionContext }>
  ): Promise<ActionExecutionResult[]> => {
    if (!actionExecutor) {
      return actions.map(action => ({
        actionId: action.id,
        success: false,
        error: 'ActionExecutor not available'
      }));
    }
    
    setIsExecuting(true);
    
    try {
      const promises = actions.map(action => 
        actionExecutor.execute(action.id, action.context)
      );
      
      const batchResults = await Promise.all(promises);
      setResults(batchResults);
      
      return batchResults;
    } finally {
      setIsExecuting(false);
    }
  }, [actionExecutor]);
  
  return {
    executeBatch,
    isExecuting,
    results
  };
}