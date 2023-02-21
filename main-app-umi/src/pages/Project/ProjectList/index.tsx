import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from '@@/exports';
import { Button, Dropdown, Input, Table, Tabs, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';

const {useToken} = theme;
const {Title} = Typography;

const projectListTypes: { [key: string]: string } = {
  all: '全部',
  participated: '我参与的',
  created: '我创建的',
  stared: '星标'
};

interface ProjectListDataType {
  id: number;
  projectName: string;
  username: string;
  status: string[];
}

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
  useSetDocTitle(`${projectListType}项目`);


  const columns: ColumnsType<ProjectListDataType> = [
    {
      title: '编号',
      dataIndex: 'projectId',
      key: 'projectId',
      width: 80,
      ellipsis: true
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '60%',
      ellipsis: true,
      render: (_, {projectName,id}) => (
        <a
          style={{color: colorPrimaryText}}
          onClick={() => handleProjectClick(id)}
        >
          {projectName}
        </a>
      )
    },
    {
      title: '负责人',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
      ellipsis: true
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: '20%',
      ellipsis: true,
      render: (_, {status}) => (
        <>
          {status.map((tag) => {
            let color = tag !== '进行中' ? 'geekblue' : 'green';
            if (tag === '已取消') {
              color = 'red';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: '稿件数',
      key: 'draftCount',
      dataIndex: 'draftCount',
      width: 100,
      ellipsis: true
    },
    {
      title: '素材数',
      key: 'resourceCount',
      dataIndex: 'resourceCount',
      width: 100,
      ellipsis: true
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      width: '25%',
      ellipsis: true
    },
    {
      title: '',
      key: 'action',
      width: 120,
      render: () => (
        <Dropdown
          menu={{
            items: [
              {
                label: '查看',
                key: '1'
              },
              {
                label: '设为星标',
                key: '2'
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

  const data: ProjectListDataType[] = [
    {
      id: 0,
      projectName: '大美湾区科技之美大美湾区科技之美大美湾区科技之美大美湾区科技之美',
      username: '破壁机',
      status: ['进行中']
    },
    {
      id: 1,
      projectName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已取消']
    },
    {
      id: 2,
      projectName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 3,
      projectName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 4,
      projectName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 5,
      projectName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    }
  ];

  // 项目点击
  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}/detail`);
  };

  return (
    <div className="project-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Title level={3}>项目列表</Title>
        {/*<Divider />*/}
      </div>
      <div>
        <Tabs
          className="!h-auto"
          defaultActiveKey={searchParams.get('type') ?? 'all'}
          size="large"
          items={[
            {
              key: 'all',
              label: `全部项目`,
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={data}
                  scroll={{x: 900}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
                    )
                  }}
                  onRow={() => {
                    return {
                      onClick: (event) => {console.log(event);},
                    };
                  }}
                />
              )
            },
            {
              key: 'participated',
              label: `我参与的`
            },
            {
              key: 'created',
              label: `我创建的`
            },
            {
              key: 'stared',
              label: `星标项目`
            }
          ]}
          tabBarExtraContent={{
            right: (
              <Input.Search placeholder="搜索项目..." enterButton />
            )
          }}
        />
      </div>
    </div>
  );
};

export default ProjectListPage;
