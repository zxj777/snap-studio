// src/utils/schema-helpers.ts
function createApiDataSource(url, options = {}) {
  return {
    type: "API_REQUEST",
    config: {
      url,
      method: "GET",
      ...options
    }
  };
}
function createStaticDataSource(value) {
  return {
    type: "STATIC_DATA",
    config: {
      value
    }
  };
}
function createComponent(componentType, props = {}) {
  return {
    componentType,
    props
  };
}
function createUpdateStateAction(path, value) {
  return {
    type: "UPDATE_STATE",
    config: {
      path,
      value
    }
  };
}
function createFetchDataAction(dataSourceId, resultPath) {
  return {
    type: "FETCH_DATA",
    config: {
      dataSourceId,
      resultPath
    }
  };
}
function createCompositeAction(steps, mode = "sequence") {
  return {
    type: "COMPOSITE",
    config: {
      steps,
      mode
    }
  };
}
function createNavigateAction(to, type = "push") {
  return {
    type: "NAVIGATE",
    config: {
      type,
      to
    }
  };
}
function createMessageAction(message, type = "info") {
  return {
    type: "SHOW_MESSAGE",
    config: {
      type,
      message
    }
  };
}
function createFormComponent(submitAction) {
  const form = {
    componentType: "Form",
    props: {
      layout: "vertical"
    },
    events: submitAction ? {
      onSubmit: submitAction
    } : void 0
  };
  return form;
}
function createTableComponent(columns, dataSource) {
  return {
    componentType: "Table",
    props: {
      columns
    },
    dataBinding: {
      dataSource
    }
  };
}
function createButtonComponent(text, onClick, type = "default") {
  return {
    componentType: "Button",
    props: {
      type,
      text
    },
    events: onClick ? {
      onClick
    } : void 0
  };
}
function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== void 0) {
      if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key]) && typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
function validateComponent(component) {
  const errors = [];
  if (!component.componentType) {
    errors.push("componentType is required");
  }
  if (component.dataBinding) {
    if (typeof component.dataBinding !== "object") {
      errors.push("dataBinding must be an object");
    }
  }
  if (component.props) {
    if (typeof component.props !== "object") {
      errors.push("props must be an object");
    }
  }
  return errors;
}
function validateDataSource(dataSource) {
  const errors = [];
  if (!dataSource.type) {
    errors.push("type is required");
  }
  if (dataSource.type === "API_REQUEST") {
    const config = dataSource.config;
    if (!config?.url) {
      errors.push("url is required for API_REQUEST type");
    }
  }
  if (dataSource.type === "STATIC_DATA") {
    const config = dataSource.config;
    if (config?.value === void 0) {
      errors.push("value is required for STATIC_DATA type");
    }
  }
  return errors;
}
function validateAction(action) {
  const errors = [];
  if (!action.type) {
    errors.push("type is required");
  }
  switch (action.type) {
    case "UPDATE_STATE":
      const updateConfig = action.config;
      if (!updateConfig?.path && !updateConfig?.batch) {
        errors.push("path or batch is required for UPDATE_STATE");
      }
      break;
    case "FETCH_DATA":
      const fetchConfig = action.config;
      if (!fetchConfig?.dataSourceId) {
        errors.push("dataSourceId is required for FETCH_DATA");
      }
      break;
    case "NAVIGATE":
      const navConfig = action.config;
      if (!navConfig?.to && navConfig?.type !== "back" && navConfig?.type !== "forward") {
        errors.push("to is required for NAVIGATE (except back/forward)");
      }
      break;
    case "COMPOSITE":
      const compConfig = action.config;
      if (!compConfig?.steps || !Array.isArray(compConfig.steps)) {
        errors.push("steps array is required for COMPOSITE");
      }
      break;
  }
  return errors;
}
function extractComponentIds(schema) {
  const ids = /* @__PURE__ */ new Set();
  if (schema.layout.root) {
    ids.add(schema.layout.root);
  }
  Object.keys(schema.components).forEach((id) => ids.add(id));
  function extractFromLayoutNode(node) {
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((childId) => ids.add(childId));
    }
    if (node.slots) {
      Object.values(node.slots).forEach((slotContent) => {
        if (typeof slotContent === "string") {
          ids.add(slotContent);
        } else if (Array.isArray(slotContent)) {
          slotContent.forEach((id) => ids.add(id));
        }
      });
    }
  }
  Object.values(schema.layout.structure || {}).forEach(extractFromLayoutNode);
  if (schema.layout.templates) {
    Object.values(schema.layout.templates).forEach(extractFromLayoutNode);
  }
  return Array.from(ids);
}
function detectCircularReferences(schema) {
  const visited = /* @__PURE__ */ new Set();
  const recursionStack = /* @__PURE__ */ new Set();
  const cycles = [];
  function dfs(componentId, path) {
    if (recursionStack.has(componentId)) {
      cycles.push(`Circular reference detected: ${path.join(" -> ")} -> ${componentId}`);
      return;
    }
    if (visited.has(componentId)) {
      return;
    }
    visited.add(componentId);
    recursionStack.add(componentId);
    const layoutNode = schema.layout.structure[componentId];
    if (layoutNode) {
      if (layoutNode.children) {
        layoutNode.children.forEach((childId) => {
          dfs(childId, [...path, componentId]);
        });
      }
      if (layoutNode.slots) {
        Object.values(layoutNode.slots).forEach((slotContent) => {
          if (typeof slotContent === "string") {
            dfs(slotContent, [...path, componentId]);
          } else if (Array.isArray(slotContent)) {
            slotContent.forEach((childId) => {
              dfs(childId, [...path, componentId]);
            });
          }
        });
      }
    }
    recursionStack.delete(componentId);
  }
  if (schema.layout.root) {
    dfs(schema.layout.root, []);
  }
  return cycles;
}
function getSchemaStats(schema) {
  return {
    componentCount: Object.keys(schema.components).length,
    dataSourceCount: Object.keys(schema.dataSource).length,
    actionCount: Object.keys(schema.actions).length,
    computedCount: Object.keys(schema.computed || {}).length,
    templateCount: Object.keys(schema.templates || {}).length,
    initialStateKeys: Object.keys(schema.initialState).length,
    // 组件类型统计
    componentTypes: Object.values(schema.components).reduce((acc, component) => {
      acc[component.componentType] = (acc[component.componentType] || 0) + 1;
      return acc;
    }, {}),
    // 数据源类型统计
    dataSourceTypes: Object.values(schema.dataSource).reduce((acc, dataSource) => {
      acc[dataSource.type] = (acc[dataSource.type] || 0) + 1;
      return acc;
    }, {}),
    // 动作类型统计
    actionTypes: Object.values(schema.actions).reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {})
  };
}

