# 用户管理系统演示 - JSON 配置驱动 & 数据流转指南

这是一个展示如何将 JSON 配置映射到 Antd 组件，以及数据流转机制的完整演示。

## 🎯 演示目标

演示两种不同的实现方式：
1. **🎯 直接使用 Antd 组件** - 基于 JSON 配置的 React 开发方式
2. **🚀 低代码引擎驱动** - 通过 JSON Schema 配置驱动页面

## 🆕 全新特性：完全 JSON 配置驱动

现在 **UserManagementPage** 组件的所有配置都来自 JSON 文件，包括：
- 📄 **页面信息** (`config.pageInfo`)
- 🔍 **筛选器配置** (`config.filters`) 
- 🛠️ **工具栏配置** (`config.toolbar`)
- 📊 **表格列配置** (`config.table.columns`)
- 🗂️ **数据映射** (`config.dataMaps`)

## 📊 核心概念

### 1. JSON 配置文件结构

```json
// src/config/page-config.json
{
  "userManagement": {
    "pageInfo": {
      "title": "用户管理系统",
      "description": "页面描述..."
    },
    "filters": [
      {
        "name": "name",
        "label": "姓名/邮箱",
        "type": "input",
        "placeholder": "请输入姓名或邮箱"
      }
    ],
    "table": {
      "columns": [
        {
          "title": "部门",
          "dataIndex": "department", 
          "render": "departmentMap"
        }
      ]
    },
    "dataMaps": {
      "departmentMap": {
        "tech": "技术部",
        "product": "产品部"
      }
    }
  }
}
```

### 2. JSON 配置到组件的映射

#### 🔍 筛选器配置映射
```json
// JSON 配置
"filters": [
  {
    "name": "department",
    "label": "部门", 
    "type": "select",
    "options": [
      { "label": "技术部", "value": "tech" }
    ]
  }
]
```
**→ 映射到组件：**
```tsx
<Form.Item name="department" label="部门">
  <Select>
    <Option value="tech">技术部</Option>
  </Select>
</Form.Item>
```

#### 📊 表格列配置映射
```json
// JSON 配置
"columns": [
  {
    "title": "部门",
    "dataIndex": "department",
    "render": "departmentMap"
  }
]
```
**→ 映射到组件：**
```tsx
{
  title: '部门',
  dataIndex: 'department',
  render: (value) => dataMaps.departmentMap[value]
}
```

#### 🗂️ 数据映射转换
```json
// JSON 配置
"dataMaps": {
  "departmentMap": {
    "tech": "技术部",
    "product": "产品部"
  }
}
```
**→ 映射到函数：**
```tsx
const renderFunctions = {
  departmentMap: (value) => dataMaps.departmentMap[value] || value
};
```

## 🔧 配置文件详解

### 完整配置结构
- **📄 `pageInfo`** - 页面基本信息（标题、描述）
- **🔍 `filters`** - 筛选器配置数组
- **🛠️ `toolbar`** - 工具栏按钮配置
- **📊 `table.columns`** - 表格列定义
- **🎨 `table.pagination`** - 分页配置  
- **📐 `table.scroll`** - 滚动配置
- **🗂️ `dataMaps`** - 数据值映射字典

### 渲染函数系统
```tsx
// 支持的内置渲染函数
const renderFunctions = {
  departmentMap: (value) => dataMaps.departmentMap[value],
  positionMap: (value) => dataMaps.positionMap[value], 
  statusRender: (value) => <StatusTag status={value} />,
  dateFormat: (value) => new Date(value).toLocaleString()
};
```

### 2. 数据流转机制

#### 状态定义
```json
{
  "state": {
    "users": { "type": "array", "default": [] },
    "filteredUsers": { "type": "array", "default": [] },
    "filterValues": { "type": "object", "default": {} }
  }
}
```

#### 数据绑定
```json
{
  "dataBinding": {
    "dataSource": "state.filteredUsers",
    "loading": "state.loading"
  }
}
```

