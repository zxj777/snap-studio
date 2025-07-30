import React, { Component, ErrorInfo, ReactNode } from 'react';
/**
 * 错误边界属性
 */
export interface ErrorBoundaryProps {
    /** 子组件 */
    children: ReactNode;
    /** 组件ID（用于错误报告） */
    componentId?: string;
    /** 组件类型（用于错误报告） */
    componentType?: string;
    /** 自定义错误UI */
    fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
    /** 错误回调函数 */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** 是否在开发模式下显示详细错误信息 */
    showErrorDetails?: boolean;
}
/**
 * 错误边界状态
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}
/**
 * React错误边界组件
 * 用于捕获和处理组件渲染错误
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   componentId="comp_user_list"
 *   componentType="DataTable"
 *   onError={(error, errorInfo) => {
 *     console.error('Component error:', error, errorInfo);
 *   }}
 * >
 *   <DataTable data={users} />
 * </ErrorBoundary>
 * ```
 */
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
/**
 * 函数式错误边界Hook
 * 在函数组件中使用错误边界
 */
export declare function useErrorBoundary(): {
    resetError: () => void;
    captureError: (error: Error) => void;
};
export {};
//# sourceMappingURL=error-boundary.d.ts.map