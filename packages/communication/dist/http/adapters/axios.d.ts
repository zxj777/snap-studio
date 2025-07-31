import type { HttpClient, HttpRequestConfig, HttpResponse } from '../types.js';
/**
 * 基于 Axios 的 HTTP 客户端实现
 * 需要项目安装 axios 依赖
 */
export declare class AxiosHttpClient implements HttpClient {
    private axiosInstance;
    constructor(axiosInstance: any);
    request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
    get<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
    post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
    put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
    delete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
}
//# sourceMappingURL=axios.d.ts.map