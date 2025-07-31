import type { LoadStrategy, ComponentDefinition } from '@snap-studio/schema';
import type { DataLoader, DataLoadResult } from '../data/data-loader.js';

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
export class LoadStrategyManager {
  private config: Required<LoadStrategyManagerConfig>;
  private loadPlan?: LoadPlan;
  private loadingTasks = new Map<string, Promise<LoadTaskResult>>();
  private loadHistory: LoadTaskResult[] = [];
  private concurrentCount = 0;
  
  constructor(
    private dataLoader: DataLoader,
    config: LoadStrategyManagerConfig = {}
  ) {
    this.config = {
      maxConcurrency: 5,
      preloadDelay: 100,
      enablePrediction: true,
      priorityWeights: {
        critical: 1000,
        high: 100,
        normal: 10,
        low: 1
      },
      ...config
    };
  }
  
  /**
   * 分析加载策略并生成加载计划
   */
  analyzeStrategy(
    strategy: LoadStrategy,
    components: Record<string, ComponentDefinition>
  ): LoadPlan {
    const plan: LoadPlan = {
      initialTasks: [],
      preloadTasks: [],
      onDemandTasks: {}
    };
    
    // 分析初始加载项
    if (strategy.initial) {
      plan.initialTasks = this.createLoadTasks(
        strategy.initial,
        'initial',
        components
      );
    }
    
    // 分析预加载项
    if (strategy.preload) {
      plan.preloadTasks = this.createLoadTasks(
        strategy.preload,
        'preload',
        components
      );
    }
    
    // 分析按需加载项
    if (strategy.onDemand) {
      Object.entries(strategy.onDemand).forEach(([actionId, items]) => {
        plan.onDemandTasks[actionId] = this.createLoadTasks(
          items,
          'onDemand',
          components
        );
      });
    }
    
    // 优化加载计划
    this.optimizeLoadPlan(plan);
    
    this.loadPlan = plan;
    return plan;
  }
  
  /**
   * 执行初始化加载
   */
  async executeInitialLoad(): Promise<LoadTaskResult[]> {
    if (!this.loadPlan) {
      throw new Error('加载计划未生成，请先调用 analyzeStrategy');
    }
    
    const { initialTasks } = this.loadPlan;
    
    if (initialTasks.length === 0) {
      return [];
    }
    
    console.log('开始执行初始化加载...', initialTasks);
    
    // 按优先级和依赖关系排序
    const sortedTasks = this.sortTasksByPriorityAndDependencies(initialTasks);
    
    return await this.executeTasks(sortedTasks);
  }
  
  /**
   * 执行预加载
   */
  async executePreload(): Promise<LoadTaskResult[]> {
    if (!this.loadPlan) {
      return [];
    }
    
    const { preloadTasks } = this.loadPlan;
    
    if (preloadTasks.length === 0) {
      return [];
    }
    
    // 延迟预加载，避免影响初始渲染
    await new Promise(resolve => setTimeout(resolve, this.config.preloadDelay));
    
    console.log('开始执行预加载...', preloadTasks);
    
    // 预加载可以更激进地并行执行
    return await this.executeTasks(preloadTasks, true);
  }
  
  /**
   * 执行按需加载
   */
  async executeOnDemandLoad(actionId: string): Promise<LoadTaskResult[]> {
    if (!this.loadPlan) {
      return [];
    }
    
    const tasks = this.loadPlan.onDemandTasks[actionId];
    
    if (!tasks || tasks.length === 0) {
      return [];
    }
    
    console.log(`开始执行按需加载: ${actionId}`, tasks);
    
    return await this.executeTasks(tasks);
  }
  
