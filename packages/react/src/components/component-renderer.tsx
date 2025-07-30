import React, { useMemo, useCallback } from 'react';
import type { ComponentDefinition } from '@snap-studio/schema';
import type { RenderEngine } from '@snap-studio/core';
import { usePageStates } from '../hooks/use-page-state.js';
import { useActionExecutor } from '../hooks/use-action-executor.js';
import { ErrorBoundary } from './error-boundary.js';

/**
 * 组件渲染器属性
 */
export interface ComponentRendererProps {
  /** 渲染引擎实例 */
  engine: RenderEngine;
  /** 组件定义 */
  definition: ComponentDefinition;
  /** 组件ID */
  componentId?: string;
  /** 额外的属性 */
  extraProps?: Record<string, any>;
  /** 是否启用错误边界 */
  enableErrorBoundary?: boolean;
}

/**
 * 动态组件渲染器
 * 将JSON定义转换为React组件
 * 
 * @example
 * ```tsx
 * function MyPage({ engine, pageSchema }) {
 *   const rootComponent = pageSchema.components[pageSchema.layout.root];
 *   
 *   return (
 *     <ComponentRenderer 
 *       engine={engine}
 *       definition={rootComponent}
 *       componentId={pageSchema.layout.root}
 *     />
 *   );
 * }
 * ```
 */
