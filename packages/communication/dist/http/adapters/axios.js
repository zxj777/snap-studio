/**
 * 基于 Axios 的 HTTP 客户端实现
 * 需要项目安装 axios 依赖
 */
export class AxiosHttpClient {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }
    async request(config) {
        try {
            const method = config.method || 'GET';
            // 构建请求头，只有POST/PUT/PATCH等有body的请求才设置Content-Type
            const headers = { ...config.headers };
            if (config.body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
                if (!headers['Content-Type'] && !headers['content-type']) {
                    headers['Content-Type'] = 'application/json';
                }
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
        }
        catch (error) {
            const message = error.response
                ? `HTTP ${error.response.status}: ${error.response.statusText}`
                : error.message || '请求失败';
            throw new Error(message);
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
//# sourceMappingURL=axios.js.map