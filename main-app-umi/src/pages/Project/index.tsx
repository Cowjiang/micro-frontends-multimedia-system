import React, { useEffect, useState } from 'react';
import { Typography, theme, Divider, Table, Tag, Row, Col, Dropdown, Button } from 'antd';
import Card from '@/components/Card';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { useNavigate } from '@@/exports';
import { Project } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';
import { formatDate } from '@/utils/format';

const {useToken} = theme;
const {Title, Text} = Typography;

const ProjectPage: React.FC = () => {
  const {token} = useToken();
  const navigate = useNavigate();

  const {colorPrimaryText} = token;

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

  return (
    <div className="project-page w-full h-full px-12 flex flex-col">
      <div>
        <Title level={3}>项目概览</Title>
        <Divider />
      </div>
      <div className="w-full pb-24">
        <Row gutter={[16, 16]}>
          <Col flex="1 1 60%" className="w-screen">
            <Card title="星标项目">
              <div className="w-full h-[290px] overflow-y-auto">
                <Table
                  columns={
                    columns.filter((column) => (
                      !['startTime', 'updateTime'].includes(column.key as string)
                    ))
                  }
                  pagination={false}
                  dataSource={staredProjectList}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-8">
                        <Empty />
                      </div>
                    )
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 300px">
            <Card title="最近项目">
              <div className="w-full h-[290px] overflow-y-auto">
                <Table
                  columns={
                    columns.filter((column) => (
                      ['project_name', 'action'].includes(column.key as string)
                    ))
                  }
                  pagination={false}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-8">
                        <Empty />
                      </div>
                    )
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 100%">
            <Card title="全部项目">
              <div className="w-full min-h-[280px]">
                <Table
                  columns={columns}
                  dataSource={projectList}
                  pagination={false}
                  scroll={{x: 800}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-8">
                        <Empty />
                      </div>
                    )
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectPage;
