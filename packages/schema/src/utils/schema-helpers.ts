import type { PageSchema } from '../types/page-schema.js';
import type { ComponentDefinition } from '../types/component.js';
import type { DataSourceDefinition, ApiRequestConfig, StaticDataConfig } from '../types/data-source.js';
import type { 
  ActionDefinition, 
  UpdateStateConfig, 
  FetchDataConfig, 
  NavigateConfig, 
  CompositeConfig 
} from '../types/action.js';

/**
 * 创建API数据源的辅助函数
 */
export function createApiDataSource(
  url: string,
  options: Partial<ApiRequestConfig> = {}
): DataSourceDefinition {
  return {
    type: 'API_REQUEST',
    config: {
      url,
      method: 'GET',
      ...options
    }
  };
}

/**
 * 创建静态数据源的辅助函数
 */
export function createStaticDataSource(value: any): DataSourceDefinition {
  return {
    type: 'STATIC_DATA',
    config: {
      value
    } as StaticDataConfig
  };
}

/**
 * 创建组件定义的辅助函数
 */
export function createComponent(
  componentType: string,
  props: Record<string, any> = {}
): ComponentDefinition {
  return {
    componentType,
    props
  };
}

/**
 * 创建更新状态动作的辅助函数
 */
export function createUpdateStateAction(
  path: string,
  value: any
): ActionDefinition {
  return {
    type: 'UPDATE_STATE',
    config: {
      path,
      value
    }
  };
}

/**
 * 创建获取数据动作的辅助函数
 */
export function createFetchDataAction(
  dataSourceId: string,
  resultPath?: string
): ActionDefinition {
  return {
    type: 'FETCH_DATA',
    config: {
      dataSourceId,
      resultPath
    }
  };
}

/**
 * 创建复合动作的辅助函数
 */
export function createCompositeAction(
  steps: string[],
  mode: 'sequence' | 'parallel' | 'race' = 'sequence'
): ActionDefinition {
  return {
    type: 'COMPOSITE',
    config: {
      steps,
      mode
    }
  };
}

/**
 * 创建导航动作的辅助函数
 */
export function createNavigateAction(
  to: string,
  type: 'push' | 'replace' = 'push'
): ActionDefinition {
  return {
    type: 'NAVIGATE',
    config: {
      type,
      to
    }
  };
}

/**
 * 创建消息提示动作的辅助函数
 */
export function createMessageAction(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): ActionDefinition {
  return {
    type: 'SHOW_MESSAGE',
    config: {
      type,
      message
    }
  };
}

/**
 * 创建表单组件的辅助函数
 */
export function createFormComponent(
  submitAction?: string
): ComponentDefinition {
  const form: ComponentDefinition = {
    componentType: 'Form',
    props: {
      layout: 'vertical'
    },
    events: submitAction ? {
      onSubmit: submitAction
    } : undefined
  };

  return form;
}

/**
 * 创建表格组件的辅助函数
 */
export function createTableComponent(
  columns: Array<{ key: string; title: string; [key: string]: any }>,
  dataSource: string
): ComponentDefinition {
  return {
    componentType: 'Table',
    props: {
      columns
    },
    dataBinding: {
      dataSource
    }
  };
}

/**
 * 创建按钮组件的辅助函数
 */
export function createButtonComponent(
  text: string,
  onClick?: string,
  type: 'primary' | 'default' | 'dashed' | 'text' | 'link' = 'default'
): ComponentDefinition {
  return {
    componentType: 'Button',
    props: {
      type,
      text
    },
    events: onClick ? {
      onClick
    } : undefined
  };
}

/**
 * 生成唯一ID的辅助函数
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 深度合并对象的辅助函数
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        (result as any)[key] = deepMerge(target[key], source[key]!);
      } else {
        (result as any)[key] = source[key]!;
      }
    }
  }
  
  return result;
}

/**
 * 验证组件定义的辅助函数
 */
export function validateComponent(component: ComponentDefinition): string[] {
  const errors: string[] = [];
  
  if (!component.componentType) {
    errors.push('componentType is required');
  }
  
  if (component.dataBinding) {
    if (typeof component.dataBinding !== 'object') {
      errors.push('dataBinding must be an object');
    }
  }
  
  if (component.props) {
    if (typeof component.props !== 'object') {
      errors.push('props must be an object');
    }
  }
  
  return errors;
}

/**
 * 验证数据源定义的辅助函数
 */
export function validateDataSource(dataSource: DataSourceDefinition): string[] {
  const errors: string[] = [];
  
  if (!dataSource.type) {
    errors.push('type is required');
  }
  
  if (dataSource.type === 'API_REQUEST') {
    const config = dataSource.config as ApiRequestConfig;
    if (!config?.url) {
      errors.push('url is required for API_REQUEST type');
    }
  }
  
  if (dataSource.type === 'STATIC_DATA') {
    const config = dataSource.config as StaticDataConfig;
    if (config?.value === undefined) {
      errors.push('value is required for STATIC_DATA type');
    }
  }
  
  return errors;
}