  /**
   * 创建加载任务
   */
  private createLoadTasks(
    items: string[],
    phase: LoadPhase,
    components: Record<string, ComponentDefinition>
  ): LoadTask[] {
    const tasks: LoadTask[] = [];
    let taskCounter = 0;
    
    items.forEach(itemId => {
      // 检查是否为组件ID
      if (components[itemId]) {
        const component = components[itemId];
        
        // 创建组件加载任务
        tasks.push({
          id: `task_${++taskCounter}`,
          type: 'component',
          targetId: itemId,
          phase,
          priority: this.calculatePriority(component, phase),
          dependencies: this.extractDependencies(component)
        });
        
        // 如果组件有数据绑定，创建数据源加载任务
        if (component.dataBinding) {
          Object.values(component.dataBinding).forEach(dataSourceId => {
            if (typeof dataSourceId === 'string' && dataSourceId.startsWith('ds_')) {
              tasks.push({
                id: `task_${++taskCounter}`,
                type: 'dataSource',
                targetId: dataSourceId,
                phase,
                priority: this.calculateDataSourcePriority(phase),
                dependencies: []
              });
            }
          });
        }
      } else {
        // 直接的数据源ID
        tasks.push({
          id: `task_${++taskCounter}`,
          type: 'dataSource',
          targetId: itemId,
          phase,
          priority: this.calculateDataSourcePriority(phase),
          dependencies: []
        });
      }
    });
    
    return tasks;
  }
  
  /**
   * 计算组件优先级
   */
  private calculatePriority(component: ComponentDefinition, phase: LoadPhase): number {
    let basePriority = 0;
    
    // 根据加载阶段设置基础优先级
    switch (phase) {
      case 'initial':
        basePriority = this.config.priorityWeights.critical;
        break;
      case 'preload':
        basePriority = this.config.priorityWeights.high;
        break;
      case 'onDemand':
        basePriority = this.config.priorityWeights.normal;
        break;
    }
    
    // 根据组件类型调整优先级
    if (component.componentType === 'PageContainer') {
      basePriority += this.config.priorityWeights.critical;
    } else if (component.componentType.includes('Header') || component.componentType.includes('Nav')) {
      basePriority += this.config.priorityWeights.high;
    }
    
    // 如果有可见性条件，降低优先级
    if (component.visibility) {
      basePriority *= 0.8;
    }
    
    return Math.floor(basePriority);
  }
  
  /**
   * 计算数据源优先级
   */
  private calculateDataSourcePriority(phase: LoadPhase): number {
    switch (phase) {
      case 'initial':
        return this.config.priorityWeights.critical;
      case 'preload':
        return this.config.priorityWeights.high;
      case 'onDemand':
        return this.config.priorityWeights.normal;
      default:
        return this.config.priorityWeights.low;
    }
  }
  
  /**
   * 提取组件依赖
   */
  private extractDependencies(component: ComponentDefinition): string[] {
    const dependencies: string[] = [];
    
    // 数据依赖
    if (component.dataBinding) {
      Object.values(component.dataBinding).forEach(binding => {
        if (typeof binding === 'string' && binding.startsWith('ds_')) {
          dependencies.push(binding);
        }
      });
    }
    
    // 父子组件依赖
    if (component.children) {
      component.children.forEach(child => {
        if (typeof child === 'string') {
          dependencies.push(child);
        }
      });
    }
    
    return dependencies;
  }
  
  /**
   * 优化加载计划
   */
  private optimizeLoadPlan(plan: LoadPlan): void {
    // 去重
    plan.initialTasks = this.deduplicateTasks(plan.initialTasks);
    plan.preloadTasks = this.deduplicateTasks(plan.preloadTasks);
    
    Object.keys(plan.onDemandTasks).forEach(actionId => {
      plan.onDemandTasks[actionId] = this.deduplicateTasks(plan.onDemandTasks[actionId]);
    });
    
    // 如果启用了智能预测，分析历史加载模式
    if (this.config.enablePrediction) {
      this.optimizeWithPrediction(plan);
    }
  }
  
