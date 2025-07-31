import type { HttpClient, HttpRequestConfig, HttpResponse } from '../types.js';

/**
 * 基于 Axios 的 HTTP 客户端实现
 * 需要项目安装 axios 依赖
 */
export class AxiosHttpClient implements HttpClient {
  constructor(private axiosInstance: any) {}
  
  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    try {
      const method = config.method || 'GET';
      
      // 构建请求头，为所有请求设置Content-Type
      const headers: Record<string, string> = { ...config.headers };
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json; charset=utf-8';
      }
      
      const axiosConfig = {
        url: config.url,
        method,
        headers,
        params: config.params,
        data: config.body,
        timeout: config.timeout,
        responseType: config.responseType === 'arrayBuffer' ? 'arraybuffer' : config.responseType
      };
      
      const response = await this.axiosInstance.request(axiosConfig);
      
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config
      };
    } catch (error: any) {
      const message = error.response 
        ? `HTTP ${error.response.status}: ${error.response.statusText}`
        : error.message || '请求失败';
      throw new Error(message);
    }
  }
  
  async get<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }
  
  async post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', body: data });
  }
  
  async put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', body: data });
  }
  
  async delete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }
}