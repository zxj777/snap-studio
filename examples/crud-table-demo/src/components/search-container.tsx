import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export interface SearchContainerProps {
  /** 输入框的占位符文本 */
  placeholder?: string;
  /** 搜索按钮的文本 */
  searchButtonText?: string;
  /** 搜索输入框的值（从状态绑定） */
  value?: string;
  /** 按钮的加载状态（从状态绑定） */
  loading?: boolean;
  /** 样式 */
  style?: React.CSSProperties;
  /** 搜索事件处理器（绑定到动作） */
  onSearch?: (event: any) => void;
  /** 输入变化事件处理器（绑定到动作） */
  onChange?: (event: any) => void;
  [key: string]: any;
}

/**
 * 搜索容器组件
 * 与 Snap Studio 状态管理系统完全集成
 * 支持数据绑定和事件绑定
 */
export const SearchContainer: React.FC<SearchContainerProps> = ({
  placeholder = "请输入搜索关键词",
  searchButtonText = "搜索",
  value = "",
  loading = false,
  style,
  onSearch,
  onChange,
  ...props
}) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 触发状态更新动作，传递输入值作为payload
    if (onChange) {
      onChange({
        target: e.target,
        payload: e.target.value,
        preventDefault: () => {},
        stopPropagation: () => {}
      });
    }
  };

  const handleSearch = () => {
    // 触发搜索动作
    if (onSearch) {
      onSearch({
        target: { value },
        payload: value,
        preventDefault: () => {},
        stopPropagation: () => {}
      });
    }
  };

  const handlePressEnter = () => {
    handleSearch();
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        ...style
      }} 
      {...props}
    >
      <Input
        value={value}
        onChange={handleInputChange}
        onPressEnter={handlePressEnter}
        placeholder={placeholder}
        allowClear
        style={{ flex: 1, maxWidth: '300px' }}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        loading={loading}
      >
        {searchButtonText}
      </Button>
    </div>
  );
};