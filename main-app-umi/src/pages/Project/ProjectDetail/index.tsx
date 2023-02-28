import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Divider, List, Row, Tabs, TabsProps, Tag, theme, Typography } from 'antd';
import { useModel, useNavigate, useParams } from '@@/exports';
import Card from '@/components/Card';
import Empty from '@/components/Empty';
import { useSetDocTitle } from '@/utils/hooks';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { draftApi, projectApi } from '@/services/api';
import { ProjectVo } from '@/services/api/modules/project/typings';
import dayjs from 'dayjs';
import { ProjectContributionVo } from '@/services/api/modules/draft/typings';
import { formatDraftType } from '@/utils/format';

const {useToken} = theme;
const {Title, Text} = Typography;

const ProjectDetailPage: React.FC = () => {
  const {id: projectId} = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    Promise.all([getProjectInfo(), getDraftList()]).then(() => {
      setLoading(false);
    });
  }, []);
  useSetDocTitle(`项目详情 - ${projectInfo?.project.projectName}`);

  const option: EChartsOption = {
    title: {
      text: '部门参与人数',
      left: 'center',
      top: 0,
      textStyle: {
        color: colorText,
        fontSize: 15,
        fontWeight: 'bold'
      }
    },
    darkMode: darkTheme,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: {
        color: colorText
      }
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
        label: {
          backgroundColor: 'transparent'
        },
        data: [
          {value: 1, name: '新媒体记者部'},
          {value: 4, name: '编辑部'},
          {value: 2, name: '策划部'},
          {value: 3, name: '设计部'},
          {value: 2, name: '技术与开发部'}
        ]
      }
    ]
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `全部稿件`
    },
    {
      key: '2',
      label: `图文`
    },
    {
      key: '3',
      label: `H5`
    },
    {
      key: '4',
      label: `音视频`
    },
    {
      key: '5',
      label: `其它`
    }
  ];

  return (
    <div className="project-detail-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb className="!mt-2">
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/list`)}>
              项目列表
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{projectInfo?.project.projectName}</Breadcrumb.Item>
        </Breadcrumb>
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
                      {projectInfo?.project.stat}
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
                    {dayjs(projectInfo?.project.updateTime ?? '').format('YYYY年MM月DD日 hh:mm')}
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
                    option={option}
                  />
                </div>
                <div className="w-12 flex-shrink-0"></div>
                <div className="w-full flex-grow">
                  <ReactECharts
                    option={option}
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
                    items.map((item, index) => ({
                      ...item,
                      children: (
                        <List
                          dataSource={
                            draftList.filter(draft => {
                              switch (index) {
                                case 0:
                                  return draft;
                                case 1:
                                  return draft.projectContribution.type === 'ARTICLE';
                                case 2:
                                  return draft.projectContribution.type === 'HTML5';
                                case 3:
                                  return draft.projectContribution.type === 'MEDIA';
                              }
                            }).map(draft => ({
                              id: draft.projectContribution.id,
                              title: draft.projectContribution.name,
                              type: draft.projectContribution.type
                            }))
                          }
                          renderItem={(item) => (
                            <List.Item className="!px-0">
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
                <Tabs className="!h-auto" defaultActiveKey="1" items={items} />
                <List
                  dataSource={[]}
                  locale={{
                    emptyText: <div className="pt-12"><Empty /></div>
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 100%">
            <Card
              title="操作历史"
              loading={loading}
              loadingOptions={{paragraph: {rows: 6}}}
            >
              <div className="w-full min-h-[280px]">
                <div className="pt-12"><Empty /></div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
