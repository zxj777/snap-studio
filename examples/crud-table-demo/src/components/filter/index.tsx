import React, { useState } from "react";
import {
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Space,
  Row,
  Col,
  Form,
  Card,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface FilterItem {
  /** 筛选项的键名 */
  key: string;
  /** 筛选项的标签 */
  label: string;
  /** 筛选项的类型 */
  type: "input" | "select" | "date" | "dateRange" | "switch";
  /** 占位符文本 */
  placeholder?: string;
  /** 选择框的选项 */
  options?: Array<{ label: string; value: any }>;
  /** 默认值 */
  defaultValue?: any;
  /** 是否必填 */
  required?: boolean;
  /** 栅格布局的跨度 */
  span?: number;
}

export interface FilterContainerProps {
  /** 筛选项配置 */
  filters: FilterItem[];
  /** 筛选值（从状态绑定） */
  values?: Record<string, any>;
  /** 按钮的加载状态（从状态绑定） */
  loading?: boolean;
  /** 样式 */
  style?: React.CSSProperties;
  /** 确认筛选事件处理器（绑定到动作） */
  onFilter?: (values: Record<string, any>) => void;
  /** 重置筛选事件处理器（绑定到动作） */
  onReset?: () => void;
  /** 值变化事件处理器（绑定到动作） */
  onChange?: (key: string, value: any) => void;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** 每行显示的筛选项数量 */
  itemsPerRow?: number;
  [key: string]: any;
}

/**
 * 筛选容器组件
 * 与 Snap Studio 状态管理系统完全集成
 * 支持多种筛选项类型、展开收起、重置和确认功能
 */
const FilterContainer: React.FC<FilterContainerProps> = ({
  filters = [],
  values = {},
  loading = false,
  style,
  onFilter,
  onReset,
  onChange,
  defaultExpanded = false,
  itemsPerRow = 4,
  ...props
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [localValues, setLocalValues] = useState(values);
  const [form] = Form.useForm();

  // 同步外部 values 到本地状态
  React.useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // 计算是否需要展开/收起功能
  const needsExpand = filters.length > itemsPerRow;

  const handleValueChange = (key: string, value: any) => {
    // 只更新本地状态，不触发外部状态更新
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = () => {
    // 使用本地状态值
    const processedValues = { ...localValues };

    filters.forEach((filter) => {
      if (filter.type === "dateRange" && processedValues[filter.key]) {
        const [start, end] = processedValues[filter.key];
        processedValues[filter.key] = {
          start: start ? start.format("YYYY-MM-DD") : null,
          end: end ? end.format("YYYY-MM-DD") : null,
        };
      } else if (filter.type === "date" && processedValues[filter.key]) {
        processedValues[filter.key] =
          processedValues[filter.key].format("YYYY-MM-DD");
      }
    });

    // 筛选时触发 onChange 事件，更新外部状态
    if (onChange) {
      Object.entries(processedValues).forEach(([key, value]) => {
        onChange(key, value);
      });
    }

    if (onFilter) {
      onFilter(processedValues);
    }
  };

  const handleReset = () => {
    form.resetFields();
    // 重置本地状态
    setLocalValues({});
    
    // 触发重置事件
    if (onReset) {
      onReset();
    }
  };

  const renderFilterItem = (filter: FilterItem) => {
    const { key, type, placeholder, options = [], defaultValue } = filter;

    switch (type) {
      case "input":
        return (
          <Input
            placeholder={placeholder}
            value={localValues[key] || ""}
            onChange={(e) => handleValueChange(key, e.target.value)}
            allowClear
          />
        );

      case "select":
        return (
          <Select
            placeholder={placeholder}
            value={localValues[key]}
            onChange={(value) => handleValueChange(key, value)}
            allowClear
            style={{ width: "100%" }}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            placeholder={placeholder}
            value={localValues[key] ? dayjs(localValues[key]) : (null as any)}
            onChange={(date) => handleValueChange(key, date)}
            style={{ width: "100%" }}
          />
        );

      case "dateRange":
        return (
          <RangePicker
            placeholder={
              placeholder
                ? [placeholder, placeholder]
                : ["开始日期", "结束日期"]
            }
            value={
              localValues[key]?.start && localValues[key]?.end
                ? ([
                    dayjs(localValues[key].start),
                    dayjs(localValues[key].end),
                  ] as any)
                : null
            }
            onChange={(dates) => handleValueChange(key, dates)}
            style={{ width: "100%" }}
          />
        );

      case "switch":
        return (
          <Switch
            checked={localValues[key] || false}
            onChange={(checked) => handleValueChange(key, checked)}
          />
        );

      default:
        return null;
    }
  };

  const visibleFilters = expanded ? filters : filters.slice(0, itemsPerRow);

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        ...style,
      }}
      bodyStyle={{
        padding: "32px",
      }}
      {...props}
    >
      <Form form={form} layout="vertical">
        {/* 第一行：显示前4个筛选项 + 按钮 */}
        <Row gutter={[20, 20]}>
          {visibleFilters.slice(0, 4).map((filter) => (
            <Col key={filter.key} span={filter.span || 4}>
              {filter.type === "switch" ? (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      marginBottom: 12,
                      fontWeight: 500,
                      color: "#262626",
                    }}
                  >
                    {filter.label}
                  </div>
                  {renderFilterItem(filter)}
                </div>
              ) : (
                <Form.Item
                  label={filter.label}
                  name={filter.key}
                  initialValue={filter.defaultValue}
                  rules={
                    filter.required
                      ? [{ required: true, message: `请选择${filter.label}` }]
                      : []
                  }
                >
                  {renderFilterItem(filter)}
                </Form.Item>
              )}
            </Col>
          ))}
        </Row>

        {/* 第二行：展开后显示剩余的筛选项 */}
        {expanded && visibleFilters.length > 4 && (
          <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
            {visibleFilters.slice(4).map((filter) => (
              <Col key={filter.key} span={filter.span || 6}>
                {filter.type === "switch" ? (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        marginBottom: 12,
                        fontWeight: 500,
                        color: "#262626",
                      }}
                    >
                      {filter.label}
                    </div>
                    {renderFilterItem(filter)}
                  </div>
                ) : (
                  <Form.Item
                    label={filter.label}
                    name={filter.key}
                    initialValue={filter.defaultValue}
                    rules={
                      filter.required
                        ? [{ required: true, message: `请选择${filter.label}` }]
                        : []
                    }
                  >
                    {renderFilterItem(filter)}
                  </Form.Item>
                )}
              </Col>
            ))}
          </Row>
        )}

        <Row justify="space-between" align="middle" style={{ marginTop: 24 }}>
          <Col>
            <Space size="middle">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={loading}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleFilter}
                loading={loading}
              >
                筛选
              </Button>
            </Space>
          </Col>
          <Col>
            {needsExpand && (
              <Button
                type="link"
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded
                  ? "收起"
                  : `展开更多 (${filters.length - itemsPerRow})`}
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterContainer;
