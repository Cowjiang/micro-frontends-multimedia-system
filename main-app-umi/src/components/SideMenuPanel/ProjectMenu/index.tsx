import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { useAccess, useModel, useNavigate, useSelector } from '@@/exports';
import Loading from '@/components/Loading';
import { Project, ProjectVo } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';
import { UserModelState } from '@/models/user';

const {Title, Text} = Typography;
const {useToken} = theme;

const ProjectMenu: React.FC = () => {
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  const {isSuperAdmin, isDepartmentAdmin} = useAccess();
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  const [loading, setLoading] = useState(false);

  // 项目列表
  const [projectList, setProjectList] = useState<ProjectVo[]>([]);

  // 获取项目列表
  const getProjectList = async () => {
    if (userInfo.userId) {
      const {data: projectList} = isSuperAdmin
        ? await projectApi.getProjectList()
        : isDepartmentAdmin && userInfo.department?.id
          ? await projectApi.getDepartmentProjectList(userInfo.department.id)
          : await projectApi.getMyProjectList(userInfo.userId);
      setProjectList((projectList ?? []).map(project => ({key: project.project.id, ...project})));
    }
  };
  useEffect(() => {
    getProjectList().then(() => {});
  }, []);

  return (
    <Loading spinning={loading} size="large">
      <div className="project-menu w-full h-full">
        <div className="w-full pt-8 px-8">
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
                            <Text ellipsis>{project.project.projectName ?? ''}</Text>
                          </div>
                        ),
                        key: String(project.project.id),
                        children: [
                          {
                            label: '项目详情',
                            key: `detail${project.project.id}`,
                            onClick: () => navigate(`/project/${project.project.id}/detail`)
                          },
                          {
                            label: '稿件列表',
                            key: `draftList${project.project.id}`,
                            onClick: () => navigate(`/project/${project.project.id}/draft/list`)
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
