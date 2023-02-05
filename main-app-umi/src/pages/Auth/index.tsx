import React, { useEffect, useMemo } from 'react';
import WujieReact from 'wujie-react';
import { useLocation, useModel, useNavigate } from '@@/exports';
import NProgress from 'nprogress';
import { FormType, AuthPageState } from '@/pages/Auth/typings';
import { Modal } from 'antd';
import { vuetifyConfig } from '@/config/vuetify';
import { authApi } from '@/services/api';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {pathname, state} = useLocation();
  const {bus, destroyApp} = WujieReact;

  // 重定向至上一页或首页
  const redirectToPrePage = () => {
    const redirectPath = (state as AuthPageState)?.from ?? '/index';
    navigate(redirectPath, {replace: true});
  };

  // 子应用登陆提交
  const handleLoginSubmit = async ({account, password}: { [key: string]: string | undefined }) => {
    const {success, message, code} = await authApi.loginByAccount({
      username: account ?? '',
      password: password ?? ''
    });
    const busRes = success ? {message: '登陆成功', type: 'success'} : {message: '账号或密码错误', type: 'warning'};
    bus.$emit('loginResponse', busRes);
    success && redirectToPrePage();
  };

  // 子应用注册提交
  const handleRegisterSubmit = async ({email, password, captcha}: { [key: string]: string | undefined }) => {
    const {success, message, code} = await authApi.registerByEmail({
      key: email ?? '',
      password: password ?? ''
    });
    const busRes = success ? {message: '注册成功', type: 'success'} : {message: message, type: 'error'};
    bus.$emit('registerResponse', busRes);
    success && handleLoginFormTypeChange(FormType.LOGIN);
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
    bus.$on('loginSubmit', handleLoginSubmit);
    bus.$on('registerSubmit', handleRegisterSubmit);
    bus.$on('loginFormTypeChange', handleLoginFormTypeChange);
    return () => {
      bus.$off('loginSubmit', handleLoginSubmit);
      bus.$off('registerSubmit', handleRegisterSubmit);
      bus.$off('loginFormTypeChange', handleLoginFormTypeChange);
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
