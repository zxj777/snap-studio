/**
 * 智能混合加载策略
 */
interface LoadStrategy {
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
interface CacheStrategy {
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
interface TimeoutConfig {
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

/**
 * 页面布局定义
 */
interface Layout {
    /** 根组件ID */
    root: string;
    /** 全局插槽映射 */
    slots?: Record<string, string>;
    /** 布局模式 */
    mode?: 'fixed' | 'fluid' | 'responsive';
    /** 响应式断点 */
    breakpoints?: Record<string, number>;
}
/**
 * 组件定义
 */
interface ComponentDefinition {
    /** 组件类型（对应UI组件库中的组件名） */
    componentType: string;
    /** 组件属性 */
    properties?: Record<string, any>;
    /** 子组件ID列表 */
    children?: string[];
    /** 数据绑定 */
    dataBinding?: Record<string, string>;
    /** 事件绑定 */
    events?: Record<string, string>;
    /** 动态属性（支持表达式） */
    dynamicProps?: Record<string, string>;
    /** 条件渲染（支持表达式） */
    visibility?: string;
    /** 样式定义 */
    style?: ComponentStyle;
    /** 插槽定义 */
    slots?: Record<string, SlotDefinition>;
    /** 校验规则 */
    validations?: ValidationRule[];
    /** 组件唯一key */
    key?: string;
    /** 是否懒加载 */
    lazy?: boolean;
    /** 错误边界配置 */
    errorBoundary?: ErrorBoundaryConfig;
}
/**
 * 组件样式定义
 */
interface ComponentStyle {
    /** 静态样式 */
    static?: Record<string, any>;
    /** 动态样式（支持表达式） */
    dynamic?: Record<string, string>;
    /** CSS类名 */
    className?: string;
    /** 主题变量 */
    theme?: Record<string, string>;
    /** 响应式样式 */
    responsive?: Record<string, Record<string, any>>;
}
/**
 * 插槽定义
 */
interface SlotDefinition {
    /** 插槽名称 */
    name: string;
    /** 默认内容组件ID */
    defaultContent?: string;
    /** 插槽属性 */
    props?: Record<string, any>;
    /** 是否必需 */
    required?: boolean;
}
/**
 * 校验规则
 */
interface ValidationRule {
    /** 校验类型 */
    type: 'required' | 'pattern' | 'range' | 'custom';
    /** 校验值 */
    value?: any;
    /** 错误消息 */
    message: string;
    /** 自定义校验函数（仅限custom类型） */
    validator?: string;
    /** 触发时机 */
    trigger?: 'change' | 'blur' | 'submit';
}
/**
 * 错误边界配置
 */
interface ErrorBoundaryConfig {
    /** 是否启用错误边界 */
    enabled: boolean;
    /** 降级组件ID */
    fallbackComponent?: string;
    /** 错误处理行为ID */
    onError?: string;
    /** 是否报告错误 */
    reportError?: boolean;
}

/**
 * 数据源定义
 */
interface DataSourceDefinition {
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
type DataSourceType = 'API_REQUEST' | 'STATIC_DATA' | 'LOCAL_STORAGE' | 'SESSION_STORAGE' | 'WEBSOCKET' | 'SERVER_SENT_EVENT' | 'COMPUTED' | 'MOCK' | 'GRAPHQL';
/**
 * 数据源配置
 */
type DataSourceConfig = ApiRequestConfig | StaticDataConfig | StorageConfig | WebSocketConfig | ServerSentEventConfig | ComputedConfig | MockConfig | GraphQLConfig;
/**
 * API请求配置
 */
interface ApiRequestConfig {
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
interface StaticDataConfig {
    /** 静态数据值 */
    value: any;
}
/**
 * 存储配置
 */
interface StorageConfig {
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
interface WebSocketConfig {
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
interface ServerSentEventConfig {
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
interface ComputedConfig {
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
interface MockConfig {
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
 * GraphQL配置
 */
interface GraphQLConfig {
    /** GraphQL端点 */
    endpoint: string;
    /** GraphQL查询 */
    query: string;
    /** 查询变量 */
    variables?: Record<string, any>;
    /** 请求头 */
    headers?: Record<string, string>;
    /** 认证配置 */
    auth?: AuthConfig;
}
/**
 * 认证配置
 */
interface AuthConfig {
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
interface DataTransformer {
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
interface DataSourceCache {
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
interface RetryConfig {
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

/**
 * 行为动作定义
 */
interface ActionDefinition {
    /** 动作类型 */
    type: ActionType;
    /** 动作配置 */
    config?: ActionConfig;
    /** 执行条件（支持表达式） */
    condition?: string;
    /** 执行前钩子 */
    beforeExecute?: string;
    /** 执行后钩子 */
    afterExecute?: string;
    /** 错误处理 */
    onError?: string;
    /** 是否异步执行 */
    async?: boolean;
    /** 执行超时时间（毫秒） */
    timeout?: number;
    /** 重试配置 */
    retry?: ActionRetryConfig;
}
/**
 * 动作类型
 */
type ActionType = 'UPDATE_STATE' | 'FETCH_DATA' | 'NAVIGATE' | 'SHOW_MESSAGE' | 'OPEN_MODAL' | 'CLOSE_MODAL' | 'VALIDATE_FORM' | 'SUBMIT_FORM' | 'CALL_API' | 'EMIT_EVENT' | 'DELAY' | 'COMPOSITE' | 'CONDITIONAL' | 'LOOP' | 'CUSTOM';
/**
 * 动作配置
 */
type ActionConfig = UpdateStateConfig | FetchDataConfig | NavigateConfig | ShowMessageConfig | ModalConfig | FormConfig | ApiCallConfig | EventConfig | DelayConfig | CompositeConfig | ConditionalConfig | LoopConfig | CustomConfig;
/**
 * 更新状态配置
 */
interface UpdateStateConfig {
    /** 状态路径 */
    path?: string;
    /** 更新值（支持表达式） */
    value?: any;
    /** 更新方式 */
    mode?: 'set' | 'merge' | 'append' | 'prepend' | 'remove';
    /** 批量更新 */
    batch?: Array<{
        path: string;
        value: any;
        mode?: 'set' | 'merge' | 'append' | 'prepend' | 'remove';
    }>;
}
/**
 * 获取数据配置
 */
interface FetchDataConfig {
    /** 数据源ID */
    dataSourceId: string;
    /** 参数（支持表达式） */
    params?: Record<string, any>;
    /** 结果存储路径 */
    resultPath?: string;
    /** 是否显示加载状态 */
    showLoading?: boolean;
    /** 加载状态路径 */
    loadingPath?: string;
}
/**
 * 导航配置
 */
interface NavigateConfig {
    /** 导航类型 */
    type: 'push' | 'replace' | 'back' | 'forward' | 'go';
    /** 目标路径 */
    to?: string;
    /** 路径参数 */
    params?: Record<string, any>;
    /** 查询参数 */
    query?: Record<string, any>;
    /** 状态数据 */
    state?: Record<string, any>;
    /** 跳转步数（仅限go类型） */
    delta?: number;
    /** 是否在新窗口打开 */
    newWindow?: boolean;
}
/**
 * 显示消息配置
 */
interface ShowMessageConfig {
    /** 消息类型 */
    type: 'success' | 'error' | 'warning' | 'info';
    /** 消息内容（支持表达式） */
    message: string;
    /** 消息标题 */
    title?: string;
    /** 显示时长（毫秒），0表示需要手动关闭 */
    duration?: number;
    /** 是否可关闭 */
    closable?: boolean;
    /** 位置 */
    placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
}
/**
 * 模态框配置
 */
interface ModalConfig {
    /** 模态框ID */
    modalId: string;
    /** 模态框属性 */
    props?: Record<string, any>;
    /** 是否销毁内容 */
    destroyOnClose?: boolean;
    /** 关闭时回调 */
    onClose?: string;
}
/**
 * 表单配置
 */
interface FormConfig {
    /** 表单ID */
    formId: string;
    /** 校验规则 */
    rules?: Record<string, ValidationRule[]>;
    /** 是否显示错误信息 */
    showErrors?: boolean;
    /** 错误信息位置 */
    errorPlacement?: 'inline' | 'tooltip' | 'summary';
    /** 提交配置 */
    submit?: {
        /** 提交API */
        api: string;
        /** 成功回调 */
        onSuccess?: string;
        /** 失败回调 */
        onError?: string;
        /** 重置表单 */
        resetOnSuccess?: boolean;
    };
}
/**
 * API调用配置
 */
interface ApiCallConfig {
    /** API端点 */
    endpoint: string;
    /** 请求方法 */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    /** 请求参数（支持表达式） */
    params?: Record<string, any>;
    /** 请求体（支持表达式） */
    body?: any;
    /** 请求头 */
    headers?: Record<string, string>;
    /** 结果处理 */
    resultHandler?: string;
    /** 错误处理 */
    errorHandler?: string;
}
/**
 * 事件配置
 */
interface EventConfig {
    /** 事件名称 */
    eventName: string;
    /** 事件数据（支持表达式） */
    data?: any;
    /** 事件范围 */
    scope?: 'global' | 'component' | 'parent';
    /** 是否冒泡 */
    bubbles?: boolean;
    /** 是否可取消 */
    cancelable?: boolean;
}
/**
 * 延迟配置
 */
interface DelayConfig {
    /** 延迟时间（毫秒） */
    duration: number;
    /** 延迟后执行的动作 */
    action?: string;
}
/**
 * 复合动作配置
 */
interface CompositeConfig {
    /** 子动作列表 */
    steps: string[];
    /** 执行模式 */
    mode?: 'sequence' | 'parallel' | 'race';
    /** 失败时是否停止 */
    stopOnError?: boolean;
    /** 最大并发数（仅限parallel模式） */
    concurrency?: number;
}
/**
 * 条件动作配置
 */
interface ConditionalConfig {
    /** 条件表达式 */
    condition: string;
    /** 条件为真时执行的动作 */
    ifTrue: string;
    /** 条件为假时执行的动作 */
    ifFalse?: string;
    /** 多重条件 */
    cases?: Array<{
        condition: string;
        action: string;
    }>;
    /** 默认动作 */
    defaultCase?: string;
}
/**
 * 循环动作配置
 */
interface LoopConfig {
    /** 循环类型 */
    type: 'for' | 'while' | 'forEach';
    /** 循环条件或次数 */
    condition: string | number;
    /** 循环体动作 */
    body: string;
    /** 最大循环次数（安全限制） */
    maxIterations?: number;
    /** 循环变量名 */
    iteratorName?: string;
    /** 数组数据路径（仅限forEach） */
    arrayPath?: string;
}
/**
 * 自定义动作配置
 */
interface CustomConfig {
    /** 自定义处理函数名 */
    handler: string;
    /** 传递给处理函数的参数 */
    args?: Record<string, any>;
    /** 上下文数据 */
    context?: Record<string, any>;
}
/**
 * 动作重试配置
 */
interface ActionRetryConfig {
    /** 最大重试次数 */
    maxAttempts: number;
    /** 重试延迟（毫秒） */
    delay: number;
    /** 延迟策略 */
    strategy?: 'fixed' | 'exponential' | 'linear';
    /** 重试条件（支持表达式） */
    retryIf?: string;
    /** 最大延迟（毫秒） */
    maxDelay?: number;
}

/**
 * 计算属性定义
 */
interface ComputedDefinition {
    /** 依赖的状态路径 */
    dependencies: string[];
    /** 计算表达式 */
    expression: string;
    /** 是否缓存计算结果 */
    cache?: boolean;
    /** 缓存时间（毫秒） */
    cacheTTL?: number;
    /** 错误处理 */
    onError?: 'throw' | 'ignore' | 'default';
    /** 默认值（错误时返回） */
    defaultValue?: any;
    /** 描述信息 */
    description?: string;
}
/**
 * 组件模板定义
 */
interface TemplateDefinition {
    /** 模板名称 */
    name: string;
    /** 基础组件类型 */
    componentType: string;
    /** 默认属性 */
    properties?: Record<string, any>;
    /** 插槽定义 */
    slots?: string[];
    /** 模板参数 */
    params?: TemplateParam[];
    /** 子组件模板 */
    children?: TemplateDefinition[];
    /** 样式模板 */
    style?: Record<string, any>;
    /** 描述信息 */
    description?: string;
    /** 示例用法 */
    examples?: TemplateExample[];
}
/**
 * 模板参数
 */
interface TemplateParam {
    /** 参数名 */
    name: string;
    /** 参数类型 */
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'expression';
    /** 默认值 */
    defaultValue?: any;
    /** 是否必需 */
    required?: boolean;
    /** 参数描述 */
    description?: string;
    /** 校验规则 */
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        options?: any[];
    };
}
/**
 * 模板示例
 */
interface TemplateExample {
    /** 示例名称 */
    name: string;
    /** 示例参数 */
    params: Record<string, any>;
    /** 示例描述 */
    description?: string;
    /** 预览截图 */
    screenshot?: string;
}
/**
 * 生命周期定义
 */
interface LifecycleDefinition {
    /** 页面加载时 */
    onLoad?: string[];
    /** 页面卸载时 */
    onUnload?: string[];
    /** 页面显示时 */
    onShow?: string[];
    /** 页面隐藏时 */
    onHide?: string[];
    /** 组件挂载后 */
    onMounted?: string[];
    /** 组件更新后 */
    onUpdated?: string[];
    /** 组件销毁前 */
    onBeforeUnmount?: string[];
    /** 错误捕获 */
    onError?: string[];
    /** 状态变化时 */
    onStateChange?: Record<string, string[]>;
    /** 自定义生命周期 */
    custom?: Record<string, LifecycleHook>;
}
/**
 * 生命周期钩子
 */
interface LifecycleHook {
    /** 钩子名称 */
    name: string;
    /** 执行的动作列表 */
    actions: string[];
    /** 执行条件 */
    condition?: string;
    /** 是否异步执行 */
    async?: boolean;
    /** 执行优先级 */
    priority?: number;
    /** 错误处理 */
    onError?: string;
}
/**
 * 主题定义
 */
interface ThemeDefinition {
    /** 主题名称 */
    name: string;
    /** 主题变量 */
    variables: Record<string, any>;
    /** 组件样式覆盖 */
    components?: Record<string, Record<string, any>>;
    /** 断点定义 */
    breakpoints?: Record<string, number>;
    /** 字体定义 */
    fonts?: FontDefinition[];
    /** 颜色调色板 */
    colors?: ColorPalette;
    /** 间距系统 */
    spacing?: SpacingSystem;
    /** 阴影系统 */
    shadows?: ShadowSystem;
    /** 动画配置 */
    animations?: AnimationConfig;
}
/**
 * 字体定义
 */
interface FontDefinition {
    /** 字体族名称 */
    family: string;
    /** 字体源 */
    src: string[];
    /** 字体权重 */
    weights?: number[];
    /** 字体样式 */
    styles?: ('normal' | 'italic')[];
    /** 字体显示 */
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}
/**
 * 颜色调色板
 */
interface ColorPalette {
    /** 主色 */
    primary: ColorScale;
    /** 辅助色 */
    secondary: ColorScale;
    /** 成功色 */
    success: ColorScale;
    /** 警告色 */
    warning: ColorScale;
    /** 错误色 */
    error: ColorScale;
    /** 信息色 */
    info: ColorScale;
    /** 灰度色 */
    gray: ColorScale;
    /** 背景色 */
    background: {
        default: string;
        paper: string;
        elevated: string;
    };
    /** 文本色 */
    text: {
        primary: string;
        secondary: string;
        disabled: string;
        hint: string;
    };
    /** 边框色 */
    border: {
        default: string;
        focus: string;
        error: string;
    };
}
/**
 * 颜色等级
 */
interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}
/**
 * 间距系统
 */
interface SpacingSystem {
    /** 基础单位 */
    unit: number;
    /** 间距比例 */
    scale: number[];
    /** 命名间距 */
    named: Record<string, number>;
}
/**
 * 阴影系统
 */
interface ShadowSystem {
    /** 阴影等级 */
    elevation: string[];
    /** 命名阴影 */
    named: Record<string, string>;
}
/**
 * 动画配置
 */
interface AnimationConfig {
    /** 缓动函数 */
    easing: Record<string, string>;
    /** 持续时间 */
    duration: Record<string, number>;
    /** 预定义动画 */
    presets: Record<string, KeyframeDefinition>;
}
/**
 * 关键帧定义
 */
interface KeyframeDefinition {
    /** 关键帧 */
    keyframes: Record<string, Record<string, any>>;
    /** 动画选项 */
    options?: {
        duration?: number;
        easing?: string;
        iterations?: number;
        direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
        fill?: 'none' | 'forwards' | 'backwards' | 'both';
    };
}
/**
 * 国际化定义
 */
interface I18nDefinition {
    /** 默认语言 */
    defaultLocale: string;
    /** 支持的语言 */
    locales: string[];
    /** 语言资源 */
    resources: Record<string, Record<string, any>>;
    /** 回退策略 */
    fallback?: {
        /** 回退语言 */
        locale: string;
        /** 是否启用键名回退 */
        keyFallback: boolean;
    };
    /** 插值配置 */
    interpolation?: {
        /** 转义HTML */
        escapeValue: boolean;
        /** 插值前缀 */
        prefix: string;
        /** 插值后缀 */
        suffix: string;
    };
}
/**
 * 权限定义
 */
interface PermissionDefinition {
    /** 权限ID */
    id: string;
    /** 权限名称 */
    name: string;
    /** 权限描述 */
    description?: string;
    /** 权限类型 */
    type: 'read' | 'write' | 'execute' | 'admin';
    /** 资源类型 */
    resource: string;
    /** 权限条件 */
    conditions?: PermissionCondition[];
    /** 继承权限 */
    inherits?: string[];
}
/**
 * 权限条件
 */
interface PermissionCondition {
    /** 条件类型 */
    type: 'role' | 'user' | 'time' | 'location' | 'custom';
    /** 条件值 */
    value: any;
    /** 条件操作符 */
    operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte' | 'matches';
}
/**
 * 错误定义
 */
interface ErrorDefinition {
    /** 错误代码 */
    code: string;
    /** 错误消息 */
    message: string;
    /** 错误类型 */
    type: 'validation' | 'network' | 'permission' | 'system' | 'business';
    /** 错误级别 */
    level: 'info' | 'warning' | 'error' | 'fatal';
    /** 恢复建议 */
    recovery?: string[];
    /** 错误详情 */
    details?: Record<string, any>;
    /** 是否可重试 */
    retryable?: boolean;
    /** 是否需要上报 */
    reportable?: boolean;
}

/**
 * 页面Schema的顶层结构
 */
interface PageSchema {
    /** 页面元信息 */
    metadata: Metadata;
    /** 加载策略 */
    loadStrategy: LoadStrategy;
    /** 页面布局 */
    layout: Layout;
    /** 组件字典 */
    components: Record<string, ComponentDefinition>;
    /** 数据源中心 */
    dataSource: Record<string, DataSourceDefinition>;
    /** 行为中心 */
    actions: Record<string, ActionDefinition>;
    /** 初始状态 */
    initialState: Record<string, any>;
    /** 计算属性 */
    computed?: Record<string, ComputedDefinition>;
    /** 组件模板 */
    templates?: Record<string, TemplateDefinition>;
    /** 生命周期 */
    lifecycle?: LifecycleDefinition;
}
/**
 * 页面元信息
 */
interface Metadata {
    /** 页面唯一标识 */
    pageId: string;
    /** 页面名称 */
    name: string;
    /** 版本号 */
    version: string;
    /** 页面描述 */
    description?: string;
    /** SEO信息 */
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
        author?: string;
    };
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
    /** 创建者 */
    author?: string;
    /** 标签 */
    tags?: string[];
}

/**
 * 创建API数据源的辅助函数
 */
declare function createApiDataSource(url: string, options?: Partial<ApiRequestConfig>): DataSourceDefinition;
/**
 * 创建静态数据源的辅助函数
 */
declare function createStaticDataSource(value: any): DataSourceDefinition;
/**
 * 创建组件定义的辅助函数
 */
declare function createComponent(componentType: string, properties?: Record<string, any>, children?: string[]): ComponentDefinition;
/**
 * 创建更新状态动作的辅助函数
 */
declare function createUpdateStateAction(path: string, value: any): ActionDefinition;
/**
 * 创建获取数据动作的辅助函数
 */
declare function createFetchDataAction(dataSourceId: string, resultPath?: string): ActionDefinition;
/**
 * 创建复合动作的辅助函数
 */
declare function createCompositeAction(steps: string[], mode?: 'sequence' | 'parallel' | 'race'): ActionDefinition;
/**
 * 创建导航动作的辅助函数
 */
declare function createNavigateAction(to: string, type?: 'push' | 'replace'): ActionDefinition;
/**
 * 创建消息提示动作的辅助函数
 */
declare function createMessageAction(message: string, type?: 'success' | 'error' | 'warning' | 'info'): ActionDefinition;
/**
 * 创建表单组件的辅助函数
 */
declare function createFormComponent(formItems: ComponentDefinition[], submitAction?: string): ComponentDefinition;
/**
 * 创建表格组件的辅助函数
 */
declare function createTableComponent(columns: Array<{
    key: string;
    title: string;
    [key: string]: any;
}>, dataSource: string): ComponentDefinition;
/**
 * 创建按钮组件的辅助函数
 */
declare function createButtonComponent(text: string, onClick?: string, type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'): ComponentDefinition;
/**
 * 生成唯一ID的辅助函数
 */
declare function generateId(prefix?: string): string;
/**
 * 深度合并对象的辅助函数
 */
declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
/**
 * 验证组件定义的辅助函数
 */
declare function validateComponent(component: ComponentDefinition): string[];
/**
 * 验证数据源定义的辅助函数
 */
declare function validateDataSource(dataSource: DataSourceDefinition): string[];
/**
 * 验证动作定义的辅助函数
 */
declare function validateAction(action: ActionDefinition): string[];
/**
 * 从PageSchema中提取所有组件ID的辅助函数
 */
declare function extractComponentIds(schema: PageSchema): string[];
/**
 * 检查Schema中是否存在循环引用的辅助函数
 */
declare function detectCircularReferences(schema: PageSchema): string[];
/**
 * 获取Schema统计信息的辅助函数
 */
declare function getSchemaStats(schema: PageSchema): {
    componentCount: number;
    dataSourceCount: number;
    actionCount: number;
    computedCount: number;
    templateCount: number;
    initialStateKeys: number;
    componentTypes: Record<string, number>;
    dataSourceTypes: Record<string, number>;
    actionTypes: Record<string, number>;
};

declare const VERSION = "1.0.0";
declare const SCHEMA_VERSION = "1.0";
declare const MIN_SUPPORTED_VERSION = "1.0";
/**
 * 检查Schema版本兼容性
 */
declare function isSchemaVersionCompatible(version: string): boolean;
/**
 * 创建空的PageSchema模板
 */
declare function createEmptyPageSchema(): PageSchema;
/**
 * 验证PageSchema基本结构
 */
declare function validatePageSchema(schema: unknown): schema is PageSchema;
/**
 * 常用的组件类型常量
 */
declare const COMMON_COMPONENT_TYPES: {
    readonly CONTAINER: "Container";
    readonly ROW: "Row";
    readonly COL: "Col";
    readonly FLEX: "Flex";
    readonly GRID: "Grid";
    readonly BUTTON: "Button";
    readonly INPUT: "Input";
    readonly TEXT: "Text";
    readonly IMAGE: "Image";
    readonly LINK: "Link";
    readonly TABLE: "Table";
    readonly LIST: "List";
    readonly CARD: "Card";
    readonly DESCRIPTION: "Description";
    readonly FORM: "Form";
    readonly FORM_ITEM: "FormItem";
    readonly SELECT: "Select";
    readonly CHECKBOX: "Checkbox";
    readonly RADIO: "Radio";
    readonly DATE_PICKER: "DatePicker";
    readonly MODAL: "Modal";
    readonly DRAWER: "Drawer";
    readonly MESSAGE: "Message";
    readonly NOTIFICATION: "Notification";
    readonly MENU: "Menu";
    readonly BREADCRUMB: "Breadcrumb";
    readonly PAGINATION: "Pagination";
    readonly TABS: "Tabs";
};
/**
 * 常用的动作类型常量
 */
declare const COMMON_ACTION_TYPES: {
    readonly UPDATE_STATE: "UPDATE_STATE";
    readonly FETCH_DATA: "FETCH_DATA";
    readonly NAVIGATE: "NAVIGATE";
    readonly SHOW_MESSAGE: "SHOW_MESSAGE";
    readonly OPEN_MODAL: "OPEN_MODAL";
    readonly CLOSE_MODAL: "CLOSE_MODAL";
    readonly VALIDATE_FORM: "VALIDATE_FORM";
    readonly SUBMIT_FORM: "SUBMIT_FORM";
    readonly CALL_API: "CALL_API";
    readonly COMPOSITE: "COMPOSITE";
};
/**
 * 常用的数据源类型常量
 */
declare const COMMON_DATA_SOURCE_TYPES: {
    readonly API_REQUEST: "API_REQUEST";
    readonly STATIC_DATA: "STATIC_DATA";
    readonly LOCAL_STORAGE: "LOCAL_STORAGE";
    readonly COMPUTED: "COMPUTED";
    readonly MOCK: "MOCK";
};

export { type ActionConfig, type ActionDefinition, type ActionRetryConfig, type ActionType, type AnimationConfig, type ApiCallConfig, type ApiRequestConfig, type AuthConfig, COMMON_ACTION_TYPES, COMMON_COMPONENT_TYPES, COMMON_DATA_SOURCE_TYPES, type CacheStrategy, type ColorPalette, type ColorScale, type ComponentDefinition, type ComponentStyle, type CompositeConfig, type ComputedConfig, type ComputedDefinition, type ConditionalConfig, type CustomConfig, type DataSourceCache, type DataSourceConfig, type DataSourceDefinition, type DataSourceType, type DataTransformer, type DelayConfig, type ErrorBoundaryConfig, type ErrorDefinition, type EventConfig, type FetchDataConfig, type FontDefinition, type FormConfig, type GraphQLConfig, type I18nDefinition, type KeyframeDefinition, type Layout, type LifecycleDefinition, type LifecycleHook, type LoadStrategy, type LoopConfig, MIN_SUPPORTED_VERSION, type Metadata, type MockConfig, type ModalConfig, type NavigateConfig, type PageSchema, type PermissionCondition, type PermissionDefinition, type RetryConfig, SCHEMA_VERSION, type ServerSentEventConfig, type ShadowSystem, type ShowMessageConfig, type SlotDefinition, type SpacingSystem, type StaticDataConfig, type StorageConfig, type TemplateDefinition, type TemplateExample, type TemplateParam, type ThemeDefinition, type TimeoutConfig, type UpdateStateConfig, VERSION, type ValidationRule, type WebSocketConfig, createApiDataSource, createButtonComponent, createComponent, createCompositeAction, createEmptyPageSchema, createFetchDataAction, createFormComponent, createMessageAction, createNavigateAction, createStaticDataSource, createTableComponent, createUpdateStateAction, deepMerge, detectCircularReferences, extractComponentIds, generateId, getSchemaStats, isSchemaVersionCompatible, validateAction, validateComponent, validateDataSource, validatePageSchema };