// src/index.ts
var VERSION = "1.0.0";
var SCHEMA_VERSION = "1.0";
var MIN_SUPPORTED_VERSION = "1.0";
function isSchemaVersionCompatible(version) {
  const [major, minor] = version.split(".").map(Number);
  const [minMajor, minMinor] = MIN_SUPPORTED_VERSION.split(".").map(Number);
  if (major > minMajor) return true;
  if (major === minMajor && minor >= minMinor) return true;
  return false;
}
function createEmptyPageSchema() {
  return {
    metadata: {
      pageId: "",
      name: "",
      version: SCHEMA_VERSION
    },
    loadStrategy: {
      initial: []
    },
    layout: {
      root: "",
      structure: {}
    },
    components: {},
    dataSource: {},
    actions: {},
    initialState: {}
  };
}
function validatePageSchema(schema) {
  if (typeof schema !== "object" || schema === null) {
    return false;
  }
  const s = schema;
  return typeof s.metadata === "object" && typeof s.metadata.pageId === "string" && typeof s.metadata.name === "string" && typeof s.metadata.version === "string" && typeof s.loadStrategy === "object" && Array.isArray(s.loadStrategy.initial) && typeof s.layout === "object" && typeof s.layout.root === "string" && typeof s.components === "object" && typeof s.dataSource === "object" && typeof s.actions === "object" && typeof s.initialState === "object";
}
var COMMON_COMPONENT_TYPES = {
  // 布局组件
  CONTAINER: "Container",
  ROW: "Row",
  COL: "Col",
  FLEX: "Flex",
  GRID: "Grid",
  // 基础组件
  BUTTON: "Button",
  INPUT: "Input",
  TEXT: "Text",
  IMAGE: "Image",
  LINK: "Link",
  // 数据展示
  TABLE: "Table",
  LIST: "List",
  CARD: "Card",
  DESCRIPTION: "Description",
  // 表单组件
  FORM: "Form",
  FORM_ITEM: "FormItem",
  SELECT: "Select",
  CHECKBOX: "Checkbox",
  RADIO: "Radio",
  DATE_PICKER: "DatePicker",
  // 反馈组件
  MODAL: "Modal",
  DRAWER: "Drawer",
  MESSAGE: "Message",
  NOTIFICATION: "Notification",
  // 导航组件
  MENU: "Menu",
  BREADCRUMB: "Breadcrumb",
  PAGINATION: "Pagination",
  TABS: "Tabs"
};
var COMMON_ACTION_TYPES = {
  UPDATE_STATE: "UPDATE_STATE",
  FETCH_DATA: "FETCH_DATA",
  NAVIGATE: "NAVIGATE",
  SHOW_MESSAGE: "SHOW_MESSAGE",
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  VALIDATE_FORM: "VALIDATE_FORM",
  SUBMIT_FORM: "SUBMIT_FORM",
  CALL_API: "CALL_API",
  COMPOSITE: "COMPOSITE"
};
var COMMON_DATA_SOURCE_TYPES = {
  API_REQUEST: "API_REQUEST",
  STATIC_DATA: "STATIC_DATA",
  LOCAL_STORAGE: "LOCAL_STORAGE",
  COMPUTED: "COMPUTED",
  MOCK: "MOCK"
};
export {
  COMMON_ACTION_TYPES,
  COMMON_COMPONENT_TYPES,
  COMMON_DATA_SOURCE_TYPES,
  MIN_SUPPORTED_VERSION,
  SCHEMA_VERSION,
  VERSION,
  createApiDataSource,
  createButtonComponent,
  createComponent,
  createCompositeAction,
  createEmptyPageSchema,
  createFetchDataAction,
  createFormComponent,
  createMessageAction,
  createNavigateAction,
  createStaticDataSource,
  createTableComponent,
  createUpdateStateAction,
  deepMerge,
  detectCircularReferences,
  extractComponentIds,
  generateId,
  getSchemaStats,
  isSchemaVersionCompatible,
  validateAction,
  validateComponent,
  validateDataSource,
  validatePageSchema
};
