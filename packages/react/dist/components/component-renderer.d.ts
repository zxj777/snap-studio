import React from 'react';
import type { ComponentDefinition } from '@snap-studio/schema';
import type { RenderEngine } from '@snap-studio/core';
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
export declare function ComponentRenderer({ engine, definition, componentId, extraProps, enableErrorBoundary }: ComponentRendererProps): React.ReactElement | null;
/**
 * 组件渲染器的简化版本
 * 用于仅渲染单个组件，不处理复杂的绑定逻辑
 */
export declare function SimpleComponentRenderer({ componentType, properties, children, componentRegistry }: {
    componentType: string;
    properties?: Record<string, any>;
    children?: React.ReactNode;
    componentRegistry: import('@snap-studio/core').ComponentRegistry;
}): React.ReactElement | null;
//# sourceMappingURL=component-renderer.d.ts.map