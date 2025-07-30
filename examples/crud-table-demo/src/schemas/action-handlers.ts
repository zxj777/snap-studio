import type { ActionExecutor } from '@snap-studio/core';
import { mockDataStore } from '../mock-data';
import { message } from 'antd';

/**
 * 自定义行为处理器
 * 为 CUSTOM 类型的 action 提供具体实现
 */
export function setupActionHandlers(actionExecutor: ActionExecutor) {
  // 获取用户数据
  actionExecutor.registerAction('act_fetch_users', {
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
          message.error('获取用户列表失败');
        }
      }
    }
  });

  // 创建用户
  actionExecutor.registerAction('act_create_user', {
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
          await actionExecutor.execute('act_fetch_users');
          message.success('用户创建成功');
        } catch (error) {
          console.error('创建用户失败:', error);
          message.error('创建用户失败: ' + (error as Error).message);
          throw error;
        } finally {
          stateManager.set('loading', false);
        }
      }
    }
  });

  // 更新用户
  actionExecutor.registerAction('act_update_user', {
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
          message.success('用户更新成功');
        } catch (error) {
          console.error('更新用户失败:', error);
          message.error('更新用户失败: ' + (error as Error).message);
          throw error;
        } finally {
          stateManager.set('loading', false);
        }
      }
    }
  });

  // 删除用户
  actionExecutor.registerAction('act_delete_user', {
    type: 'CUSTOM',
    config: {
      handler: async (context: any, record: any) => {
        const { stateManager } = context;
        
        try {
          stateManager.set('loading', true);
          await mockDataStore.deleteUser(record.id);
          
          // 刷新用户列表
          await actionExecutor.execute('act_fetch_users');
          message.success('用户删除成功');
        } catch (error) {
          console.error('删除用户失败:', error);
          message.error('删除用户失败: ' + (error as Error).message);
          throw error;
        } finally {
          stateManager.set('loading', false);
        }
      }
    }
  });

  // 批量删除用户
  actionExecutor.registerAction('act_batch_delete_users', {
    type: 'CUSTOM',
    config: {
      handler: async (context: any, records: any[]) => {
        const { stateManager } = context;
        
        try {
          stateManager.set('loading', true);
          const ids = records.map(record => record.id);
          await mockDataStore.batchDeleteUsers(ids);
          
          // 刷新用户列表
          await actionExecutor.execute('act_fetch_users');
          message.success(`成功删除 ${records.length} 个用户`);
        } catch (error) {
          console.error('批量删除用户失败:', error);
          message.error('批量删除用户失败: ' + (error as Error).message);
          throw error;
        } finally {
          stateManager.set('loading', false);
        }
      }
    }
  });

  // 搜索用户
  actionExecutor.registerAction('act_search_users', {
    type: 'CUSTOM',
    config: {
      handler: async (context: any, searchParams: any) => {
        const { stateManager } = context;
        
        stateManager.set('searchParams', searchParams);
        stateManager.set('pagination', { current: 1, pageSize: 10 });
        
        // 重新加载用户列表
        await actionExecutor.execute('act_fetch_users');
      }
    }
  });
}