/**
 * 模拟用户数据
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

/**
 * 部门列表
 */
export const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '设计部', value: 'design' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
  { label: '人事部', value: 'hr' }
];

/**
 * 职位列表
 */
export const positions = [
  { label: '前端工程师', value: 'frontend' },
  { label: '后端工程师', value: 'backend' },
  { label: '全栈工程师', value: 'fullstack' },
  { label: '产品经理', value: 'pm' },
  { label: 'UI设计师', value: 'ui' },
  { label: 'UX设计师', value: 'ux' },
  { label: '运营专员', value: 'operation' },
  { label: '市场专员', value: 'marketing' },
  { label: 'HR专员', value: 'hr' }
];

/**
 * 状态列表
 */
export const statusOptions = [
  { label: '在职', value: 'active' },
  { label: '离职', value: 'inactive' }
];

/**
 * 生成模拟用户数据
 */
export const generateMockUsers = (count: number = 50): User[] => {
  const users: User[] = [];
  const names = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
    '陈一', '刘二', '杨三', '黄四', '朱五', '林六', '徐七', '邓八',
    '马九', '高十', '梁一', '郭二', '谢三', '曹四', '彭五', '潘六'
  ];
  
  const emailDomains = ['@company.com', '@example.com', '@test.com'];
  
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const status = Math.random() > 0.2 ? 'active' : 'inactive';
    const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    
    const createTime = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updateTime = new Date(createTime.getTime() + Math.random() * 100 * 24 * 60 * 60 * 1000);
    
    users.push({
      id: `user_${i + 1}`,
      name: `${name}${i + 1}`,
      email: `${name.toLowerCase()}${i + 1}${emailDomain}`,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      department: department.value,
      position: position.value,
      status: status as 'active' | 'inactive',
      createTime: createTime.toISOString(),
      updateTime: updateTime.toISOString()
    });
  }
  
  return users;
};

/**
 * 模拟数据存储
 */
class MockDataStore {
  private users: User[] = generateMockUsers(50);
  
  /**
   * 获取用户列表
   */
  getUsers(params?: {
    page?: number;
    pageSize?: number;
    name?: string;
    department?: string;
    status?: string;
  }): Promise<{
    data: User[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return new Promise((resolve) => {

      
      setTimeout(() => {
        let filteredUsers = [...this.users];
        
        // 筛选
        if (params?.name) {
          filteredUsers = filteredUsers.filter(user => 
            user.name.includes(params.name!) || 
            user.email.includes(params.name!)
          );
        }
        
        if (params?.department) {
          filteredUsers = filteredUsers.filter(user => user.department === params.department);
        }
        
        if (params?.status) {
          filteredUsers = filteredUsers.filter(user => user.status === params.status);
        }
        
        // 分页
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        resolve({
          data: filteredUsers.slice(start, end),
          total: filteredUsers.length,
          page,
          pageSize
        });
      }, 300); // 模拟网络延迟
    });
  }
  
  /**
   * 创建用户
   */
  createUser(user: Omit<User, 'id' | 'createTime' | 'updateTime'>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查邮箱是否已存在
        if (this.users.some(u => u.email === user.email)) {
          reject(new Error('邮箱已存在'));
          return;
        }
        
        const newUser: User = {
          ...user,
          id: `user_${Date.now()}`,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        };
        
        this.users.unshift(newUser);
        resolve(newUser);
      }, 500);
    });
  }
  
  /**
   * 更新用户
   */
  updateUser(id: string, user: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('用户不存在'));
          return;
        }
        
        // 检查邮箱是否被其他用户使用
        if (user.email && this.users.some(u => u.id !== id && u.email === user.email)) {
          reject(new Error('邮箱已被其他用户使用'));
          return;
        }
        
        this.users[index] = {
          ...this.users[index],
          ...user,
          updateTime: new Date().toISOString()
        };
        
        resolve(this.users[index]);
      }, 500);
    });
  }
  
  /**
   * 删除用户
   */
  deleteUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('用户不存在'));
          return;
        }
        
        this.users.splice(index, 1);
        resolve();
      }, 300);
    });
  }
  
  /**
   * 批量删除用户
   */
  batchDeleteUsers(ids: string[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.users = this.users.filter(user => !ids.includes(user.id));
        resolve();
      }, 500);
    });
  }
}

// 导出单例实例
export const mockDataStore = new MockDataStore();