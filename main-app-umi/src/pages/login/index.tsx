import React, { useEffect, useMemo } from 'react';
import { history } from '@@/exports';
import WujieReact from 'wujie-react';
import { useLocation, useNavigate } from '@@/exports';
import NProgress from 'nprogress';

export default function Page() {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const {bus} = WujieReact;
  bus.$on('login', (res: any) => {
    console.log(res);
    // navigate('../register', {replace: true});
  });

  bus.$on('loginFormTypeChange', (loginFormType: number) => {
    if (loginFormType === 1) {
      navigate('../register', {replace: false});
    } else {
      navigate('../login', {replace: false});
    }
  })

  const pathName = useMemo(() => pathname, [pathname]);

  return (
    <div>
      <WujieReact
        width="100%"
        height="100%"
        name="vite"
        url={`http://localhost:3000${pathName}`}
        alive={true}
        sync={false}
        afterMount={() => {
          NProgress.done();
        }}
      />
    </div>
  );
}
