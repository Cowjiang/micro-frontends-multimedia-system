import React, { useEffect } from 'react';
import WujieReact from 'wujie-react';
import { useLocation, useNavigate } from '@@/exports';
import NProgress from 'nprogress';

export default function Page() {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const {bus} = WujieReact;

  const handleLoginSuccess = (res: any) => {
    console.log(res);
  };

  useEffect(() => {
    const handleLoginFormTypeChange = (loginFormType: number) => {
      navigate(loginFormType === 1 ? '../register' : '../login', {replace: true});
    };

    bus.$on('loginSuccess', handleLoginSuccess);
    bus.$on('loginFormTypeChange', handleLoginFormTypeChange);
    return () => {
      bus.$off('loginFormTypeChange', handleLoginFormTypeChange);
      bus.$off('loginSuccess', handleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    bus.$emit('loginFormTypeChange', pathname === '/register' ? 1 : 0);
  }, [pathname]);

  return (
    <div>
      <WujieReact
        width="100%"
        height="100%"
        name="vite"
        url={`http://localhost:3000${pathname}`}
        alive={true}
        sync={false}
        afterMount={() => {
          NProgress.done();
        }}
      />
    </div>
  );
}
