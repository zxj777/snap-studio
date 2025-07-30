import React from 'react';
import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import { createLowCodeComponent } from '../base-component.js';
import type { LowCodeComponentProps } from '../base-component.js';

/**
 * 低代码按钮组件属性
 */
export interface ButtonProps extends LowCodeComponentProps, Omit<AntButtonProps, 'disabled'> {
  /** 按钮文本 */
  text?: string;
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  /** 按钮大小 */
  size?: 'large' | 'middle' | 'small';
  /** 按钮形状 */
  shape?: 'default' | 'circle' | 'round';
  /** 图标 */
  icon?: React.ReactNode;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否为危险按钮 */
  danger?: boolean;
  /** 是否为幽灵按钮 */
  ghost?: boolean;
  /** 是否为块级按钮 */
  block?: boolean;
  /** 点击事件 action ID */
  onClickActionId?: string;
  /** 点击事件处理函数 */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * 基础按钮组件
 * 基于 antd Button 封装，增加低代码特性
 * 
 * @example
 * ```tsx
 * <Button 
 *   text="提交" 
 *   type="primary" 
 *   onClickActionId="act_submit_form"
 *   loading={isSubmitting}
 * />
 * ```
 */
export const BaseButton: React.FC<ButtonProps> = ({
  text,
  children,
  onClickActionId,
  onClick,
  ...props
}) => {
  return React.createElement(AntButton, {
    ...props,
    onClick: onClick
  }, text || children);
};

// 创建低代码按钮组件
export const Button = createLowCodeComponent(BaseButton);