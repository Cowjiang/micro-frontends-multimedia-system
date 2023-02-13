import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { TabsLayoutProps } from '@/layouts/typings';
import { Button, Space, Tabs } from 'antd';
import SideMenuPanel from '@/components/SideMenuPanel';
import { useModel, useNavigate, useSelectedRoutes } from '@@/exports';
import './tabs.less';
import IndexPage from '@/pages/Index';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const TabsLayout: React.FC<TabsLayoutProps> = (props) => {
  const {darkTheme} = useModel('theme');
  const navigate = useNavigate();
  const routes = useSelectedRoutes();
  const currentRoute = routes.at(-1)?.route; //当前路由

  const initialItems = [
    {
      label: '首页',
      children: <IndexPage />,
      key: '/index'
    },
    currentRoute?.path === '/index' ? {} : {
      label: currentRoute?.title,
      children: currentRoute?.element,
      key: currentRoute?.path ?? ''
    }
  ];

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

  const remove = (targetKey: TargetKey) => {
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

  const onTabClick = (e: MouseEvent) => {
    e.preventDefault();
    const currentKey = (e.target as HTMLElement)?.id.replaceAll('rc-tabs-0-tab-', '');
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div className="w-full h-full flex">
      <SideMenuPanel />
      <div className="w-full h-full">
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
            background: darkTheme ? '#212121' : '#edeef0',
            paddingTop: '0.3rem',
            minHeight: '40px'
          }}
          hideAdd
          tabBarExtraContent={{
            left: <div className="w-2 h-full"></div>
          }}
          onContextMenu={onTabClick}
          onChange={onChange}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};

export default TabsLayout;