/**
 * 验证动作定义的辅助函数
 */
export function validateAction(action: ActionDefinition): string[] {
  const errors: string[] = [];
  
  if (!action.type) {
    errors.push('type is required');
  }
  
  // 根据动作类型验证配置
  switch (action.type) {
    case 'UPDATE_STATE':
      const updateConfig = action.config as UpdateStateConfig;
      if (!updateConfig?.path && !updateConfig?.batch) {
        errors.push('path or batch is required for UPDATE_STATE');
      }
      break;
    case 'FETCH_DATA':
      const fetchConfig = action.config as FetchDataConfig;
      if (!fetchConfig?.dataSourceId) {
        errors.push('dataSourceId is required for FETCH_DATA');
      }
      break;
    case 'NAVIGATE':
      const navConfig = action.config as NavigateConfig;
      if (!navConfig?.to && navConfig?.type !== 'back' && navConfig?.type !== 'forward') {
        errors.push('to is required for NAVIGATE (except back/forward)');
      }
      break;
    case 'COMPOSITE':
      const compConfig = action.config as CompositeConfig;
      if (!compConfig?.steps || !Array.isArray(compConfig.steps)) {
        errors.push('steps array is required for COMPOSITE');
      }
      break;
  }
  
  return errors;
}

/**
 * 从PageSchema中提取所有组件ID的辅助函数
 */
export function extractComponentIds(schema: PageSchema): string[] {
  const ids = new Set<string>();
  
  // 添加根组件
  if (schema.layout.root) {
    ids.add(schema.layout.root);
  }
  
  // 添加所有组件定义中的ID
  Object.keys(schema.components).forEach(id => ids.add(id));
  
  // 从布局结构中提取组件ID
  function extractFromLayoutNode(node: any): void {
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((childId: string) => ids.add(childId));
    }
    
    if (node.slots) {
      Object.values(node.slots).forEach((slotContent: any) => {
        if (typeof slotContent === 'string') {
          ids.add(slotContent);
        } else if (Array.isArray(slotContent)) {
          slotContent.forEach((id: string) => ids.add(id));
        }
      });
    }
  }
  
  // 遍历布局结构
  Object.values(schema.layout.structure || {}).forEach(extractFromLayoutNode);
  
  // 遍历模板
  if (schema.layout.templates) {
    Object.values(schema.layout.templates).forEach(extractFromLayoutNode);
  }
  
  return Array.from(ids);
}

/**
 * 检查Schema中是否存在循环引用的辅助函数
 */
export function detectCircularReferences(schema: PageSchema): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];
  
  function dfs(componentId: string, path: string[]): void {
    if (recursionStack.has(componentId)) {
      cycles.push(`Circular reference detected: ${path.join(' -> ')} -> ${componentId}`);
      return;
    }
    
    if (visited.has(componentId)) {
      return;
    }
    
    visited.add(componentId);
    recursionStack.add(componentId);
    
    // 从布局结构中查找子组件
    const layoutNode = schema.layout.structure[componentId];
    if (layoutNode) {
      // 检查children
      if (layoutNode.children) {
        layoutNode.children.forEach(childId => {
          dfs(childId, [...path, componentId]);
        });
      }
      
      // 检查slots
      if (layoutNode.slots) {
        Object.values(layoutNode.slots).forEach(slotContent => {
          if (typeof slotContent === 'string') {
            dfs(slotContent, [...path, componentId]);
          } else if (Array.isArray(slotContent)) {
            slotContent.forEach(childId => {
              dfs(childId, [...path, componentId]);
            });
          }
        });
      }
    }
    
    recursionStack.delete(componentId);
  }
  
  // 从根组件开始检查
  if (schema.layout.root) {
    dfs(schema.layout.root, []);
  }
  
  return cycles;
}

/**
 * 获取Schema统计信息的辅助函数
 */
export function getSchemaStats(schema: PageSchema) {
  return {
    componentCount: Object.keys(schema.components).length,
    dataSourceCount: Object.keys(schema.dataSource).length,
    actionCount: Object.keys(schema.actions).length,
    computedCount: Object.keys(schema.computed || {}).length,
    templateCount: Object.keys(schema.templates || {}).length,
    initialStateKeys: Object.keys(schema.initialState).length,
    
    // 组件类型统计
    componentTypes: Object.values(schema.components).reduce((acc, component) => {
      acc[component.componentType] = (acc[component.componentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    // 数据源类型统计
    dataSourceTypes: Object.values(schema.dataSource).reduce((acc, dataSource) => {
      acc[dataSource.type] = (acc[dataSource.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    // 动作类型统计
    actionTypes: Object.values(schema.actions).reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
} 