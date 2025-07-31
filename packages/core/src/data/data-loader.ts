import type { 
  DataSourceDefinition, 
  LoadStrategy,
  ApiRequestConfig,
  StaticDataConfig,
  ComputedConfig
} from '@snap-studio/schema';
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
 * 缓存项
 */
interface CacheItem {
  data: any;
  timestamp: number;
  expiry?: number;
}

/**
 * 数据加载器
 * 根据 LoadStrategy 智能加载数据源
 */
export class DataLoader {
  private dataSources = new Map<string, DataSourceDefinition>();
  private cache = new Map<string, CacheItem>();
  private loadingPromises = new Map<string, Promise<DataLoadResult>>();
  private config: Required<DataLoaderConfig>;
  
  constructor(
    private stateManager: StateManager,
    private expressionEngine: ExpressionEngine,
    config: DataLoaderConfig = {}
  ) {
    this.config = {
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
      enableCache: true,
      cacheExpiry: 5 * 60 * 1000, // 5分钟
      ...config
    };
  }
  
  /**
   * 注册数据源
   */
  registerDataSource(id: string, definition: DataSourceDefinition): void {
    this.dataSources.set(id, definition);
  }
  
  /**
   * 批量注册数据源
   */
  registerDataSources(dataSources: Record<string, DataSourceDefinition>): void {
    Object.entries(dataSources).forEach(([id, definition]) => {
      this.registerDataSource(id, definition);
    });
  }
  
  /**
   * 根据加载策略执行初始化加载
   */
  async loadInitial(strategy: LoadStrategy): Promise<DataLoadResult[]> {
    const { initial } = strategy;
    
    if (!initial || initial.length === 0) {
      return [];
    }
    
    return await this.loadMultiple(initial);
  }
  
  /**
   * 执行预加载
   */
  async preload(strategy: LoadStrategy): Promise<DataLoadResult[]> {
    const { preload } = strategy;
    
    if (!preload || preload.length === 0) {
      return [];
    }
    
    // 预加载通常在后台执行，不阻塞主流程
    return await this.loadMultiple(preload);
  }
  
  /**
   * 按需加载数据
   */
  async loadOnDemand(strategy: LoadStrategy, actionId: string): Promise<DataLoadResult[]> {
    const { onDemand } = strategy;
    
    if (!onDemand || !onDemand[actionId]) {
      return [];
    }
    
    return await this.loadMultiple(onDemand[actionId]);
  }
  
  /**
   * 加载单个数据源
   */
  async loadSingle(dataSourceId: string): Promise<DataLoadResult> {
    // 检查是否正在加载中
    const existingPromise = this.loadingPromises.get(dataSourceId);
    if (existingPromise) {
      return await existingPromise;
    }
    
    // 检查缓存
    if (this.config.enableCache) {
      const cached = this.getCachedData(dataSourceId);
      if (cached) {
        return {
          dataSourceId,
          success: true,
          data: cached.data,
          fromCache: true,
          duration: 0
        };
      }
    }
    
    const dataSource = this.dataSources.get(dataSourceId);
    if (!dataSource) {
      return {
        dataSourceId,
        success: false,
        error: `数据源 "${dataSourceId}" 未找到`
      };
    }
    
    const loadPromise = this.performLoad(dataSourceId, dataSource);
    this.loadingPromises.set(dataSourceId, loadPromise);
    
    try {
      const result = await loadPromise;
      
      // 缓存成功的结果
      if (result.success && this.config.enableCache) {
        this.setCachedData(dataSourceId, result.data);
      }
      
      return result;
    } finally {
      this.loadingPromises.delete(dataSourceId);
    }
  }
  
  /**
   * 批量加载数据源
   */
  async loadMultiple(dataSourceIds: string[]): Promise<DataLoadResult[]> {
    const loadPromises = dataSourceIds.map(id => this.loadSingle(id));
    return await Promise.all(loadPromises);
  }
  
