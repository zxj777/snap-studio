/**
 * 模拟API服务器
 * 为了演示API_REQUEST数据源，我们需要一个简单的API服务
 */
import { mockDataStore } from './mock-data';

// 模拟API端点处理函数
const handleUsersGet = async (params: URLSearchParams) => {
  const searchParams = {
    name: params.get('name') || undefined,
    department: params.get('department') || undefined,
    status: params.get('status') || undefined,
    page: parseInt(params.get('page') || '1'),
    pageSize: parseInt(params.get('pageSize') || '10')
  };
  
  return await mockDataStore.getUsers(searchParams);
};

const handleUsersPost = async (body: any) => {
  return await mockDataStore.createUser(body);
};

const handleUserUpdate = async (id: string, body: any) => {
  return await mockDataStore.updateUser(id, body);
};

const handleUserDelete = async (id: string) => {
  return await mockDataStore.deleteUser(id);
};

// 拦截fetch请求
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  
  // 如果是我们的模拟API
  if (url.startsWith('/api/')) {
    const method = init?.method || 'GET';
    
    try {
      let result;
      
      if (url === '/api/users' && method === 'GET') {
        const urlObj = new URL(url, window.location.origin);
        result = await handleUsersGet(urlObj.searchParams);
      } else if (url.match(/^\/api\/users\/\w+$/) && (method === 'PUT' || method === 'DELETE')) {
        const id = url.split('/').pop()!;
        if (method === 'PUT') {
          const body = init?.body ? JSON.parse(init.body as string) : undefined;
          result = await handleUserUpdate(id, body);
        } else {
          result = await handleUserDelete(id);
        }
      } else if (url === '/api/users' && method === 'POST') {
        const body = init?.body ? JSON.parse(init.body as string) : undefined;
        result = await handleUsersPost(body);
      }
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  // 其他请求使用原始fetch
  return originalFetch(input, init);
};

console.log('🚀 Mock API server initialized');