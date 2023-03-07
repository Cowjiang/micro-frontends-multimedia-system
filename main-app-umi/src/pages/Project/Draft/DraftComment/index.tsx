import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useModel, useNavigate, useParams } from '@@/exports';
import { Avatar, Breadcrumb, Button, Col, Divider, List, Row, Tag, theme, Tour, Typography } from 'antd';
import { ProjectVo } from '@/services/api/modules/project/typings';
import { draftApi, projectApi } from '@/services/api';
import { ProjectContributionCommentVo, ProjectContributionVo } from '@/services/api/modules/draft/typings';
import { Editor } from 'tinymce';
import { formatDate, formatDraftType } from '@/utils/format';
import { DRAFT_RELEASE_CHANNEL } from '@/constants';
import Loading from '@/components/Loading';
import RichTextEditor from '@/components/RichTextEditor';
import Card from '@/components/Card';
import Empty from '@/components/Empty';

const {Title, Text} = Typography;
const {useToken} = theme;

const DraftCommentPage: React.FC = () => {
  const {projectId, draftType, draftId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorPrimary} = token;

  // 项目信息
  const [projectInfo, setProjectInfo] = useState<ProjectVo>();
  // 获取项目信息
  const getProjectInfo = async () => {
    if (projectId && !projectInfo) {
      const {data: projectInfo} = await projectApi.getProjectDetail(Number(projectId));
      setProjectInfo(projectInfo ?? undefined);
    }
  };

  // 稿件详情
  const [draftDetail, setDraftDetail] = useState<ProjectContributionVo>();
  const [draftDetailTemp, setDraftDetailTemp] = useState<ProjectContributionVo>();
  // 获取稿件详情
  const getDraftDetail = async () => {
    if (draftId && !draftDetailTemp) {
      await draftApi.getDraftDetail(draftId).then((res) => {
        setDraftDetail(res.data ?? undefined);
        setDraftDetailTemp(res.data ?? undefined);
      });
    }
  };

  // 稿件批注列表
  const [commentList, setCommentList] = useState<ProjectContributionCommentVo[]>([]);
  // 获取稿件批注列表
  const getDraftCommentList = async () => {
    if (draftId && !commentList.length) {
      await draftApi.getDraftCommentList(draftId).then((res) => {
        setCommentList(res.data ?? []);
      });
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/draft/comment/')) {
      Promise.all([getProjectInfo(), getDraftDetail(), getDraftCommentList()]).then(() => {});
    }
  }, [draftType, draftId]);

  const editorRef = useRef<Editor | null>(null);
  const [loading, setLoading] = useState(true);

  const editorContainerRef = useRef(null);
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="draft-detail-page w-full h-full px-16 flex flex-col">
      <div>
        <Breadcrumb className="!mt-2">
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/${projectId}/detail`)}>
              {projectInfo?.project.projectName ?? ''}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/${projectId}/draft/list`)}>
              稿件
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{draftDetail?.projectContribution?.name ?? ''}</Breadcrumb.Item>
          <Breadcrumb.Item>审批</Breadcrumb.Item>
        </Breadcrumb>
        <div className="w-full flex items-center">
          <div className="flex flex-col">
            <Title level={3} className="mt-6">
              <Tag
                className="!mr-4 !text-lg"
                color={formatDraftType(draftDetail?.projectContribution?.type ?? '').color}
              >
                {formatDraftType(draftDetail?.projectContribution?.type ?? '').tag}稿件
              </Tag>
              {draftDetail?.projectContribution?.name ?? ''}
            </Title>
            <Text type="secondary">
              发布渠道：
              {
                JSON.parse(draftDetail?.projectContribution?.channels ?? '[]').map((channel: string) => {
                  const defaultChannel = DRAFT_RELEASE_CHANNEL.find(c => c.value === channel);
                  return (
                    <Tag
                      className="!mt-1"
                      color={defaultChannel?.color ?? colorPrimary}
                    >
                      {defaultChannel?.label ?? channel}
                    </Tag>
                  );
                })
              }
            </Text>
          </div>
          <div className="ml-auto flex flex-col">
            <div className="flex ml-auto mt-2">
              <Button
                danger
                type="primary"
              >
                提交审批
              </Button>
            </div>
            <Text className="!ml-auto !mt-6" type="secondary">
              上次编辑：{formatDate(draftDetail?.projectContribution?.updatedTime ?? '')}
            </Text>
          </div>
        </div>
        <Divider />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          {
            draftType === 'article' && (
              <Loading
                spinning={loading}
                size="large"
              >
                <div className="h-[70vh]" ref={editorContainerRef}>
                  <RichTextEditor
                    init={{
                      height: '100%',
                      language: 'zh-Hans',
                      skin: darkTheme ? 'oxide-dark' : 'oxide',
                      content_css: darkTheme ? 'dark' : 'default',
                      content_style: 'p { font-size:15px }',
                      toolbar: false,
                      statusbar: false
                    }}
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                      setLoading(false);
                    }}
                    initialValue={draftDetail?.projectContribution?.content ?? ''}
                    disabled
                  />
                </div>
              </Loading>
            )
          }
        </Col>
        <Col span={10}>
          <Card title="审批管理">
            <Button type="primary" size="large" onClick={() => setTourOpen(true)}>
              添加批注
            </Button>
            <Button className="ml-4" type="primary" size="large" ghost>
              审批意见
            </Button>
          </Card>
          <div className="h-4"></div>
          <Card title="批注列表">
            <div className="h-[45vh] overflow-auto">
              <List
                dataSource={commentList}
                renderItem={(item) => (
                  <List.Item className="!px-0">
                    <List.Item.Meta
                      avatar={<Avatar size="large" src={item.userProfile?.avgPath ?? ''} />}
                      title={item.userProfile?.username ?? ''}
                      description={formatDate(item.projectContributionComment?.createdTime ?? '')}
                    />
                    {item.projectContributionComment?.content ?? ''}
                  </List.Item>
                )}
                locale={{
                  emptyText: <div className="py-32"><Empty /></div>
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <div className="w-full pt-36"></div>
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={[{
        title: '选择稿件内容',
        description: '请先选中任意稿件内容，再点击添加批注',
        target: () => editorContainerRef.current
      }]} />
    </div>
  );
};

export default DraftCommentPage;
