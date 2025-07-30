import type { ExpressionEngine } from '@snap-studio/expression-engine';
/**
 * 状态更新类型
 */
export type StateUpdateType = 'SET' | 'MERGE' | 'DELETE' | 'ARRAY_PUSH' | 'ARRAY_REMOVE';
/**
 * 状态更新操作
 */
export interface StateUpdate {
    /** 更新类型 */
    type: StateUpdateType;
    /** 状态路径 */
    path: string;
    /** 更新值 */
    value?: any;
    /** 额外选项 */
    options?: {
        /** 是否触发订阅者通知 */
        silent?: boolean;
        /** 是否深度合并（仅对 MERGE 有效） */
        deep?: boolean;
    };
}
/**
 * 状态订阅者
 */
export type StateSubscriber = (newState: any, oldState: any, path: string) => void;
/**
 * 响应式状态管理器
 * 提供全局状态管理和订阅机制
 */
export declare class StateManager {
    private state;
    private subscriptions;
    expressionEngine?: ExpressionEngine;
    private subscriptionIdCounter;
    constructor(initialState?: Record<string, any>, expressionEngine?: ExpressionEngine);
    /**
     * 获取状态值
     */
    get(path?: string): any;
    /**
     * 设置状态值
     */
    set(path: string, value: any, options?: StateUpdate['options']): void;
    /**
     * 合并状态值（适用于对象）
     */
    merge(path: string, value: Record<string, any>, options?: StateUpdate['options']): void;
    /**
     * 删除状态值
     */
    delete(path: string, options?: StateUpdate['options']): void;
    /**
     * 数组操作：添加元素
     */
    arrayPush(path: string, value: any, options?: StateUpdate['options']): void;
    /**
     * 数组操作：移除元素
     */
    arrayRemove(path: string, value: any, options?: StateUpdate['options']): void;
    /**
     * 批量更新状态
     */
    batchUpdate(updates: StateUpdate[]): void;
    /**
     * 订阅状态变化
     */
    subscribe(pathPattern: string, callback: StateSubscriber, options?: {
        once?: boolean;
    }): string;
    /**
     * 取消订阅
     */
    unsubscribe(id: string): boolean;
    /**
     * 清空所有订阅
     */
    clearSubscriptions(): void;
    /**
     * 计算属性求值
     */
    computeValue(expression: string): Promise<any>;
    /**
     * 获取状态快照
     */
    getSnapshot(): Record<string, any>;
    /**
     * 重置状态
     */
    reset(newState?: Record<string, any>): void;
    /**
     * 执行状态更新
     */
    private updateState;
    /**
     * 执行具体的更新操作
     */
    private performUpdate;
    /**
     * 通知订阅者
     */
    private notifySubscribers;
    /**
     * 根据路径获取值
     */
    private getValueByPath;
    /**
     * 根据路径设置值
     */
    private setValueByPath;
    /**
     * 根据路径删除值
     */
    private deleteValueByPath;
    /**
     * 深度合并对象
     */
    private deepMerge;
    /**
     * 检查路径是否匹配模式
     */
    private pathMatches;
}
//# sourceMappingURL=state-manager.d.ts.map