import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import {
  Outlet,
  useAccess,
  useDispatch,
  useLocation,
  useModel,
  useNavigate,
  useSelectedRoutes,
  useSelector
} from '@@/exports';
import { ConfigProvider, Layout, message, theme } from 'antd';
import Loading from '@/components/Loading';
import SideNavBar from '@/components/SideNavBar';
import ChatDialog from '@/components/ChatDialog';
import { NavItem } from '@/components/SideNavBar/typings';
import { UserModelState } from '@/models/user';
import { AppModelState } from '@/models/app';
import TabsLayout from '@/layouts/tabs';
import UserInfoDialog from '@/components/UserInfoDialog';
import { UserInfoDialogProps } from '@/components/UserInfoDialog/typings';
import { userApi } from '@/services/api';

export default () => {
  const {loading, setLoading} = useModel('global');
  const {primaryColor} = useModel('theme');
  const navigate = useNavigate();
  const location = useLocation();
  const routes = useSelectedRoutes();
  const access = useAccess();
  const lastRoute = routes.at(-1); //当前路由

  const [messageApi, contextHolder] = message.useMessage();
  const {setMessageApi} = useModel('messageApi');
  useEffect(() => {
    setMessageApi(messageApi);
  }, []);

  const chatAppConfig: AppModelState['chatAppConfig'] = useSelector((state: any) => state.app.chatAppConfig);
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const {setInitialState} = useModel('@@initialState');

  useEffect(() => {
    if (!userInfo?.userId && localStorage.getItem('userInfo')) {
      userApi.getCurrentUserInfo().then(({data}) => {
        dispatch({
          type: 'user/setUserInfo',
          payload: data
        });
      }).catch(() => {
        messageApi.error('网络异常').then(() => {});
      });
    }
  }, []);

  useEffect(() => {
    setInitialState(userInfo);
  }, [userInfo]);

  const {darkTheme} = useModel('theme');
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {colorBgContainer} = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );

  // 导航栏点击事件
  const handleNavItemClick = (e: NavItem) => {
    if (['home', 'project', 'file', 'department', 'settings'].includes(e.value.name)) {
      dispatch({
        type: 'app/setActiveNavIndex',
        payload: {
          activeNavIndex: e.index
        }
      });
    }
    if (e.value.name === 'chat') {
      dispatch({
        type: 'app/setChatAppConfig',
        payload: {
          chatAppConfig: {
            ...chatAppConfig,
            open: true
          }
        }
      });
    } else if (e.value.name === 'user') {
      userInfo?.userId && setUserProfileDialogProps({
        open: true,
        userId: userInfo.userId
      });
    }
    const url = e.value.url ?? '';
    url && navigate(url);
  };

  useEffect(() => {
    const currentPath = lastRoute?.pathname ?? '';
    let activeNavIndex: number;
    if (currentPath.includes('/project')) {
      activeNavIndex = 1;
    } else if (currentPath.includes('/resource')) {
      activeNavIndex = 2;
    } else if (currentPath.includes('/department')) {
      activeNavIndex = 3;
    } else if (currentPath.includes('/settings')) {
      activeNavIndex = 5;
    } else {
      activeNavIndex = 0;
    }
      dispatch({
      type: 'app/setActiveNavIndex',
      payload: {activeNavIndex}
    });
  }, [lastRoute]);

  const [userProfileDialogProps, setUserProfileDialogProps] = useState<UserInfoDialogProps>({
    open: false,
    userId: 0
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor
        },
        algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Layout className={darkTheme ? 'dark' : 'light'} style={{background: colorBgContainer}}>
        <Loading
          spinning={loading}
          size="large"
          className="!h-screen !max-h-screen"
        >
          {
            lastRoute?.pathname !== '/' ? (
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
                    <SideNavBar
                      secondaryColor={darkTheme ? '#212121' : '#f6f6f6'}
                      onChange={handleNavItemClick}
                    />
                  </div>
                  <div
                    className="content-wrapper h-screen flex-grow pt-2 pr-2 pb-2"
                    style={{background: darkTheme ? '#333' : '#222'}}
                  >
                    <div
                      className="content-container w-full flex rounded-lg overflow-hidden"
                      style={{background: colorBgContainer}}
                    >
                      <TabsLayout>
                        <Outlet
                          context={{
                            path: `${lastRoute?.pathname}`,
                            title: (lastRoute?.route as RouteObject).title,
                            action: (lastRoute?.route as RouteObject).action,
                            access: (lastRoute?.route as RouteObject)?.access
                          }}
                        />
                      </TabsLayout>
                    </div>
                  </div>
                </div>
              )
            ) : <Outlet />
          }
          {contextHolder}
          <ChatDialog
            open={chatAppConfig.open}
            onCancel={() => {
              dispatch({
                type: 'app/setChatAppConfig',
                payload: {
                  chatAppConfig: {
                    ...chatAppConfig,
                    open: false
                  }
                }
              });
            }}
          />
          <UserInfoDialog
            {...userProfileDialogProps}
            destroyOnClose
            onCancel={() => setUserProfileDialogProps({open: false, userId: 0})}
          />
        </Loading>
      </Layout>
    </ConfigProvider>
  );
};
