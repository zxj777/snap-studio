// 页面Schema核心类型
export type {
  PageSchema,
  Metadata
} from './types/page-schema.js';
import type { PageSchema } from './types/page-schema.js';

// 加载策略相关类型
export type {
  LoadStrategy,
  CacheStrategy,
  TimeoutConfig
} from './types/load-strategy.js';

// 组件相关类型
export type {
  Layout,
  LayoutDefinition,
  LayoutNode,
  LayoutRepeat,
  LayoutTemplate,
  ComponentDefinition,
  ComponentStyle,
  SlotDefinition,
  ValidationRule,
  ErrorBoundaryConfig
} from './types/component.js';

// 数据源相关类型
export type {
  DataSourceDefinition,
  DataSourceType,
  DataSourceConfig,
  ApiRequestConfig,
  StaticDataConfig,
  StorageConfig,
  WebSocketConfig,
  ServerSentEventConfig,
  ComputedConfig,
  MockConfig,

  AuthConfig,
  DataTransformer,
  DataSourceCache,
  RetryConfig
} from './types/data-source.js';

// 动作相关类型
export type {
  ActionDefinition,
  ActionType,
  ActionConfig,
  UpdateStateConfig,
  FetchDataConfig,
  NavigateConfig,
  ShowMessageConfig,
  ModalConfig,
  FormConfig,
  ApiCallConfig,
  EventConfig,
  DelayConfig,
  CompositeConfig,
  ConditionalConfig,
  LoopConfig,
  CustomConfig,
  ActionRetryConfig
} from './types/action.js';

// 高级特性相关类型
export type {
  ComputedDefinition,
  TemplateDefinition,
  TemplateParam,
  TemplateExample,
  LifecycleDefinition,
  LifecycleHook,
  ThemeDefinition,
  FontDefinition,
  ColorPalette,
  ColorScale,
  SpacingSystem,
  ShadowSystem,
  AnimationConfig,
  KeyframeDefinition,
  I18nDefinition,
  PermissionDefinition,
  PermissionCondition,
  ErrorDefinition
} from './types/advanced.js';

// 版本信息
export const VERSION = '1.0.0';

// Schema版本兼容性
export const SCHEMA_VERSION = '1.0';
export const MIN_SUPPORTED_VERSION = '1.0';

/**
 * 检查Schema版本兼容性
 */
export function isSchemaVersionCompatible(version: string): boolean {
  // 简单的版本比较逻辑
  const [major, minor] = version.split('.').map(Number);
  const [minMajor, minMinor] = MIN_SUPPORTED_VERSION.split('.').map(Number);
  
  if (major > minMajor) return true;
  if (major === minMajor && minor >= minMinor) return true;
  
  return false;
}

/**
 * 创建空的PageSchema模板
 */
export function createEmptyPageSchema(): PageSchema {
  return {
    metadata: {
      pageId: '',
      name: '',
      version: SCHEMA_VERSION
    },
    loadStrategy: {
      initial: []
    },
    layout: {
      root: '',
      structure: {}
    },
    components: {},
    dataSource: {},
    actions: {},
    initialState: {}
  };
}

/**
 * 验证PageSchema基本结构
 */
export function validatePageSchema(schema: unknown): schema is PageSchema {
  if (typeof schema !== 'object' || schema === null) {
    return false;
  }
  
  const s = schema as any;
  
  // 检查必需字段
  return (
    typeof s.metadata === 'object' &&
    typeof s.metadata.pageId === 'string' &&
    typeof s.metadata.name === 'string' &&
    typeof s.metadata.version === 'string' &&
    typeof s.loadStrategy === 'object' &&
    Array.isArray(s.loadStrategy.initial) &&
    typeof s.layout === 'object' &&
    typeof s.layout.root === 'string' &&
    typeof s.components === 'object' &&
    typeof s.dataSource === 'object' &&
    typeof s.actions === 'object' &&
    typeof s.initialState === 'object'
  );
}

/**
 * 常用的组件类型常量
 */
export const COMMON_COMPONENT_TYPES = {
  // 布局组件
  CONTAINER: 'Container',
  ROW: 'Row',
  COL: 'Col',
  FLEX: 'Flex',
  GRID: 'Grid',
  
  // 基础组件
  BUTTON: 'Button',
  INPUT: 'Input',
  TEXT: 'Text',
  IMAGE: 'Image',
  LINK: 'Link',
  
  // 数据展示
  TABLE: 'Table',
  LIST: 'List',
  CARD: 'Card',
  DESCRIPTION: 'Description',
  
  // 表单组件
  FORM: 'Form',
  FORM_ITEM: 'FormItem',
  SELECT: 'Select',
  CHECKBOX: 'Checkbox',
  RADIO: 'Radio',
  DATE_PICKER: 'DatePicker',
  
  // 反馈组件
  MODAL: 'Modal',
  DRAWER: 'Drawer',
  MESSAGE: 'Message',
  NOTIFICATION: 'Notification',
  
  // 导航组件
  MENU: 'Menu',
  BREADCRUMB: 'Breadcrumb',
  PAGINATION: 'Pagination',
  TABS: 'Tabs'
} as const;

/**
 * 常用的动作类型常量
 */
export const COMMON_ACTION_TYPES = {
  UPDATE_STATE: 'UPDATE_STATE',
  FETCH_DATA: 'FETCH_DATA',
  NAVIGATE: 'NAVIGATE',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  VALIDATE_FORM: 'VALIDATE_FORM',
  SUBMIT_FORM: 'SUBMIT_FORM',
  CALL_API: 'CALL_API',
  COMPOSITE: 'COMPOSITE'
} as const;

/**
 * 常用的数据源类型常量
 */
export const COMMON_DATA_SOURCE_TYPES = {
  API_REQUEST: 'API_REQUEST',
  STATIC_DATA: 'STATIC_DATA',
  LOCAL_STORAGE: 'LOCAL_STORAGE',
  COMPUTED: 'COMPUTED',
  MOCK: 'MOCK'
} as const;

// 导出工具函数
export {
  createApiDataSource,
  createStaticDataSource,
  createComponent,
  createUpdateStateAction,
  createFetchDataAction,
  createCompositeAction,
  createNavigateAction,
  createMessageAction,
  createFormComponent,
  createTableComponent,
  createButtonComponent,
  generateId,
  deepMerge,
  validateComponent,
  validateDataSource,
  validateAction,
  extractComponentIds,
  detectCircularReferences,
  getSchemaStats
} from './utils/schema-helpers.js'; 