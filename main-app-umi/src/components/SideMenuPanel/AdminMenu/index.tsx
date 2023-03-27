import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useDispatch, useModel, useNavigate } from '@@/exports';

const {Title, Text} = Typography;
const {useToken} = theme;

const AdminMenu: React.FC = () => {
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  return (
    <div className="admin-menu w-full h-full">
      <div className="w-full pt-8 px-8">
        <Title level={3}>后台管理</Title>
      </div>
      <div className="w-full px-8 mt-6">
        <div className="w-full flex">
          <Input
            className="custom-input"
            style={{background: colorFillSecondary}}
            placeholder="搜索管理项..."
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
                label: '安全管理',
                key: 'secure',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '权限管理',
                    key: 'permission',
                    onClick: () => navigate('/admin/permission', {replace: true})
                  },
                  {
                    label: '角色管理',
                    key: 'role',
                    onClick: () => navigate('/admin/role', {replace: true})
                  },
                  {
                    label: '路径管理',
                    key: 'request-path',
                    onClick: () => navigate('/admin/request-path', {replace: true})
                  },
                  {
                    label: '用户管理',
                    key: 'user',
                    onClick: () => navigate('/admin/user', {replace: true})
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

export default AdminMenu;
