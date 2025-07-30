import React from 'react';
import type { LowCodeComponentProps } from '../types/index.js';

// 重新导出 LowCodeComponentProps 供其他组件使用
export type { LowCodeComponentProps };

/**
 * 基础组件包装器
 * 为所有低代码组件提供通用功能
 */
export interface BaseComponentWrapperProps extends LowCodeComponentProps {
  /** 包装的组件 */
  component: React.ComponentType<any>;
  /** 传递给组件的属性 */
  componentProps?: Record<string, any>;
  /** 权限检查函数 */
  hasPermission?: (permission: string | string[]) => boolean;
}

/**
 * 基础组件包装器
 * 处理权限控制、显示隐藏等通用逻辑
 */
export const BaseComponentWrapper: React.FC<BaseComponentWrapperProps> = ({
  children,
  className,
  style,
  'data-testid': testId,
  disabled = false,
  hidden = false,
  permission,
  component: Component,
  componentProps = {},
  hasPermission,
  ...props
}) => {
  // 权限检查
  if (permission && hasPermission && !hasPermission(permission)) {
    return null;
  }

  // 隐藏检查
  if (hidden) {
    return null;
  }

  // 合并样式
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(hidden ? { display: 'none' } : {})
  };

  // 合并类名
  const mergedClassName = [
    'snap-lowcode-component',
    className,
    disabled ? 'snap-disabled' : ''
  ].filter(Boolean).join(' ');

  // 合并组件属性
  const mergedProps = {
    ...componentProps,
    ...props,
    className: mergedClassName,
    style: mergedStyle,
    disabled,
    'data-testid': testId
  };

  return React.createElement(Component, mergedProps, children);
};

/**
 * 创建低代码组件的高阶函数
 */
export function createLowCodeComponent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  defaultProps?: Partial<T>
) {
  const LowCodeComponent = React.forwardRef<any, LowCodeComponentProps & T>((props, ref) => {
    const {
      children,
      className,
      style,
      'data-testid': testId,
      disabled,
      hidden,
      permission,
      ...componentProps
    } = props;

    return React.createElement(BaseComponentWrapper, {
      children,
      className,
      style,
      'data-testid': testId,
      disabled,
      hidden,
      permission,
      component: Component,
      componentProps: {
        ...defaultProps,
        ...componentProps,
        ref
      }
    });
  });

  LowCodeComponent.displayName = `LowCode(${Component.displayName || Component.name})`;
  
  return LowCodeComponent;
}