export function ComponentRenderer({
  engine,
  definition,
  componentId,
  extraProps = {},
  enableErrorBoundary = true
}: ComponentRendererProps): React.ReactElement | null {
  const { execute } = useActionExecutor(engine.actionExecutor);
  const ComponentClass = engine.componentRegistry.get(definition.componentType);
  
  // 处理数据绑定 - 收集所有数据路径
  const dataBindingPaths = useMemo(() => {
    if (!definition.dataBinding) return [];
    
    return Object.entries(definition.dataBinding)
      .filter(([_, dataPath]) => typeof dataPath === 'string')
      .map(([propName, dataPath]) => ({ propName, dataPath: dataPath as string }));
  }, [definition.dataBinding]);
  
  // 使用 usePageStates 批量订阅数据
  const { states: boundData } = usePageStates(
    engine.stateManager,
    dataBindingPaths.map((item: { propName: string; dataPath: string }) => item.dataPath),
    {}
  );
  
  // 构建数据绑定属性
  const dataBindingProps = useMemo(() => {
    if (!definition.dataBinding) return {};
    
    const props: Record<string, any> = {};
    
    dataBindingPaths.forEach(({ propName, dataPath }: { propName: string; dataPath: string }) => {
      props[propName] = boundData[dataPath];
    });
    
    // 处理复杂数据绑定（非字符串类型）
    Object.entries(definition.dataBinding).forEach(([propName, dataPath]) => {
      if (typeof dataPath === 'object') {
        props[propName] = dataPath;
      }
    });
    
    return props;
  }, [definition.dataBinding, dataBindingPaths, boundData]);
  
  // 处理动态属性
  const dynamicProps = useMemo(() => {
    if (!definition.dynamicProps) return {};
    
    const props: Record<string, any> = {};
    
    Object.entries(definition.dynamicProps).forEach(([propName, expression]) => {
      try {
        // 同步计算表达式值
        const context = {
          state: engine.stateManager.get(),
          // 可以添加更多上下文
        };
        
        const value = engine.stateManager.expressionEngine?.evaluateSync(expression, context);
        props[propName] = value;
      } catch (error) {
        console.warn(`动态属性计算失败: ${propName}`, error);
        props[propName] = undefined;
      }
    });
    
    return props;
  }, [definition.dynamicProps, engine.stateManager]);
  
  // 处理事件绑定
  const eventProps = useMemo(() => {
    if (!definition.events) return {};
    
    const props: Record<string, any> = {};
    
    Object.entries(definition.events).forEach(([eventName, actionId]) => {
      props[eventName] = async (event: Event) => {
        try {
          await execute(actionId, {
            event,
            target: event.target,
            payload: { componentId, eventName }
          });
        } catch (error) {
          console.error(`事件处理失败: ${eventName}`, error);
        }
      };
    });
    
    return props;
  }, [definition.events, execute, componentId]);
  
  // 检查可见性
  const isVisible = useMemo(() => {
    if (!definition.visibility) return true;
    
    try {
      const context = {
        state: engine.stateManager.get(),
      };
      
      return Boolean(
        engine.stateManager.expressionEngine?.evaluateSync(definition.visibility, context)
      );
    } catch (error) {
      console.warn('可见性条件计算失败:', error);
      return true;
    }
  }, [definition.visibility, engine.stateManager]);
  
  // 渲染子组件
  const renderChildren = useCallback(() => {
    if (!definition.children) return undefined;
    
    return definition.children.map((child: ComponentDefinition | string, index: number) => {
      if (typeof child === 'string') {
        // 字符串类型的子组件（组件ID引用）
        const childDefinition = engine.getCurrentSchema()?.components[child];
        if (!childDefinition) {
          console.warn(`子组件未找到: ${child}`);
          return null;
        }
        
        return React.createElement(ComponentRenderer, {
          key: child,
          engine,
          definition: childDefinition,
          componentId: child,
          enableErrorBoundary
        });
      } else if (typeof child === 'object') {
        // 内联组件定义
        return React.createElement(ComponentRenderer, {
          key: `inline-${index}`,
          engine,
          definition: child as ComponentDefinition,
          componentId: `${componentId}-child-${index}`,
          enableErrorBoundary
        });
      } else {
        // 纯文本内容
        return child;
      }
    });
  }, [definition.children, engine, componentId, enableErrorBoundary]);
  
  // 如果组件不可见，返回null
  if (!isVisible) {
    return null;
  }
  
  // 如果组件类型未注册，显示错误提示
  if (!ComponentClass) {
    const ErrorComponent = () => React.createElement('div', 
      { 
        style: { 
          padding: '16px', 
          border: '2px dashed #ff4d4f', 
          borderRadius: '4px',
          backgroundColor: '#fff2f0',
          color: '#ff4d4f'
        }
      },
      React.createElement('strong', null, `组件类型未注册: ${definition.componentType}`),
      componentId && React.createElement('div', null, `组件ID: ${componentId}`)
    );
    
    return enableErrorBoundary ? 
      React.createElement(ErrorBoundary, 
        { componentId, componentType: definition.componentType },
        React.createElement(ErrorComponent)
      ) : 
      React.createElement(ErrorComponent);
  }
  
  // 合并所有属性
  const allProps = {
    ...(definition.properties || definition.props || {}),
    ...dataBindingProps,
    ...dynamicProps,
    ...eventProps,
    ...extraProps,
    children: renderChildren()
  };
  
  // 创建组件元素
  const element = React.createElement(ComponentClass, allProps);
  
  // 是否包装错误边界
  if (enableErrorBoundary) {
    return React.createElement(ErrorBoundary, 
      { componentId, componentType: definition.componentType },
      element
    );
  }
  
  return element;
}

/**
 * 组件渲染器的简化版本
 * 用于仅渲染单个组件，不处理复杂的绑定逻辑
 */
export function SimpleComponentRenderer({
  componentType,
  properties = {},
  children,
  componentRegistry
}: {
  componentType: string;
  properties?: Record<string, any>;
  children?: React.ReactNode;
  componentRegistry: import('@snap-studio/core').ComponentRegistry;
}): React.ReactElement | null {
  const ComponentClass = componentRegistry.get(componentType);
  
  if (!ComponentClass) {
    return React.createElement('div', 
      { style: { color: 'red' } }, 
      `Unknown component: ${componentType}`
    );
  }
  
  return React.createElement(ComponentClass, { ...properties, children });
}