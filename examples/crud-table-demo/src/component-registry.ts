import React from 'react';
import { defaultComponentRegistry } from '@snap-studio/core';
import { 
  Button, 
  Input, 
  Table,
  Row,
  Col,
  Card,
  Space,
  Typography
} from '@snap-studio/ui-components';

/**
 * 设置组件注册表
 * 注册所有可用的低代码组件
 */
export function setupComponentRegistry() {
  // 基础组件
  defaultComponentRegistry.register({
    type: 'Button',
    component: Button,
    description: '按钮组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Input',
    component: Input,
    description: '输入框组件'
  });
  
  // 数据组件
  defaultComponentRegistry.register({
    type: 'Table',
    component: Table,
    description: '表格组件'
  });
  
  // 布局组件
  defaultComponentRegistry.register({
    type: 'Row',
    component: Row,
    description: '行布局组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Col',
    component: Col,
    description: '列布局组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Card',
    component: Card,
    description: '卡片组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Space',
    component: Space,
    description: '间距组件'
  });
  
  // 文本组件
  defaultComponentRegistry.register({
    type: 'Typography',
    component: Typography,
    description: '文本组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Title',
    component: Typography.Title,
    description: '标题组件'
  });
  
  // 容器组件
  defaultComponentRegistry.register({
    type: 'Container',
    component: ({ children, ...props }: any) => {
      return React.createElement('div', {
        style: {
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...props.style
        },
        ...props
      }, children);
    },
    description: '通用容器组件'
  });
  
  const registeredTypes = defaultComponentRegistry.getRegisteredTypes();
  console.log('组件注册完成，已注册组件:', registeredTypes);
  console.log('Container组件是否已注册:', registeredTypes.includes('Container'));
}