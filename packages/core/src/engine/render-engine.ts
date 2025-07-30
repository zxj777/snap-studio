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
export class RenderEngine {
  public readonly componentRegistry: ComponentRegistry;
  public readonly stateManager: StateManager;
  public readonly dataLoader: DataLoader;
  public readonly actionExecutor: ActionExecutor;
  public readonly loadStrategyManager: LoadStrategyManager;
  
  private currentSchema?: PageSchema;
  private isInitialized = false;
  private config: Required<RenderEngineConfig>;
  
  constructor(
    private expressionEngine: ExpressionEngine,
    config: RenderEngineConfig = {}
  ) {
    this.config = {
      debug: false,
      dataLoader: {
        timeout: 30000,
        retryCount: 3,
        enableCache: true,
        ...config.dataLoader
      },
      actionExecutor: {
        timeout: 30000,
        maxConcurrency: 10,
        ...config.actionExecutor
      },
      loadStrategy: {
        maxConcurrency: 5,
        preloadDelay: 100,
        enablePrediction: true,
        ...config.loadStrategy
      }
    };
    
    // 初始化各个子模块
    this.componentRegistry = new ComponentRegistry();
    this.stateManager = new StateManager({}, expressionEngine);
    this.dataLoader = new DataLoader(
      this.stateManager,
      expressionEngine,
      this.config.dataLoader
    );
    this.actionExecutor = new ActionExecutor(
      this.stateManager,
      this.dataLoader,
      expressionEngine,
      this.config.actionExecutor
    );
    this.loadStrategyManager = new LoadStrategyManager(
      this.dataLoader,
      this.config.loadStrategy
    );
    
    if (this.config.debug) {
      console.log('RenderEngine initialized with config:', this.config);
    }
  }
  
  /**
   * 初始化页面Schema
   */
  async initialize(schema: PageSchema): Promise<RenderEngineInitResult> {
    const startTime = Date.now();
    
    try {
      if (this.config.debug) {
        console.log('开始初始化页面Schema:', schema.metadata);
      }
      
      // 验证Schema
      this.validateSchema(schema);
      
      // 保存当前Schema
      this.currentSchema = schema;
      
      // 重置状态
      this.stateManager.reset(schema.initialState);
      
      // 注册数据源
      this.dataLoader.registerDataSources(schema.dataSource);
      
      // 注册行为
      this.actionExecutor.registerActions(schema.actions);
      
      // 分析加载策略
      const loadPlan = this.loadStrategyManager.analyzeStrategy(
        schema.loadStrategy,
        schema.components
      );
      
      // 执行初始化加载
      const initialLoadResults = await this.loadStrategyManager.executeInitialLoad();
      const successfulLoads = initialLoadResults.filter(r => r.success).length;
      
      // 验证组件注册
      const componentValidation = this.componentRegistry.validateComponentDefinition(
        schema.components[schema.layout.root]
      );
      
      if (!componentValidation.isValid) {
        console.warn('存在未注册的组件类型:', componentValidation.missingTypes);
      }
      
      // 执行生命周期钩子
      if (schema.lifecycle?.onLoad) {
        await Promise.all(
          schema.lifecycle.onLoad.map(actionId => 
            this.actionExecutor.execute(actionId)
          )
        );
      }
      
      // 启动预加载（异步执行，不阻塞初始化）
      this.loadStrategyManager.executePreload().catch(error => {
        console.warn('预加载失败:', error);
      });
      
      this.isInitialized = true;
      
      const result: RenderEngineInitResult = {
        success: true,
        duration: Date.now() - startTime,
        loadedDataSources: successfulLoads,
        registeredComponents: this.componentRegistry.getStats().componentCount
      };
      
      if (this.config.debug) {
        console.log('页面初始化完成:', result);
      }
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化失败';
      
      if (this.config.debug) {
        console.error('页面初始化失败:', error);
      }
      
      return {
        success: false,
        duration: Date.now() - startTime,
        error: errorMessage,
        loadedDataSources: 0,
        registeredComponents: 0
      };
    }
  }
  
