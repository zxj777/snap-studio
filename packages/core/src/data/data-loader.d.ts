import type { DataSourceDefinition, LoadStrategy } from '@snap-studio/schema';
import type { ExpressionEngine } from '@snap-studio/expression-engine';
import type { StateManager } from '../state/state-manager.js';
/**
 * 数据加载结果
 */
export interface DataLoadResult {
    /** 数据源ID */
    dataSourceId: string;
    /** 是否成功 */
    success: boolean;
    /** 加载的数据 */
    data?: any;
    /** 错误信息 */
    error?: string;
    /** 加载耗时（毫秒） */
    duration?: number;
    /** 缓存标识 */
    fromCache?: boolean;
}
/**
 * 数据加载配置
 */
export interface DataLoaderConfig {
    /** 请求超时时间（毫秒） */
    timeout?: number;
    /** 重试次数 */
    retryCount?: number;
    /** 重试间隔（毫秒） */
    retryDelay?: number;
    /** 启用缓存 */
    enableCache?: boolean;
    /** 缓存过期时间（毫秒） */
    cacheExpiry?: number;
}
/**
 * 数据加载器
 * 根据 LoadStrategy 智能加载数据源
 */
export declare class DataLoader {
    private stateManager;
    private expressionEngine;
    private dataSources;
    private cache;
    private loadingPromises;
    private config;
    constructor(stateManager: StateManager, expressionEngine: ExpressionEngine, config?: DataLoaderConfig);
    /**
     * 注册数据源
     */
    registerDataSource(id: string, definition: DataSourceDefinition): void;
    /**
     * 批量注册数据源
     */
    registerDataSources(dataSources: Record<string, DataSourceDefinition>): void;
    /**
     * 根据加载策略执行初始化加载
     */
    loadInitial(strategy: LoadStrategy): Promise<DataLoadResult[]>;
    /**
     * 执行预加载
     */
    preload(strategy: LoadStrategy): Promise<DataLoadResult[]>;
    /**
     * 按需加载数据
     */
    loadOnDemand(strategy: LoadStrategy, actionId: string): Promise<DataLoadResult[]>;
    /**
     * 加载单个数据源
     */
    loadSingle(dataSourceId: string): Promise<DataLoadResult>;
    /**
     * 批量加载数据源
     */
    loadMultiple(dataSourceIds: string[]): Promise<DataLoadResult[]>;
    /**
     * 执行具体的数据加载
     */
    private performLoad;
    /**
     * 加载API数据
     */
    private loadApiData;
    /**
     * 从本地存储加载数据
     */
    private loadFromStorage;
    /**
     * 加载计算属性数据
     */
    private loadComputedData;
    /**
     * 生成模拟数据
     */
    private generateMockData;
    /**
     * 应用数据转换
     */
    private applyTransform;
    /**
     * 获取缓存数据
     */
    private getCachedData;
    /**
     * 设置缓存数据
     */
    private setCachedData;
    /**
     * 清空缓存
     */
    clearCache(dataSourceId?: string): void;
    /**
     * 获取加载状态
     */
    isLoading(dataSourceId: string): boolean;
    /**
     * 获取缓存统计
     */
    getCacheStats(): {
        size: number;
        entries: Array<{
            id: string;
            timestamp: number;
            size: number;
        }>;
    };
}
//# sourceMappingURL=data-loader.d.ts.map