export { RenderEngine } from './engine/render-engine.js';
export type { RenderEngineConfig, RenderEngineInitResult } from './engine/render-engine.js';
import { RenderEngine, type RenderEngineConfig } from './engine/render-engine.js';
import type { ExpressionEngine } from '@snap-studio/expression-engine';
export { ComponentRegistry, defaultComponentRegistry } from './registry/component-registry.js';
export type { ComponentConstructor, ComponentRegistration } from './registry/component-registry.js';
export { StateManager } from './state/state-manager.js';
export type { StateUpdate, StateSubscriber, StateUpdateType } from './state/state-manager.js';
export { DataLoader } from './data/data-loader.js';
export type { DataLoadResult, DataLoaderConfig } from './data/data-loader.js';
export { ActionExecutor } from './actions/action-executor.js';
export type { ActionExecutionResult, ActionExecutionContext, ActionExecutorConfig } from './actions/action-executor.js';
export { LoadStrategyManager } from './loading/load-strategy-manager.js';
export type { LoadTask, LoadTaskResult, LoadPlan, LoadPhase, LoadStrategyManagerConfig } from './loading/load-strategy-manager.js';
export declare const VERSION = "1.0.0";
/**
 * 创建默认的渲染引擎实例
 */
export declare function createRenderEngine(expressionEngine: ExpressionEngine, config?: RenderEngineConfig): RenderEngine;
//# sourceMappingURL=index.d.ts.map