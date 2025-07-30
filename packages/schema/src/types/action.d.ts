import type { ValidationRule } from './component.js';
/**
 * 行为动作定义
 */
export interface ActionDefinition {
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
export type ActionType = 'UPDATE_STATE' | 'FETCH_DATA' | 'NAVIGATE' | 'SHOW_MESSAGE' | 'OPEN_MODAL' | 'CLOSE_MODAL' | 'VALIDATE_FORM' | 'SUBMIT_FORM' | 'CALL_API' | 'EMIT_EVENT' | 'DELAY' | 'COMPOSITE' | 'CONDITIONAL' | 'LOOP' | 'CUSTOM';
/**
 * 动作配置
 */
export type ActionConfig = UpdateStateConfig | FetchDataConfig | NavigateConfig | ShowMessageConfig | ModalConfig | FormConfig | ApiCallConfig | EventConfig | DelayConfig | CompositeConfig | ConditionalConfig | LoopConfig | CustomConfig;
/**
 * 更新状态配置
 */
export interface UpdateStateConfig {
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
export interface FetchDataConfig {
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
export interface NavigateConfig {
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
export interface ShowMessageConfig {
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
export interface ModalConfig {
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
export interface FormConfig {
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
export interface ApiCallConfig {
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
export interface EventConfig {
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
export interface DelayConfig {
    /** 延迟时间（毫秒） */
    duration: number;
    /** 延迟后执行的动作 */
    action?: string;
}
/**
 * 复合动作配置
 */
export interface CompositeConfig {
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
export interface ConditionalConfig {
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
export interface LoopConfig {
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
export interface CustomConfig {
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
export interface ActionRetryConfig {
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
//# sourceMappingURL=action.d.ts.map