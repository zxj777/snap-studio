import { useState } from 'react';
import { Layout, Typography } from 'antd';
import { EnhancedPageContainer } from './components/enhanced-page-container';
import { setupComponentRegistry } from './component-registry';
import userManagementConfig from './user-management.config.json';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [componentsRegistered] = useState(() => {
    // 同步设置组件注册表
    console.log('开始注册组件...');
    setupComponentRegistry();
    console.log('组件注册完成');
    return true;
  });

  // 等待组件注册完成
  if (!componentsRegistered) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            🚀 Snap Studio - 用户管理系统
          </Title>
        </Header>
        
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div>组件注册中...</div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          🚀 Snap Studio - 用户管理系统
        </Title>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <div style={{ 
          background: '#fff7e6', 
          border: '1px solid #ffd591',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <strong>💡 低代码引擎驱动：</strong>
          <ul style={{ marginBottom: 0, marginTop: 8 }}>
            <li>通过单一 JSON 配置文件驱动整个页面</li>
            <li>所有的表格列、搜索字段、按钮都可配置</li>
            <li>支持完整的用户增删改查功能</li>
            <li>配置文件：<code>user-management.config.json</code></li>
          </ul>
        </div>
        <EnhancedPageContainer
          schema={userManagementConfig as any}
          engineConfig={{
            debug: true,
            dataLoader: {
              timeout: 10000,
              enableCache: true
            }
          }}
          onPageLoad={(schema) => {
            console.log('✅ 页面加载完成:', schema.metadata.name);
          }}
          onPageError={(error) => {
            console.error('❌ 页面加载失败:', error);
          }}
        />
      </Content>
    </Layout>
  );
}

export default App;