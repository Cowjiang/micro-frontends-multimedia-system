import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useDispatch, useModel, useNavigate } from '@@/exports';

const {Title, Text} = Typography;
const {useToken} = theme;

const IndexMenu: React.FC = () => {
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  return (
    <div className="index-menu w-full h-full">
      <div className="w-full pt-8 px-8">
        <Title level={3}>MFMS 采编系统</Title>
      </div>
      <div className="w-full px-8 mt-6">
        <div className="w-full flex">
          <Input
            className="custom-input"
            style={{background: colorFillSecondary}}
            placeholder="搜索内容..."
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
                label: '内容管理',
                key: 'quick-access',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '项目概览',
                    key: 'project-overview',
                    onClick: () => navigate('/project')
                  },
                  {
                    label: '项目列表',
                    key: 'project-list',
                    onClick: () => navigate('/project/list?type=all')
                  },
                  {
                    label: '素材资源',
                    key: 'resource',
                    onClick: () => navigate('/resource')
                  }
                ]
              },
              {
                label: '用户与沟通',
                key: 'user-chat',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '部门信息',
                    key: 'department',
                    onClick: () => navigate('/department')
                  },
                  {
                    label: '私信与群聊',
                    key: 'chat'
                  },
                  {
                    label: '个人设置',
                    key: 'user-setting',
                    onClick: () => navigate('/settings/personal')
                  }
                ]
              },
              {
                label: '更多',
                key: 'more',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '系统设置',
                    key: 'system-setting',
                    onClick: () => navigate('/settings/general')
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

export default IndexMenu;
