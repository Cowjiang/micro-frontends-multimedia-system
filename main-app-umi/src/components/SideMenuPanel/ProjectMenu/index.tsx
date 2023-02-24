import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useModel, useNavigate } from '@@/exports';
import Loading from '@/components/Loading';
import { Project } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';

const {Title, Text} = Typography;
const {useToken} = theme;

const ProjectMenu: React.FC = () => {
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  const [loading, setLoading] = useState(false);

  // 项目列表
  const [projectList, setProjectList] = useState<Project[]>([]);

  // 获取项目列表
  const getProjectList = async () => {
    const {data: projectList} = await projectApi.getProjectList();
    setProjectList((projectList ?? []).map(project => ({key: project.id, ...project})));
  };
  useEffect(() => {
    getProjectList().then(() => {});
  }, []);

  // 项目点击
  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}/detail`);
  };

  return (
    <Loading spinning={loading} size="large">
      <div className="project-menu w-full h-full">
        <div className="w-full pt-2 px-8">
          <Title level={3}>项目</Title>
        </div>
        <div className="w-full px-8 mt-6">
          <div className="w-full flex">
            <Input
              className="custom-input"
              style={{background: colorFillSecondary}}
              placeholder="搜索项目..."
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
                  label: '项目概览',
                  key: 'project-overview',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    {
                      label: '我参与的',
                      key: 'participated',
                      onClick: () => navigate('/project/list?type=participated')
                    },
                    {
                      label: '我创建的',
                      key: 'created',
                      onClick: () => navigate('/project/list?type=created')
                    },
                    {
                      label: '星标项目',
                      key: 'stared',
                      onClick: () => navigate('/project/list?type=stared')
                    }
                  ]
                },
                {
                  label: '项目列表',
                  key: 'project-list',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    ...projectList.length
                      ? projectList.map(project => ({
                        label: (
                          <div className="w-full flex">
                            <Text ellipsis>{project.projectName ?? ''}</Text>
                          </div>
                        ),
                        key: String(project.id),
                        children: [
                          {
                            label: '项目详情',
                            key: `detail${project.id}`,
                            onClick: () => handleProjectClick(project.id as number)
                          },
                          {
                            label: '稿件列表',
                            key: `draftList${project.id}`
                          }
                        ]
                      }))
                      : [{
                        label: '空空如也',
                        key: 'empty',
                        disabled: true
                      }]
                  ]
                },
                {
                  label: '项目管理',
                  key: 'project-manage',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    {
                      label: '新建项目',
                      key: 'create-project',
                      onClick: () => navigate('/project/edit/new')
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default ProjectMenu;
