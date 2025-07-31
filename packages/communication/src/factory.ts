import type { CommunicationClientType } from './types/common.js';
import type { HttpClient } from './http/types.js';
import { FetchHttpClient, AxiosHttpClient } from './http/index.js';

/**
 * 创建通信客户端的工厂函数
 */
export function createCommunicationClient(
  type: 'http',
  config?: any
): HttpClient;
export function createCommunicationClient(
  type: CommunicationClientType,
  config?: any
): any {
  switch (type) {
    case 'http':
      return new FetchHttpClient(config);
    case 'websocket':
      throw new Error('WebSocket client not implemented yet');
    case 'sse':
      throw new Error('SSE client not implemented yet');
    default:
      throw new Error(`Unsupported communication type: ${type}`);
  }
}

/**
 * 创建 HTTP 客户端的便捷函数
 */
export function createHttpClient(
  adapter: 'fetch' | 'axios' = 'fetch',
  config?: any
): HttpClient {
  switch (adapter) {
    case 'fetch':
      return new FetchHttpClient(config);
    case 'axios':
      if (!config) {
        throw new Error('Axios instance required for AxiosHttpClient');
      }
      return new AxiosHttpClient(config);
    default:
      throw new Error(`Unsupported HTTP adapter: ${adapter}`);
  }
}