import type { PageSchema } from '@snap-studio/schema';
import { mockDataStore, departments, positions, statusOptions } from '../mock-data';

/**
 * 用户管理页面的 JSON Schema
 * 展示完整的 CRUD 功能配置
 */
export const userManagementSchema: PageSchema = {
  metadata: {
    pageId: 'user_management_page',
    name: '用户管理',
    version: '1.0.0',
    description: '用户管理系统 - 支持增删改查功能',
    seo: {
      title: '用户管理系统',
      description: '基于 Snap Studio 低代码平台构建的用户管理系统'
    }
  },

  loadStrategy: {
    initial: ['ds_user_list'],
    preload: [],
    onDemand: {
      'act_create_user': ['ds_departments', 'ds_positions'],
      'act_edit_user': ['ds_departments', 'ds_positions']
    }
  },

  layout: {
    root: 'comp_page_container'
  },

  components: {
    // 页面容器
    'comp_page_container': {
      componentType: 'Container',
      properties: {
        style: {
          padding: '24px',
          minHeight: '100vh'
        }
      },
      children: ['comp_user_table']
    },

    // 用户表格
    'comp_user_table': {
      componentType: 'Table',
      properties: {
        rowKey: 'id',
        bordered: true,
        size: 'middle',
        editable: true,
        editMode: 'inline',
        
        // 表格列配置
        columns: [
          {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            sorter: true
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            editable: true,
            editType: 'input',
            rules: [
              { required: true, message: '姓名不能为空' },
              { min: 2, max: 20, message: '姓名长度在2-20个字符之间' }
            ]
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            editable: true,
            editType: 'input',
            rules: [
              { required: true, message: '邮箱不能为空' },
            ]
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            editable: true,
            editType: 'input',
            rules: [
              { required: true, message: '手机号不能为空' },
            ]
          },
          {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            width: 120,
            editable: true,
            editType: 'select',
            editOptions: departments,
            filters: departments.map(dept => ({ text: dept.label, value: dept.value })),
            // render: "(value) => departments.find(d => d.value === value)?.label || value"
          },
          {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
            width: 140,
            editable: true,
            editType: 'select',
            editOptions: positions,
            // render: "(value) => positions.find(p => p.value === value)?.label || value"
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            editable: true,
            editType: 'select',
            editOptions: statusOptions,
            filters: statusOptions.map(status => ({ text: status.label, value: status.value })),
            // render: "(value) => value === 'active' ? '在职' : '离职'"
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            sorter: true,
            // render: "(value) => new Date(value).toLocaleString('zh-CN')"
          }
        ],

        // 行操作配置
        rowActions: [
          {
            type: 'update',
            text: '编辑',
            actionId: 'act_edit_user'
          },
          {
            type: 'delete',
            text: '删除',
            actionId: 'act_delete_user',
            confirm: {
              title: '确认删除',
              content: '删除后无法恢复，确定要删除这个用户吗？'
            }
          }
        ],

        // 工具栏操作配置
        toolbarActions: [
          {
            type: 'create',
            text: '新增用户',
            actionId: 'act_create_user'
          }
        ],

        // 搜索配置
        search: {
          enabled: true,
          fields: [
            {
              name: 'name',
              label: '用户名/邮箱',
              type: 'input',
              placeholder: '请输入用户名或邮箱'
            },
            {
              name: 'department',
              label: '部门',
              type: 'select',
              options: departments
            },
            {
              name: 'status',
              label: '状态',
              type: 'select',
              options: statusOptions
            }
          ],
          searchActionId: 'act_search_users',
          resetActionId: 'act_reset_search'
        },

        // 分页配置
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
          pageSizeOptions: ['10', '20', '50', '100']
        },

        // 行选择配置
        rowSelection: {
          type: 'checkbox',
          onChangeActionId: 'act_row_selection_change'
        }
      },
      dataBinding: {
        dataSource: 'state.userList',
        loading: 'state.loading',
        pagination: 'state.pagination'
      }
    }
  },

  dataSource: {
    // 用户列表数据源
    'ds_user_list': {
      type: 'STATIC_DATA',
      config: {
        value: []
      }
    },

    // 部门列表数据源
    'ds_departments': {
      type: 'STATIC_DATA',
      config: {
        value: departments
      }
    },

    // 职位列表数据源
    'ds_positions': {
      type: 'STATIC_DATA',
      config: {
        value: positions
      }
    }
  },

  actions: {
    // 加载用户列表
    'act_load_users': {
      type: 'COMPOSITE',
      config: {
        steps: [
          'act_set_loading_true',
          'act_fetch_users',
          'act_set_loading_false'
        ]
      }
    },

    // 设置加载状态
    'act_set_loading_true': {
      type: 'UPDATE_STATE',
      config: {
        path: 'loading',
        value: true
      }
    },

    'act_set_loading_false': {
      type: 'UPDATE_STATE',
      config: {
        path: 'loading',
        value: false
      }
    },

    // 获取用户数据
    'act_fetch_users': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any) => {
          const { stateManager } = context;
          const searchParams = stateManager.get('searchParams') || {};
          const pagination = stateManager.get('pagination') || { current: 1, pageSize: 10 };
          
          try {
            const result = await mockDataStore.getUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              ...searchParams
            });
            
            stateManager.set('userList', result.data);
            stateManager.set('pagination', {
              ...pagination,
              total: result.total
            });
          } catch (error) {
            console.error('获取用户列表失败:', error);
          }
        }
      }
    },

    // 创建用户
    'act_create_user': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any, record?: any) => {
          const { stateManager } = context;
          
          if (!record) {
            // 如果没有传入记录，创建默认新记录并开始编辑
            const newRecord = {
              id: `new_${Date.now()}`,
              name: '',
              email: '',
              phone: '',
              department: 'tech',
              position: 'frontend',
              status: 'active'
            };
            
            const currentUsers = stateManager.get('userList') || [];
            stateManager.set('userList', [newRecord, ...currentUsers]);
            return;
          }
          
          try {
            stateManager.set('loading', true);
            const createdUser = await mockDataStore.createUser(record);
            
            // 刷新用户列表
            const searchParams = stateManager.get('searchParams') || {};
            const pagination = stateManager.get('pagination') || { current: 1, pageSize: 10 };
            
            const result = await mockDataStore.getUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              ...searchParams
            });
            
            stateManager.set('userList', result.data);
            stateManager.set('pagination', {
              ...pagination,
              total: result.total
            });
          } catch (error) {
            console.error('创建用户失败:', error);
            throw error;
          } finally {
            stateManager.set('loading', false);
          }
        }
      }
    },

    // 更新用户
    'act_update_user': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any, record: any) => {
          const { stateManager } = context;
          
          try {
            stateManager.set('loading', true);
            await mockDataStore.updateUser(record.id, record);
            
            // 更新本地数据
            const currentUsers = stateManager.get('userList') || [];
            const updatedUsers = currentUsers.map((user: any) => 
              user.id === record.id ? record : user
            );
            stateManager.set('userList', updatedUsers);
          } catch (error) {
            console.error('更新用户失败:', error);
            throw error;
          } finally {
            stateManager.set('loading', false);
          }
        }
      }
    },

    // 删除用户
    'act_delete_user': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any, record: any) => {
          const { stateManager } = context;
          
          try {
            stateManager.set('loading', true);
            await mockDataStore.deleteUser(record.id);
            
            // 刷新用户列表
            const searchParams = stateManager.get('searchParams') || {};
            const pagination = stateManager.get('pagination') || { current: 1, pageSize: 10 };
            
            const result = await mockDataStore.getUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              ...searchParams
            });
            
            stateManager.set('userList', result.data);
            stateManager.set('pagination', {
              ...pagination,
              total: result.total
            });
          } catch (error) {
            console.error('删除用户失败:', error);
            throw error;
          } finally {
            stateManager.set('loading', false);
          }
        }
      }
    },

    // 批量删除用户
    'act_batch_delete_users': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any, records: any[]) => {
          const { stateManager } = context;
          
          try {
            stateManager.set('loading', true);
            const ids = records.map(record => record.id);
            await mockDataStore.batchDeleteUsers(ids);
            
            // 刷新用户列表
            const searchParams = stateManager.get('searchParams') || {};
            const pagination = stateManager.get('pagination') || { current: 1, pageSize: 10 };
            
            const result = await mockDataStore.getUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              ...searchParams
            });
            
            stateManager.set('userList', result.data);
            stateManager.set('pagination', {
              ...pagination,
              total: result.total
            });
          } catch (error) {
            console.error('批量删除用户失败:', error);
            throw error;
          } finally {
            stateManager.set('loading', false);
          }
        }
      }
    },

    // 搜索用户
    'act_search_users': {
      type: 'CUSTOM',
      config: {
        handler: async (context: any, searchParams: any) => {
          const { stateManager } = context;
          
          stateManager.set('searchParams', searchParams);
          stateManager.set('pagination', { current: 1, pageSize: 10 });
          
          // 重新加载用户列表
          await context.actionExecutor.execute('act_fetch_users');
        }
      }
    },

    // 重置搜索
    'act_reset_search': {
      type: 'COMPOSITE',
      config: {
        steps: [
          'act_clear_search_params',
          'act_reset_pagination',
          'act_fetch_users'
        ]
      }
    },

    'act_clear_search_params': {
      type: 'UPDATE_STATE',
      config: {
        path: 'searchParams',
        value: {}
      }
    },

    'act_reset_pagination': {
      type: 'UPDATE_STATE',
      config: {
        path: 'pagination',
        value: { current: 1, pageSize: 10 }
      }
    },

    // 行选择变化
    'act_row_selection_change': {
      type: 'UPDATE_STATE',
      config: {
        path: 'selectedRowKeys',
        value: '{{payload}}'
      }
    }
  },

  initialState: {
    userList: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    searchParams: {},
    selectedRowKeys: []
  },

  lifecycle: {
    onLoad: ['act_load_users']
  }
};