  /**
   * 执行具体的数据加载
   */
  private async performLoad(
    dataSourceId: string, 
    dataSource: DataSourceDefinition
  ): Promise<DataLoadResult> {
    const startTime = Date.now();

    
    try {
      let data: any;
      
      switch (dataSource.type) {
        case 'API_REQUEST':
          data = await this.loadApiData(dataSource.config as ApiRequestConfig);
          break;
          
        case 'STATIC_DATA':
          data = (dataSource.config as StaticDataConfig).value;
          break;
          
        case 'LOCAL_STORAGE':
          data = this.loadFromStorage(dataSource.config.key);
          break;
          
        case 'COMPUTED':
          data = await this.loadComputedData(dataSource.config as ComputedConfig);
          break;
          
        case 'MOCK':
          data = dataSource.config.data || this.generateMockData(dataSource.config);
          break;
          
        default:
          throw new Error(`不支持的数据源类型: ${dataSource.type}`);
      }
      
      // 应用数据转换
      if (dataSource.transformer) {
        data = await this.applyTransform(data, dataSource.transformer);
      }
      
      return {
        dataSourceId,
        success: true,
        data,
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      return {
        dataSourceId,
        success: false,
        error: errorMessage,
        duration: Date.now() - startTime
      };
    }
  }
  
  /**
   * 加载API数据
   */
  private async loadApiData(config: ApiRequestConfig): Promise<any> {
    const { url, method = 'GET', params, headers, body } = config;
    
    // 构建请求URL
    let requestUrl = url;
    if (params) {
      const searchParams = new URLSearchParams(params);
      requestUrl += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }
    
    // 构建请求选项
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: AbortSignal.timeout(this.config.timeout)
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    const response = await fetch(requestUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  /**
   * 从本地存储加载数据
   */
  private loadFromStorage(key: string): any {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Failed to load from localStorage: ${key}`, error);
      return null;
    }
  }
  
  /**
   * 加载计算属性数据
   */
  private async loadComputedData(config: ComputedConfig): Promise<any> {
    const context = {
      state: this.stateManager.get(),
      // 可以添加其他上下文
    };
    
    return await this.expressionEngine.evaluate(config.expression, context);
  }
  
  /**
   * 生成模拟数据
   */
  private generateMockData(config: any): any {
    // 简单的模拟数据生成器
    if (config.template) {
      return config.template;
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      mock: true
    };
  }
  
  /**
   * 应用数据转换
   */
  private async applyTransform(data: any, transformer: any): Promise<any> {
    if (typeof transformer === 'string') {
      // 表达式转换
      const context = { data, state: this.stateManager.get() };
      return await this.expressionEngine.evaluate(transformer, context);
    }
    
    if (typeof transformer === 'function') {
      // 函数转换
      return transformer(data);
    }
    
    return data;
  }
  
  /**
   * 获取缓存数据
   */
  private getCachedData(dataSourceId: string): CacheItem | null {
    const cached = this.cache.get(dataSourceId);
    
    if (!cached) {
      return null;
    }
    
    const now = Date.now();
    const expiry = cached.expiry || (cached.timestamp + this.config.cacheExpiry);
    
    if (now > expiry) {
      this.cache.delete(dataSourceId);
      return null;
    }
    
    return cached;
  }
  
  /**
   * 设置缓存数据
   */
  private setCachedData(dataSourceId: string, data: any, customExpiry?: number): void {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now(),
      expiry: customExpiry ? Date.now() + customExpiry : undefined
    };
    
    this.cache.set(dataSourceId, cacheItem);
  }
  
  /**
   * 清空缓存
   */
  clearCache(dataSourceId?: string): void {
    if (dataSourceId) {
      this.cache.delete(dataSourceId);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * 获取加载状态
   */
  isLoading(dataSourceId: string): boolean {
    return this.loadingPromises.has(dataSourceId);
  }
  
  /**
   * 获取缓存统计
   */
  getCacheStats(): {
    size: number;
    entries: Array<{ id: string; timestamp: number; size: number }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([id, item]) => ({
      id,
      timestamp: item.timestamp,
      size: JSON.stringify(item.data).length
    }));
    
    return {
      size: this.cache.size,
      entries
    };
  }
}