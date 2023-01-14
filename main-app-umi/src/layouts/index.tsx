import { Outlet, useAppData, useLocation, useModel } from '@@/exports';
import React from 'react';
import { useSetDocTitle } from '@/utils/hooks';
import Loading from '@/components/loading';

export default () => {
  const {loading} = useModel('global');
  const {pathname} = useLocation();
  const {routes} = useAppData();
  const title = (Object.values(routes).find(({path}) => path?.includes(pathname)) as any)?.title ?? '';
  useSetDocTitle(title);

  return (
    <Loading
      spinning={loading}
      size="large"
      className="!h-screen !max-h-screen bg-white"
    >
      <Outlet />
    </Loading>
  );
};
