/**
 * 通用通信配置
 */
export interface CommunicationConfig {
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
    retryCount?: number;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
}
/**
 * 通信客户端接口（为未来扩展预留）
 */
export interface CommunicationClient<T = any> {
    connect?(): Promise<void>;
    disconnect?(): void;
    send?(data: T): Promise<void>;
    subscribe?(callback: (data: any) => void): () => void;
    isConnected?(): boolean;
}
/**
 * 通信客户端类型
 */
export type CommunicationClientType = 'http' | 'websocket' | 'sse';
//# sourceMappingURL=common.d.ts.map