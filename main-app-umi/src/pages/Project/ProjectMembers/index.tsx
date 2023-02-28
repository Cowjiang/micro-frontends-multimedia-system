import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Popconfirm,
  Row,
  Skeleton,
  Tag,
  theme,
  Typography
} from 'antd';
import { useModel, useNavigate, useParams } from '@@/exports';
import { ProjectMemberVo, ProjectVo } from '@/services/api/modules/project/typings';
import { projectApi } from '@/services/api';
import { useSetDocTitle } from '@/utils/hooks';

const {useToken} = theme;
const {Title, Text} = Typography;

const ProjectMembersPage = () => {
  const {id: projectId} = useParams();
  const navigate = useNavigate();

  const {token} = useToken();
  const {messageApi} = useModel('messageApi');

  // 项目信息
  const [projectInfo, setProjectInfo] = useState<ProjectVo>();
  // 获取项目信息
  const getProjectInfo = async () => {
    if (projectId) {
      const {data: projectInfo} = await projectApi.getProjectDetail(Number(projectId));
      setProjectInfo(projectInfo ?? undefined);
    }
  };

  // 项目成员列表
  const [projectMemberList, setProjectMemberList] = useState<ProjectMemberVo[]>();
  const getProjectMembers = async () => {
    if (projectId) {
      const {data: projectMembers} = await projectApi.getProjectMember(Number(projectId));
      setProjectMemberList(projectMembers ?? []);
    }
  };

  useEffect(() => {
    Promise.all([getProjectInfo(), getProjectMembers()]).then(() => {
      // setLoading(false);
    });
  }, []);
  useSetDocTitle(`项目成员 - ${projectInfo?.project.projectName}`);

  // 编辑状态
  const [editStatus, setEditStatus] = useState(false);

  // 移除项目成员
  const removeProjectMember = (userId?: number) => {
    if (userId && projectId) {
      projectApi.deleteProjectMember({
        projectId: Number(projectId),
        userId
      }).then(async res => {
        messageApi.success('移除成功');
        await getProjectMembers();
      }).catch(err => {
        messageApi.error('移除失败');
      });
    }
  };

  return (
    <div className="project-detail-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb className="!mt-2">
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/list`)}>
              项目列表
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/${projectId}/detail`)}>
              {projectInfo?.project.projectName}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>成员</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-full flex items-center">
        <div>
          <Title level={3} className="mt-6">项目成员 - {projectInfo?.project.projectName}</Title>
          <Tag color={token.colorPrimary}>
            {projectMemberList?.length ?? 0} 个部门
          </Tag>
          <Tag color={token.colorPrimary}>
            {
              projectMemberList
                ?.map(department => department.userProfileList?.length ?? 0)
                .reduce((prev, cur) => prev + cur)
            } 名成员
          </Tag>
        </div>
        <div className="ml-auto flex">
          <Button
            className="mr-4"
            type="primary"
            ghost
          >
            新增成员
          </Button>
          <Button type="primary" onClick={() => setEditStatus(!editStatus)}>
            {editStatus ? '完成' : '编辑成员'}
          </Button>
        </div>
      </div>
      <Divider />
      <div>
        {
          projectMemberList?.map(member => (
            <div className="w-full mb-8" key={member.department?.id}>
              <Title level={5}>{member.department?.name}</Title>
              <div className="w-full mt-2">
                <Row gutter={[16, 16]}>
                  {
                    member.userProfileList?.map(user => (
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={6} key={user.userId}>
                        <Card
                          actions={(() => {
                            const actionList = [
                              <Text type="secondary">
                                <i className="fi fi-sr-comment-info" />
                              </Text>,
                              <Text type="secondary">
                                <i className="fi fi-sr-comment" />
                              </Text>
                            ];
                            return editStatus
                              ? [
                                ...actionList,
                                <Popconfirm
                                  title="移除成员"
                                  description="你确定要移除该成员吗?"
                                  onConfirm={() => removeProjectMember(user.userId)}
                                >
                                  <Text type="danger">
                                    <i className="fi fi-sr-cross" />
                                  </Text>
                                </Popconfirm>
                              ]
                              : actionList;
                          })()}
                        >
                          <Skeleton loading={false} avatar={{size: 'large'}} paragraph={{rows: 1}} active>
                            <Card.Meta
                              avatar={<Avatar size="large" src={user.avgPath} />}
                              title={user.username}
                              description={`${member.department?.name ?? ''}部门`}
                            />
                          </Skeleton>
                        </Card>
                      </Col>
                    ))
                  }
                </Row>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ProjectMembersPage;
