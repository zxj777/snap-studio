# Snap Studio CRUD Table Demo

这是一个基于 Snap Studio 低代码渲染引擎构建的完整用户管理系统示例，展示了如何通过**单一 JSON 配置文件**实现表格的增删改查功能。

## ✨ 重构亮点

🎯 **极简架构** - 删除了所有多余的组件文件，只保留核心的用户管理功能  
📄 **单文件配置** - 整个应用由 `user-management.config.json` 一个文件驱动  
🚀 **零代码开发** - 表格列、搜索字段、按钮等都通过 JSON 配置，无需编写组件代码  
🔧 **高度可配置** - 所有UI元素都可以通过修改配置文件轻松调整  
⚡ **内置数据源** - 使用引擎内置的 `MOCK`、`API_REQUEST` 等数据源类型  
🎛️ **内置Actions** - 使用 `FETCH_DATA`、`CALL_API` 等通用action，无需自定义

## 🎯 功能特性

### ✅ 完整的 CRUD 操作
- **新增用户** - 支持内联编辑创建新用户
- **编辑用户** - 支持内联编辑修改用户信息
- **删除用户** - 支持单个删除和批量删除
- **查询用户** - 支持多条件搜索和筛选

### ✅ 高级表格功能
- **内联编辑** - 直接在表格中编辑数据
- **表单验证** - 支持字段验证规则
- **排序筛选** - 支持列排序和筛选
- **分页导航** - 支持分页显示和页面大小调整
- **行选择** - 支持单选和多选操作
- **搜索功能** - 支持多字段组合搜索

### ✅ 低代码特性
- **单一配置文件** - 整个页面由一个 JSON 文件驱动
- **完全可配置** - 表格列、搜索字段、按钮都可通过配置修改
- **零代码组件** - 无需编写 React 组件代码
- **响应式状态管理** - 自动同步数据状态
- **智能加载策略** - 支持按需加载和预加载
- **事件驱动** - 声明式事件处理和动作执行

## 🏗️ 技术架构

```
📦 examples/crud-table-demo/
├── 📄 package.json                          # 项目配置
├── 📄 vite.config.ts                       # Vite 构建配置
├── 📄 tsconfig.json                        # TypeScript 配置
├── 📄 index.html                           # HTML 入口
└── 📁 src/
    ├── 📄 main.tsx                         # 应用入口
    ├── 📄 App.tsx                          # 主应用组件 (简化版)
    ├── 📄 user-management.config.json      # 🎯 核心配置文件
    ├── 📄 component-registry.ts            # 组件注册表
    ├── 📄 mock-data.ts                    # 模拟数据和API
    ├── 📁 components/
    │   └── 📄 enhanced-page-container.tsx  # 增强页面容器
    └── 📁 schemas/
        └── 📄 action-handlers.ts           # 自定义行为处理器
```

### 核心特点
- **单文件配置**: `user-management.config.json` 是唯一的配置来源
- **简化架构**: 删除了所有不必要的组件文件
- **纯声明式**: 通过 JSON 配置实现所有功能，无需编写组件代码

## 🚀 快速开始

### 1. 安装依赖

```bash
# 在项目根目录安装依赖
pnpm install
```

### 2. 启动开发服务器

```bash
# 进入示例目录
cd examples/crud-table-demo

# 启动开发服务器
pnpm dev
```

### 3. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📋 用户操作指南

### 新增用户
1. 点击表格上方的 **"新增用户"** 按钮
2. 表格顶部会出现一行可编辑的新记录
3. 填写用户信息（姓名、邮箱、手机号等）
4. 点击 **"保存"** 完成创建，或点击 **"取消"** 放弃创建

### 编辑用户
1. 点击用户行的 **"编辑"** 按钮
2. 该行进入编辑模式，字段变为可编辑状态
3. 修改需要的信息
4. 点击 **"保存"** 完成修改，或点击 **"取消"** 放弃修改

### 删除用户
- **单个删除**: 点击用户行的 **"删除"** 按钮，确认后删除
- **批量删除**: 选中多个用户，点击 **"删除选中"** 按钮

### 搜索筛选
1. 点击表格右上角的 **"搜索"** 按钮展开搜索表单
2. 在搜索表单中输入筛选条件：
   - **用户名/邮箱**: 模糊搜索用户名或邮箱
   - **部门**: 选择特定部门
   - **状态**: 选择在职或离职状态
3. 点击 **"搜索"** 执行筛选，或点击 **"重置"** 清空条件

### 分页导航
- 使用表格底部的分页组件切换页面
- 可以调整每页显示的记录数量
- 支持快速跳转到指定页面

## 🔧 核心配置解析

### JSON 配置文件：`user-management.config.json`

这是整个应用的**唯一配置来源**，所有的页面功能都通过这个文件定义：

```json
{
  "metadata": {
    "pageId": "user_management_page",
    "name": "用户管理",
    "version": "1.0.0"
  },
  
  "components": {
    "comp_user_table": {
      "componentType": "Table",
      "properties": {
        "columns": [
          {
            "title": "姓名",
            "dataIndex": "name",
            "editable": true,
            "editType": "input",
            "rules": [{"required": true, "message": "姓名不能为空"}]
          }
        ],
        "toolbarActions": [
          {
            "type": "create",
            "text": "新增用户",
            "actionId": "act_create_user"
          }
        ],
        "search": {
          "enabled": true,
          "fields": [
            {
              "name": "name",
              "label": "用户名/邮箱",
              "type": "input",
              "placeholder": "请输入用户名或邮箱"
            }
          ]
        }
      }
    }
  },
  
  "dataSource": {
    "ds_user_list": {"type": "static", "config": {"value": []}}
  },
  
  "actions": {
    "act_create_user": {"type": "CUSTOM", "config": {"handler": "act_create_user"}}
  },
  
  "initialState": {
    "userList": [],
    "loading": false
  }
}
```

