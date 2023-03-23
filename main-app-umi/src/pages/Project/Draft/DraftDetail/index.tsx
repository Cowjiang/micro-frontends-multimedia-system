import React, { useEffect, useRef, useState } from 'react';
import { ProjectContribution, ProjectContributionVo } from '@/services/api/modules/draft/typings';
import { draftApi, projectApi } from '@/services/api';
import { useLocation, useModel, useNavigate, useParams } from '@@/exports';
import { Avatar, Breadcrumb, Button, Card as AntdCard, Divider, QRCode, Tag, theme, Typography } from 'antd';
import { ProjectVo } from '@/services/api/modules/project/typings';
import { DRAFT_RELEASE_CHANNEL } from '@/constants';
import { formatDate, formatDraftType } from '@/utils/format';
import RichTextEditor from '@/components/RichTextEditor';
import { Editor } from 'tinymce';
import Loading from '@/components/Loading';
import Card from '@/components/Card';
import Empty from '@/components/Empty';
import messageApi from '@/models/messageApi';

const {Title, Text} = Typography;
const {useToken} = theme;

const DraftDetailPage: React.FC = () => {
  const {projectId, draftType, draftId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {messageApi} = useModel('messageApi');

  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorPrimary, colorFillQuaternary} = token;

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

  useEffect(() => {
    if (location.pathname.includes('/draft/detail/')) {
      Promise.all([getProjectInfo(), getDraftDetail()]).then(() => {});
    }
  }, [draftType, draftId]);

  const editorRef = useRef<Editor | null>(null);
  const [loading, setLoading] = useState(true);

  // 部署H5
  const handleDeployH5 = () => {
    setLoading(true);
    draftId && draftApi.deployPreviewH5(draftId).then(() => {
      messageApi.success('正在部署，请等待一分钟后刷新');
    }).catch(err => {
      messageApi.error('部署失败');
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="draft-detail-page w-full h-full px-16 flex flex-col">
      <div>
        <Breadcrumb
          className="!mt-2"
          items={[
            {
              title: (
                <a onClick={() => navigate(`/project/${projectId}/detail`)}>
                  {projectInfo?.project.projectName ?? ''}
                </a>
              )
            },
            {title: <a onClick={() => navigate(`/project/${projectId}/draft/list`)}>稿件</a>},
            {title: draftDetail?.projectContribution?.name ?? ''}
          ]}
        />
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
                JSON.parse(draftDetail?.projectContribution?.channels || '[]').map((channel: string) => {
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
                className="mr-4"
                type="primary"
                ghost
                onClick={() => navigate(`/project/${projectId}/draft/comment/${draftType}/${draftId}`)}
              >
                稿件批注
              </Button>
              <Button
                className="mr-4"
                type="primary"
                ghost
              >
                操作历史
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(`/project/${projectId}/draft/edit/${draftType}/${draftId}`)}
              >
                编辑稿件
              </Button>
            </div>
            <Text className="!ml-auto !mt-6" type="secondary">
              上次编辑：{formatDate(draftDetail?.projectContribution?.updatedTime ?? '')}
            </Text>
          </div>
        </div>
        <Divider />
      </div>
      <div>
        <Card>
          {
            draftType === 'article' && (
              <Loading
                spinning={loading}
                size="large"
              >
                <div className="min-h-[40vh]">
                  <RichTextEditor
                    init={{
                      height: '100%',
                      language: 'zh-Hans',
                      inline: true,
                      skin: darkTheme ? 'oxide-dark' : 'oxide',
                      content_css: darkTheme ? 'dark' : 'default',
                      content_style: 'p { font-size:15px }'
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
          {
            draftType === 'media' && (
              <div className="w-full h-[30vh] flex justify-center items-center">
                <i className="fi fi-sr-play text-7xl" style={{color: colorPrimary}} />
                <div className="ml-6 flex flex-col items-center">
                  <Text type="secondary">共一个音视频文件</Text>
                  <div className="w-full flex justify-between mt-2">
                    <Text>
                      <a href={draftDetail?.projectContribution.mediaUrl} style={{color: colorPrimary}}>查看</a>
                    </Text>
                    <Text style={{color: colorPrimary}}>下载文件</Text>
                  </div>
                </div>
                {
                  draftDetail?.projectContribution.mediaUrl && (<>
                    <Divider type="vertical" className="!h-24 !mx-12" />
                    <QRCode
                      value={draftDetail.projectContribution.mediaUrl}
                      size={110}
                      bordered={false}
                      color={colorPrimary}
                      style={{background: darkTheme ? colorFillQuaternary : '#fff'}}
                    />
                  </>)
                }
              </div>
            )
          }
          {
            draftType === 'h5' && (
              <div className="w-full h-[30vh] flex justify-center items-center">
                <i className="fi fi-br-link-alt text-7xl" style={{color: colorPrimary}} />
                <div className="ml-6 flex flex-col items-center">
                  <Text type="secondary">共一个 H5 项目文件</Text>
                  <div className="w-full flex justify-between mt-2">
                    <Text>
                      <a href={draftDetail?.projectContribution.content} style={{color: colorPrimary}}>预览</a>
                    </Text>
                    <Text style={{color: colorPrimary}}>
                      <a href={draftDetail?.projectContribution.mediaUrl} style={{color: colorPrimary}}>下载源码</a>
                    </Text>
                  </div>
                </div>
                {
                  draftDetail?.projectContribution.mediaUrl && (<>
                    <Divider type="vertical" className="!h-24 !mx-12" />
                    {
                      draftDetail?.projectContribution.content
                        ? <QRCode
                          value={draftDetail.projectContribution.content}
                          size={110}
                          bordered={false}
                          color={colorPrimary}
                        />
                        : <Button
                          type="primary"
                          size="large"
                          onClick={handleDeployH5}
                        >
                          生成预览链接
                        </Button>
                    }
                  </>)
                }
              </div>
            )
          }
        </Card>
        <div className="h-4"></div>
        <Card
          title="稿件作者"
          loadingOptions={{avatar: true}}
        >
          <AntdCard.Meta
            avatar={<Avatar size="large" src={draftDetail?.creatorInfo.avgPath ?? ''} />}
            title={draftDetail?.creatorInfo.username ?? ''}
            description={`稿件创建时间：${formatDate(draftDetail?.projectContribution.createdTime ?? '')}`}
          />
        </Card>
        <div className="h-4"></div>
        <Card title="审批记录">
          <div className="py-12">
            <Empty />
          </div>
        </Card>
        <div className="h-24"></div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
