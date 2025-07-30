import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card } from 'antd';
import { EnhancedPageContainer } from './components/enhanced-page-container';
import { setupComponentRegistry } from './component-registry';
import { userManagementSchema } from './schemas/user-management.schema';
import { setupActionHandlers } from './schemas/action-handlers';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [componentsRegistered, setComponentsRegistered] = useState(() => {
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
            🚀 Snap Studio - 低代码渲染引擎演示
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
          🚀 Snap Studio - 低代码渲染引擎演示
        </Title>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Card 
          title="用户管理系统" 
          style={{ width: '100%' }}
          bodyStyle={{ padding: 0 }}
        >
          <EnhancedPageContainer
            schema={userManagementSchema}
            engineConfig={{
              debug: true,
              dataLoader: {
                timeout: 10000,
                enableCache: true
              },
              expressionEngine: {
                debug: true
              }
            }}
            onPageLoad={(schema) => {
              console.log('✅ 页面加载完成:', schema.metadata.name);
            }}
            onPageError={(error) => {
              console.error('❌ 页面加载失败:', error);
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default App;