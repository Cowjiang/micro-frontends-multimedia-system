import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/loading.less';
import { useLocation } from '@@/exports';

export default function PageLoading() {
  const {pathname} = useLocation();

  useEffect(() => {
    NProgress.start();
    return () => {
      if (!['login', 'register'].filter(v => pathname.includes(v)).length) {
        NProgress.done();
      }
    };
  }, []);
  return <></>;
};
