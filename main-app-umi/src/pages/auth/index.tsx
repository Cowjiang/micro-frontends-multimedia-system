import React, { useEffect, useMemo, useState } from 'react';
import WujieReact from 'wujie-react';
import { useLocation, useModel, useNavigate } from '@@/exports';
import NProgress from 'nprogress';
import { FormType, AuthPageState } from '@/pages/auth/typings';
import { Modal } from 'antd';
import { vuetifyConfig } from '@/config/vuetify';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {pathname, state} = useLocation();
  const {bus, destroyApp} = WujieReact;

  // 重定向至上一页或首页
  const redirectToPrePage = () => {
    const redirectPath = (state as AuthPageState)?.from ?? '/index';
    navigate(redirectPath, {replace: true});
  };

  // 子应用登陆成功
  const handleLoginSuccess = (res: any) => {
    console.log(res);
    redirectToPrePage();
  };

  // 子应用切换登录/注册
  const handleLoginFormTypeChange = (loginFormType: number) => {
    navigate(
      loginFormType === FormType.REGISTER ? '/auth/register' : '/auth/login',
      {
        state: {
          from: (state as AuthPageState)?.from ?? '/index'
        },
        replace: true
      }
    );
  };

  useEffect(() => {
    if (sessionStorage.getItem('TOKEN')) {
      // 已登录验证
      redirectToPrePage();
    }
    bus.$on('loginSuccess', handleLoginSuccess);
    bus.$on('loginFormTypeChange', handleLoginFormTypeChange);
    return () => {
      bus.$off('loginFormTypeChange', handleLoginFormTypeChange);
      bus.$off('loginSuccess', handleLoginSuccess);
      // destroyApp('vite');
    };
  }, []);

  useEffect(() => {
    bus.$emit('loginFormTypeChange', pathname === '/auth/register' ? FormType.REGISTER : FormType.LOGIN);
    if (!(state as AuthPageState)?.from && pathname === '/auth/register') {
      handleLoginFormTypeChange(FormType.LOGIN);
      location.reload();
    }
  }, [pathname]);

  const {setLoading} = useModel('global');
  const {messageApi} = useModel('messageApi');
  const [modal, contextHolder] = Modal.useModal();

  const wujieInstance = useMemo(() => {
    return (
      <WujieReact
        name="vite"
        width="100vw"
        height="100vh"
        url={`http://localhost:3000${pathname.replaceAll('/auth', '')}`}
        // alive={true}
        props={{
          ...vuetifyConfig
        }}
        beforeLoad={() => {
          NProgress.start();
          setLoading(true);
        }}
        beforeMount={() => {
          NProgress.done();
          setLoading(false);
        }}
        loadError={() => {
          // messageApi.error('加载失败')
          NProgress.done();
          setLoading(false);
          modal.error({
            centered: true,
            title: '服务加载失败',
            content: '请检查网络连接或联系管理员',
            keyboard: false,
            okText: '返回',
            onOk: redirectToPrePage
          });
        }}
      />
    );
  }, []);

  return (
    <div>
      {wujieInstance}
      {contextHolder}
    </div>
  );
};

export default AuthPage;
