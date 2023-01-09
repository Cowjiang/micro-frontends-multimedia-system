import { Outlet, useModel } from '@@/exports';
import { Spin } from 'antd';
import React from 'react';

export default () => {
  const {loading} = useModel('global');

  return (
    <Spin
      spinning={loading}
      size="large"
      className="!h-screen !max-h-screen"
    >
      <Outlet />
    </Spin>
  );
};
