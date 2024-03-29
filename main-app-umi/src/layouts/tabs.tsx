import React, { useEffect, useMemo, useState } from 'react';
import './tabs.less';
import classNames from 'classnames';
import { TabsLayoutProps } from '@/layouts/typings';
import { Drawer, Dropdown, Tabs, theme } from 'antd';
import SideMenuPanel from '@/components/SideMenuPanel';
import {
  useAccess,
  useDispatch,
  useLocation,
  useModel,
  useNavigate,
  useSelectedRoutes,
  useSelector
} from '@@/exports';
import IndexPage from '@/pages/Index';
import { AppModelState } from '@/models/app';
import IndexMenu from '@/components/SideMenuPanel/IndexMenu';
import ProjectMenu from '@/components/SideMenuPanel/ProjectMenu';
import DepartmentMenu from '@/components/SideMenuPanel/DepartmentMenu';
import ResourceMenu from '@/components/SideMenuPanel/ResourceMenu';
import SettingMenu from '@/components/SideMenuPanel/SettingMenu';
import AdminMenu from '@/components/SideMenuPanel/AdminMenu';
import { useSize } from 'ahooks';
import Loading from '@/components/Loading';
import ForbiddenPage from '@/pages/403';

const {useToken} = theme;

const TabsLayout: React.FC<TabsLayoutProps> = (props) => {
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorBorderSecondary} = token;
  const bodySize = useSize(document.querySelector('body'));

  const navigate = useNavigate();
  const routes = useSelectedRoutes();
  const currentRoute = routes.at(-1)?.route as RouteObject;
  const location = useLocation();
  const {tabsList, activeTabKey}: AppModelState = useSelector((state: any) => state.app);
  const dispatch = useDispatch();
  const access = useAccess();

  // 初始化标签页列表
  useEffect(() => {
    const initTabsList = tabsList;
    //@ts-ignore
    const flag = currentRoute?.access?.find((routeAccess: string) => access[routeAccess] === false);
    if (flag) {
      // 权限不足拦截访问
      initTabsList.push({
        label: currentRoute?.title ?? '',
        children: <ForbiddenPage />,
        key: '/403'
      });
    } else if (location.pathname !== '/index' && currentRoute.title) {
      initTabsList.push({
        label: currentRoute?.title ?? '',
        children: currentRoute.element,
        key: location.pathname
      });
      dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: location.pathname}});
    } else if (location.pathname === '/index') {
      dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: '/index'}});
    } else {
      navigate('/404', {replace: true});
    }
    dispatch({type: 'app/setTabsList', payload: {tabsList: initTabsList}});
  }, []);

  useEffect(() => {
    //@ts-ignore
    const flag = props.children.props.context.access?.find((routeAccess: string) => access[routeAccess] === false);
    if (flag != undefined) {
      // 权限不足拦截访问
      navigate('/403');
      return;
    }
    if (props.children.props.context.action === 'POP') {
      const prevTab = tabsList.find(tab => tab.key === location.pathname);
      if (prevTab) {
        dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: prevTab.key}});
      }
    }
    if (props.children.props.context.path !== '/index' && currentRoute?.path !== '/*') {
      if (props.children.props.context.action === 'REPLACE') {
        const newTabsList = tabsList.filter(tab => tab.key !== activeTabKey);
        dispatch({type: 'app/setTabsList', payload: {tabsList: newTabsList}});
      }
      addTab(
        currentRoute?.element,
        props.children.props.context.title,
        props.children.props.context.path
      );
    } else if (props.children.props.context.path === '/index' && props.children.props.context.action === 'REPLACE') {
      const newTabsList = tabsList.filter(tab => tab.key === '/index');
      dispatch({type: 'app/setTabsList', payload: {tabsList: newTabsList}});
      dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: '/index'}});
    } else if (currentRoute?.path === '/*') {
      navigate('/404', {replace: true});
    } else {
      dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: '/index'}});
    }
  }, [props.children]);

  useEffect(() => {
    if (activeTabKey && activeTabKey !== location.pathname) {
      navigate(activeTabKey);
    }
  }, [activeTabKey]);

  // 当前标签变更事件
  const onActiveTabChange = (newActiveKey: string) => {
    dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: newActiveKey}});
  };

  // 新增标签
  const addTab = (children: React.ReactNode = <IndexPage />, title?: string, key?: string) => {
    dispatch({type: 'app/addTab', payload: {children, title, key}});
  };

  // 移除指定标签
  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    dispatch({type: 'app/removeTab', payload: {targetKey}});
  };

  // 移除其它标签
  const removeOtherTabs = (currentTabKey: string) => {
    const newTabsList = tabsList.filter(item => ['/index', currentTabKey].includes(item.key));
    dispatch({type: 'app/setTabsList', payload: {tabsList: newTabsList}});
    dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: currentTabKey}});
  };

  // 移除全部标签
  const removeAllTabs = () => {
    const newTabsList = tabsList.filter(item => item.key === '/index');
    dispatch({type: 'app/setTabsList', payload: {tabsList: newTabsList}});
    dispatch({type: 'app/setActiveTabKey', payload: {activeTabKey: '/index'}});
  };

  // 当前正在刷新的标签页key
  const [refreshKey, setRefreshKey] = useState('');
  // 刷新标签页
  const refreshTabs = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    setRefreshKey(targetKey as string);
    setTimeout(() => {
      setRefreshKey('');
    }, 250);
  };

  // 标签编辑
  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    action === 'remove' && removeTab(targetKey);
  };

  /**
   * 标签下拉菜单项点击事件
   * @param tabKey 标签的key，更多按钮右键触发时为null
   * @param menuItemKey 菜单项的key
   */
  const handleTabMenuClick = (tabKey?: string | null, menuItemKey?: string) => {
    if (menuItemKey === 'closeAll') {
      removeAllTabs();
      return;
    }
    if (tabKey) {
      // 标签页右键
      menuItemKey === 'closeCurrent' && removeTab(tabKey);
      menuItemKey === 'closeOthers' && removeOtherTabs(tabKey);
      menuItemKey === 'refresh' && refreshTabs(tabKey);
    } else {
      // 更多按钮右键
      menuItemKey === 'backHome' && activeTabKey !== '/index' && navigate('/index');
    }
  };

  // 是否显示侧边菜单栏
  const [showSideMenuPanel, setShowSideMenuPanel] = useState(true);
  const changeSideMenuPanelShow = () => {
    setShowSideMenuPanel(!showSideMenuPanel);
  };

  // 侧边栏组件
  const sideMenuPanel = useMemo(() => {
    let sideMenuPanelContent: React.ReactNode;
    if (activeTabKey.includes('/department')) {
      sideMenuPanelContent = <DepartmentMenu />;
    } else if (activeTabKey.includes('/project')) {
      sideMenuPanelContent = <ProjectMenu />;
    } else if (activeTabKey.includes('/resource')) {
      sideMenuPanelContent = <ResourceMenu />;
    } else if (activeTabKey.includes('/setting')) {
      sideMenuPanelContent = <SettingMenu />;
    } else if (activeTabKey.includes('/admin')) {
      sideMenuPanelContent = <AdminMenu />;
    } else {
      sideMenuPanelContent = <IndexMenu />;
    }
    return (
      <SideMenuPanel hide={!showSideMenuPanel}>
        {sideMenuPanelContent}
      </SideMenuPanel>
    );
  }, [activeTabKey, showSideMenuPanel]);

  return (
    <div className="relative w-full h-full flex">
      {
        bodySize && bodySize?.width <= 1150
          ? (
            <Drawer
              placement="left"
              closable={false}
              open={showSideMenuPanel}
              onClose={() => setShowSideMenuPanel(false)}
              getContainer={false}
              bodyStyle={{
                padding: 0
              }}
              contentWrapperStyle={{
                width: 'auto'
              }}
            >
              {sideMenuPanel}
            </Drawer>
          )
          : sideMenuPanel
      }
      <div
        className={classNames('w-full h-full overflow-auto min-w-[750px]', darkTheme ? 'dark' : 'light')}
        style={{borderLeft: `1px solid ${darkTheme ? colorBorderSecondary : '#ececec'}`}}
      >
        <Tabs
          type="editable-card"
          items={
            tabsList.map(tab => ({
              ...tab,
              children: refreshKey === tab.key
                ? (
                  <Loading spinning size="large">
                    <div className="w-full h-[80vh]"></div>
                  </Loading>
                )
                : tab.children
            }))
          }
          activeKey={activeTabKey}
          tabBarGutter={0}
          tabPosition="top"
          tabBarStyle={{
            background: darkTheme ? '#212121' : '#f6f6f6',
            paddingTop: '0.3rem',
            minHeight: '40px'
          }}
          addIcon={
            <Dropdown
              menu={{
                items: [
                  {
                    label: '回到首页',
                    key: 'backHome'
                  },
                  {
                    label: '关闭全部标签页',
                    key: 'closeAll',
                    danger: true
                  }
                ],
                onClick: ({key}) => handleTabMenuClick(null, key)
              }}
              trigger={['click']}
            >
              <i className="fi fi-sr-angle-down" />
            </Dropdown>
          }
          moreIcon={
            <i className="fi fi-bs-menu-dots opacity-70" />
          }
          renderTabBar={(tabBarProps, DefaultTabBar) => (
            <DefaultTabBar {...tabBarProps} className="tab-bar">
              {
                (node) => {
                  return (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            label: '刷新',
                            key: 'refresh',
                            icon: <i className="fi fi-br-rotate-right" />,
                            disabled: activeTabKey !== node.key
                          },
                          {
                            label: '关闭',
                            key: 'closeCurrent',
                            disabled: node.key === '/index',
                            icon: <i className="fi fi-br-cross" />
                          },
                          {
                            label: '关闭其他标签页',
                            key: 'closeOthers',
                            icon: <div></div>
                          },
                          {
                            label: '关闭全部标签页',
                            key: 'closeAll',
                            danger: true,
                            icon: <div></div>
                          }
                        ],
                        onClick: ({key}) => handleTabMenuClick(node.key as string, key)
                      }}
                      trigger={['contextMenu']}
                    >
                      {node}
                    </Dropdown>
                  );
                }
              }
            </DefaultTabBar>
          )}
          tabBarExtraContent={{
            left:
              <div className="w-10 h-full flex justify-center items-center opacity-70">
                {
                  showSideMenuPanel
                    ? <i
                      className="fi fi-rr-angle-double-left text-xs cursor-pointer"
                      onClick={changeSideMenuPanelShow}
                    />
                    : <i
                      className="fi fi-rr-angle-double-right text-xs cursor-pointer"
                      onClick={changeSideMenuPanelShow}
                    />
                }
              </div>
          }}
          onChange={onActiveTabChange}
          onEdit={onTabEdit}
        />
      </div>
    </div>
  );
};

export default TabsLayout;
