import React from "react";
import { Table, Card, Tag, Space, Button, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export interface PatientListProps {
  /** 列配置 */
  columns?: any[];
  /** 患者数据列表 */
  dataSource?: any[];
  /** 加载状态 */
  loading?: boolean;
  /** 样式 */
  style?: React.CSSProperties;
  /** 查看患者详情事件 */
  onView?: (record: any) => void;
  /** 编辑患者信息事件 */
  onEdit?: (record: any) => void;
  /** 删除患者事件 */
  onDelete?: (record: any) => void;
  /** 表格标题 */
  title?: string;
  /** 是否显示操作列 */
  showActions?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 表格大小 */
  size?: "small" | "middle" | "large";
  [key: string]: any;
}

/**
 * 患者列表组件
 * 与 Snap Studio 状态管理系统完全集成
 * 支持患者信息的展示、查看、编辑、删除等操作
 */
const PatientList: React.FC<PatientListProps> = ({
  columns = [],
  dataSource = [],
  loading = false,
  style,
  onView,
  onEdit,
  onDelete,
  title = "患者信息列表",
  showActions = true,
  bordered = true,
  size = "middle" as const,
  ...props
}) => {
  // 状态标签渲染
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="green">正常</Tag>;
      case 1:
        return <Tag color="red">停用</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 性别标签渲染
  const renderSex = (sex: string) => {
    return sex === "男" ? (
      <Tag color="blue">男</Tag>
    ) : (
      <Tag color="pink">女</Tag>
    );
  };

  // 操作列渲染
  const renderActions = (record: any) => {
    return (
      <Space size="small">
        {onView && (
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        )}
      </Space>
    );
  };

  // 渲染函数映射
  const renderFunctions = {
    text: (value: any) => (
      <span style={{ fontWeight: 500, color: "#1890ff" }}>{value}</span>
    ),
    tag: (value: string) => renderSex(value),
    status: (value: number) => renderStatus(value),
    date: (value: string) => (
      <span style={{ color: "#666" }}>{value}</span>
    ),
    phone: (value: string) => (
      <span style={{ color: "#666" }}>{value || "-"}</span>
    ),
    default: (value: any) => value,
  };

  // 构建表格列配置
  const tableColumns = [
    // 处理传入的列配置
    ...columns.map((column) => {
      const { renderType, ...columnProps } = column;
      
      return {
        ...columnProps,
        render: (value: any, record: any) => {
          // 如果有自定义render函数，优先使用
          if (column.render) {
            return column.render(value, record);
          }
          
          // 根据renderType选择渲染函数
          const renderFn = renderFunctions[renderType as keyof typeof renderFunctions] || renderFunctions.default;
          return renderFn(value);
        },
      };
    }),
    // 添加操作列
    ...(showActions
      ? [
          {
            title: "操作",
            key: "actions",
            width: 120,
            fixed: "right" as const,
            align: "center" as const,
            render: (_: any, record: any) => renderActions(record),
          },
        ]
      : []),
  ];

  // 如果没有数据，不渲染表格
  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  return (
    <Card
      size="small"
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        ...style,
      }}
      bodyStyle={{
        padding: "16px",
      }}
      {...props}
    >
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          pageSize: 10,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: 800 }}
        size={size}
        bordered={bordered}
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 500 }}>{title}</span>
            <span style={{ color: "#666", fontSize: "14px" }}>
              共 {dataSource.length} 条记录
            </span>
          </div>
        )}
      />
    </Card>
  );
};

export default PatientList;
