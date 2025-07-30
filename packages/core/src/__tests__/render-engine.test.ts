import { describe, it, expect, beforeEach } from 'vitest';
import { ExpressionEngine } from '@snap-studio/expression-engine';
import { RenderEngine } from '../engine/render-engine.js';
import type { PageSchema } from '@snap-studio/schema';

describe('RenderEngine', () => {
  let renderEngine: RenderEngine;
  let expressionEngine: ExpressionEngine;
  
  beforeEach(() => {
    expressionEngine = new ExpressionEngine();
    renderEngine = new RenderEngine(expressionEngine, { debug: true });
  });
  
  it('应该能够正确初始化', () => {
    expect(renderEngine).toBeDefined();
    expect(renderEngine.componentRegistry).toBeDefined();
    expect(renderEngine.stateManager).toBeDefined();
    expect(renderEngine.dataLoader).toBeDefined();
    expect(renderEngine.actionExecutor).toBeDefined();
    expect(renderEngine.loadStrategyManager).toBeDefined();
  });
  
  it('应该能够初始化页面Schema', async () => {
    const schema: PageSchema = {
      metadata: {
        pageId: 'test-page',
        name: '测试页面',
        version: '1.0.0'
      },
      loadStrategy: {
        initial: ['ds_test_data']
      },
      layout: {
        root: 'comp_root'
      },
      components: {
        'comp_root': {
          componentType: 'Container',
          properties: {
            className: 'root-container'
          }
        }
      },
      dataSource: {
        'ds_test_data': {
          type: 'STATIC_DATA',
          config: {
            value: { message: 'Hello World' }
          }
        }
      },
      actions: {
        'act_test': {
          type: 'UPDATE_STATE',
          config: {
            path: 'testValue',
            value: 'updated'
          }
        }
      },
      initialState: {
        testValue: 'initial'
      }
    };
    
    const result = await renderEngine.initialize(schema);
    
    expect(result.success).toBe(true);
    expect(result.loadedDataSources).toBe(1);
    expect(renderEngine.getInitializationStatus()).toBe(true);
    expect(renderEngine.getCurrentSchema()).toEqual(schema);
  });
  
  it('应该能够管理状态', async () => {
    const schema: PageSchema = {
      metadata: {
        pageId: 'test-state',
        name: '状态测试',
        version: '1.0.0'
      },
      loadStrategy: {
        initial: []
      },
      layout: {
        root: 'comp_root'
      },
      components: {
        'comp_root': {
          componentType: 'Container'
        }
      },
      dataSource: {},
      actions: {},
      initialState: {
        counter: 0,
        user: {
          name: '张三',
          age: 25
        }
      }
    };
    
    await renderEngine.initialize(schema);
    
    // 测试状态获取
    expect(renderEngine.stateManager.get('counter')).toBe(0);
    expect(renderEngine.stateManager.get('user.name')).toBe('张三');
    
    // 测试状态更新
    renderEngine.stateManager.set('counter', 5);
    expect(renderEngine.stateManager.get('counter')).toBe(5);
    
    renderEngine.stateManager.merge('user', { age: 26 });
    expect(renderEngine.stateManager.get('user.age')).toBe(26);
    expect(renderEngine.stateManager.get('user.name')).toBe('张三');
  });
  
  it('应该能够执行行为', async () => {
    const schema: PageSchema = {
      metadata: {
        pageId: 'test-actions',
        name: '行为测试',
        version: '1.0.0'
      },
      loadStrategy: {
        initial: []
      },
      layout: {
        root: 'comp_root'
      },
      components: {
        'comp_root': {
          componentType: 'Container'
        }
      },
      dataSource: {},
      actions: {
        'act_increment': {
          type: 'UPDATE_STATE',
          config: {
            path: 'counter',
            value: '{{state.counter + 1}}'
          }
        }
      },
      initialState: {
        counter: 0
      }
    };
    
    await renderEngine.initialize(schema);
    
    // 执行行为
    const result = await renderEngine.actionExecutor.execute('act_increment');
    
    expect(result.success).toBe(true);
    expect(renderEngine.stateManager.get('counter')).toBe(1);
  });
  
  it('应该能够处理数据源', async () => {
    const schema: PageSchema = {
      metadata: {
        pageId: 'test-data',
        name: '数据测试',
        version: '1.0.0'
      },
      loadStrategy: {
        initial: ['ds_user_data']
      },
      layout: {
        root: 'comp_root'
      },
      components: {
        'comp_root': {
          componentType: 'Container'
        }
      },
      dataSource: {
        'ds_user_data': {
          type: 'STATIC_DATA',
          config: {
            value: {
              id: 1,
              name: '用户1',
              email: 'user1@example.com'
            }
          }
        },
        'ds_computed': {
          type: 'COMPUTED',
          config: {
            expression: 'state.userData.name + " (" + state.userData.email + ")"',
            dependencies: ['state.userData']
          }
        }
      },
      actions: {},
      initialState: {}
    };
    
    await renderEngine.initialize(schema);
    
    // 测试静态数据加载
    const dataResult = await renderEngine.dataLoader.loadSingle('ds_user_data');
    expect(dataResult.success).toBe(true);
    expect(dataResult.data.name).toBe('用户1');
  });
  
  it('应该能够正确销毁', async () => {
    const schema: PageSchema = {
      metadata: {
        pageId: 'test-destroy',
        name: '销毁测试',
        version: '1.0.0'
      },
      loadStrategy: {
        initial: []
      },
      layout: {
        root: 'comp_root'
      },
      components: {
        'comp_root': {
          componentType: 'Container'
        }
      },
      dataSource: {},
      actions: {},
      initialState: { test: 'value' }
    };
    
    await renderEngine.initialize(schema);
    expect(renderEngine.getInitializationStatus()).toBe(true);
    
    await renderEngine.destroy();
    expect(renderEngine.getInitializationStatus()).toBe(false);
    expect(renderEngine.getCurrentSchema()).toBeUndefined();
  });
});