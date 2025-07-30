import type { LoadStrategy, ComponentDefinition } from '@snap-studio/schema';
import type { DataLoader } from '../data/data-loader.js';
/**
 * 加载阶段
 */
export type LoadPhase = 'initial' | 'preload' | 'onDemand';
/**
 * 加载任务
 */
export interface LoadTask {
    /** 任务ID */
    id: string;
    /** 任务类型 */
    type: 'component' | 'dataSource';
    /** 目标ID */
    targetId: string;
    /** 加载阶段 */
    phase: LoadPhase;
    /** 优先级 */
    priority: number;
    /** 依赖项 */
    dependencies?: string[];
}
/**
 * 加载结果
 */
export interface LoadTaskResult {
    /** 任务ID */
    taskId: string;
    /** 是否成功 */
    success: boolean;
    /** 加载耗时 */
    duration: number;
    /** 错误信息 */
    error?: string;
    /** 从缓存加载 */
    fromCache?: boolean;
}
/**
 * 加载计划
 */
export interface LoadPlan {
    /** 初始化阶段任务 */
    initialTasks: LoadTask[];
    /** 预加载阶段任务 */
    preloadTasks: LoadTask[];
    /** 按需加载任务映射 */
    onDemandTasks: Record<string, LoadTask[]>;
}
/**
 * 加载策略管理器配置
 */
export interface LoadStrategyManagerConfig {
    /** 最大并发加载数 */
    maxConcurrency?: number;
    /** 预加载延迟（毫秒） */
    preloadDelay?: number;
    /** 启用智能预测 */
    enablePrediction?: boolean;
    /** 资源优先级权重 */
    priorityWeights?: {
        critical: number;
        high: number;
        normal: number;
        low: number;
    };
}
/**
 * 加载策略管理器
 * 实现智能混合加载模式，管理组件和数据的加载时机
 */
export declare class LoadStrategyManager {
    private dataLoader;
    private config;
    private loadPlan?;
    private loadingTasks;
    private loadHistory;
    private concurrentCount;
    constructor(dataLoader: DataLoader, config?: LoadStrategyManagerConfig);
    /**
     * 分析加载策略并生成加载计划
     */
    analyzeStrategy(strategy: LoadStrategy, components: Record<string, ComponentDefinition>): LoadPlan;
    /**
     * 执行初始化加载
     */
    executeInitialLoad(): Promise<LoadTaskResult[]>;
    /**
     * 执行预加载
     */
    executePreload(): Promise<LoadTaskResult[]>;
    /**
     * 执行按需加载
     */
    executeOnDemandLoad(actionId: string): Promise<LoadTaskResult[]>;
    /**
     * 创建加载任务
     */
    private createLoadTasks;
    /**
     * 计算组件优先级
     */
    private calculatePriority;
    /**
     * 计算数据源优先级
     */
    private calculateDataSourcePriority;
    /**
     * 提取组件依赖
     */
    private extractDependencies;
    /**
     * 优化加载计划
     */
    private optimizeLoadPlan;
    /**
     * 去重任务
     */
    private deduplicateTasks;
    /**
     * 基于预测优化加载计划
     */
    private optimizeWithPrediction;
    /**
     * 分析加载历史
     */
    private analyzeLoadHistory;
    /**
     * 在按需加载任务中查找任务
     */
    private findTaskInOnDemand;
    /**
     * 按优先级和依赖关系排序任务
     */
    private sortTasksByPriorityAndDependencies;
    /**
     * 执行任务列表
     */
    private executeTasks;
    /**
     * 执行单个任务
     */
    private executeTask;
    /**
     * 获取加载统计信息
     */
    getLoadStats(): {
        planGenerated: boolean;
        totalTasks: number;
        completedTasks: number;
        avgLoadTime: number;
        cacheHitRate: number;
    };
    /**
     * 清空加载历史
     */
    clearHistory(): void;
}
//# sourceMappingURL=load-strategy-manager.d.ts.map