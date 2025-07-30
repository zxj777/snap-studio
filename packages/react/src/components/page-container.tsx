import React, { useEffect, useState, useMemo } from 'react';
import type { PageSchema } from '@snap-studio/schema';
import { useRenderEngine } from '../hooks/use-render-engine.js';
import { ComponentRenderer } from './component-renderer.js';
import { ErrorBoundary } from './error-boundary.js';

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
  loadingComponent?: React.ComponentType<{ progress?: number; message?: string }>;
  /** 错误UI */
  errorComponent?: React.ComponentType<{ error: string; onRetry?: () => void }>;
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
 * 默认加载组件
 */
const DefaultLoadingComponent: React.FC<{ progress?: number; message?: string }> = ({ 
  progress, 
  message = '页面加载中...' 
}) => {
  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '40px 20px'
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '300px'
  };

  const spinnerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1890ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  };

  const messageStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '16px',
    marginBottom: '16px'
  };

  const progressStyle: React.CSSProperties = {
    width: '100%',
    height: '4px',
    backgroundColor: '#f3f3f3',
    borderRadius: '2px',
    overflow: 'hidden'
  };

  const progressBarStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#1890ff',
    transition: 'width 0.3s ease',
    width: `${progress || 0}%`
  };

  return (
    <div style={loadingStyle}>
      <div style={contentStyle}>
        <div style={spinnerStyle}></div>
        <div style={messageStyle}>{message}</div>
        {typeof progress === 'number' && (
          <div style={progressStyle}>
            <div style={progressBarStyle}></div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

/**
 * 默认错误组件
 */
const DefaultErrorComponent: React.FC<{ error: string; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => {
  const errorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    padding: '40px 20px'
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '400px'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '16px'
  };

  const titleStyle: React.CSSProperties = {
    color: '#ff4d4f',
    margin: '0 0 16px 0',
    fontSize: '20px'
  };

  const messageStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '24px',
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '4px',
    textAlign: 'left'
  };

  const retryButtonStyle: React.CSSProperties = {
    background: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={errorStyle}>
      <div style={contentStyle}>
        <div style={iconStyle}>⚠️</div>
        <h3 style={titleStyle}>页面加载失败</h3>
        <div style={messageStyle}>{error}</div>
        {onRetry && (
          <button 
            style={retryButtonStyle}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = '#1890ff';
            }}
            onClick={onRetry}
          >
            重新加载
          </button>
        )}
      </div>
    </div>
  );
};

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
export function PageContainer({
  schema,
  engineConfig = {},
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  enableErrorBoundary = true,
  className,
  style,
  onPageLoad,
  onPageError,
  onPageUnload
}: PageContainerProps): React.ReactElement {
  const { 
    engine, 
    initializePage, 
    isInitialized, 
    isInitializing, 
    initError,
    destroy
  } = useRenderEngine(engineConfig);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('正在初始化页面...');
  
  // 页面初始化
  useEffect(() => {
    let mounted = true;
    
    const initPage = async () => {
      if (!schema || !engine) return;
      
      try {
        setLoadingMessage('正在加载页面配置...');
        setLoadingProgress(20);
        
        const result = await initializePage(schema);
        
        if (!mounted) return;
        
        if (result.success) {
          setLoadingProgress(100);
          setLoadingMessage('加载完成');
          onPageLoad?.(schema);
        } else {
          onPageError?.(result.error || '页面初始化失败');
        }
      } catch (error) {
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        onPageError?.(errorMessage);
      }
    };
    
    initPage();
    
    return () => {
      mounted = false;
    };
  }, [schema, engine, initializePage, onPageLoad, onPageError]);
  
  // 页面卸载
  useEffect(() => {
    return () => {
      if (schema) {
        onPageUnload?.(schema);
      }
      destroy();
    };
  }, [schema, destroy, onPageUnload]);
  
  // 根组件定义
  const rootComponentDefinition = useMemo(() => {
    if (!schema || !isInitialized) return null;
    
    const rootComponentId = schema.layout.root;
    const componentDef = schema.components[rootComponentId];
    
    if (!componentDef) return null;
    
    // 合并layout.structure中的children信息到组件定义中
    const layoutNode = schema.layout.structure?.[rootComponentId];
    if (layoutNode?.children) {
      return {
        ...componentDef,
        children: layoutNode.children
      };
    }
    
    return componentDef;
  }, [schema, isInitialized]);
  
  // 重试函数
  const handleRetry = () => {
    if (schema && engine) {
      setLoadingProgress(0);
      setLoadingMessage('正在重新加载...');
      initializePage(schema);
    }
  };
  
  // 页面容器样式
  const containerStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    ...style
  };
  
  const containerClassName = [
    'snap-studio-page-container',
    schema?.metadata.pageId ? `page-${schema.metadata.pageId}` : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  // 渲染内容
  const renderContent = () => {
    // 显示错误
    if (initError) {
      return <ErrorComponent error={initError} onRetry={handleRetry} />;
    }
    
    // 显示加载中
    if (isInitializing || !isInitialized) {
      return (
        <LoadingComponent 
          progress={loadingProgress} 
          message={loadingMessage} 
        />
      );
    }
    
    // 渲染页面内容
    if (engine && rootComponentDefinition && schema) {
      return (
        <ComponentRenderer
          engine={engine}
          definition={rootComponentDefinition}
          componentId={schema.layout.root}
          enableErrorBoundary={enableErrorBoundary}
        />
      );
    }
    
    return null;
  };
  
  const content = renderContent();
  
  if (enableErrorBoundary) {
    return (
      <div className={containerClassName} style={containerStyle}>
        <ErrorBoundary 
          componentId={schema?.layout.root}
          componentType="PageContainer"
          onError={(error, errorInfo) => {
            console.error('页面容器错误:', error, errorInfo);
            onPageError?.(error.message);
          }}
        >
          {content}
        </ErrorBoundary>
      </div>
    );
  }
  
  return (
    <div className={containerClassName} style={containerStyle}>
      {content}
    </div>
  );
}

/**
 * 页面容器的简化版本
 * 用于快速原型开发
 */
export function SimplePage({
  schema,
  debug = false
}: {
  schema: PageSchema;
  debug?: boolean;
}): React.ReactElement {
  return (
    <PageContainer
      schema={schema}
      engineConfig={{ debug }}
      onPageLoad={(schema) => {
        if (debug) {
          console.log('页面加载完成:', schema.metadata);
        }
      }}
      onPageError={(error) => {
        if (debug) {
          console.error('页面加载失败:', error);
        }
      }}
    />
  );
}