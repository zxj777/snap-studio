/**
 * 基于 Fetch API 的 HTTP 客户端实现
 */
export class FetchHttpClient {
    constructor(defaultConfig = {}) {
        this.defaultConfig = {
            timeout: 10000,
            responseType: 'json',
            ...defaultConfig
        };
    }
    async request(config) {
        // 合并默认配置
        const finalConfig = { ...this.defaultConfig, ...config };
        const { url, method = 'GET', headers, params, body, timeout, responseType } = finalConfig;
        debugger;
        // 构建请求URL
        let requestUrl = url;
        if (params) {
            const searchParams = new URLSearchParams(params);
            const separator = url.includes('?') ? '&' : '?';
            requestUrl += separator + searchParams.toString();
        }
        // 构建请求头，只有POST/PUT/PATCH等有body的请求才设置Content-Type
        const requestHeaders = { ...headers };
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            if (!requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
                requestHeaders['Content-Type'] = 'application/json';
            }
        }
        // 构建请求选项
        const fetchOptions = {
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
            let data;
            switch (responseType) {
                case 'json':
                    data = await response.json();
                    break;
                case 'text':
                    data = await response.text();
                    break;
                case 'blob':
                    data = await response.blob();
                    break;
                case 'arrayBuffer':
                    data = await response.arrayBuffer();
                    break;
                default:
                    data = await response.json();
            }
            // 构建响应头对象
            const responseHeaders = {};
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`请求失败: ${error.message}`);
            }
            throw new Error('请求失败: 未知错误');
        }
    }
    async get(url, config) {
        return this.request({ ...config, url, method: 'GET' });
    }
    async post(url, data, config) {
        return this.request({ ...config, url, method: 'POST', body: data });
    }
    async put(url, data, config) {
        return this.request({ ...config, url, method: 'PUT', body: data });
    }
    async delete(url, config) {
        return this.request({ ...config, url, method: 'DELETE' });
    }
}
//# sourceMappingURL=fetch.js.map