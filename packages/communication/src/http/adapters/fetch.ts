import type { HttpClient, HttpRequestConfig, HttpResponse } from '../types.js';

/**
 * 基于 Fetch API 的 HTTP 客户端实现
 */
export class FetchHttpClient implements HttpClient {
  private readonly defaultConfig: Partial<HttpRequestConfig>;
  
  constructor(defaultConfig: Partial<HttpRequestConfig> = {}) {
    this.defaultConfig = {
      timeout: 10000,
      responseType: 'json',
      ...defaultConfig
    };
  }
  
  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    // 合并默认配置
    const finalConfig = { ...this.defaultConfig, ...config };
    const { url, method = 'GET', headers, params, body, timeout, responseType } = finalConfig;

    // 构建请求URL
    let requestUrl = url;
    if (params) {
      const searchParams = new URLSearchParams(params);
      const separator = url.includes('?') ? '&' : '?';
      requestUrl += separator + searchParams.toString();
    }
    
    // 构建请求头，为所有请求设置Content-Type
    const requestHeaders: Record<string, string> = { ...headers };
    if (!requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
      requestHeaders['Content-Type'] = 'application/json; charset=utf-8';
    }

    // 构建请求选项
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: timeout ? AbortSignal.timeout(timeout) : undefined
    };
    
    // 设置请求体
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    try {
      const response = await fetch(requestUrl, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // 解析响应数据
      let data: T;
      switch (responseType) {
        case 'json':
          data = await response.json();
          break;
        case 'text':
          data = await response.text() as T;
          break;
        case 'blob':
          data = await response.blob() as T;
          break;
        case 'arrayBuffer':
          data = await response.arrayBuffer() as T;
          break;
        default:
          data = await response.json();
      }
      
      // 构建响应头对象
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        config: finalConfig
      };
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`请求失败: ${error.message}`);
      }
      throw new Error('请求失败: 未知错误');
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