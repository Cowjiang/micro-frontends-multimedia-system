import React, { useEffect, useState } from 'react';
import { useAccess, useLocation, useModel, useNavigate, useSearchParams, useSelector } from '@@/exports';
import { Button, Dropdown, Input, Table, Tabs, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { Project, ProjectVo } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';
import dayjs from 'dayjs';
import { UserModelState } from '@/models/user';

const {useToken} = theme;
const {Title, Text} = Typography;

const projectListTypes: { [key: string]: string } = {
  all: '全部',
  participated: '我参与的',
  created: '我创建的',
  stared: '星标'
};

const ProjectListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {messageApi} = useModel('messageApi');
  const {isDepartmentAdmin, isSuperAdmin} = useAccess();
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  const {token} = useToken();
  const {colorPrimaryText} = token;

  const [projectListType, setProjectListType] = useState(
    projectListTypes[searchParams.get('type') ?? '']
  );
  useEffect(() => {
    if (location.pathname === '/project/list') {
      setProjectListType(projectListTypes[searchParams.get('type') ?? '']);
      if (!projectListType) {
        setSearchParams({type: 'all'});
      }
    }
  }, [projectListType, searchParams]);
  useSetDocTitle(`项目列表 - ${projectListType}`);

  const columns: ColumnsType<ProjectVo> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_, {project: {id}}) => (
        <Text type="secondary"># {id}</Text>
      )
    },
    {
      title: '项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      ellipsis: true,
      render: (_, {project: {projectName, id}}) => (
        <Text
          className="cursor-pointer"
          style={{color: colorPrimaryText}}
          onClick={() => handleProjectClick(id as number)}
        >
          {projectName}
        </Text>
      )
    },
    {
      title: '负责人',
      dataIndex: 'username',
      key: 'username',
      width: '15%',
      render: (_, {charge: {username}}) => (
        <Text>{username}</Text>
      )
    },
    {
      title: '状态',
      key: 'stat',
      dataIndex: 'stat',
      width: 150,
      render: (_, {project: {stat}}) => (
        <Tag color="green">
          进行中
        </Tag>
      )
    },
    {
      title: '稿件数',
      dataIndex: 'contributionNum',
      key: 'contributionNum',
      width: 100,
      responsive: ['xl'],
      render: (_, {contributionNum}) => (
        <Text>
          {contributionNum ?? 0}
        </Text>
      )
    },
    {
      title: '开始 / 结束时间',
      key: 'startTime',
      dataIndex: 'startTime',
      ellipsis: true,
      render: (_, {project: {startTime, endTime}}) => (
        <div className="flex flex-col">
          <Text type="secondary" ellipsis>
            {dayjs(startTime).format('YYYY年MM月DD日 hh:mm')}
          </Text>
          <Text type="secondary" ellipsis>
            {dayjs(endTime).format('YYYY年MM月DD日 hh:mm')}
          </Text>
        </div>
      )
    },
    {
      title: '更新时间',
      key: 'updatedTime',
      dataIndex: 'updatedTime',
      ellipsis: true,
      responsive: ['xxl'],
      render: (_, {project: {updatedTime}}) => (
        <Text type="secondary" ellipsis>
          {dayjs(updatedTime).format('YYYY年MM月DD日 hh:mm')}
        </Text>
      )
    },
    {
      title: <div className="!ml-2">操作</div>,
      key: 'action',
      width: 90,
      render: (_, {project}) => (
        <Dropdown
          menu={{
            items: [
              {
                label: '进入项目',
                key: '1',
                onClick: () => handleProjectClick(project.id as number)
              },
              {
                label: '编辑项目',
                key: '2'
              },
              {
                label: project.star ? '取消星标' : '设置星标',
                key: '3',
                onClick: () => handleStarProject(project)
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text">
            <i className="fi fi-bs-menu-dots" />
          </Button>
        </Dropdown>
      )
    }
  ];

  // 项目列表
  const [projectList, setProjectList] = useState<ProjectVo[]>([]);
  // 星标项目列表
  const [staredProjectList, setStaredProjectList] = useState<ProjectVo[]>([]);

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
    const {data: starProjectList} = await projectApi.getStaredProjectList();
    setStaredProjectList((starProjectList ?? []).map(project => ({key: project.project.id, ...project})));
  };
  useEffect(() => {
    getProjectList().then(() => {});
  }, []);

  // 项目点击
  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}/detail`);
  };

  // 切换项目星标状态
  const handleStarProject = (project: Project) => {
    project.id && projectApi.setProjectStarStatus({
      id: project.id,
      starFlag: project.star ? 0 : 1
    }).then(async () => {
      await getProjectList();
    }).catch(() => {
      messageApi.error('设置失败');
    });
  };

  const handleTabsChange = (newTabKey: string) => {
    setSearchParams({type: newTabKey});
  };

  return (
    <div className="project-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Title level={3} className="mt-6">项目列表</Title>
      </div>
      <div>
        <Tabs
          className="!h-auto"
          defaultActiveKey={searchParams.get('type') ?? 'all'}
          size="large"
          items={[
            {
              key: 'all',
              label: '全部项目',
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={projectList}
                  scroll={{x: 900}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
                    )
                  }}
                />
              )
            },
            {
              key: 'participated',
              label: '我参与的',
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={projectList}
                  scroll={{x: 900}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
                    )
                  }}
                />
              )
            },
            {
              key: 'created',
              label: '我创建的',
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={
                    projectList.filter(project => project.creator.userId === userInfo.userId)
                  }
                  scroll={{x: 900}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
                    )
                  }}
                />
              )
            },
            {
              key: 'stared',
              label: '星标项目',
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={staredProjectList}
                  scroll={{x: 900}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
                    )
                  }}
                />
              )
            }
          ]}
          tabBarExtraContent={{
            right: (
              <Input.Search placeholder="搜索项目..." enterButton />
            )
          }}
          onChange={handleTabsChange}
        />
      </div>
    </div>
  );
};

export default ProjectListPage;
