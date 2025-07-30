import type { ActionDefinition } from '@snap-studio/schema';
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
export declare class ActionExecutor {
    private stateManager;
    private dataLoader;
    private expressionEngine;
    private actions;
    private executingActions;
    private config;
    private concurrentCount;
    constructor(stateManager: StateManager, dataLoader: DataLoader, expressionEngine: ExpressionEngine, config?: ActionExecutorConfig);
    /**
     * 注册行为
     */
    registerAction(id: string, definition: ActionDefinition): void;
    /**
     * 批量注册行为
     */
    registerActions(actions: Record<string, ActionDefinition>): void;
    /**
     * 执行行为
     */
    execute(actionId: string, context?: ActionExecutionContext): Promise<ActionExecutionResult>;
    /**
     * 执行具体的行为
     */
    private performAction;
    /**
     * 执行状态更新
     */
    private executeUpdateState;
    /**
     * 执行数据获取
     */
    private executeFetchData;
    /**
     * 执行导航
     */
    private executeNavigate;
    /**
     * 执行消息显示
     */
    private executeShowMessage;
    /**
     * 执行模态框操作
     */
    private executeModal;
    /**
     * 执行API调用
     */
    private executeApiCall;
    /**
     * 执行组合行为
     */
    private executeComposite;
    /**
     * 执行条件行为
     */
    private executeConditional;
    /**
     * 执行循环行为
     */
    private executeLoop;
    /**
     * 执行延迟
     */
    private executeDelay;
    /**
     * 重试行为执行
     */
    private retryAction;
    /**
     * 计算表达式
     */
    private evaluateExpression;
    /**
     * 评估条件
     */
    private evaluateCondition;
    /**
     * 检查行为是否正在执行
     */
    isExecuting(actionId: string): boolean;
    /**
     * 获取执行状态统计
     */
    getExecutionStats(): {
        concurrentCount: number;
        executingActions: string[];
        registeredActionsCount: number;
    };
}
//# sourceMappingURL=action-executor.d.ts.map