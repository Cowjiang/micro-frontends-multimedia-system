import React from 'react';
import { Typography, theme, Divider, Space, Table, Tag, Row, Col } from 'antd';
import Card from '@/components/Card';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { useNavigate } from '@@/exports';

const {useToken} = theme;
const {Title} = Typography;

interface DataType {
  id: number;
  project_name: string;
  username: string;
  status: string[];
}

const ProjectPage: React.FC = () => {
  const {token} = useToken();
  const navigate = useNavigate();

  const {colorPrimary, colorFillQuaternary, colorPrimaryBg, colorFillSecondary, colorFillTertiary, colorBorder} = token;

  const columns: ColumnsType<DataType> = [
    {
      title: '项目',
      dataIndex: 'project_name',
      key: 'project_name'
    },
    {
      title: '负责人',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 200,
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
      title: '选项',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleProjectClick(_.id)}>查看</a>
          <a>星标</a>
        </Space>
      )
    }
  ];

  const data: DataType[] = [
    {
      id: 0,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['进行中']
    },
    {
      id: 1,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['已取消']
    },
    {
      id: 2,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 3,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 4,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 5,
      project_name: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    }
  ];

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
                  columns={columns}
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
          <Col flex="1 1 300px">
            <Card title="最近项目">
              <div className="w-full h-[290px] overflow-y-auto">
                <Table
                  columns={
                    columns.filter((column) => (
                      ['project_name', 'action'].includes(column.key as string)
                    ))
                  }
                  dataSource={data}
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
                  dataSource={data}
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
        </Row>
      </div>
    </div>
  );
};

export default ProjectPage;
