import { useRef, useEffect, useState, useCallback } from 'react';
import { RenderEngine, createRenderEngine } from '@snap-studio/core';
import { ExpressionEngine } from '@snap-studio/expression-engine';
import type { PageSchema } from '@snap-studio/schema';
import type { RenderEngineConfig, RenderEngineInitResult } from '@snap-studio/core';

/**
 * 渲染引擎Hook配置
 */
export interface UseRenderEngineConfig extends RenderEngineConfig {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** 表达式引擎配置 */
  expressionEngine?: {
    debug?: boolean;
    transforms?: Record<string, Function>;
  };
}

/**
 * 渲染引擎Hook返回值
 */
export interface UseRenderEngineReturn {
  /** 渲染引擎实例 */
  engine: RenderEngine | null;
  /** 初始化页面 */
  initializePage: (schema: PageSchema) => Promise<RenderEngineInitResult>;
  /** 是否已初始化 */
  isInitialized: boolean;
  /** 是否正在初始化 */
  isInitializing: boolean;
  /** 初始化错误 */
  initError: string | null;
  /** 销毁引擎 */
  destroy: () => Promise<void>;
  /** 获取引擎统计信息 */
  getStats: () => any;
}

/**
 * React渲染引擎Hook
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { engine, initializePage, isInitialized } = useRenderEngine({
 *     debug: true
 *   });
 *   
 *   useEffect(() => {
 *     initializePage(pageSchema);
 *   }, []);
 *   
 *   if (!isInitialized) return <div>Loading...</div>;
 *   
 *   return <PageRenderer engine={engine} />;
 * }
 * ```
 */
export function useRenderEngine(
  config: UseRenderEngineConfig = {}
): UseRenderEngineReturn {
  const engineRef = useRef<RenderEngine | null>(null);
  const expressionEngineRef = useRef<ExpressionEngine | null>(null);
  
  const [engine, setEngine] = useState<RenderEngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  // 初始化引擎实例（只执行一次）
  useEffect(() => {
    if (!engineRef.current) {
      try {
        console.log('🔧 Creating ExpressionEngine...');
        // 创建表达式引擎
        expressionEngineRef.current = new ExpressionEngine(config.expressionEngine);
        console.log('✅ ExpressionEngine created:', expressionEngineRef.current);
        
        console.log('🔧 Creating RenderEngine...');
        // 创建渲染引擎
        engineRef.current = createRenderEngine(
          expressionEngineRef.current,
          config
        );
        console.log('✅ RenderEngine created:', engineRef.current);
        
        // 更新状态以触发组件重新渲染
        setEngine(engineRef.current);
        
        if (config.debug) {
          console.log('🐛 Debug mode enabled for RenderEngine');
        }
      } catch (error) {
        console.error('❌ Failed to create engines:', error);
        setInitError(`引擎创建失败: ${error.message}`);
      }
    }
    
    // 清理函数
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy().catch(console.error);
        engineRef.current = null;
        expressionEngineRef.current = null;
        setEngine(null);
        setIsInitialized(false);
      }
    };
  }, []); // 空依赖数组，只执行一次
  
  /**
   * 初始化页面Schema
   */
  const initializePage = useCallback(async (schema: PageSchema): Promise<RenderEngineInitResult> => {
    if (!engineRef.current) {
      throw new Error('渲染引擎未创建');
    }
    
    setIsInitializing(true);
    setInitError(null);
    
    try {
      const result = await engineRef.current.initialize(schema);
      
      if (result.success) {
        setIsInitialized(true);
        if (config.debug) {
          console.log('页面初始化成功:', result);
        }
      } else {
        setInitError(result.error || '初始化失败');
        if (config.debug) {
          console.error('页面初始化失败:', result.error);
        }
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化异常';
      setInitError(errorMessage);
      
      if (config.debug) {
        console.error('页面初始化异常:', error);
      }
      
      return {
        success: false,
        duration: 0,
        error: errorMessage,
        loadedDataSources: 0,
        registeredComponents: 0
      };
    } finally {
      setIsInitializing(false);
    }
  }, [config.debug]);
  
  /**
   * 销毁引擎
   */
  const destroy = useCallback(async (): Promise<void> => {
    if (engineRef.current) {
      await engineRef.current.destroy();
      engineRef.current = null;
      expressionEngineRef.current = null;
      setEngine(null);
      setIsInitialized(false);
      setInitError(null);
    }
  }, []);
  
  /**
   * 获取引擎统计信息
   */
  const getStats = useCallback(() => {
    return engineRef.current?.getStats() || null;
  }, []);
  
  return {
    engine,
    initializePage,
    isInitialized,
    isInitializing,
    initError,
    destroy,
    getStats
  };
}