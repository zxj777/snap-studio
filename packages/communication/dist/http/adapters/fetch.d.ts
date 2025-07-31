import type { HttpClient, HttpRequestConfig, HttpResponse } from '../types.js';
/**
 * 基于 Fetch API 的 HTTP 客户端实现
 */
export declare class FetchHttpClient implements HttpClient {
    private readonly defaultConfig;
    constructor(defaultConfig?: Partial<HttpRequestConfig>);
    request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
    get<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
    post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
    put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
    delete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
}
//# sourceMappingURL=fetch.d.ts.map