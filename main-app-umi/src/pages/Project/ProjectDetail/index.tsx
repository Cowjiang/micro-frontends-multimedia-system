import React, { useMemo } from 'react';
import './index.less';
import { Col, Divider, List, Row, Tabs, TabsProps, Tag, theme, Typography } from 'antd';
import { useModel, useNavigate } from '@@/exports';
import Card from '@/components/Card';
import Empty from '@/components/Empty';
import { formatDate } from '@/utils/format';
import { PRIMARY_COLOR } from '@/constants';
import { useSetDocTitle } from '@/utils/hooks';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';
import { useSize } from 'ahooks';

const {useToken} = theme;
const {Title, Text} = Typography;

const ProjectDetailPage: React.FC = () => {
  const {token} = useToken();
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const bodySize = useSize(document.body);
  const {
    colorPrimary,
    colorPrimaryActive,
    colorPrimaryBgHover,
    colorPrimaryBorder,
    colorPrimaryBorderHover,
    colorFillQuaternary,
    colorFillSecondary,
    colorFillTertiary,
    colorText
  } = token;

  const projectInfo = {
    username: '破壁机',
    projectName: '大美湾区科技之美',
    projectDesc: '第31届夏季奥林匹克运动会(Gamesof he xxX/ 0mpiad)，又称2016年里约热内运会，2016年8月5日到2016年8月21日在巴西里约热内卢举行201年里约热内卢奥运会主会场是马拉卡纳体育场，举办竞选2016年奥运会申办进程于2007年5月16日启动，所有国际奥林匹克委员会成员国所管辖范围内城市向国..',
    tags: ['爆炸', '竞技'],
    startTime: formatDate(String(Date.now())),
    endTime: formatDate(String(Date.now())),
    updateTime: formatDate(String(Date.now())),
    status: ['进行中']
  };
  useSetDocTitle(`项目详情 - ${projectInfo.projectName}`);

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
        <Title level={3}>项目详情 - 大美湾区科技之美</Title>
        {
          projectInfo.tags.map(status => (
            <Tag color={PRIMARY_COLOR} key={status}>
              {status}
            </Tag>
          ))
        }
        <Divider />
      </div>
      <div className="w-full pb-24">
        <Row gutter={[16, 16]}>
          <Col flex="1 1 500px">
            <Card title="项目信息">
              <div className="w-full h-[300px] overflow-y-auto">
                <Row className="mb-4">
                  <Col span={4}><Text strong>负责人：</Text></Col>
                  <Col span={20}>{projectInfo.username}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>项目状态：</Text></Col>
                  <Col span={20}>
                    {
                      projectInfo.status.map(status => (
                        <Tag color="green" key={status}>
                          {status}
                        </Tag>
                      ))
                    }
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>项目描述：</Text></Col>
                  <Col span={20}>{projectInfo.projectDesc}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>开始时间：</Text></Col>
                  <Col span={20}>{projectInfo.startTime}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>结束时间：</Text></Col>
                  <Col span={20}>{projectInfo.endTime}</Col>
                </Row>
                <Row className="mb-4">
                  <Col span={4}><Text strong>上次更新：</Text></Col>
                  <Col span={20}>{projectInfo.updateTime}</Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col flex="1 1 40%" className="w-screen min-w-[500px]">
            <Card title="项目构成">
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
            <Card title="稿件列表">
              <div className="w-full h-[300px] flex flex-col overflow-y-auto">
                <Tabs className="!h-auto" defaultActiveKey="1" items={items} />
                <List
                  dataSource={[
                    'Racing car sprays burning fuel into crowd.',
                    'Japanese princess to wed commoner.',
                    'Australian walks 100km after outback crash.',
                    'Man charged over missing wedding girl.',
                    'Los Angeles battles huge wildfires.',
                    'Los Angeles battles huge wildfires.',
                    'Los Angeles battles huge wildfires.',
                    'Los Angeles battles huge wildfires.',
                    'Los Angeles battles huge wildfires.'
                  ]}
                  renderItem={(item) => (
                    <List.Item className="!px-0">
                      <Tag color={PRIMARY_COLOR}>H5</Tag>{item}
                    </List.Item>
                  )}
                  locale={{
                    emptyText: <div className="pt-12"><Empty /></div>
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 40%">
            <Card title="资源库">
              <div className="w-full h-[300px] flex flex-col overflow-y-auto">
                <Tabs className="!h-auto" defaultActiveKey="1" items={items} />
                <List
                  dataSource={[]}
                  locale={{
                    emptyText: <div className="pt-12"><Empty /></div>
                  }}
                  renderItem={(item) => (
                    <List.Item className="!px-0">
                      <Tag color={PRIMARY_COLOR}>H5</Tag>{item}
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
          <Col flex="1 1 100%">
            <Card title="操作历史">
              <div className="w-full min-h-[280px]">

              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
