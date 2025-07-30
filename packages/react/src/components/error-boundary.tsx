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
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // 在开发环境下记录详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Component Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      if (this.props.componentId) {
        console.error('Component ID:', this.props.componentId);
      }
      if (this.props.componentType) {
        console.error('Component Type:', this.props.componentType);
      }
      console.groupEnd();
    }
  }
  
  render() {
    if (this.state.hasError) {
      // 使用自定义错误UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.state.errorInfo!);
      }
      
      // 默认错误UI
      const errorBoundaryStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        padding: '20px',
        backgroundColor: '#fff2f0',
        border: '2px dashed #ff4d4f',
        borderRadius: '8px',
        margin: '10px 0'
      };

      const contentStyle: React.CSSProperties = {
        textAlign: 'center',
        maxWidth: '600px'
      };

      const titleStyle: React.CSSProperties = {
        color: '#ff4d4f',
        margin: '0 0 16px 0',
        fontSize: '18px'
      };

      const infoStyle: React.CSSProperties = {
        background: 'white',
        padding: '12px',
        borderRadius: '4px',
        margin: '16px 0',
        textAlign: 'left'
      };

      const infoPStyle: React.CSSProperties = {
        margin: '4px 0',
        fontSize: '14px'
      };

      const detailsStyle: React.CSSProperties = {
        margin: '16px 0',
        textAlign: 'left'
      };

      const stackStyle: React.CSSProperties = {
        background: '#f5f5f5',
        padding: '12px',
        borderRadius: '4px',
        maxHeight: '300px',
        overflow: 'auto'
      };

      const preStyle: React.CSSProperties = {
        margin: '0',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      };

      const retryButtonStyle: React.CSSProperties = {
        background: '#1890ff',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '16px'
      };

      return (
        <div style={errorBoundaryStyle}>
          <div style={contentStyle}>
            <h3 style={titleStyle}>
              ⚠️ 组件渲染出错
            </h3>
            
            <div style={infoStyle}>
              {this.props.componentType && (
                <p style={infoPStyle}><strong>组件类型:</strong> {this.props.componentType}</p>
              )}
              {this.props.componentId && (
                <p style={infoPStyle}><strong>组件ID:</strong> {this.props.componentId}</p>
              )}
            </div>
            
            {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && (
              <details style={detailsStyle}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                  错误详情
                </summary>
                <div style={stackStyle}>
                  <pre style={preStyle}>{this.state.error?.stack}</pre>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 style={{ margin: '16px 0 8px 0' }}>组件栈:</h4>
                      <pre style={preStyle}>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <button 
              style={retryButtonStyle}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = '#40a9ff';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = '#1890ff';
              }}
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            >
              重试渲染
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

/**
 * 函数式错误边界Hook
 * 在函数组件中使用错误边界
 */
export function useErrorBoundary(): {
  resetError: () => void;
  captureError: (error: Error) => void;
} {
  const [, setState] = React.useState();
  
  const resetError = React.useCallback(() => {
    setState({} as any);
  }, []);
  
  const captureError = React.useCallback((error: Error) => {
    setState(() => {
      throw error;
    });
  }, []);
  
  return { resetError, captureError };
}