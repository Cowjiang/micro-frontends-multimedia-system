import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Divider,
  List,
  Row,
  Tabs,
  TabsProps,
  Tag,
  theme,
  Timeline,
  Typography
} from 'antd';
import { useDispatch, useModel, useNavigate, useParams } from '@@/exports';
import Card from '@/components/Card';
import Empty from '@/components/Empty';
import { useSetDocTitle } from '@/utils/hooks';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { draftApi, projectApi } from '@/services/api';
import { ProjectMemberVo, ProjectVo } from '@/services/api/modules/project/typings';
import dayjs from 'dayjs';
import { DraftType, ProjectContributionVo } from '@/services/api/modules/draft/typings';
import { formatDate, formatDraftType } from '@/utils/format';
import { OperationHistoryVo } from '@/services/typings';
import OperationHistory from '@/components/OperationHistory';

const {useToken} = theme;
const {Title, Text} = Typography;

// 稿件列表标签
const draftTabsItems: TabsProps['items'] = [
  {
    key: '1',
    label: `全部稿件`
  }, {
    key: '2',
    label: `图文`
  }, {
    key: '3',
    label: `H5`
  }, {
    key: '4',
    label: `音视频`
  }, {
    key: '5',
    label: `其它`
  }
];

const ProjectDetailPage: React.FC = () => {
  const {id: projectId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {darkTheme} = useModel('theme');
  const [loading, setLoading] = useState(true);

  const {token} = useToken();
  const {
    colorPrimary,
    colorPrimaryActive,
    colorPrimaryBgHover,
    colorPrimaryBorder,
    colorPrimaryBorderHover,
    colorText,
    colorPrimaryText
  } = token;

  // 项目信息
  const [projectInfo, setProjectInfo] = useState<ProjectVo>();
  // 获取项目信息
  const getProjectInfo = async () => {
    if (projectId) {
      const {data: projectInfo} = await projectApi.getProjectDetail(Number(projectId));
      setProjectInfo(projectInfo ?? undefined);
    }
  };

  //稿件列表
  const [draftList, setDraftList] = useState<ProjectContributionVo[]>([]);
  // 获取稿件列表
  const getDraftList = async () => {
    if (projectId) {
      const {data: draftList} = await draftApi.getProjectDraftList(projectId);
      setDraftList(draftList ?? []);
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

  // 项目操作历史
  const [projectOperationHistory, setProjectOperationHistory] = useState<OperationHistoryVo[]>([]);
  // 获取项目信息
  const getProjectOperationHistory = async () => {
    if (projectId) {
      const {data} = await projectApi.getOperationHistory(Number(projectId));
      setProjectOperationHistory(data?.records ?? []);
    }
  };

  useEffect(() => {
    Promise.all([getProjectInfo(), getDraftList(), getProjectMembers(), getProjectOperationHistory()]).then(() => {
      setLoading(false);
    });
  }, []);
  useSetDocTitle(`项目详情 - ${projectInfo?.project.projectName}`);

  const chartBaseOption: EChartsOption = {
    title: {
      left: 'center',
      top: 0,
      textStyle: {
        color: colorText,
        fontSize: 15,
        fontWeight: 'bold'
      }
    },
    darkMode: darkTheme,
    tooltip: {trigger: 'item'},
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: {color: colorText}
    }
  };

  const memberChartOption: EChartsOption = useMemo(() => ({
    ...chartBaseOption,
    title: {
      ...chartBaseOption.title,
      text: '部门参与人数'
    },
    series: [
      {
        name: '参与人数',
        type: 'pie',
        color: [
          colorPrimary,
          colorPrimaryActive,
          colorPrimaryBgHover,
          colorPrimaryBorder,
          colorPrimaryBorderHover
        ],
        radius: ['25%', '55%'],
        center: ['50%', '46%'],
        label: {backgroundColor: 'transparent'},
        data: projectMemberList?.map(d => ({
          name: d.department?.name ?? '',
          value: d.userProfileList?.length ?? 0
        }))
      }
    ]
  }), [projectMemberList, token]);

  const draftChartOption: EChartsOption = useMemo(() => ({
    ...chartBaseOption,
    title: {
      ...chartBaseOption.title,
      text: '稿件构成'
    },
    series: [
      {
        name: '稿件数',
        type: 'pie',
        color: [
          colorPrimary,
          colorPrimaryActive,
          colorPrimaryBgHover,
          colorPrimaryBorder,
          colorPrimaryBorderHover
        ],
        radius: ['25%', '55%'],
        center: ['50%', '46%'],
        label: {backgroundColor: 'transparent'},
        data: [DraftType.ARTICLE, DraftType.HTML5, DraftType.MEDIA].map(draftType => ({
          name: formatDraftType(draftType).tag,
          value: draftList.filter(draft => draft.projectContribution?.type === draftType).length
        }))
      }
    ]
  }), [draftList, token]);

  return (
    <div className="project-detail-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb
          className="!mt-2"
          items={[
            {title: <a onClick={() => navigate(`/project/list`)}>项目列表</a>},
            {title: projectInfo?.project.projectName}
          ]}
        />
        <div className="w-full flex items-center">
          <div>
            <Title level={3} className="mt-6">项目详情 - {projectInfo?.project.projectName}</Title>
            {/*{*/}
            {/*  projectInfo.tags.map(status => (*/}
            {/*    <Tag color={PRIMARY_COLOR} key={status}>*/}
            {/*      {status}*/}
            {/*    </Tag>*/}
            {/*  ))*/}
            {/*}*/}
            <Tag color={colorPrimary}>
              项目标签
            </Tag>
          </div>
          <div className="ml-auto flex">
            <Button
              className="mr-4"
              type="primary"
              ghost
              onClick={() => navigate(`/project/${projectId}/member/list`)}
            >
              项目成员
            </Button>
            <Button
              className="mr-4"
              type="primary"
              onClick={() => navigate(`/project/edit/${projectId}`, {replace: true})}
            >
              编辑项目
            </Button>
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: 'app/setChatAppConfig',
                  payload: {
                    chatAppConfig: {
                      url: `http://localhost:3000/chat/home/chat/group/${projectInfo?.project.groupId}`,
                      open: true
                    }
                  }
                });
              }}
            >
              进入群聊
            </Button>
          </div>
        </div>
        <Divider />
      </div>
      <div className="w-full pb-24">
        <Row gutter={[16, 16]}>
          <Col flex="1 1 500px">
            <Card
              title="项目信息"
              loading={loading}
              loadingOptions={{paragraph: {rows: 7}}}
              onActionBtnClick={
                (action) => action === 'refresh' && getProjectInfo()
              }
            >
              <div className="w-full h-[300px] overflow-y-auto">
                <Row className="mb-4">
                  <Col span={4}><Text strong>负责人：</Text></Col>
                  <Col span={20}>{projectInfo?.charge.username}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>项目状态：</Text></Col>
                  <Col span={20}>
                    {/*{*/}
                    {/*  projectInfo.status.map(status => (*/}
                    {/*    <Tag color="green" key={status}>*/}
                    {/*      {status}*/}
                    {/*    </Tag>*/}
                    {/*  ))*/}
                    {/*}*/}
                    <Tag color="green">
                      {projectInfo?.project.stat ?? '进行中'}
                    </Tag>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>项目描述：</Text></Col>
                  <Col span={20}>{projectInfo?.project.projectDesc}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>开始时间：</Text></Col>
                  <Col span={20}>
                    {dayjs(projectInfo?.project.startTime ?? '').format('YYYY年MM月DD日 hh:mm')}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>结束时间：</Text></Col>
                  <Col span={20}>
                    {dayjs(projectInfo?.project.endTime ?? '').format('YYYY年MM月DD日 hh:mm')}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>上次更新：</Text></Col>
                  <Col span={20}>
                    {dayjs(projectInfo?.project.updatedTime ?? '').format('YYYY年MM月DD日 hh:mm')}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col flex="1 1 40%" className="w-screen min-w-[500px]">
            <Card
              title="项目构成"
              loading={loading}
              loadingOptions={{paragraph: {rows: 7}}}
            >
              <div className="w-full h-[300px] overflow-y-auto flex">
                <div className="w-full flex-grow">
                  <ReactECharts
                    option={memberChartOption}
                  />
                </div>
                <div className="w-12 flex-shrink-0"></div>
                <div className="w-full flex-grow">
                  <ReactECharts
                    option={draftChartOption}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col flex="1 1 60%">
            <Card
              title="稿件列表"
              loading={loading}
              loadingOptions={{paragraph: {rows: 6}}}
              onActionBtnClick={
                (action) => {
                  action === 'more' && navigate(`/project/${projectId}/draft/list`);
                  action === 'refresh' && getDraftList();
                }
              }
            >
              <div className="w-full h-[300px] flex flex-col overflow-y-auto">
                <Tabs
                  className="!h-auto"
                  defaultActiveKey="1"
                  items={
                    draftTabsItems.map((item, index) => ({
                      ...item,
                      children: (
                        <List
                          dataSource={
                            draftList.filter(draft => {
                              switch (index) {
                                case 0:
                                  return draft;
                                case 1:
                                  return draft.projectContribution?.type === 'ARTICLE';
                                case 2:
                                  return draft.projectContribution?.type === 'HTML5';
                                case 3:
                                  return draft.projectContribution?.type === 'MEDIA';
                              }
                            }).map(draft => ({
                              id: draft.projectContribution?.id,
                              title: draft.projectContribution?.name,
                              type: draft.projectContribution?.type
                            }))
                          }
                          renderItem={(item) => (
                            <List.Item
                              className="!px-0"
                              onClick={() => navigate(`/project/${projectId}/draft/detail/${formatDraftType(item.type ?? '').value}/${item.id}`)}
                            >
                              <div className="w-full flex">
                                <Tag color={formatDraftType(item.type ?? '').color}>
                                  {formatDraftType(item.type ?? '').tag}
                                </Tag>
                                <Text className="cursor-pointer">{item.title}</Text>
                                <a className="ml-auto" style={{color: colorPrimaryText}}>查看稿件</a>
                              </div>
                            </List.Item>
                          )}
                          locale={{
                            emptyText: <div className="pt-12"><Empty /></div>
                          }}
                        />
                      )
                    }))
                  }
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 40%">
            <Card
              title="资源库"
              loading={loading}
              loadingOptions={{paragraph: {rows: 6}}}
            >
              <div className="w-full h-[300px] flex flex-col overflow-y-auto">
                <div className="pt-12">
                  <Empty
                    description={
                      <Button
                        className="mt-4"
                        type="primary"
                        onClick={() => navigate(`/resource/list/mfms-material/${encodeURIComponent(`project/${projectId}`)}`)}
                      >
                        进入素材库
                      </Button>
                    }
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col flex="1 1 100%">
            <Card
              title="操作历史"
              loading={loading}
              loadingOptions={{paragraph: {rows: 6}}}
            >
              <div className="w-full min-h-[200px] flex items-center justify-center">
                <OperationHistory
                  operationHistory={[
                    {
                      createdTime: dayjs(projectInfo?.project.createdTime ?? '').toDate(),
                      comment: '创建了此项目',
                      userProfile: projectInfo?.creator
                    },
                    ...projectOperationHistory
                  ]}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