  /**
   * 去重任务
   */
  private deduplicateTasks(tasks: LoadTask[]): LoadTask[] {
    const seen = new Set<string>();
    return tasks.filter(task => {
      const key = `${task.type}:${task.targetId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  
  /**
   * 基于预测优化加载计划
   */
  private optimizeWithPrediction(plan: LoadPlan): void {
    // 分析历史加载数据，调整优先级
    const frequentlyUsed = this.analyzeLoadHistory();
    
    // 将频繁使用的资源移到更早的加载阶段
    frequentlyUsed.forEach(targetId => {
      const onDemandTask = this.findTaskInOnDemand(plan, targetId);
      if (onDemandTask) {
        // 移动到预加载阶段
        plan.preloadTasks.push({
          ...onDemandTask,
          phase: 'preload',
          priority: this.calculateDataSourcePriority('preload')
        });
      }
    });
  }
  
  /**
   * 分析加载历史
   */
  private analyzeLoadHistory(): string[] {
    const usage = new Map<string, number>();
    
    this.loadHistory.forEach(result => {
      const count = usage.get(result.taskId) || 0;
      usage.set(result.taskId, count + 1);
    });
    
    return Array.from(usage.entries())
      .filter(([_, count]) => count >= 3) // 使用3次以上
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5) // 取前5个
      .map(([taskId]) => taskId);
  }
  
  /**
   * 在按需加载任务中查找任务
   */
  private findTaskInOnDemand(plan: LoadPlan, targetId: string): LoadTask | undefined {
    for (const tasks of Object.values(plan.onDemandTasks)) {
      const found = tasks.find(task => task.targetId === targetId);
      if (found) return found;
    }
    return undefined;
  }
  
  /**
   * 按优先级和依赖关系排序任务
   */
  private sortTasksByPriorityAndDependencies(tasks: LoadTask[]): LoadTask[] {
    // 拓扑排序处理依赖关系，然后按优先级排序
    const sorted = [...tasks];
    
    sorted.sort((a, b) => {
      // 首先按依赖关系排序
      if (a.dependencies?.includes(b.targetId)) return 1;
      if (b.dependencies?.includes(a.targetId)) return -1;
      
      // 然后按优先级排序
      return b.priority - a.priority;
    });
    
    return sorted;
  }
  
  /**
   * 执行任务列表
   */
  private async executeTasks(tasks: LoadTask[], allowHighConcurrency = false): Promise<LoadTaskResult[]> {
    const results: LoadTaskResult[] = [];
    const maxConcurrency = allowHighConcurrency ? this.config.maxConcurrency * 2 : this.config.maxConcurrency;
    
    // 按批次执行，控制并发数
    for (let i = 0; i < tasks.length; i += maxConcurrency) {
      const batch = tasks.slice(i, i + maxConcurrency);
      const batchPromises = batch.map(task => this.executeTask(task));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    // 记录加载历史
    this.loadHistory.push(...results);
    
    // 限制历史记录大小
    if (this.loadHistory.length > 1000) {
      this.loadHistory = this.loadHistory.slice(-500);
    }
    
    return results;
  }
  
  /**
   * 执行单个任务
   */
  private async executeTask(task: LoadTask): Promise<LoadTaskResult> {
    const startTime = Date.now();
    
    try {
      if (task.type === 'dataSource') {
        const dataResult = await this.dataLoader.loadSingle(task.targetId);

        
        return {
          taskId: task.id,
          success: dataResult.success,
          duration: Date.now() - startTime,
          error: dataResult.error,
          fromCache: dataResult.fromCache
        };
      } else {
        // 组件任务（目前主要是标记为已加载）
        return {
          taskId: task.id,
          success: true,
          duration: Date.now() - startTime
        };
      }
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '任务执行失败'
      };
    }
  }
  
  /**
   * 获取加载统计信息
   */
  getLoadStats(): {
    planGenerated: boolean;
    totalTasks: number;
    completedTasks: number;
    avgLoadTime: number;
    cacheHitRate: number;
  } {
    const totalTasks = this.loadHistory.length;
    const completedTasks = this.loadHistory.filter(r => r.success).length;
    const avgLoadTime = totalTasks > 0 
      ? this.loadHistory.reduce((sum, r) => sum + r.duration, 0) / totalTasks 
      : 0;
    const cacheHits = this.loadHistory.filter(r => r.fromCache).length;
    const cacheHitRate = totalTasks > 0 ? cacheHits / totalTasks : 0;
    
    return {
      planGenerated: !!this.loadPlan,
      totalTasks,
      completedTasks,
      avgLoadTime: Math.round(avgLoadTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100
    };
  }
  
  /**
   * 清空加载历史
   */
  clearHistory(): void {
    this.loadHistory = [];
  }
}