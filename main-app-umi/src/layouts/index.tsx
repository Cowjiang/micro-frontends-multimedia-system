import React, { useEffect } from 'react';
import { Outlet, useAppData, useLocation, useModel, useSearchParams } from '@@/exports';
import { ConfigProvider, Layout, message, theme } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import Loading from '@/components/loading';

export default () => {
  const {loading} = useModel('global');
  const {pathname} = useLocation();
  const {routes} = useAppData();
  const title = (Object.values(routes).find(({path}) => path?.includes(pathname)) as any)?.title ?? '';
  useSetDocTitle(title);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('theme'));

  const [messageApi, contextHolder] = message.useMessage();
  const {setMessageApi} = useModel('messageApi');
  useEffect(() => {
    setMessageApi(messageApi);
    // message.success('成功')
  }, []);

  const {darkTheme} = useModel('theme');

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#00b96b'
        },
        algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Layout>
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
