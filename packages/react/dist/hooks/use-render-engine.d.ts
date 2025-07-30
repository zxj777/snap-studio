import { RenderEngine } from '@snap-studio/core';
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
export declare function useRenderEngine(config?: UseRenderEngineConfig): UseRenderEngineReturn;
//# sourceMappingURL=use-render-engine.d.ts.map