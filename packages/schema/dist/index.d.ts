export type { PageSchema, Metadata } from './types/page-schema.js';
import type { PageSchema } from './types/page-schema.js';
export type { LoadStrategy, CacheStrategy, TimeoutConfig } from './types/load-strategy.js';
export type { Layout, LayoutDefinition, LayoutNode, LayoutRepeat, LayoutTemplate, ComponentDefinition, ComponentStyle, SlotDefinition, ValidationRule, ErrorBoundaryConfig } from './types/component.js';
export type { DataSourceDefinition, DataSourceType, DataSourceConfig, ApiRequestConfig, StaticDataConfig, StorageConfig, WebSocketConfig, ServerSentEventConfig, ComputedConfig, MockConfig, AuthConfig, DataTransformer, DataSourceCache, RetryConfig } from './types/data-source.js';
export type { ActionDefinition, ActionType, ActionConfig, UpdateStateConfig, FetchDataConfig, NavigateConfig, ShowMessageConfig, ModalConfig, FormConfig, ApiCallConfig, EventConfig, DelayConfig, CompositeConfig, ConditionalConfig, LoopConfig, CustomConfig, ActionRetryConfig } from './types/action.js';
export type { ComputedDefinition, TemplateDefinition, TemplateParam, TemplateExample, LifecycleDefinition, LifecycleHook, ThemeDefinition, FontDefinition, ColorPalette, ColorScale, SpacingSystem, ShadowSystem, AnimationConfig, KeyframeDefinition, I18nDefinition, PermissionDefinition, PermissionCondition, ErrorDefinition } from './types/advanced.js';
export declare const VERSION = "1.0.0";
export declare const SCHEMA_VERSION = "1.0";
export declare const MIN_SUPPORTED_VERSION = "1.0";
/**
 * 检查Schema版本兼容性
 */
export declare function isSchemaVersionCompatible(version: string): boolean;
/**
 * 创建空的PageSchema模板
 */
export declare function createEmptyPageSchema(): PageSchema;
/**
 * 验证PageSchema基本结构
 */
export declare function validatePageSchema(schema: unknown): schema is PageSchema;
/**
 * 常用的组件类型常量
 */
export declare const COMMON_COMPONENT_TYPES: {
    readonly CONTAINER: "Container";
    readonly ROW: "Row";
    readonly COL: "Col";
    readonly FLEX: "Flex";
    readonly GRID: "Grid";
    readonly BUTTON: "Button";
    readonly INPUT: "Input";
    readonly TEXT: "Text";
    readonly IMAGE: "Image";
    readonly LINK: "Link";
    readonly TABLE: "Table";
    readonly LIST: "List";
    readonly CARD: "Card";
    readonly DESCRIPTION: "Description";
    readonly FORM: "Form";
    readonly FORM_ITEM: "FormItem";
    readonly SELECT: "Select";
    readonly CHECKBOX: "Checkbox";
    readonly RADIO: "Radio";
    readonly DATE_PICKER: "DatePicker";
    readonly MODAL: "Modal";
    readonly DRAWER: "Drawer";
    readonly MESSAGE: "Message";
    readonly NOTIFICATION: "Notification";
    readonly MENU: "Menu";
    readonly BREADCRUMB: "Breadcrumb";
    readonly PAGINATION: "Pagination";
    readonly TABS: "Tabs";
};
/**
 * 常用的动作类型常量
 */
export declare const COMMON_ACTION_TYPES: {
    readonly UPDATE_STATE: "UPDATE_STATE";
    readonly FETCH_DATA: "FETCH_DATA";
    readonly NAVIGATE: "NAVIGATE";
    readonly SHOW_MESSAGE: "SHOW_MESSAGE";
    readonly OPEN_MODAL: "OPEN_MODAL";
    readonly CLOSE_MODAL: "CLOSE_MODAL";
    readonly VALIDATE_FORM: "VALIDATE_FORM";
    readonly SUBMIT_FORM: "SUBMIT_FORM";
    readonly CALL_API: "CALL_API";
    readonly COMPOSITE: "COMPOSITE";
};
/**
 * 常用的数据源类型常量
 */
export declare const COMMON_DATA_SOURCE_TYPES: {
    readonly API_REQUEST: "API_REQUEST";
    readonly STATIC_DATA: "STATIC_DATA";
    readonly LOCAL_STORAGE: "LOCAL_STORAGE";
    readonly COMPUTED: "COMPUTED";
    readonly MOCK: "MOCK";
};
export { createApiDataSource, createStaticDataSource, createComponent, createUpdateStateAction, createFetchDataAction, createCompositeAction, createNavigateAction, createMessageAction, createFormComponent, createTableComponent, createButtonComponent, generateId, deepMerge, validateComponent, validateDataSource, validateAction, extractComponentIds, detectCircularReferences, getSchemaStats } from './utils/schema-helpers.js';
