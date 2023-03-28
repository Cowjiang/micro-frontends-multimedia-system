import React, { useEffect } from 'react';
import './index.less';
import { Col, Row, theme, Typography } from 'antd';
import { UserModelState } from '@/models/user';
import { useAccess, useModel, useNavigate, useSelector } from '@@/exports';

const {Title, Text} = Typography;
const {useToken} = theme;

const IndexPage = () => {
  const {token} = useToken();
  const {colorFillQuaternary, colorPrimary, colorPrimaryBg, colorBorderSecondary} = token;
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);
  const {darkTheme} = useModel('theme');
  const navigate = useNavigate();

  const itemList = [
    {
      title: '项目管理',
      icon: <i className="fi fi-sr-apps" />,
      description: '查看和管理你参与的所有项目',
      onClick: () => navigate('/project')
    },
    {
      title: '我的稿件',
      icon: <i className="fi fi-sr-document" />,
      description: '查看和管理你发布的所有稿件',
      onClick: () => navigate('/project')
    },
    {
      title: '我的素材',
      icon: <i className="fi fi-sr-cloud-upload" />,
      description: '进入查看和管理素材资源',
      onClick: () => navigate('/resource')
    },
    {
      title: '沟通与交流',
      icon: <i className="fi fi-sr-comment" />,
      description: '与项目成员在线沟通',
      onClick: () => {}
    },
    {
      title: '部门与人员',
      icon: <i className="fi fi-sr-users" />,
      description: '查看或管理部门与人员信息',
      onClick: () => navigate('/department')
    },
    {
      title: '设置中心',
      icon: <i className="fi fi-sr-settings" />,
      description: '更改用户信息或系统设置',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="index-page w-full h-full p-12 flex justify-center">
      <div className="w-full max-w-[1000px] flex flex-col">
        <div className="w-full h-[350px] pt-16 flex flex-col items-center">
          <div className="bg-animation"></div>
          <div className="text-7xl font-bold">
            Hi，{userInfo?.username ?? ''}
          </div>
          <div className="mt-12 text-2xl">
            有事做有所期待，日子就是幸福的
          </div>
        </div>
        <Row gutter={[32, 32]}>
          {
            itemList.map(data => (
              <Col span={8} key={data.title}>
                <div
                  className="h-full p-16 flex flex-col justify-center items-center rounded-xl cursor-pointer"
                  style={{background: colorFillQuaternary}}
                  onClick={data.onClick}
                >
                  <Title level={1} style={{color: colorPrimary}}>{data.icon}</Title>
                  <Title className="!mt-0" level={3}>{data.title}</Title>
                  <Text type="secondary">{data.description}</Text>
                </div>
              </Col>
            ))
          }
        </Row>
      </div>
    </div>
  );
};

export default IndexPage;
