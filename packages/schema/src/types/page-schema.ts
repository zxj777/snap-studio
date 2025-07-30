import type { LoadStrategy } from './load-strategy.js';
import type { LayoutDefinition, ComponentDefinition } from './component.js';
import type { DataSourceDefinition } from './data-source.js';
import type { ActionDefinition } from './action.js';
import type { ComputedDefinition, TemplateDefinition, LifecycleDefinition } from './advanced.js';

/**
 * 页面Schema的顶层结构
 */
export interface PageSchema {
  /** 页面元信息 */
  metadata: Metadata;
  
  /** 加载策略 */
  loadStrategy: LoadStrategy;
  
  /** 页面布局 */
  layout: LayoutDefinition;
  
  /** 组件字典 */
  components: Record<string, ComponentDefinition>;
  
  /** 数据源中心 */
  dataSource: Record<string, DataSourceDefinition>;
  
  /** 行为中心 */
  actions: Record<string, ActionDefinition>;
  
  /** 初始状态 */
  initialState: Record<string, any>;
  
  /** 计算属性 */
  computed?: Record<string, ComputedDefinition>;
   
  /** 组件模板 */
  templates?: Record<string, TemplateDefinition>;
  
  /** 生命周期 */
  lifecycle?: LifecycleDefinition;
}

/**
 * 页面元信息
 */
export interface Metadata {
  /** 页面唯一标识 */
  pageId: string;
  
  /** 页面名称 */
  name: string;
  
  /** 版本号 */
  version: string;
  
  /** 页面描述 */
  description?: string;
  
  /** SEO信息 */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
  };
  
  /** 创建时间 */
  createdAt?: string;
  
  /** 更新时间 */
  updatedAt?: string;
  
  /** 创建者 */
  author?: string;
  
  /** 标签 */
  tags?: string[];
} 