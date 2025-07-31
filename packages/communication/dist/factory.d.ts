import type { HttpClient } from './http/types.js';
/**
 * 创建通信客户端的工厂函数
 */
export declare function createCommunicationClient(type: 'http', config?: any): HttpClient;
/**
 * 创建 HTTP 客户端的便捷函数
 */
export declare function createHttpClient(adapter?: 'fetch' | 'axios', config?: any): HttpClient;
//# sourceMappingURL=factory.d.ts.map