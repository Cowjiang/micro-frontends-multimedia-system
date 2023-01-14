import { Outlet, useAppData, useLocation, useModel } from '@@/exports';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useSetDocTitle } from '@/utils/hooks';

export default () => {
  const {loading} = useModel('global');
  const {pathname} = useLocation();
  const {routes} = useAppData();
  const title = (Object.values(routes).find(({path}) => path?.includes(pathname)) as any)?.title ?? '';
  useSetDocTitle(title);

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