### 配置说明
- **表格列**: `components.comp_user_table.properties.columns` - 定义所有表格列
- **搜索字段**: `components.comp_user_table.properties.search.fields` - 定义搜索表单
- **操作按钮**: `components.comp_user_table.properties.toolbarActions` - 定义工具栏按钮
- **行操作**: `components.comp_user_table.properties.rowActions` - 定义行级操作

### 数据源类型
现在使用的是内置的数据源类型，无需自定义：

```json
{
  "dataSource": {
    "ds_user_list": {
      "type": "MOCK",              // 模拟数据，支持延迟和错误率
      "config": {
        "data": [...],             // 模拟数据
        "delay": 500,              // 模拟网络延迟500ms
        "simulateError": false     // 是否模拟错误
      }
    }
  }
}
```

也支持真正的API调用（参见 `api-config-example.json`）：
```json
{
  "dataSource": {
    "ds_user_list": {
      "type": "API_REQUEST",       // 真实API调用
      "config": {
        "url": "/api/users",
        "method": "GET",
        "headers": {...},
        "timeout": 10000
      },
      "cache": {...},              // 缓存配置
      "retry": {...}               // 重试配置
    }
  }
}
```

### Action类型
支持多种内置action类型：

```json
{
  "actions": {
    "act_fetch_users": {
      "type": "FETCH_DATA",        // 内置的数据获取action
      "config": {
        "dataSourceId": "ds_user_list",
        "resultPath": "userList",  // 结果存储路径
        "showLoading": true,       // 显示加载状态
        "loadingPath": "loading"   // 加载状态路径
      }
    },
    "act_show_message": {
      "type": "SHOW_MESSAGE",      // 内置的消息显示action
      "config": {
        "type": "success",
        "message": "操作成功！",
        "duration": 3000
      }
    },
    "act_call_api": {
      "type": "CALL_API",          // 内置的API调用action
      "config": {
        "endpoint": "/api/users",
        "method": "POST",
        "body": "{{payload}}"
      }
    }
  }
}
```

### 完全内置版本
参见 `pure-builtin-config.json` - 展示如何完全使用内置功能，无需任何自定义代码。

### 表格列配置

```typescript
{
  title: '姓名',
  dataIndex: 'name',
  editable: true,                      // 可编辑
  editType: 'input',                   // 编辑类型
  rules: [                             // 验证规则
    { required: true, message: '姓名不能为空' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符之间' }
  ]
}
```

### 行为处理器

```typescript
// 自定义行为处理器
'act_create_user': {
  type: 'CUSTOM',
  config: {
    handler: async (context, record) => {
      const { stateManager } = context;
      // 执行创建用户逻辑
      await mockDataStore.createUser(record);
      // 更新状态
      stateManager.set('userList', newData);
    }
  }
}
```

## 🎨 自定义扩展

### 添加新的表格列

在 `user-management.config.json` 中的 `columns` 数组添加新列：

```json
{
  "title": "年龄",
  "dataIndex": "age",
  "key": "age",
  "width": 80,
  "editable": true,
  "editType": "number",
  "rules": [
    {"required": true, "message": "年龄不能为空"},
    {"min": 18, "max": 65, "message": "年龄在18-65之间"}
  ]
}
```

### 添加新的搜索字段

在 `search.fields` 数组中添加：

```json
{
  "name": "age",
  "label": "年龄",
  "type": "input",
  "placeholder": "请输入年龄"
}
```

### 添加新的操作按钮

在 `rowActions` 或 `toolbarActions` 中添加：

```json
{
  "type": "custom",
  "text": "导出",
  "actionId": "act_export_user"
}
```

### 修改部门选项

直接修改配置文件中的部门数据：

```json
{
  "dataSource": {
    "ds_departments": {
      "type": "static",
      "config": {
        "value": [
          {"label": "技术部", "value": "tech"},
          {"label": "新部门", "value": "new_dept"}
        ]
      }
    }
  }
}
```

## 🔍 调试指南

### 启用调试模式

在 `App.tsx` 中设置：

```typescript
engineConfig={{
  debug: true,  // 启用调试模式
  // ...
}}
```

### 查看调试信息

1. 打开浏览器开发者工具
2. 查看 Console 面板的日志输出
3. 可以看到页面初始化、数据加载、行为执行等详细信息

### 常见问题

1. **组件未注册**: 检查 `component-registry.ts` 中是否正确注册组件
2. **数据未加载**: 检查 `dataSource` 配置和 `loadStrategy`
3. **行为未执行**: 检查 `actions` 配置和 action handlers 注册

## 📚 相关文档

- [Snap Studio 核心架构](../../packages/core/README.md)
- [React 渲染器使用指南](../../packages/react/README.md)  
- [UI 组件库文档](../../packages/ui-components/README.md)
- [Schema 配置规范](../../packages/schema/README.md)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个示例！

---

**Snap Studio** - 让低代码开发更简单、更强大！ 🚀