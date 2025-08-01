import { useState } from "react";
import { Layout, Typography } from "antd";
import { setupComponentRegistry } from "./component-registry";
import axios from "axios";
import { AxiosHttpClient } from "@snap-studio/communication";
// import MockAdapter from "axios-mock-adapter";
// import { mockDataStore } from "./mock-data";
import EnhancedPageContainerWrap from "./EnhancedPageContainerWrap";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [componentsRegistered] = useState(() => {
    // 同步设置组件注册表
    console.log("开始注册组件...");
    setupComponentRegistry();
    console.log("组件注册完成");
    return true;
  });

  // 创建 axios 实例和 HTTP 客户端
  const axiosInstance = axios.create({
    baseURL: window.location.origin, // 使用当前域名作为baseURL
    timeout: 15000,
  });

  // 🚀 配置Mock适配器（注释掉以禁用所有mock，调用真实接口）
  // const mock = new MockAdapter(axiosInstance, { delayResponse: 300 });

  // 配置用户列表API（注释掉以调用真实接口）
  // mock.onGet("/api/users").reply(async (config) => {
  //   try {
  //     console.log("🎯 Mock拦截GET /api/users:", config.params);

  //     const searchParams = {
  //       name: config.params?.name || config.params?.search || undefined,
  //       department: config.params?.department || undefined,
  //       status: config.params?.status || undefined,
  //       page: parseInt(config.params?.page || "1"),
  //       pageSize: parseInt(config.params?.pageSize || "10"),
  //     };

  //     console.log("📋 处理用户查询参数:", searchParams);
  //     const result = await mockDataStore.getUsers(searchParams);
  //     console.log("✅ Mock返回结果:", result);

  //     return [200, result];
  //   } catch (error) {
  //     console.error("❌ Mock处理错误:", error);
  //     return [400, { error: (error as Error).message }];
  //   }
  // });

  // 配置创建用户API（注释掉以调用真实接口）
  // mock.onPost("/api/users").reply(async (config) => {
  //   try {
  //     console.log("🎯 Mock拦截POST /api/users:", config.data);
  //     const userData = JSON.parse(config.data);
  //     const result = await mockDataStore.createUser(userData);
  //     console.log("✅ Mock创建用户成功:", result);
  //     return [201, result];
  //   } catch (error) {
  //     console.error("❌ Mock创建用户失败:", error);
  //     return [400, { error: (error as Error).message }];
  //   }
  // });

  // 配置更新用户API（注释掉以调用真实接口）
  // mock.onPut(/\/api\/users\/\w+/).reply(async (config) => {
  //   try {
  //     const url = config.url || "";
  //     const id = url.split("/").pop()!;
  //     const userData = JSON.parse(config.data);
  //     console.log("🎯 Mock拦截PUT /api/users/" + id, userData);

  //     const result = await mockDataStore.updateUser(id, userData);
  //     console.log("✅ Mock更新用户成功:", result);
  //     return [200, result];
  //   } catch (error) {
  //     console.error("❌ Mock更新用户失败:", error);
  //     return [400, { error: (error as Error).message }];
  //   }
  // });

  // 配置删除用户API（注释掉以调用真实接口）
  // mock.onDelete(/\/api\/users\/\w+/).reply(async (config) => {
  //   try {
  //     const url = config.url || "";
  //     const id = url.split("/").pop()!;
  //     console.log("🎯 Mock拦截DELETE /api/users/" + id);

  //     await mockDataStore.deleteUser(id);
  //     console.log("✅ Mock删除用户成功");
  //     return [200, { success: true }];
  //   } catch (error) {
  //     console.error("❌ Mock删除用户失败:", error);
  //     return [400, { error: (error as Error).message }];
  //   }
  // });

  // 患者信息接口不进行 Mock，直接调用真实接口
  // mock.onPost("/api/patient/patientInfo/preview").reply(async (config) => {
  //   // 注释掉 mock 配置，让真实接口被调用
  // });

  // 添加请求/响应拦截器用于调试
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log("🚀 Axios Request:", {
        url: config.url,
        method: config.method,
        params: config.params,
      });
      return config;
    },
    (error) => {
      console.error("❌ Axios Request Error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("✅ Axios Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error("❌ Axios Response Error:", error);
      return Promise.reject(error);
    }
  );

  const httpClient = new AxiosHttpClient(axiosInstance);

  // 等待组件注册完成
  if (!componentsRegistered) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            🚀 轻应用demo
          </Title>
        </Header>

        <Content
          style={{
            padding: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div>组件注册中...</div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          🚀 轻应用demo
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <div
          style={{
            background: "#fff7e6",
            border: "1px solid #ffd591",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          <strong>💡 低代码引擎驱动：</strong>
          <ul style={{ marginBottom: 0, marginTop: 8 }}>
            <li>通过单一 JSON 配置文件驱动整个页面</li>
            <li>所有的表格列、搜索字段、按钮都可配置</li>
            <li>
              配置文件：<code> user-filter.config</code>
            </li>
          </ul>
        </div>
        <EnhancedPageContainerWrap httpClient={httpClient} />
      </Content>
    </Layout>
  );
}

export default App;
