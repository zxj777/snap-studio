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
export declare function useActionExecutor(actionExecutor: ActionExecutor | null, options?: {
    /** 最大历史记录数 */
    maxHistory?: number;
    /** 是否自动清除错误 */
    autoClearError?: boolean;
    /** 错误清除延迟（毫秒） */
    errorClearDelay?: number;
}): UseActionExecutorReturn;
/**
 * 批量行为执行Hook
 * 用于批量执行多个行为
 */
export declare function useBatchActionExecutor(actionExecutor: ActionExecutor | null): {
    executeBatch: (actions: Array<{
        id: string;
        context?: ActionExecutionContext;
    }>) => Promise<ActionExecutionResult[]>;
    isExecuting: boolean;
    results: ActionExecutionResult[];
};
//# sourceMappingURL=use-action-executor.d.ts.map