import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table as AntTable, 
  Button, 
  Space, 
  Popconfirm, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber,
  Row,
  Col,
  Card,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import type { TableProps as AntTableProps, ColumnType } from 'antd/lib/table';
import { createLowCodeComponent } from '../base-component.js';
import type { LowCodeComponentProps } from '../base-component.js';
import type { 
  LowCodeTableConfig, 
  LowCodeTableColumn, 
  TableActionConfig
} from '../../types/index.js';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 低代码表格组件属性
 */
export interface TableProps extends LowCodeComponentProps, LowCodeTableConfig {
  /** 表格数据 */
  dataSource?: any[];
  /** 行键字段名 */
  rowKey?: string | ((record: any) => string);
  /** 是否可编辑表格 */
  editable?: boolean;
  /** 编辑模式 */
  editMode?: 'inline' | 'modal' | 'drawer';
  /** 新增记录的默认值 */
  defaultNewRecord?: Record<string, any>;
  /** 操作事件处理器映射 */
  actionHandlers?: Record<string, (data?: any) => Promise<void> | void>;
}

/**
 * 可编辑单元格组件
 */
interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  editType: LowCodeTableColumn['editType'];
  editOptions?: LowCodeTableColumn['editOptions'];
  rules?: LowCodeTableColumn['rules'];
  children: React.ReactNode;
  record: any;
  index: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  editType = 'input',
  editOptions,
  rules,
  children,
  ...restProps
}) => {
  const getInputNode = () => {
    switch (editType) {
      case 'number':
        return React.createElement(InputNumber, { style: { width: '100%' } });
      case 'select':
        return React.createElement(Select, { style: { width: '100%' } },
          editOptions?.map(option => 
            React.createElement(Option, { 
              key: option.value, 
              value: option.value,
              children: option.label 
            })
          )
        );
      case 'date':
        return React.createElement(DatePicker, { style: { width: '100%' } });
      case 'textarea':
        return React.createElement(Input.TextArea, { rows: 2 });
      default:
        return React.createElement(Input);
    }
  };

  return React.createElement('td', restProps,
    editing ? 
      React.createElement(Form.Item, {
        name: dataIndex,
        style: { margin: 0 },
        rules: rules?.map(rule => ({
          required: rule.required,
          message: rule.message || `${title}是必填项`,
          pattern: rule.pattern,
          min: rule.min,
          max: rule.max
        }))
      }, getInputNode()) :
      children
  );
};

/**
 * 基础表格组件
 * 基于 antd Table 封装，提供完整的 CRUD 功能
 * 
 * @example
 * ```tsx
 * <Table 
 *   columns={columns}
 *   dataSource={data}
 *   rowActions={[
 *     { type: 'update', text: '编辑', actionId: 'act_edit_user' },
 *     { type: 'delete', text: '删除', actionId: 'act_delete_user', confirm: true }
 *   ]}
 *   toolbarActions={[
 *     { type: 'create', text: '新增', actionId: 'act_create_user' }
 *   ]}
 *   search={{
 *     enabled: true,
 *     fields: [
 *       { name: 'name', label: '姓名', type: 'input' },
 *       { name: 'status', label: '状态', type: 'select', options: statusOptions }
 *     ]
 *   }}
 *   editable
 * />
 * ```
 */
