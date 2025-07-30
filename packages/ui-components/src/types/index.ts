import type { ReactNode } from 'react';

/**
 * 低代码组件基础属性
 */
export interface LowCodeComponentProps {
  /** 子元素 */
  children?: ReactNode;
  /** 样式类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 数据测试ID */
  'data-testid'?: string;
  /** 组件是否禁用 */
  disabled?: boolean;
  /** 组件是否隐藏 */
  hidden?: boolean;
  /** 权限控制 */
  permission?: string | string[];
}

/**
 * 表格 CRUD 操作类型
 */
export type CrudAction = 'create' | 'read' | 'update' | 'delete';

/**
 * 表格操作配置
 */
export interface TableActionConfig {
  /** 操作类型 */
  type: CrudAction;
  /** 操作文本 */
  text?: string;
  /** 图标 */
  icon?: ReactNode;
  /** 操作处理函数的 action ID */
  actionId?: string;
  /** 是否确认操作 */
  confirm?: boolean | {
    title?: string;
    content?: string;
  };
  /** 权限控制 */
  permission?: string | string[];
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否禁用 */
  disabled?: boolean | ((record: any) => boolean);
}

/**
 * 表格列配置（扩展 antd 的 ColumnType）
 */
export interface LowCodeTableColumn {
  /** 列标题 */
  title: string;
  /** 数据字段 */
  dataIndex: string;
  /** 唯一键 */
  key?: string;
  /** 列宽 */
  width?: number | string;
  /** 是否固定列 */
  fixed?: 'left' | 'right';
  /** 排序 */
  sorter?: boolean | ((a: any, b: any) => number);
  /** 筛选 */
  filters?: Array<{ text: string; value: any }>;
  /** 自定义渲染 */
  render?: (value: any, record: any, index: number) => ReactNode;
  /** 是否可编辑 */
  editable?: boolean;
  /** 编辑类型 */
  editType?: 'input' | 'select' | 'number' | 'date' | 'textarea';
  /** 编辑选项（用于 select 类型） */
  editOptions?: Array<{ label: string; value: any }>;
  /** 校验规则 */
  rules?: Array<{
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
  }>;
}

/**
 * 表格搜索配置
 */
export interface TableSearchConfig {
  /** 是否启用搜索 */
  enabled: boolean;
  /** 搜索字段配置 */
  fields?: Array<{
    /** 字段名 */
    name: string;
    /** 显示标签 */
    label: string;
    /** 输入类型 */
    type: 'input' | 'select' | 'date' | 'dateRange';
    /** 选项（用于 select 类型） */
    options?: Array<{ label: string; value: any }>;
    /** 占位符 */
    placeholder?: string;
  }>;
  /** 搜索函数的 action ID */
  searchActionId?: string;
  /** 重置函数的 action ID */
  resetActionId?: string;
}

/**
 * 表格分页配置
 */
export interface TablePaginationConfig {
  /** 当前页码 */
  current?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 总条数 */
  total?: number;
  /** 每页条数选择器的选项 */
  pageSizeOptions?: string[];
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示总数 */
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
}

/**
 * 表格配置
 */
export interface LowCodeTableConfig {
  /** 表格数据源 action ID */
  dataSourceActionId?: string;
  /** 表格列配置 */
  columns: LowCodeTableColumn[];
  /** 行操作配置 */
  rowActions?: TableActionConfig[];
  /** 工具栏操作配置 */
  toolbarActions?: TableActionConfig[];
  /** 搜索配置 */
  search?: TableSearchConfig;
  /** 分页配置 */
  pagination?: TablePaginationConfig | false;
  /** 行选择配置 */
  rowSelection?: {
    /** 选择类型 */
    type?: 'checkbox' | 'radio';
    /** 选中行变化的回调 action ID */
    onChangeActionId?: string;
  };
  /** 是否显示边框 */
  bordered?: boolean;
  /** 表格大小 */
  size?: 'large' | 'middle' | 'small';
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 空数据时的显示内容 */
  emptyText?: string;
  /** 滚动配置 */
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
}