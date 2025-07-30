import type { ComponentDefinition } from '@snap-studio/schema';
/**
 * 组件构造函数类型定义
 */
export type ComponentConstructor<TProps = any> = (props: TProps) => any;
/**
 * 组件注册信息
 */
export interface ComponentRegistration {
    /** 组件构造函数 */
    component: ComponentConstructor;
    /** 组件类型名称 */
    type: string;
    /** 组件描述 */
    description?: string;
    /** 默认属性 */
    defaultProps?: Record<string, any>;
    /** 属性类型定义 */
    propTypes?: Record<string, any>;
}
/**
 * 组件注册表
 * 负责管理所有可用的组件类型
 */
export declare class ComponentRegistry {
    private components;
    private aliases;
    /**
     * 注册组件
     */
    register(registration: ComponentRegistration): void;
    /**
     * 批量注册组件
     */
    registerBatch(registrations: ComponentRegistration[]): void;
    /**
     * 获取组件
     */
    get(type: string): ComponentConstructor | undefined;
    /**
     * 获取组件注册信息
     */
    getRegistration(type: string): ComponentRegistration | undefined;
    /**
     * 检查组件是否已注册
     */
    has(type: string): boolean;
    /**
     * 取消注册组件
     */
    unregister(type: string): boolean;
    /**
     * 创建组件别名
     */
    createAlias(alias: string, targetType: string): void;
    /**
     * 获取所有已注册的组件类型
     */
    getRegisteredTypes(): string[];
    /**
     * 获取所有别名
     */
    getAliases(): Record<string, string>;
    /**
     * 清空注册表
     */
    clear(): void;
    /**
     * 获取注册表统计信息
     */
    getStats(): {
        componentCount: number;
        aliasCount: number;
        types: string[];
    };
    /**
     * 验证组件定义是否有对应的注册组件
     */
    validateComponentDefinition(definition: ComponentDefinition): {
        isValid: boolean;
        missingTypes: string[];
    };
}
/**
 * 默认组件注册表实例
 */
export declare const defaultComponentRegistry: ComponentRegistry;
//# sourceMappingURL=component-registry.d.ts.map