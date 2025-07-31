/**
 * 页面布局定义
 */
export interface LayoutDefinition {
    /** 根组件ID */
    root: string;
    /** 页面结构定义 */
    structure: Record<string, LayoutNode>;
    /** 重复内容模板 */
    templates?: Record<string, LayoutTemplate>;
    /** 布局模式 */
    mode?: 'fixed' | 'fluid' | 'responsive';
    /** 响应式断点 */
    breakpoints?: Record<string, number>;
}
/**
 * 布局节点定义
 */
export interface LayoutNode {
    /** 子组件列表 */
    children?: string[];
    /** 插槽定义 */
    slots?: Record<string, string | string[]>;
    /** 动态重复内容 */
    repeat?: LayoutRepeat;
}
/**
 * 布局重复内容定义
 */
export interface LayoutRepeat {
    /** 模板ID */
    template: string;
    /** 数据源表达式 */
    dataSource: string;
    /** 列表项的唯一键 */
    itemKey?: string;
    /** 空状态组件 */
    emptyComponent?: string;
    /** 加载状态组件 */
    loadingComponent?: string;
}
/**
 * 布局模板定义
 */
export interface LayoutTemplate {
    /** 模板根结构 */
    children?: string[];
    /** 插槽定义 */
    slots?: Record<string, string | string[]>;
    /** 嵌套模板 */
    templates?: Record<string, LayoutTemplate>;
    /** 描述信息 */
    description?: string;
}
export type Layout = LayoutDefinition;
/**
 * 组件定义
 */
export interface ComponentDefinition {
    /** 组件类型（对应UI组件库中的组件名） */
    componentType: string;
    /** 组件属性 (用于向后兼容) */
    props?: Record<string, any>;
    /** 组件属性 */
    properties?: Record<string, any>;
    /** 子组件列表 */
    children?: Array<ComponentDefinition | string>;
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
    /** 校验规则 */
    validations?: ValidationRule[];
    /** 组件唯一key */
    key?: string;
    /** 是否懒加载 */
    lazy?: boolean;
    /** 错误边界配置 */
    errorBoundary?: ErrorBoundaryConfig;
    /** 组件描述 */
    description?: string;
}
/**
 * 组件样式定义
 */
export interface ComponentStyle {
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
export interface SlotDefinition {
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
export interface ValidationRule {
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
export interface ErrorBoundaryConfig {
    /** 是否启用错误边界 */
    enabled: boolean;
    /** 降级组件ID */
    fallbackComponent?: string;
    /** 错误处理行为ID */
    onError?: string;
    /** 是否报告错误 */
    reportError?: boolean;
}
