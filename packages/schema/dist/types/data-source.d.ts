/**
 * 数据源定义
 */
export interface DataSourceDefinition {
    /** 数据源类型 */
    type: DataSourceType;
    /** 数据源配置 */
    config?: DataSourceConfig;
    /** 成功回调行为ID */
    onSuccess?: string;
    /** 失败回调行为ID */
    onError?: string;
    /** 加载中回调行为ID */
    onLoading?: string;
    /** 数据转换器 */
    transformer?: DataTransformer;
    /** 缓存配置 */
    cache?: DataSourceCache;
    /** 重试配置 */
    retry?: RetryConfig;
    /** 依赖的其他数据源 */
    dependencies?: string[];
}
/**
 * 数据源类型
 */
export type DataSourceType = 'API_REQUEST' | 'STATIC_DATA' | 'LOCAL_STORAGE' | 'SESSION_STORAGE' | 'WEBSOCKET' | 'SERVER_SENT_EVENT' | 'COMPUTED' | 'MOCK';
/**
 * 数据源配置
 */
export type DataSourceConfig = ApiRequestConfig | StaticDataConfig | StorageConfig | WebSocketConfig | ServerSentEventConfig | ComputedConfig | MockConfig;
/**
 * API请求配置
 */
export interface ApiRequestConfig {
    /** 请求URL */
    url: string;
    /** 请求方法 */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    /** 请求头 */
    headers?: Record<string, string>;
    /** 请求参数 */
    params?: Record<string, any>;
    /** 请求体 */
    body?: any;
    /** 超时时间（毫秒） */
    timeout?: number;
    /** 认证配置 */
    auth?: AuthConfig;
    /** 请求拦截器 */
    interceptors?: {
        request?: string;
        response?: string;
    };
}
/**
 * 静态数据配置
 */
export interface StaticDataConfig {
    /** 静态数据值 */
    value: any;
}
/**
 * 存储配置
 */
export interface StorageConfig {
    /** 存储键 */
    key: string;
    /** 默认值 */
    defaultValue?: any;
    /** 是否自动序列化 */
    serialize?: boolean;
}
/**
 * WebSocket配置
 */
export interface WebSocketConfig {
    /** WebSocket URL */
    url: string;
    /** 协议 */
    protocols?: string[];
    /** 重连配置 */
    reconnect?: {
        enabled: boolean;
        maxAttempts: number;
        delay: number;
    };
    /** 心跳配置 */
    heartbeat?: {
        enabled: boolean;
        interval: number;
        message: string;
    };
}
/**
 * SSE配置
 */
export interface ServerSentEventConfig {
    /** SSE URL */
    url: string;
    /** 事件类型过滤 */
    eventTypes?: string[];
    /** 重连配置 */
    reconnect?: {
        enabled: boolean;
        maxAttempts: number;
        delay: number;
    };
}
/**
 * 计算数据源配置
 */
export interface ComputedConfig {
    /** 依赖的数据源或状态路径 */
    dependencies: string[];
    /** 计算表达式 */
    expression: string;
    /** 是否缓存计算结果 */
    cache?: boolean;
}
/**
 * 模拟数据配置
 */
export interface MockConfig {
    /** 模拟数据 */
    data: any;
    /** 模拟延迟（毫秒） */
    delay?: number;
    /** 是否模拟错误 */
    simulateError?: boolean;
    /** 错误概率（0-1） */
    errorRate?: number;
}
/**
 * 认证配置
 */
export interface AuthConfig {
    /** 认证类型 */
    type: 'bearer' | 'basic' | 'apikey' | 'custom';
    /** 认证令牌 */
    token?: string;
    /** 用户名（basic认证） */
    username?: string;
    /** 密码（basic认证） */
    password?: string;
    /** API密钥配置 */
    apiKey?: {
        key: string;
        value: string;
        in: 'header' | 'query';
    };
    /** 自定义认证头 */
    customHeaders?: Record<string, string>;
}
/**
 * 数据转换器
 */
export interface DataTransformer {
    /** 转换表达式 */
    expression: string;
    /** 转换类型 */
    type?: 'map' | 'filter' | 'reduce' | 'custom';
    /** 错误处理 */
    onError?: 'throw' | 'ignore' | 'default';
    /** 默认值（错误时返回） */
    defaultValue?: any;
}
/**
 * 数据源缓存配置
 */
export interface DataSourceCache {
    /** 是否启用缓存 */
    enabled: boolean;
    /** 缓存时间（毫秒），-1表示永不过期 */
    ttl?: number;
    /** 缓存键 */
    key?: string;
    /** 缓存策略 */
    strategy?: 'memory' | 'localStorage' | 'sessionStorage';
    /** 是否在后台刷新 */
    staleWhileRevalidate?: boolean;
}
/**
 * 重试配置
 */
export interface RetryConfig {
    /** 最大重试次数 */
    maxAttempts: number;
    /** 重试延迟（毫秒） */
    delay: number;
    /** 延迟策略 */
    strategy?: 'fixed' | 'exponential' | 'linear';
    /** 重试条件 */
    retryIf?: string;
    /** 最大延迟（毫秒） */
    maxDelay?: number;
}
