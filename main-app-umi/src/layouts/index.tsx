import React, { useEffect, useMemo } from 'react';
import { Outlet, useModel } from '@@/exports';
import { ConfigProvider, Layout, message, theme } from 'antd';
import Loading from '@/components/loading';

export default () => {
  const {loading} = useModel('global');

  const [messageApi, contextHolder] = message.useMessage();
  const {setMessageApi} = useModel('messageApi');
  useEffect(() => {
    setMessageApi(messageApi);
  }, []);

  const {darkTheme} = useModel('theme');
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {colorBgContainer} = useMemo(
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
          {contextHolder}
          <Outlet />
        </Loading>
      </Layout>
    </ConfigProvider>
  );
};