export const BaseTable: React.FC<TableProps> = ({
  dataSource = [],
  columns = [],
  rowActions = [],
  toolbarActions = [],
  search,
  pagination,
  rowSelection,
  bordered = true,
  size = 'middle',
  loading = false,
  emptyText = '暂无数据',
  rowKey = 'id',
  editable = false,
  editMode = 'inline',
  defaultNewRecord = {},
  actionHandlers = {},
  ...props
}) => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState(dataSource);
  const [searchVisible, setSearchVisible] = useState(false);

  // 同步外部数据 - 使用 JSON.stringify 进行深度比较，避免无限渲染
  useEffect(() => {
    console.log('🔄 Table dataSource updated:', dataSource);
    setTableData(dataSource);
  }, [JSON.stringify(dataSource)]);

  // 判断是否正在编辑
  const isEditing = (record: any) => {
    const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey as string];
    return key === editingKey;
  };

  // 开始编辑
  const startEdit = useCallback((record: any) => {
    form.setFieldsValue({ ...record });
    const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey as string];
    setEditingKey(key);
  }, [form, rowKey]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditingKey('');
    form.resetFields();
  }, [form]);

  // 保存编辑
  const saveEdit = useCallback(async (record: any) => {
    try {
      const values = await form.validateFields();
      const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey as string];
      const newData = [...tableData];
      const index = newData.findIndex(item => {
        const itemKey = typeof rowKey === 'function' ? rowKey(item) : item[rowKey as string];
        return itemKey === key;
      });

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...values });
        setTableData(newData);
        setEditingKey('');

        // 调用更新处理器
        const updateHandler = actionHandlers['update'] || actionHandlers['act_update'];
        if (updateHandler) {
          await updateHandler({ ...item, ...values });
        }

        message.success('保存成功');
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  }, [form, tableData, rowKey, actionHandlers]);

  // 删除记录
  const handleDelete = useCallback(async (record: any) => {
    try {
      const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey as string];
      const newData = tableData.filter(item => {
        const itemKey = typeof rowKey === 'function' ? rowKey(item) : item[rowKey as string];
        return itemKey !== key;
      });
      setTableData(newData);

      // 调用删除处理器
      const deleteHandler = actionHandlers['delete'] || actionHandlers['act_delete'];
      if (deleteHandler) {
        await deleteHandler(record);
      }

      message.success('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  }, [tableData, rowKey, actionHandlers]);

  // 新增记录
  const handleCreate = useCallback(async () => {
    try {
      const newRecord = {
        ...defaultNewRecord,
        [typeof rowKey === 'string' ? rowKey : 'id']: `new_${Date.now()}`
      };

      // 调用新增处理器
      const createHandler = actionHandlers['create'] || actionHandlers['act_create'];
      if (createHandler) {
        await createHandler(newRecord);
      } else {
        // 默认添加到表格开头
        setTableData([newRecord, ...tableData]);
        startEdit(newRecord);
      }

      message.success('新增成功');
    } catch (error) {
      console.error('新增失败:', error);
      message.error('新增失败');
    }
  }, [defaultNewRecord, rowKey, actionHandlers, tableData, startEdit]);

  // 批量删除
  const handleBatchDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    try {
      const newData = tableData.filter(item => {
        const key = typeof rowKey === 'function' ? rowKey(item) : item[rowKey as string];
        return !selectedRowKeys.includes(key);
      });
      setTableData(newData);
      setSelectedRowKeys([]);

      // 调用批量删除处理器
      const batchDeleteHandler = actionHandlers['batchDelete'] || actionHandlers['act_batch_delete'];
      if (batchDeleteHandler) {
        const selectedRecords = tableData.filter(item => {
          const key = typeof rowKey === 'function' ? rowKey(item) : item[rowKey as string];
          return selectedRowKeys.includes(key);
        });
        await batchDeleteHandler(selectedRecords);
      }

      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('批量删除失败');
    }
  }, [selectedRowKeys, tableData, rowKey, actionHandlers]);

  // 搜索处理
  const handleSearch = useCallback(async (values: any) => {
    try {
      const searchHandler = actionHandlers[search?.searchActionId || 'search'] || actionHandlers['act_search'];
      if (searchHandler) {
        await searchHandler(values);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败');
    }
  }, [search, actionHandlers]);

  // 重置搜索
  const handleSearchReset = useCallback(async () => {
    searchForm.resetFields();
    try {
      const resetHandler = actionHandlers[search?.resetActionId || 'reset'] || actionHandlers['act_reset'];
      if (resetHandler) {
        await resetHandler();
      }
    } catch (error) {
      console.error('重置失败:', error);
    }
  }, [searchForm, search, actionHandlers]);

  // 处理行操作
  const handleRowAction = useCallback(async (action: TableActionConfig, record: any) => {
    const handler = actionHandlers[action.actionId || action.type];
    if (handler) {
      try {
        await handler(record);
      } catch (error) {
        console.error(`操作失败:`, error);
        message.error('操作失败');
      }
    } else {
      // 默认操作
      switch (action.type) {
        case 'update':
          startEdit(record);
          break;
        case 'delete':
          await handleDelete(record);
          break;
        default:
          console.warn(`未找到操作处理器: ${action.actionId || action.type}`);
      }
    }
  }, [actionHandlers, startEdit, handleDelete]);

  // 构建列配置
  const buildColumns = useCallback((): ColumnType<any>[] => {
    const builtColumns: ColumnType<any>[] = columns.map((col: LowCodeTableColumn) => {
      const column: ColumnType<any> = {
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key || col.dataIndex,
        width: col.width,
        fixed: col.fixed,
        sorter: col.sorter,
        filters: col.filters,
        render: col.render
      };

      // 如果表格可编辑，添加编辑功能
      if (editable && col.editable) {
        column.onCell = (record: any) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          editType: col.editType,
          editOptions: col.editOptions,
          rules: col.rules
        });
      }

      return column;
    });

    // 添加操作列
    if (rowActions.length > 0 || editable) {
      builtColumns.push({
        title: '操作',
        key: 'actions',
        fixed: 'right',
        width: 120 + rowActions.length * 60,
        render: (_, record) => {
          const editing = isEditing(record);
          
          return React.createElement(Space, { size: 'small' },
            ...(editing ? [
              React.createElement(Button, {
                key: 'save',
                type: 'link',
                size: 'small',
                onClick: () => saveEdit(record)
              }, '保存'),
              React.createElement(Button, {
                key: 'cancel',
                type: 'link',
                size: 'small',
                onClick: cancelEdit
              }, '取消')
            ] : [
              ...rowActions.map((action, index) => {
                const button = React.createElement(Button, {
                  key: action.type + index,
                  type: 'link',
                  size: 'small',
                  icon: action.icon,
                  style: action.style,
                  disabled: typeof action.disabled === 'function' ? action.disabled(record) : action.disabled,
                  onClick: () => handleRowAction(action, record)
                }, action.text);

                return action.confirm ? 
                  React.createElement(Popconfirm, {
                    key: action.type + index,
                    title: typeof action.confirm === 'object' ? (action.confirm.title || '确定要执行此操作吗？') : '确定要执行此操作吗？',
                    onConfirm: () => handleRowAction(action, record),
                    okText: '确定',
                    cancelText: '取消'
                  }, button) : button;
              }),
              ...(editable ? [
                React.createElement(Button, {
                  key: 'edit',
                  type: 'link',
                  size: 'small',
                  icon: React.createElement(EditOutlined),
                  onClick: () => startEdit(record)
                }, '编辑')
              ] : [])
            ])
          );
        }
      });
    }

    return builtColumns;
  }, [columns, rowActions, editable, isEditing, saveEdit, cancelEdit, handleRowAction, startEdit]);

  // 构建搜索表单
  const buildSearchForm = useCallback(() => {
    if (!search?.enabled || !search.fields) return null;

    return React.createElement(Card, {
      size: 'small',
      style: { marginBottom: 16 },
      bodyStyle: { paddingBottom: 0 }
    },
      React.createElement(Form, {
        form: searchForm,
        layout: 'inline',
        onFinish: handleSearch
      },
        React.createElement(Row, { gutter: 16, style: { width: '100%' } },
          ...search.fields.map(field => 
            React.createElement(Col, {
              key: field.name,
              xs: 24,
              sm: 12,
              md: 8,
              lg: 6
            },
              React.createElement(Form.Item, {
                name: field.name,
                label: field.label
              },
                (() => {
                  switch (field.type) {
                    case 'select':
                      return React.createElement(Select, {
                        placeholder: field.placeholder,
                        allowClear: true,
                        style: { width: '100%' }
                      },
                        field.options?.map(option =>
                          React.createElement(Option, {
                            key: option.value,
                            value: option.value,
                            children: option.label
                          })
                        )
                      );
                    case 'date':
                      return React.createElement(DatePicker, {
                        placeholder: field.placeholder,
                        style: { width: '100%' }
                      });
                    case 'dateRange':
                      return React.createElement(RangePicker, {
                        style: { width: '100%' }
                      });
                    default:
                      return React.createElement(Input, {
                        placeholder: field.placeholder,
                        allowClear: true
                      });
                  }
                })()
              )
            )
          ),
          React.createElement(Col, {
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6
          },
            React.createElement(Form.Item, null,
              React.createElement(Space, null,
                React.createElement(Button, {
                  type: 'primary',
                  htmlType: 'submit',
                  icon: React.createElement(SearchOutlined)
                }, '搜索'),
                React.createElement(Button, {
                  onClick: handleSearchReset
                }, '重置')
              )
            )
          )
        )
      )
    );
  }, [search, searchForm, handleSearch, handleSearchReset]);

  // 构建工具栏
  const buildToolbar = useCallback(() => {
    if (toolbarActions.length === 0 && !rowSelection) return null;

    const buttons = [
      ...toolbarActions.map((action, index) => 
        React.createElement(Button, {
          key: action.type + index,
          type: action.type === 'create' ? 'primary' : 'default',
          icon: action.icon || (action.type === 'create' ? React.createElement(PlusOutlined) : undefined),
          onClick: () => {
            const handler = actionHandlers[action.actionId || action.type];
            if (handler) {
              handler();
            } else if (action.type === 'create') {
              handleCreate();
            }
          },
          style: action.style,
          disabled: typeof action.disabled === 'function' ? false : action.disabled
        }, action.text)
      )
    ];

    // 添加批量操作按钮
    if (rowSelection && selectedRowKeys.length > 0) {
      buttons.push(
        React.createElement(Button, {
          key: 'batch-delete',
          danger: true,
          icon: React.createElement(DeleteOutlined),
          onClick: handleBatchDelete
        }, `删除选中 (${selectedRowKeys.length})`)
      );
    }

    return React.createElement('div', {
      style: { marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    },
      React.createElement(Space, null, ...buttons),
      React.createElement(Space, null,
        search?.enabled && React.createElement(Button, {
          type: searchVisible ? 'primary' : 'default',
          icon: React.createElement(SearchOutlined),
          onClick: () => setSearchVisible(!searchVisible)
        }, '搜索'),
        React.createElement(Button, {
          icon: React.createElement(ReloadOutlined),
          onClick: () => {
            const refreshHandler = actionHandlers['refresh'] || actionHandlers['act_refresh'];
            if (refreshHandler) {
              refreshHandler();
            }
          }
        }, '刷新')
      )
    );
  }, [toolbarActions, rowSelection, selectedRowKeys, actionHandlers, handleCreate, handleBatchDelete, search, searchVisible]);

  // 行选择配置
  const rowSelectionConfig = rowSelection ? {
    type: rowSelection.type || 'checkbox',
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
      const handler = actionHandlers[rowSelection.onChangeActionId || 'rowSelectionChange'];
      if (handler) {
        handler(keys);
      }
    }
  } : undefined;

  // 表格属性
  const tableProps: AntTableProps<any> = {
    ...props,
    dataSource: tableData,
    columns: buildColumns(),
    rowKey,
    rowSelection: rowSelectionConfig,
    bordered,
    size,
    loading,
    locale: { emptyText },
    pagination: pagination === false ? false : {
      current: pagination?.current || 1,
      pageSize: pagination?.pageSize || 10,
      total: pagination?.total || tableData.length,
      showSizeChanger: pagination?.showSizeChanger !== false,
      showQuickJumper: pagination?.showQuickJumper,
      showTotal: typeof pagination?.showTotal === 'function' ? pagination.showTotal : 
                 pagination?.showTotal === true ? ((total) => `共 ${total} 条记录`) : undefined,
      pageSizeOptions: pagination?.pageSizeOptions || ['10', '20', '50', '100']
    },
    components: editable ? {
      body: {
        cell: EditableCell
      }
    } : undefined
  };

  return React.createElement(Form.Provider, {
    onFormFinish: (name, { forms }) => {
      if (name === 'editable-table-form') {
        // 处理表单提交逻辑
        console.log('Form submitted:', forms);
      }
    }
  },
    React.createElement('div', { className: 'snap-lowcode-table' },
      buildToolbar(),
      search?.enabled && searchVisible && buildSearchForm(),
      React.createElement(Form, {
        form,
        component: false,
        name: 'editable-table-form'
      },
        React.createElement(AntTable, tableProps)
      )
    )
  );
};

// 创建低代码表格组件
export const Table = createLowCodeComponent(BaseTable);