import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useModel, useNavigate } from '@@/exports';

const {Title, Text} = Typography;
const {useToken} = theme;

const SettingMenu: React.FC = () => {
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  return (
    <div className="setting-menu w-full h-full">
      <div className="w-full pt-8 px-8">
        <Title level={3}>设置中心</Title>
      </div>
      <div className="w-full px-8 mt-6">
        <div className="w-full flex">
          <Input
            className="custom-input"
            style={{background: colorFillSecondary}}
            placeholder="搜索设置..."
          />
          <Button
            className="!w-[40px] ml-2"
            type="primary"
            icon={<i className="fi fi-br-search" />}
          />
        </div>
        <div className="w-full h-6"></div>
      </div>
      <div className="w-full">
        <div className="w-full px-4">
          <Menu
            className="!bg-transparent !border-r-0"
            mode="inline"
            selectable={false}
            items={[
              {
                label: '个人设置',
                key: 'personal-settings',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '账号设置',
                    key: 'account-setting',
                  },
                  {
                    label: '隐私设置',
                    key: 'private-setting',
                  },
                  {
                    label: '安全设置',
                    key: 'secure-setting',
                  }
                ]
              },
              {
                label: '通用设置',
                key: 'app-settings',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '外观设置',
                    key: 'appearance-setting',
                  },
                  {
                    label: '通知设置',
                    key: 'notification-setting',
                  },
                  {
                    label: '语言设置',
                    key: 'language-setting',
                  }
                ]
              },
              {
                label: '更多设置',
                key: 'more-settings',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '关于应用',
                    key: 'about'
                  },
                  {
                    label: '退出登录',
                    key: 'logout',
                    danger: true
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingMenu;
