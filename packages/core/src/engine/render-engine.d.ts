import type { PageSchema, ComponentDefinition } from '@snap-studio/schema';
import type { ExpressionEngine } from '@snap-studio/expression-engine';
import { ComponentRegistry } from '../registry/component-registry.js';
import { StateManager } from '../state/state-manager.js';
import { DataLoader } from '../data/data-loader.js';
import { ActionExecutor } from '../actions/action-executor.js';
import { LoadStrategyManager } from '../loading/load-strategy-manager.js';
/**
 * 渲染引擎配置
 */
export interface RenderEngineConfig {
    /** 调试模式 */
    debug?: boolean;
    /** 数据加载器配置 */
    dataLoader?: {
        timeout?: number;
        retryCount?: number;
        enableCache?: boolean;
    };
    /** 行为执行器配置 */
    actionExecutor?: {
        timeout?: number;
        maxConcurrency?: number;
    };
    /** 加载策略管理器配置 */
    loadStrategy?: {
        maxConcurrency?: number;
        preloadDelay?: number;
        enablePrediction?: boolean;
    };
}
/**
 * 渲染引擎初始化结果
 */
export interface RenderEngineInitResult {
    /** 是否成功 */
    success: boolean;
    /** 初始化耗时 */
    duration: number;
    /** 错误信息 */
    error?: string;
    /** 加载的数据源数量 */
    loadedDataSources: number;
    /** 注册的组件数量 */
    registeredComponents: number;
}
/**
 * 核心渲染引擎
 * 整合所有子模块，提供统一的页面渲染能力
 */
export declare class RenderEngine {
    private expressionEngine;
    readonly componentRegistry: ComponentRegistry;
    readonly stateManager: StateManager;
    readonly dataLoader: DataLoader;
    readonly actionExecutor: ActionExecutor;
    readonly loadStrategyManager: LoadStrategyManager;
    private currentSchema?;
    private isInitialized;
    private config;
    constructor(expressionEngine: ExpressionEngine, config?: RenderEngineConfig);
    /**
     * 初始化页面Schema
     */
    initialize(schema: PageSchema): Promise<RenderEngineInitResult>;
    /**
     * 获取当前页面Schema
     */
    getCurrentSchema(): PageSchema | undefined;
    /**
     * 检查是否已初始化
     */
    getInitializationStatus(): boolean;
    /**
     * 动态更新组件
     */
    updateComponent(componentId: string, definition: ComponentDefinition): Promise<void>;
    /**
     * 动态添加数据源
     */
    addDataSource(id: string, definition: any): Promise<void>;
    /**
     * 动态添加行为
     */
    addAction(id: string, definition: any): void;
    /**
     * 执行按需加载
     */
    executeOnDemandLoad(actionId: string): Promise<void>;
    /**
     * 销毁渲染引擎
     */
    destroy(): Promise<void>;
    /**
     * 获取引擎统计信息
     */
    getStats(): {
        initialized: boolean;
        currentPageId?: string;
        components: number;
        dataSources: number;
        actions: number;
        loadStats: any;
        executionStats: any;
    };
    /**
     * 验证Schema
     */
    private validateSchema;
}
//# sourceMappingURL=render-engine.d.ts.map