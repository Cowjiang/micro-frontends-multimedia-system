import React, { useEffect, useMemo } from 'react';
import { Outlet, useModel, useSelectedRoutes } from '@@/exports';
import { ConfigProvider, Layout, message, theme } from 'antd';
import Loading from '@/components/Loading';
import SideNavBar from '@/components/SideNavBar';
import './index.less';

export default () => {
  const {loading} = useModel('global');
  const routes = useSelectedRoutes();
  const lastRoute = routes.at(-1); //当前路由

  const [messageApi, contextHolder] = message.useMessage();
  const {setMessageApi} = useModel('messageApi');
  useEffect(() => {
    setMessageApi(messageApi);
  }, []);

  const {darkTheme} = useModel('theme');
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {colorBgContainer, colorFill, colorFillSecondary, colorFillTertiary} = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Layout style={{background: colorBgContainer}}>
        <Loading
          spinning={loading}
          size="large"
          className="!h-screen !max-h-screen"
        >
          {
            lastRoute?.pathname.includes('auth') ? (
              <>
                <Outlet />
              </>
            ) : (
              <div className="w-screen h-full flex flex-row">
                <div
                  className="nav-wrapper h-screen flex-shrink-0 flex-grow-0"
                  style={{background: darkTheme ? '#333' : '#222'}}
                >
                  <SideNavBar secondaryColor={darkTheme ? '#181818' : '#edeef0'} />
                </div>
                <div
                  className="content-wrapper h-screen flex-grow pt-2 pr-2 pb-2"
                  style={{background: darkTheme ? '#333' : '#222'}}
                >
                  <div
                    className="content-container w-full flex rounded-lg overflow-hidden"
                    style={{background: colorBgContainer}}
                  >
                    <Outlet />
                  </div>
                </div>
              </div>
            )
          }
          {contextHolder}
        </Loading>
      </Layout>
    </ConfigProvider>
  );
};
