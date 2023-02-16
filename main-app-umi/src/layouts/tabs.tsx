import React, { useEffect, useMemo, useRef, useState } from 'react';
import './tabs.less';
import classNames from 'classnames';
import { TabsLayoutProps } from '@/layouts/typings';
import { Dropdown, Tabs, theme } from 'antd';
import SideMenuPanel from '@/components/SideMenuPanel';
import { useLocation, useModel, useNavigate, useSelectedRoutes } from '@@/exports';
import IndexPage from '@/pages/Index';

const TabsLayout: React.FC<TabsLayoutProps> = (props) => {
  const {darkTheme} = useModel('theme');
  const navigate = useNavigate();
  const routes = useSelectedRoutes();
  const currentRoute = routes.at(-1)?.route as RouteObject;
  const location = useLocation();

  // 当前激活的标签路径
  const [activeKey, setActiveKey] = useState('');

  // 初始化标签页列表
  const initTabsList = useMemo(() => {
    const initTabsList: { label: string | React.ReactNode; children: React.ReactNode; key: string; closable?: boolean }[] = [{
      label: (
        <div className="flex items-center">
          <i className="fi fi-rr-apps"></i>
          <span className="ml-2">首页</span>
        </div>
      ),
      children: <IndexPage />,
      key: '/index',
      closable: false
    }];
    if (location.pathname !== '/index' && currentRoute.title) {
      initTabsList.push({
        label: currentRoute?.title ?? '',
        children: currentRoute.element,
        key: location.pathname
      });
      setActiveKey(location.pathname);
    } else {
      setActiveKey('/index');
    }
    return initTabsList;
  }, []);

  // 标签页列表
  const [tabsList, setTabsList] = useState(initTabsList);
  const newTabIndex = useRef(0);

  useEffect(() => {
    if (props.children.props.context.path !== '/index') {
      addTab(
        currentRoute?.element,
        props.children.props.context.title,
        props.children.props.context.path
      );
      if (props.children.props.context.action === 'REPLACE') {
        const newTabsList = tabsList.filter(tab => tab.key !== activeKey);
        setTabsList(newTabsList);
      } else if (props.children.props.context.action === 'POP') {
        const prevTab = tabsList.find(tab => tab.key === location.pathname);
        if (prevTab) {
          setActiveKey(prevTab.key);
        }
      }
    }
  }, [props.children]);

  useEffect(() => {
    if (activeKey) {
      console.log(activeKey);
      navigate(activeKey);
    }
  }, [activeKey]);

  // 当前标签变更事件
  const onActiveTabChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  // 新增标签
  const addTab = (children: React.ReactNode = <IndexPage />, title?: string, key?: string) => {
    const existIndex = tabsList.findIndex(item => item.key === key);
    if (existIndex !== -1) {
      setActiveKey(tabsList[existIndex].key);
    } else if (title) {
      const newActiveKey = key ?? `newTab${newTabIndex.current++}`;
      const newPanes = [...tabsList];
      newPanes.push({label: title ?? '新标签页', children: children, key: newActiveKey});
      setTabsList(newPanes);
      setActiveKey(newActiveKey);
    }
  };

  // 移除指定标签
  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabsList.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabsList.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabsList(newPanes);
    setActiveKey(newActiveKey);
  };

  // 移除其它标签
  const removeOtherTabs = (currentTabKey: string) => {
    const newTabsList = tabsList.filter(item => ['/index', currentTabKey].includes(item.key));
    setTabsList(newTabsList);
    setActiveKey(currentTabKey);
  };

  // 移除全部标签
  const removeAllTabs = () => {
    const newTabsList = tabsList.filter(item => item.key === '/index');
    setTabsList(newTabsList);
    setActiveKey('/index');
  };

  // 标签编辑
  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      // addTab();
    } else {
      removeTab(targetKey);
    }
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
    } else {
      // 更多按钮右键
      menuItemKey === 'backHome' && navigate('/index');
    }
  };

  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {colorBorderSecondary} = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );

  return (
    <div className="w-full h-full flex">
      <SideMenuPanel />
      <div
        className={classNames('w-full h-full', darkTheme ? 'dark' : 'light')}
        style={{borderLeft: `1px solid ${darkTheme ? colorBorderSecondary : '#ececec'}`}}
      >
        <Tabs
          type="editable-card"
          items={tabsList}
          activeKey={activeKey}
          tabBarGutter={0}
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
            >
              <i className="fi fi-bs-menu-dots" />
            </Dropdown>
          }
          renderTabBar={(tabBarProps, DefaultTabBar) => (
            <DefaultTabBar {...tabBarProps}>
              {
                (node) => {
                  return (
                    <Dropdown
                      menu={{
                        items: [
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
            left: <div className="w-2 h-full"></div>
          }}
          onChange={onActiveTabChange}
          onEdit={onTabEdit}
        />
      </div>
    </div>
  );
};

export default TabsLayout;