  /**
   * 获取当前页面Schema
   */
  getCurrentSchema(): PageSchema | undefined {
    return this.currentSchema;
  }
  
  /**
   * 检查是否已初始化
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
  
  /**
   * 动态更新组件
   */
  async updateComponent(componentId: string, definition: ComponentDefinition): Promise<void> {
    if (!this.currentSchema) {
      throw new Error('渲染引擎未初始化');
    }
    
    // 更新Schema中的组件定义
    this.currentSchema.components[componentId] = definition;
    
    // 如果组件有新的数据依赖，触发数据加载
    if (definition.dataBinding) {
      const dataSourceIds = Object.values(definition.dataBinding)
        .filter(id => typeof id === 'string');
      
      for (const dataSourceId of dataSourceIds) {
        if (this.currentSchema.dataSource[dataSourceId]) {
          await this.dataLoader.loadSingle(dataSourceId);
        }
      }
    }
    
    if (this.config.debug) {
      console.log(`组件 ${componentId} 已更新`);
    }
  }
  
  /**
   * 动态添加数据源
   */
  async addDataSource(id: string, definition: any): Promise<void> {
    if (!this.currentSchema) {
      throw new Error('渲染引擎未初始化');
    }
    
    this.currentSchema.dataSource[id] = definition;
    this.dataLoader.registerDataSource(id, definition);
    
    if (this.config.debug) {
      console.log(`数据源 ${id} 已添加`);
    }
  }
  
  /**
   * 动态添加行为
   */
  addAction(id: string, definition: any): void {
    if (!this.currentSchema) {
      throw new Error('渲染引擎未初始化');
    }
    
    this.currentSchema.actions[id] = definition;
    this.actionExecutor.registerAction(id, definition);
    
    if (this.config.debug) {
      console.log(`行为 ${id} 已添加`);
    }
  }
  
  /**
   * 执行按需加载
   */
  async executeOnDemandLoad(actionId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('渲染引擎未初始化');
    }
    
    await this.loadStrategyManager.executeOnDemandLoad(actionId);
    
    if (this.config.debug) {
      console.log(`按需加载已完成: ${actionId}`);
    }
  }
  
  /**
   * 销毁渲染引擎
   */
  async destroy(): Promise<void> {
    if (this.config.debug) {
      console.log('开始销毁渲染引擎...');
    }
    
    // 执行生命周期钩子
    if (this.currentSchema?.lifecycle?.onUnload) {
      await Promise.all(
        this.currentSchema.lifecycle.onUnload.map(actionId => 
          this.actionExecutor.execute(actionId)
        )
      );
    }
    
    // 清理资源
    this.stateManager.clearSubscriptions();
    this.dataLoader.clearCache();
    this.componentRegistry.clear();
    this.loadStrategyManager.clearHistory();
    
    this.currentSchema = undefined;
    this.isInitialized = false;
    
    if (this.config.debug) {
      console.log('渲染引擎已销毁');
    }
  }
  
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
  } {
    return {
      initialized: this.isInitialized,
      currentPageId: this.currentSchema?.metadata.pageId,
      components: this.componentRegistry.getStats().componentCount,
      dataSources: Object.keys(this.currentSchema?.dataSource || {}).length,
      actions: Object.keys(this.currentSchema?.actions || {}).length,
      loadStats: this.loadStrategyManager.getLoadStats(),
      executionStats: this.actionExecutor.getExecutionStats()
    };
  }
  
  /**
   * 验证Schema
   */
  private validateSchema(schema: PageSchema): void {
    if (!schema.metadata?.pageId) {
      throw new Error('Schema必须包含有效的页面ID');
    }
    
    if (!schema.layout?.root) {
      throw new Error('Schema必须包含根布局组件');
    }
    
    if (!schema.components[schema.layout.root]) {
      throw new Error('根布局组件在components中未找到');
    }
    
    // 可以添加更多验证逻辑
  }
}