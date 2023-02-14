import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TabsLayoutProps } from '@/layouts/typings';
import { Dropdown, Tabs, theme } from 'antd';
import SideMenuPanel from '@/components/SideMenuPanel';
import { useModel, useNavigate, useSelectedRoutes } from '@@/exports';
import './tabs.less';
import IndexPage from '@/pages/Index';

const TabsLayout: React.FC<TabsLayoutProps> = (props) => {
  const {darkTheme} = useModel('theme');
  const navigate = useNavigate();
  const routes = useSelectedRoutes();
  const currentRoute = routes.at(-1)?.route as RouteObject; //当前路由

  const init = () => {
    const items: { label: string | React.ReactNode; children: React.ReactNode; key: string }[] = [{
      label: (
        <div className="flex items-center">
          <i className="fi fi-rr-apps"></i>
          <span className="ml-2">首页</span>
        </div>
      ),
      children: <IndexPage />,
      key: '/index'
    }];
    currentRoute?.path !== '/index' && items.push({
      label: currentRoute?.title ?? '',
      children: currentRoute.element,
      key: currentRoute?.path ?? ''
    });
    return items;
  };
  const initialItems = init();

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  useEffect(() => {
    props.children.props.context.path !== '/index' && add(
      currentRoute?.element,
      props.children.props.context.title,
      props.children.props.context.path
    );
  }, [props.children]);

  useEffect(() => {
    if (activeKey) {
      navigate(activeKey);
    }
  }, [activeKey]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = (children: React.ReactNode = <IndexPage />, title?: string, key?: string) => {
    const existIndex = items.findIndex(item => item.key === key);
    if (existIndex !== -1) {
      setActiveKey(items[existIndex].key);
    } else {
      const newActiveKey = key ?? `newTab${newTabIndex.current++}`;
      const newPanes = [...items];
      newPanes.push({label: title ?? '新标签页', children: children, key: newActiveKey});
      setItems(newPanes);
      setActiveKey(newActiveKey);
    }
  };

  const remove = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  // 标签编辑
  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      // add();
    } else {
      remove(targetKey);
    }
  };

  /**
   * 标签下拉菜单项点击事件
   * @param tabKey 标签的key，更多按钮右键触发时为null
   * @param menuItemKey 菜单项的key
   */
  const handleTabMenuClick = (tabKey?: string | null, menuItemKey?: string) => {
    if (menuItemKey === 'closeAll') {
      items.forEach(item => {
        item.key !== '/index' && remove(item.key);
      });
      onChange('/index');
    }
    if (tabKey) {
      // 标签页右键
      menuItemKey === 'closeCurrent' && remove(tabKey);
      menuItemKey === 'closeOthers' && items.forEach(item => {
        !['/index', tabKey].includes(item.key) && remove(item.key);
      });
    } else {
      // 更多按钮右键
      menuItemKey === 'backHome' && navigate('/index');
    }
  };

  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {colorBorder, colorBorderSecondary} = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );

  return (
    <div className="w-full h-full flex">
      <SideMenuPanel />
      <div
        id="test"
        className="w-full h-full"
        style={{borderLeft: `1px solid ${darkTheme ? colorBorderSecondary : '#ececec'}`}}
      >
        <Tabs
          type="editable-card"
          items={
            items.map((item, index) => {
              if (index === 0) {
                return {
                  ...item,
                  closable: false
                };
              }
              return item;
            })
          }
          activeKey={activeKey}
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
          onChange={onChange}
          onEdit={onTabEdit}
        />
      </div>
    </div>
  );
};

export default TabsLayout;
