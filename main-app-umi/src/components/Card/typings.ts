import React from 'react';
import { CardProps as AntdCardProps } from 'antd/es/card';

export interface CardProps extends AntdCardProps {
  wrapperStyle?: React.CSSProperties;
  children: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
}