#### 事件处理
```json
{
  "events": {
    "onFilter": "act_filter_users",
    "onReset": "act_reset_filter"
  }
}
```

### 3. 完整的数据流转过程

```
1. 用户交互
   ↓
2. 触发事件 (onFilter)
   ↓  
3. 执行行为 (act_filter_users)
   ↓
4. 更新状态 (state.filteredUsers)
   ↓
5. 组件重新渲染 (Table 显示新数据)
```

## 🔧 组件设计要点

### 1. 增强组件设计
每个组件都需要支持：
- **数据绑定** - 通过 props 接收状态数据
- **事件处理** - 通过 callback 向上传递事件
- **配置驱动** - 通过 JSON 配置控制渲染

```tsx
interface EnhancedTableProps {
  dataSource: any[];           // 数据绑定
  columns: ColumnConfig[];     // 配置驱动  
  onEdit: (record) => void;    // 事件处理
  onDelete: (record) => void;  // 事件处理
}
```

### 2. 数据流设计
```tsx
// 父组件管理状态
const [users, setUsers] = useState([]);
const [filteredUsers, setFilteredUsers] = useState([]);

// 处理筛选事件
const handleFilter = (values) => {
  const filtered = users.filter(/* 筛选逻辑 */);
  setFilteredUsers(filtered);
};

// 传递给子组件
<FilterForm onFilter={handleFilter} />
<Table dataSource={filteredUsers} />
```

### 3. 事件向上传递
```tsx
// 子组件
const FilterForm = ({ onFilter }) => {
  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onFilter(values); // 向上传递
  };
};

// 父组件
const handleFilter = (values) => {
  // 处理筛选逻辑
  console.log('收到筛选条件:', values);
};
```

## 🚀 运行演示

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 打开浏览器访问 http://localhost:3000
```

## 📝 关键文件说明

### 🎯 JSON 配置驱动版本（推荐查看）
- **`src/config/page-config.json`** - 📋 完整的页面配置文件
- **`src/components/UserManagementPage.tsx`** - 📄 配置驱动的页面组件
- **`src/components/UserTable.tsx`** - 📊 支持配置的表格组件
- **`src/components/UserFilterForm.tsx`** - 🔍 筛选表单组件
- **`src/components/UserToolbar.tsx`** - 🛠️ 工具栏组件

### 🚀 低代码引擎版本
- `src/schemas/user-management-simple.schema.ts` - JSON Schema 配置
- `src/component-registry.ts` - 组件注册（映射 JSON 到组件）
- `src/components/enhanced-page-container.tsx` - 页面容器（引擎驱动）

## 🎨 数据流转可视化

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FilterForm    │    │   UserToolbar   │    │   UserTable     │
│                 │    │                 │    │                 │
│ onFilter() ─────┼────┼─────────────────┼───▶│ dataSource      │
│ onReset() ──────┼────┼─────────────────┼───▶│ loading         │
└─────────────────┘    │ onAction() ─────┼───▶│ onEdit()        │
                       └─────────────────┘    │ onDelete()      │
                                              └─────────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │ UserManagement  │
                    │     Page        │
                    │                 │
                    │ • handleFilter  │
                    │ • handleReset   │  
                    │ • handleEdit    │
                    │ • handleDelete  │
                    │                 │
                    │ State:          │
                    │ • users         │
                    │ • filteredUsers │
                    │ • filterValues  │
                    └─────────────────┘
```

## 💡 最佳实践

1. **组件职责单一** - 每个组件只负责自己的渲染和交互
2. **数据向下流动** - 通过 props 传递数据
3. **事件向上传递** - 通过 callback 传递事件
4. **状态集中管理** - 在父组件统一管理状态
5. **配置驱动渲染** - 通过 JSON 配置控制组件行为

## 🔍 调试技巧

打开浏览器控制台，可以看到完整的数据流转日志：
- 🔍 筛选条件变化
- 📊 数据筛选结果  
- ✏️ 编辑操作
- 🗑️ 删除操作
- 🔧 工具栏操作

这些日志帮助理解数据在组件间的流转过程。