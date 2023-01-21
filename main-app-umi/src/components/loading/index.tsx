import React from 'react';
import { Spin } from 'antd';
import { LoadingProps } from '@/components/loading/typings';
import './index.less';

const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <Spin{...props}>
      {props.children}
    </Spin>
  );
};

export default Loading;
