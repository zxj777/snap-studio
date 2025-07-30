import React from 'react';
import { Input as AntInput, type InputProps as AntInputProps } from 'antd';
import { createLowCodeComponent } from '../base-component.js';
import type { LowCodeComponentProps } from '../base-component.js';

/**
 * 低代码输入框组件属性
 */
export interface InputProps extends LowCodeComponentProps, Omit<AntInputProps, 'disabled'> {
  /** 输入框类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  /** 占位符 */
  placeholder?: string;
  /** 输入框大小 */
  size?: 'large' | 'middle' | 'small';
  /** 前缀图标 */
  prefix?: React.ReactNode;
  /** 后缀图标 */
  suffix?: React.ReactNode;
  /** 前置标签 */
  addonBefore?: React.ReactNode;
  /** 后置标签 */
  addonAfter?: React.ReactNode;
  /** 是否显示清空按钮 */
  allowClear?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 输入状态 */
  status?: 'error' | 'warning';
  /** 值变化事件 action ID */
  onChangeActionId?: string;
  /** 值变化事件处理函数 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 失去焦点事件 action ID */
  onBlurActionId?: string;
  /** 失去焦点事件处理函数 */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 获得焦点事件 action ID */
  onFocusActionId?: string;
  /** 获得焦点事件处理函数 */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 按下回车事件 action ID */
  onPressEnterActionId?: string;
  /** 按下回车事件处理函数 */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * 基础输入框组件
 * 基于 antd Input 封装，增加低代码特性
 * 
 * @example
 * ```tsx
 * <Input 
 *   placeholder="请输入用户名" 
 *   onChangeActionId="act_update_username"
 *   allowClear
 * />
 * ```
 */
export const BaseInput: React.FC<InputProps> = ({
  onChangeActionId,
  onChange,
  onBlurActionId,
  onBlur,
  onFocusActionId,
  onFocus,
  onPressEnterActionId,
  onPressEnter,
  ...props
}) => {
  return React.createElement(AntInput, {
    ...props,
    onChange,
    onBlur,
    onFocus,
    onPressEnter
  });
};

// 创建低代码输入框组件
export const Input = createLowCodeComponent(BaseInput);

/**
 * 文本域组件属性
 */
export interface TextAreaProps extends LowCodeComponentProps {
  /** 占位符 */
  placeholder?: string;
  /** 行数 */
  rows?: number;
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
  /** 是否自动调整高度 */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** 是否显示清空按钮 */
  allowClear?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 输入状态 */
  status?: 'error' | 'warning';
  /** 值变化事件 action ID */
  onChangeActionId?: string;
  /** 值变化事件处理函数 */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * 基础文本域组件
 */
export const BaseTextArea: React.FC<TextAreaProps> = ({
  onChangeActionId,
  onChange,
  ...props
}) => {
  return React.createElement(AntInput.TextArea, {
    ...props,
    onChange
  });
};

// 创建低代码文本域组件
export const TextArea = createLowCodeComponent(BaseTextArea);

// 将 TextArea 作为 Input 的静态属性
(Input as any).TextArea = TextArea;