import React from 'react';
import { CardProps as AntdCardProps } from 'antd/es/card';
import { SkeletonProps } from 'antd';

export interface CardProps extends AntdCardProps {
  wrapperStyle?: React.CSSProperties;
  children: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  loadingOptions?: SkeletonProps;
  onActionBtnClick?: (action: 'more' | 'refresh') => void;
}
