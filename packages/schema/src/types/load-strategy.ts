/**
 * 智能混合加载策略
 */
export interface LoadStrategy {
  /** 初始加载：页面首次加载时必须的组件和数据源ID */
  initial: string[];
  
  /** 预加载：浏览器空闲时预加载的组件和数据源ID */
  preload?: string[];
  
  /** 按需加载：根据特定行为触发加载的映射 */
  onDemand?: Record<string, string[]>;
  
  /** 缓存策略 */
  cache?: CacheStrategy;
  
  /** 超时配置 */
  timeout?: TimeoutConfig;
}

/**
 * 缓存策略
 */
export interface CacheStrategy {
  /** 组件缓存时间（毫秒），-1表示永不过期 */
  componentTTL?: number;
  
  /** 数据源缓存时间（毫秒），-1表示永不过期 */
  dataTTL?: number;
  
  /** 是否启用内存缓存 */
  enableMemoryCache?: boolean;
  
  /** 是否启用本地存储缓存 */
  enableLocalStorage?: boolean;
  
  /** 缓存键前缀 */
  cacheKeyPrefix?: string;
}

/**
 * 超时配置
 */
export interface TimeoutConfig {
  /** 组件加载超时时间（毫秒） */
  componentTimeout?: number;
  
  /** 数据加载超时时间（毫秒） */
  dataTimeout?: number;
  
  /** 预加载超时时间（毫秒） */
  preloadTimeout?: number;
  
  /** 重试次数 */
  retryCount?: number;
  
  /** 重试间隔（毫秒） */
  retryDelay?: number;
} 