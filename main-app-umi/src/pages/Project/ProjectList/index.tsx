import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from '@@/exports';
import { Button, Dropdown, Input, Table, Tabs, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { Project } from '@/services/api/modules/project/typings';
import { formatDate } from '@/utils/format';
import { projectApi } from '@/services/api';

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

  const columns: ColumnsType<Project> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      ellipsis: true,
      render: (_, {projectName, id}) => (
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
      render: (_, {userId}) => (
        <>
          破壁机
        </>
      )
    },
    {
      title: '状态',
      key: 'stat',
      dataIndex: 'stat',
      width: 150,
      render: (_, {stat}) => (
        <Tag color="green">
          进行中
        </Tag>
      )
    },
    {
      title: '稿件数',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      responsive: ['xl'],
      render: (_, {}) => (
        <Text>
          14
        </Text>
      )
    },
    {
      title: '开始 / 结束时间',
      key: 'startTime',
      dataIndex: 'startTime',
      ellipsis: true,
      render: (_, {startTime, endTime}) => (
        <div className="flex flex-col">
          <Text type="secondary" ellipsis>{formatDate(String(startTime) ?? '')}</Text>
          <Text type="secondary" ellipsis>{formatDate(String(endTime) ?? '')}</Text>
        </div>
      )
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      ellipsis: true,
      responsive: ['xxl'],
      render: (_, {updateTime}) => (
        <Text type="secondary" ellipsis>{formatDate(String(updateTime) ?? '')}</Text>
      )
    },
    {
      title: <div className="!ml-2">操作</div>,
      key: 'action',
      width: 90,
      render: (_, {id}) => (
        <Dropdown
          menu={{
            items: [
              {
                label: '进入项目',
                key: '1',
                onClick: () => handleProjectClick(id as number)
              },
              {
                label: '编辑项目',
                key: '2'
              },
              {
                label: '设置星标',
                key: '3'
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
  const [projectList, setProjectList] = useState<Project[]>([]);
  // 星标项目列表
  const [staredProjectList, setStaredProjectList] = useState<Project[]>([]);

  // 获取项目列表
  const getProjectList = async () => {
    const {data: projectList} = await projectApi.getProjectList();
    setProjectList((projectList ?? []).map(project => ({key: project.id, ...project})));
    const {data: starProjectList} = await projectApi.getProjectList();
    setStaredProjectList((starProjectList ?? []).map(project => ({key: project.id, ...project})));
  };
  useEffect(() => {
    getProjectList().then(() => {});
  }, []);

  // 项目点击
  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}/detail`);
  };

  const handleTabsChange = (newTabKey: string) => {
    setSearchParams({type: newTabKey});
  };

  return (
    <div className="project-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Title level={3}>项目列表</Title>
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
