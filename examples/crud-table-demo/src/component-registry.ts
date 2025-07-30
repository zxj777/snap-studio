import React from 'react';
import { defaultComponentRegistry } from '@snap-studio/core';
import { 
  Button, 
  Input, 
  Table,
  Row,
  Col,
  Card,
  Space,
  Typography,
  Select,
  Form,
  Pagination,
  message
} from 'antd';

const { Option } = Select;

/**
 * 增强的 Input 组件 - 支持数据绑定和事件处理
 */
const EnhancedInput = ({ value, onChange, onSearch, dataBinding, ...props }: any) => {
  return React.createElement(Input, {
    value,
    onChange: (e: any) => onChange?.(e.target.value),
    onPressEnter: (e: any) => onSearch?.(e.target.value),
    ...props
  });
};

/**
 * 增强的 Select 组件 - 支持数据绑定和选项配置
 */
const EnhancedSelect = ({ value, onChange, options = [], dataBinding, ...props }: any) => {
  return React.createElement(Select, {
    value,
    onChange,
    ...props
  }, 
    options.map((option: any) => 
      React.createElement(Option, { 
        key: option.value, 
        value: option.value 
      }, option.label)
    )
  );
};

/**
 * 增强的 Table 组件 - 支持完整的 CRUD 操作
 */
const EnhancedTable = ({ 
  dataSource = [], 
  columns = [], 
  loading = false,
  pagination = false,
  onEdit,
  onDelete,
  onCreate,
  dataBinding,
  showActions = true,
  ...props 
}: any) => {
  // 处理列配置，添加操作列
  const enhancedColumns = showActions ? [
    ...columns,
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: any) => React.createElement(Space, { size: 'small' },
        React.createElement(Button, {
          type: 'link',
          size: 'small',
          onClick: () => onEdit?.(record)
        }, '编辑'),
        React.createElement(Button, {
          type: 'link',
          size: 'small',
          danger: true,
          onClick: () => onDelete?.(record)
        }, '删除')
      )
    }
  ] : columns;

  return React.createElement(Table, {
    dataSource,
    columns: enhancedColumns,
    loading,
    pagination,
    rowKey: 'id',
    ...props
  });
};

/**
 * 筛选表单组件
 */
const FilterForm = ({ filters = [], onFilter, onReset, dataBinding, ...props }: any) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    const values = form.getFieldsValue();
    onFilter?.(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return React.createElement(Card, {
    size: 'small',
    style: { marginBottom: 16 }
  },
    React.createElement(Form, {
      form,
      layout: 'inline',
      ...props
    },
      filters.map((filter: any) => {
        if (filter.type === 'input') {
          return React.createElement(Form.Item, {
            key: filter.name,
            name: filter.name,
            label: filter.label
          }, 
            React.createElement(Input, {
              placeholder: filter.placeholder,
              onPressEnter: handleFilter,
              allowClear: true
            })
          );
        } else if (filter.type === 'select') {
          return React.createElement(Form.Item, {
            key: filter.name,
            name: filter.name,
            label: filter.label
          },
            React.createElement(Select, {
              placeholder: filter.placeholder,
              allowClear: true,
              style: { width: 120 },
              onChange: handleFilter
            },
              filter.options?.map((option: any) => 
                React.createElement(Option, {
                  key: option.value,
                  value: option.value
                }, option.label)
              )
            )
          );
        }
        return null;
      }),
      React.createElement(Form.Item, null,
        React.createElement(Space, null,
          React.createElement(Button, {
            type: 'primary',
            onClick: handleFilter
          }, '搜索'),
          React.createElement(Button, {
            onClick: handleReset
          }, '重置')
        )
      )
    )
  );
};

/**
 * 工具栏组件 - 包含新增等操作按钮
 */
const Toolbar = ({ actions = [], dataBinding, ...props }: any) => {
  return React.createElement(Card, {
    size: 'small',
    style: { marginBottom: 16 }
  },
    React.createElement(Space, null,
      actions.map((action: any, index: number) => 
        React.createElement(Button, {
          key: index,
          type: action.type === 'primary' ? 'primary' : 'default',
          onClick: action.onClick,
          ...action.props
        }, action.text)
      )
    )
  );
};

/**
 * 设置组件注册表
 * 注册所有可用的低代码组件
 */
export function setupComponentRegistry() {
  console.log('🔧 开始注册 Antd 原生组件...');

  // 注册增强的数据组件
  defaultComponentRegistry.register({
    type: 'Input',
    component: EnhancedInput,
    description: '增强输入框组件'
  });

  defaultComponentRegistry.register({
    type: 'Select',
    component: EnhancedSelect,
    description: '增强选择框组件'
  });

  defaultComponentRegistry.register({
    type: 'Table',
    component: EnhancedTable,
    description: '增强表格组件'
  });

  defaultComponentRegistry.register({
    type: 'FilterForm',
    component: FilterForm,
    description: '筛选表单组件'
  });

  defaultComponentRegistry.register({
    type: 'Form',
    component: Form,
    description: '基础表单组件'
  });

  defaultComponentRegistry.register({
    type: 'Toolbar',
    component: Toolbar,
    description: '工具栏组件'
  });

  // 注册基础UI组件
  defaultComponentRegistry.register({
    type: 'Button',
    component: Button,
    description: '按钮组件'
  });
  
  // 布局组件
  defaultComponentRegistry.register({
    type: 'Row',
    component: Row,
    description: '行布局组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Col',
    component: Col,
    description: '列布局组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Card',
    component: Card,
    description: '卡片组件'
  });
  
  defaultComponentRegistry.register({
    type: 'Space',
    component: Space,
    description: '间距组件'
  });
  
  // 文本组件
  defaultComponentRegistry.register({
    type: 'Title',
    component: Typography.Title,
    description: '标题组件'
  });
  
  // 容器组件
  defaultComponentRegistry.register({
    type: 'Container',
    component: ({ children, ...props }: any) => {
      return React.createElement('div', {
        style: {
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...props.style
        },
        ...props
      }, children);
    },
    description: '通用容器组件'
  });
  
  const registeredTypes = defaultComponentRegistry.getRegisteredTypes();
  console.log('✅ 组件注册完成，已注册组件:', registeredTypes);
  console.log('✅ Container组件是否已注册:', registeredTypes.includes('Container'));
}