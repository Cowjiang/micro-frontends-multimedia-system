import React, { useEffect, useState } from 'react';
import { Typography, theme, Divider, Table, Tag, Row, Col, Dropdown, Button, Modal } from 'antd';
import Card from '@/components/Card';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { useAccess, useModel, useNavigate, useSelector } from '@@/exports';
import { Project, ProjectVo } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';
import dayjs from 'dayjs';
import { UserModelState } from '@/models/user';
import { protectedAccess } from '@/utils';
import { formatProjectStatus } from '@/utils/format';

const {useToken} = theme;
const {Title, Text} = Typography;

const ProjectPage: React.FC = () => {
  const {token} = useToken();
  const navigate = useNavigate();
  const {isDepartmentAdmin, isSuperAdmin, canEditProject} = useAccess();
  const {colorPrimaryText} = token;
  const {messageApi} = useModel('messageApi');
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

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
      render: (_, {charge: {username, userId}}) => (
        <Text>
          {username}
        </Text>
      )
    },
    {
      title: '状态',
      key: 'stat',
      dataIndex: 'stat',
      width: 150,
      render: (_, {project}) => (
        <Tag color={formatProjectStatus(project).color}>
          {formatProjectStatus(project).tag}
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
              },
              {
                label: '删除项目',
                key: '4',
                danger: true,
                onClick: () => protectedAccess(
                  canEditProject,
                  () => {
                    Modal.confirm({
                      content: '确定要删除项目吗？',
                      onOk: () => {
                        projectApi.deleteProject(project.id as number).then(() => {
                          getProjectList().then(() => {
                            messageApi.success('删除成功');
                          });
                        }).catch(() => {
                          messageApi.error('删除失败');
                        });
                      }
                    });
                  }
                )
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
      const {data: starProjectList} = await projectApi.getStaredProjectList();
      setStaredProjectList((starProjectList ?? []).map(project => ({key: project.project.id, ...project})));
    }
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

  return (
    <div className="project-page w-full h-full px-12 flex flex-col">
      <div>
        <Title level={3} className="mt-6">项目概览</Title>
        <Divider />
      </div>
      <div className="w-full pb-24">
        <Row gutter={[16, 16]}>
          <Col flex="1 1 60%" className="w-screen">
            <Card
              title="星标项目"
              onActionBtnClick={
                (action) => action === 'refresh' && getProjectList()
              }
            >
              <div className="w-full h-[290px] overflow-y-auto">
                <Table
                  columns={
                    columns.filter((column) => (
                      !['startTime', 'updatedTime'].includes(column.key as string)
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
            <Card
              title="全部项目"
              onActionBtnClick={
                (action) => action === 'refresh' && getProjectList()
              }
            >
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
