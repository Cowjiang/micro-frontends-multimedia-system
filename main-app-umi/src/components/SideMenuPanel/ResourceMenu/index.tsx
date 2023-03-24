import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useDispatch, useModel, useNavigate } from '@@/exports';

const {Title, Text} = Typography;
const {useToken} = theme;

const ResourceMenu: React.FC = () => {
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  return (
    <div className="resource-menu w-full h-full">
      <div className="w-full pt-8 px-8">
        <Title level={3}>资源素材库</Title>
      </div>
      <div className="w-full px-8 mt-6">
        <div className="w-full flex">
          <Input
            className="custom-input"
            style={{background: colorFillSecondary}}
            placeholder="搜索资源..."
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
                label: '资源分类',
                key: 'resource-classification',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '全部素材',
                    key: 'all-resource',
                  },
                  {
                    label: '最近素材',
                    key: 'recent-resource',
                  },
                  {
                    label: '我的素材',
                    key: 'my-resource',
                  },
                  {
                    label: '我的收藏',
                    key: 'favorite-resource',
                  }
                ]
              },
              {
                label: '资源类型',
                key: 'resource-type',
                type: 'group',
                children: [
                  {type: 'divider'},
                  {
                    label: '图片素材',
                    key: 'image-resource',
                  },
                  {
                    label: '音视频素材',
                    key: 'media-resource',
                  },
                  {
                    label: '文档素材',
                    key: 'document-resource',
                  },
                  {
                    label: 'H5 素材',
                    key: 'h5-resource',
                  },
                  {
                    label: '其它素材',
                    key: 'other-resource',
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
                    label: '回收站',
                    key: 'recycle-bin'
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

export default ResourceMenu;
