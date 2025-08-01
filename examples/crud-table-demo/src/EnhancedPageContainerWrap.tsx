import { useEffect } from "react";
import { EnhancedPageContainer } from "./components/enhanced-page-container";
// import userManagementConfig from "./user-management.config.json";
import userFilterConfig from "./user-filter.config.json";

const EnhancedPageContainerWrap = ({ httpClient }: { httpClient: any }) => {
  useEffect(() => {
    console.log("EnhancedPageContainerWrap");
  }, []);
  return (
    <EnhancedPageContainer
      schema={userFilterConfig as any}
      engineConfig={{
        debug: true,
        dataLoader: {
          timeout: 15000,
          enableCache: true,
          httpClient, // 🚀 使用 Axios HTTP 客户端
        },
      }}
      onPageLoad={(schema) => {
        console.log("✅ 页面加载完成:", schema.metadata.name);
      }}
      onPageError={(error) => {
        console.error("❌ 页面加载失败:", error);
      }}
    />
  );
};

export default EnhancedPageContainerWrap;
