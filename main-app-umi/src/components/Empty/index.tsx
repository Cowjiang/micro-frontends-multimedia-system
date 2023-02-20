import React from 'react';
import { Empty as AntdEmpty, EmptyProps } from 'antd';
import emptyImage from '@/assets/images/placeholder/empty.png';

const Empty = (props: EmptyProps) => {
  return (
    <AntdEmpty
      {...props}
      image={emptyImage}
    />
  );
};

export default Empty;
