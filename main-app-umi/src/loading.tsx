import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/loading.less';
import { useLocation } from '@@/exports';

function PageLoading() {
  const {pathname} = useLocation();

  useEffect(() => {
    NProgress.start();
    return () => {
      if (!['login', 'register'].includes(pathname)) {
        NProgress.done();
      }
    };
  }, []);
  return <></>;
}

export default PageLoading;
