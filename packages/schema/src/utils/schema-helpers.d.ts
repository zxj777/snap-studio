import type { PageSchema } from '../types/page-schema.js';
import type { ComponentDefinition } from '../types/component.js';
import type { DataSourceDefinition, ApiRequestConfig } from '../types/data-source.js';
import type { ActionDefinition } from '../types/action.js';
/**
 * 创建API数据源的辅助函数
 */
export declare function createApiDataSource(url: string, options?: Partial<ApiRequestConfig>): DataSourceDefinition;
/**
 * 创建静态数据源的辅助函数
 */
export declare function createStaticDataSource(value: any): DataSourceDefinition;
/**
 * 创建组件定义的辅助函数
 */
export declare function createComponent(componentType: string, props?: Record<string, any>): ComponentDefinition;
/**
 * 创建更新状态动作的辅助函数
 */
export declare function createUpdateStateAction(path: string, value: any): ActionDefinition;
/**
 * 创建获取数据动作的辅助函数
 */
export declare function createFetchDataAction(dataSourceId: string, resultPath?: string): ActionDefinition;
/**
 * 创建复合动作的辅助函数
 */
export declare function createCompositeAction(steps: string[], mode?: 'sequence' | 'parallel' | 'race'): ActionDefinition;
/**
 * 创建导航动作的辅助函数
 */
export declare function createNavigateAction(to: string, type?: 'push' | 'replace'): ActionDefinition;
/**
 * 创建消息提示动作的辅助函数
 */
export declare function createMessageAction(message: string, type?: 'success' | 'error' | 'warning' | 'info'): ActionDefinition;
/**
 * 创建表单组件的辅助函数
 */
export declare function createFormComponent(submitAction?: string): ComponentDefinition;
/**
 * 创建表格组件的辅助函数
 */
export declare function createTableComponent(columns: Array<{
    key: string;
    title: string;
    [key: string]: any;
}>, dataSource: string): ComponentDefinition;
/**
 * 创建按钮组件的辅助函数
 */
export declare function createButtonComponent(text: string, onClick?: string, type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'): ComponentDefinition;
/**
 * 生成唯一ID的辅助函数
 */
export declare function generateId(prefix?: string): string;
/**
 * 深度合并对象的辅助函数
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
/**
 * 验证组件定义的辅助函数
 */
export declare function validateComponent(component: ComponentDefinition): string[];
/**
 * 验证数据源定义的辅助函数
 */
export declare function validateDataSource(dataSource: DataSourceDefinition): string[];
/**
 * 验证动作定义的辅助函数
 */
export declare function validateAction(action: ActionDefinition): string[];
/**
 * 从PageSchema中提取所有组件ID的辅助函数
 */
export declare function extractComponentIds(schema: PageSchema): string[];
/**
 * 检查Schema中是否存在循环引用的辅助函数
 */
export declare function detectCircularReferences(schema: PageSchema): string[];
/**
 * 获取Schema统计信息的辅助函数
 */
export declare function getSchemaStats(schema: PageSchema): {
    componentCount: number;
    dataSourceCount: number;
    actionCount: number;
    computedCount: number;
    templateCount: number;
    initialStateKeys: number;
    componentTypes: Record<string, number>;
    dataSourceTypes: Record<string, number>;
    actionTypes: Record<string, number>;
};
//# sourceMappingURL=schema-helpers.d.ts.map