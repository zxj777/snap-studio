import React, { useEffect, useState } from 'react';
import { useRenderEngine } from '@snap-studio/react';
import { ComponentRenderer } from '@snap-studio/react';
import type { PageSchema } from '@snap-studio/schema';
import type { HttpClient } from '@snap-studio/communication';
// import { setupActionHandlers } from '../schemas/action-handlers';

/**
 * 增强版页面容器
 * 支持自定义 action handlers
 */
export interface EnhancedPageContainerProps {
  schema: PageSchema;
  engineConfig?: {
    debug?: boolean;
    dataLoader?: {
      timeout?: number;
      enableCache?: boolean;
      httpClient?: HttpClient;
    };
  };
  onPageLoad?: (schema: PageSchema) => void;
  onPageError?: (error: string) => void;
}

export const EnhancedPageContainer: React.FC<EnhancedPageContainerProps> = ({
  schema,
  engineConfig = {},
  onPageLoad,
  onPageError
}) => {
  const {
    engine,
    initializePage,
    isInitialized,
    isInitializing,
    initError
  } = useRenderEngine(engineConfig);


  // 页面初始化
  useEffect(() => {
    console.log('🚀 Page initialization check:', { 
      engine: !!engine, 
      isInitialized, 
      isInitializing 
    });
    if (engine) {
      console.log('🚀 Starting page initialization...');
      initializePage(schema).then((result) => {
        console.log('🚀 Page initialization result:', result);
        if (result.success) {
          console.log('✅ Page initialization successful');
          onPageLoad?.(schema);
        } else {
          console.error('❌ Page initialization failed:', result.error);
          onPageError?.(result.error || '页面初始化失败');
        }
      }).catch((error) => {
        console.error('💥 Page initialization error:', error);
        onPageError?.(error.message || '页面初始化异常');
      });
    }
  }, [engine, schema, initializePage, onPageLoad, onPageError]);

  // 显示错误
  if (initError) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        color: '#ff4d4f'
      }}>
        <h3>页面加载失败</h3>
        <p>{initError}</p>
      </div>
    );
  }

  // 显示加载中
  if (isInitializing || !isInitialized || !engine) {
    console.log('⏳ Showing loading state:', { 
      isInitializing, 
      isInitialized, 
      hasEngine: !!engine,
    });
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center'
      }}>
        <div>页面加载中...</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Engine: {engine ? '✅' : '❌'} | 
          Initialized: {isInitialized ? '✅' : '❌'} | 
          Initializing: {isInitializing ? '⏳' : '⭕'} |
        </div>
      </div>
    );
  }

  // 渲染页面内容 - 合并layout.structure中的children信息
  const baseRootDefinition = schema.components[schema.layout.root];
  const layoutNode = schema.layout.structure?.[schema.layout.root];
  
  const rootComponentDefinition = baseRootDefinition ? {
    ...baseRootDefinition,
    ...(layoutNode?.children ? { children: layoutNode.children } : {})
  } : null;
  
  if (!rootComponentDefinition) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        color: '#ff4d4f'
      }}>
        <h3>页面配置错误</h3>
        <p>找不到根组件: {schema.layout.root}</p>
      </div>
    );
  }

  console.log(engine, 'engineengine')

  return (
    <ComponentRenderer
      engine={engine}
      definition={rootComponentDefinition}
      componentId={schema.layout.root}
      enableErrorBoundary={true}
    />
  );
};