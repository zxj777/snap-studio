import React from 'react';
import type { PageSchema } from '@snap-studio/schema';
/**
 * 页面容器属性
 */
export interface PageContainerProps {
    /** 页面Schema */
    schema: PageSchema;
    /** 渲染引擎配置 */
    engineConfig?: {
        debug?: boolean;
        dataLoader?: {
            timeout?: number;
            retryCount?: number;
            enableCache?: boolean;
        };
        actionExecutor?: {
            timeout?: number;
            maxConcurrency?: number;
        };
    };
    /** 加载中的UI */
    loadingComponent?: React.ComponentType<{
        progress?: number;
        message?: string;
    }>;
    /** 错误UI */
    errorComponent?: React.ComponentType<{
        error: string;
        onRetry?: () => void;
    }>;
    /** 是否启用错误边界 */
    enableErrorBoundary?: boolean;
    /** 页面级别的样式类名 */
    className?: string;
    /** 页面级别的样式 */
    style?: React.CSSProperties;
    /** 生命周期回调 */
    onPageLoad?: (schema: PageSchema) => void;
    onPageError?: (error: string) => void;
    onPageUnload?: (schema: PageSchema) => void;
}
/**
 * 页面容器组件
 * 作为页面的根容器，负责初始化渲染引擎并渲染页面内容
 *
 * @example
 * ```tsx
 * import { PageContainer } from '@snap-studio/react';
 *
 * function App() {
 *   return (
 *     <PageContainer
 *       schema={pageSchema}
 *       engineConfig={{ debug: true }}
 *       onPageLoad={(schema) => {
 *         console.log('页面加载完成:', schema.metadata.name);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export declare function PageContainer({ schema, engineConfig, loadingComponent: LoadingComponent, errorComponent: ErrorComponent, enableErrorBoundary, className, style, onPageLoad, onPageError, onPageUnload }: PageContainerProps): React.ReactElement;
/**
 * 页面容器的简化版本
 * 用于快速原型开发
 */
export declare function SimplePage({ schema, debug }: {
    schema: PageSchema;
    debug?: boolean;
}): React.ReactElement;
//# sourceMappingURL=page-container.d.ts.map