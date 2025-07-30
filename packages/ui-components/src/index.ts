// 组件导出
export { Button } from './components/basic/button.js';
export { Input, TextArea } from './components/basic/input.js';
export { Table } from './components/data/table.js';

// 类型导出
export type { ButtonProps } from './components/basic/button.js';
export type { InputProps, TextAreaProps } from './components/basic/input.js';
export type { TableProps } from './components/data/table.js';

// 基础组件和类型导出
export { BaseComponentWrapper, createLowCodeComponent } from './components/base-component.js';
export type { BaseComponentWrapperProps } from './components/base-component.js';
export type { LowCodeComponentProps } from './types/index.js';

// 类型定义导出
export type {
  CrudAction,
  TableActionConfig,
  LowCodeTableColumn,
  TableSearchConfig,
  TablePaginationConfig,
  LowCodeTableConfig
} from './types/index.js';

// Ant Design 组件直接导出（便于使用）
export {
  Row,
  Col,
  Card,
  Space,
  Divider,
  Typography,
  Layout,
  Menu,
  Breadcrumb,
  Pagination,
  Steps,
  Tabs,
  Modal,
  Drawer,
  Popover,
  Tooltip,
  Alert,
  message,
  notification
} from 'antd';

// Ant Design 图标导出
export {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  DownOutlined,
  UpOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

// 版本信息
export const VERSION = '1.0.0';