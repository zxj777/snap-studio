// 核心引擎
export { RenderEngine } from './engine/render-engine.js';
export type { 
  RenderEngineConfig, 
  RenderEngineInitResult 
} from './engine/render-engine.js';
import { RenderEngine, type RenderEngineConfig } from './engine/render-engine.js';
import type { ExpressionEngine } from '@snap-studio/expression-engine';
import { defaultComponentRegistry } from './registry/component-registry.js';

// 组件注册表
export { ComponentRegistry, defaultComponentRegistry } from './registry/component-registry.js';
export type { 
  ComponentConstructor, 
  ComponentRegistration 
} from './registry/component-registry.js';

// 状态管理器
export { StateManager } from './state/state-manager.js';
export type { 
  StateUpdate, 
  StateSubscriber, 
  StateUpdateType 
} from './state/state-manager.js';

// 数据加载器
export { DataLoader } from './data/data-loader.js';
export type { 
  DataLoadResult, 
  DataLoaderConfig 
} from './data/data-loader.js';

// 行为执行器
export { ActionExecutor } from './actions/action-executor.js';
export type { 
  ActionExecutionResult, 
  ActionExecutionContext, 
  ActionExecutorConfig 
} from './actions/action-executor.js';

// 加载策略管理器
export { LoadStrategyManager } from './loading/load-strategy-manager.js';
export type { 
  LoadTask, 
  LoadTaskResult, 
  LoadPlan, 
  LoadPhase,
  LoadStrategyManagerConfig 
} from './loading/load-strategy-manager.js';

// 版本信息
export const VERSION = '1.0.0';

/**
 * 创建默认的渲染引擎实例
 */
export function createRenderEngine(
  expressionEngine: ExpressionEngine,
  config?: RenderEngineConfig
): RenderEngine {
  const engine = new RenderEngine(expressionEngine, config);
  
  // 将默认组件注册表中的组件复制到引擎的组件注册表中
  const defaultTypes = defaultComponentRegistry.getRegisteredTypes();
  defaultTypes.forEach(type => {
    const registration = defaultComponentRegistry.getRegistration(type);
    if (registration) {
      engine.componentRegistry.register(registration);
    }
  });
  
  if (config?.debug) {
    console.log('🔧 Copied components from defaultComponentRegistry:', defaultTypes);
  }
  
  return engine;
}