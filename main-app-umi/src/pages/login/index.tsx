import React, { useEffect, useMemo } from 'react';
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

  const pathName = useMemo(() => pathname, [pathname]);

  return (
    <div>
      <WujieReact
        width="100%"
        height="100%"
        name="vite"
        url="http://localhost:3000/login"
        alive={false}
        sync={false}
        // props={{
        //   formType: pathName === '/register' ? 1 : 0
        // }}
        afterMount={() => {
          NProgress.done();
        }}
      />
    </div>
  );
}
