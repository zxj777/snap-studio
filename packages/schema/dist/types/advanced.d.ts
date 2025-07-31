/**
 * 计算属性定义
 */
export interface ComputedDefinition {
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
export interface TemplateDefinition {
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
export interface TemplateParam {
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
export interface TemplateExample {
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
export interface LifecycleDefinition {
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
export interface LifecycleHook {
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
export interface ThemeDefinition {
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
export interface FontDefinition {
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
export interface ColorPalette {
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
export interface ColorScale {
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
export interface SpacingSystem {
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
export interface ShadowSystem {
    /** 阴影等级 */
    elevation: string[];
    /** 命名阴影 */
    named: Record<string, string>;
}
/**
 * 动画配置
 */
export interface AnimationConfig {
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
export interface KeyframeDefinition {
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
export interface I18nDefinition {
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
export interface PermissionDefinition {
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
export interface PermissionCondition {
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
export interface ErrorDefinition {
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
