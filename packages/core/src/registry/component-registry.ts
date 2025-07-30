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
export class ComponentRegistry {
  private components = new Map<string, ComponentRegistration>();
  private aliases = new Map<string, string>();
  
  /**
   * 注册组件
   */
  register(registration: ComponentRegistration): void {
    const { type, component } = registration;
    
    if (!type || !component) {
      throw new Error('组件类型和构造函数不能为空');
    }
    
    if (this.components.has(type)) {
      console.warn(`组件类型 "${type}" 已存在，将被覆盖`);
    }
    
    this.components.set(type, registration);
  }
  
  /**
   * 批量注册组件
   */
  registerBatch(registrations: ComponentRegistration[]): void {
    registrations.forEach(registration => {
      this.register(registration);
    });
  }
  
  /**
   * 获取组件
   */
  get(type: string): ComponentConstructor | undefined {
    // 先检查别名
    const actualType = this.aliases.get(type) || type;
    const registration = this.components.get(actualType);
    return registration?.component;
  }
  
  /**
   * 获取组件注册信息
   */
  getRegistration(type: string): ComponentRegistration | undefined {
    const actualType = this.aliases.get(type) || type;
    return this.components.get(actualType);
  }
  
  /**
   * 检查组件是否已注册
   */
  has(type: string): boolean {
    const actualType = this.aliases.get(type) || type;
    return this.components.has(actualType);
  }
  
  /**
   * 取消注册组件
   */
  unregister(type: string): boolean {
    return this.components.delete(type);
  }
  
  /**
   * 创建组件别名
   */
  createAlias(alias: string, targetType: string): void {
    if (!this.components.has(targetType)) {
      throw new Error(`目标组件类型 "${targetType}" 不存在`);
    }
    
    this.aliases.set(alias, targetType);
  }
  
  /**
   * 获取所有已注册的组件类型
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.components.keys());
  }
  
  /**
   * 获取所有别名
   */
  getAliases(): Record<string, string> {
    return Object.fromEntries(this.aliases);
  }
  
  /**
   * 清空注册表
   */
  clear(): void {
    this.components.clear();
    this.aliases.clear();
  }
  
  /**
   * 获取注册表统计信息
   */
  getStats(): {
    componentCount: number;
    aliasCount: number;
    types: string[];
  } {
    return {
      componentCount: this.components.size,
      aliasCount: this.aliases.size,
      types: this.getRegisteredTypes()
    };
  }
  
  /**
   * 验证组件定义是否有对应的注册组件
   */
  validateComponentDefinition(definition: ComponentDefinition): {
    isValid: boolean;
    missingTypes: string[];
  } {
    const missingTypes: string[] = [];
    
    const checkType = (type: string) => {
      if (!this.has(type)) {
        missingTypes.push(type);
      }
    };
    
    // 检查主组件类型
    checkType(definition.componentType);
    
    // 递归检查子组件
    if (definition.children) {
      definition.children.forEach(child => {
        if (typeof child === 'object' && child.componentType) {
          const childResult = this.validateComponentDefinition(child);
          missingTypes.push(...childResult.missingTypes);
        }
      });
    }
    
    return {
      isValid: missingTypes.length === 0,
      missingTypes: [...new Set(missingTypes)] // 去重
    };
  }
}

/**
 * 默认组件注册表实例
 */
export const defaultComponentRegistry = new ComponentRegistry();