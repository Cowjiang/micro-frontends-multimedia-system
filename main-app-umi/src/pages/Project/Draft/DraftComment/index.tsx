import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useModel, useNavigate, useParams, useSelector } from '@@/exports';
import { Avatar, Breadcrumb, Button, Col, Divider, Input, List, Modal, Row, Tag, theme, Tour, Typography } from 'antd';
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
import { UserModelState } from '@/models/user';

const {Title, Text} = Typography;
const {useToken} = theme;

const DraftCommentPage: React.FC = () => {
  const {projectId, draftType, draftId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {messageApi} = useModel('messageApi');
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorPrimary, colorError} = token;

  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

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
  const [inputModalOpen, setInputModalOpen] = useState(false);

  // 添加批注
  const addComment = () => {
    const sel = editorRef.current?.selection.getSel();
    if (sel?.type !== 'Range') {
      messageApi.warning('请先选中内容');
      return;
    }
    draftId && draftApi.addDraftComment({
      content: '新批注',
      contributionId: draftId
    }).then(res => {
      if (res.data?.id) {
        createCommentLinkById(res.data.id);
        setCommentList([{
          projectContributionComment: res.data,
          userProfile: userInfo
        }, ...commentList]);
        messageApi.success('添加成功');
      }
    }).catch(err => {
      messageApi.error('添加失败');
    });
  };

  // 移除批注
  const removeComment = (id?: number | string) => {
    if (id) {
      draftApi.removeDraftComment(id).then(async res => {
        removeCommentLinkById(id);
        const commentIndex = commentList.findIndex(comment => comment.projectContributionComment?.id === id);
        const newCommentList = [...commentList];
        commentIndex !== -1 && newCommentList.splice(commentIndex, 1);
        setCommentList(newCommentList);
        messageApi.success('移除成功');
      }).catch(err => {
        messageApi.error('移除失败');
      });
    }
  };

  // 修改批注
  const editComment = () => {
    const id = currentComment?.id;
    if (id && draftId) {
      draftApi.updateDraftComment({
        id: Number(id),
        content: currentComment.content ?? '',
        contributionId: draftId
      }).then(async res => {
        const newCommentList = commentList.map(comment => {
          if (comment.projectContributionComment?.id === id) {
            return {
              ...comment,
              projectContributionComment: {
                ...comment.projectContributionComment,
                content: currentComment.content ?? ''
              }
            };
          } else return comment;
        });
        setCommentList([...newCommentList]);
        messageApi.success('修改成功');
      }).catch(err => {
        messageApi.error('修改失败');
      }).finally(() => {
        setInputModalOpen(false);
        setCurrentComment({});
      });
    }
  };

  // 创建批注链接
  const createCommentLinkById = (id: string | number) => {
    editorRef.current?.execCommand('CreateLink', false, '#flag');
    const ownerDocument = editorRef.current?.getBody().ownerDocument;
    const result = ownerDocument?.evaluate(
      '//a[@href=\'#flag\']',
      ownerDocument.body,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    if (result) {
      let node;
      const elementList: HTMLElement[] = [];
      while (node = result.iterateNext()) {
        node.nodeType === Node.ELEMENT_NODE && elementList.push(node as HTMLElement);
      }
      elementList.forEach(element => {
        element.setAttribute('name', 'comment');
        element.setAttribute('data-comment-id', String(id));
        element.setAttribute('href', '#none');
        // element.addEventListener('click', handleCommentClick);
      });
    }
  };

  // 移除批注链接
  const removeCommentLinkById = (id: string | number) => {
    editorRef.current?.execCommand('Unlink');
    if (id !== 0) {
      let elementToUnlink: HTMLElement[] = [];
      editorRef.current?.getBody().ownerDocument.getElementsByName('comment').forEach((element) => {
        if (eval(element.getAttribute('data-comment-id') ?? '0') === id) {
          elementToUnlink.push(element);
        }
      });
      for (const element of elementToUnlink) {
        editorRef.current?.selection.select(element);
        editorRef.current?.execCommand('Unlink');
      }
    }
  };

  // 当前选中批注
  const [currentComment, setCurrentComment] = useState<{ id?: number; content?: string; }>({});
  // const handleCommentClick = (event: MouseEvent) => {
  //   const element = event.target as Element;
  //   setCurrentComment(eval(element.getAttribute('data-mce-id') ?? '0'));
  // };

  return (
    <div className="draft-comment-page w-full h-full px-16 flex flex-col">
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
            {
              title: (
                <a onClick={() => navigate(`/project/${projectId}/draft/detail/${draftType}/${draftId}`)}>
                  {draftDetail?.projectContribution?.name ?? ''}
                </a>
              )
            },
            {title: '审批'}
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
                      key={channel}
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
          <Card wrapperStyle={{height: '100%'}}>
            {
              draftType === 'article' && (
                <Loading
                  spinning={loading}
                  size="large"
                >
                  <div ref={editorContainerRef}>
                    <RichTextEditor
                      init={{
                        height: '100%',
                        language: 'zh-Hans',
                        skin: darkTheme ? 'oxide-dark' : 'oxide',
                        content_css: darkTheme ? 'dark' : 'default',
                        content_style: 'p { font-size:15px }',
                        menubar: false,
                        toolbar: false,
                        statusbar: false,
                        inline: true
                      }}
                      onInit={(evt, editor) => {
                        editorRef.current = editor;
                        setLoading(false);
                      }}
                      initialValue={draftDetail?.projectContribution?.content ?? ''}
                      // disabled
                    />
                  </div>
                </Loading>
              )
            }
            {
              draftType === 'media' && (
                <div className="w-full h-[60vh] flex justify-center items-center">
                  <i className="fi fi-sr-play text-6xl" style={{color: colorPrimary}} />
                  <div className="ml-6 flex flex-col items-center">
                    <Text type="secondary">共一个音视频文件</Text>
                    <div className="w-full flex justify-between mt-2">
                      <Text>
                        <a href={draftDetail?.projectContribution.mediaUrl} style={{color: colorPrimary}}>
                          查看
                        </a>
                      </Text>
                      <Text style={{color: colorPrimary}}>下载文件</Text>
                    </div>
                  </div>
                </div>
              )
            }
          </Card>
        </Col>
        <Col span={10} className="!flex flex-col">
          <Card title="审批管理">
            <div className="py-4">
              <Button type="primary" size="large" onClick={() => setTourOpen(true)}>
                添加批注
              </Button>
              <Button className="ml-4" type="primary" size="large" ghost>
                审批意见
              </Button>
            </div>
          </Card>
          <div className="h-4"></div>
          <Card title="批注列表" wrapperStyle={{flexGrow: 1}}>
            <div className="h-[45vh] overflow-auto">
              <List
                dataSource={commentList}
                renderItem={(item, index) => (
                  <List.Item
                    className="!px-0"
                    key={index}
                    actions={[
                      ...item.userProfile?.userId === userInfo.userId ? [
                        <a
                          style={{color: colorPrimary}}
                          onClick={() => {
                            setCurrentComment({
                              id: item.projectContributionComment?.id,
                              content: item.projectContributionComment?.content ?? ''
                            });
                            setInputModalOpen(true);
                          }}
                        >
                          编辑
                        </a>,
                        <a
                          style={{color: colorError}}
                          onClick={() => removeComment(item.projectContributionComment?.id)}
                        >
                          删除
                        </a>
                      ] : []
                    ]}
                  >
                    <div className="w-full">
                      <List.Item.Meta
                        avatar={<Avatar size="large" src={item.userProfile?.avgPath ?? ''} />}
                        title={item.userProfile?.username ?? '未知用户'}
                        description={formatDate(item.projectContributionComment?.createdTime ?? '')}
                      />
                      <div className="my-2">{item.projectContributionComment?.content ?? ''}</div>
                    </div>
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
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={[{
          title: '选择稿件内容',
          description: '请先选中任意稿件内容，再点击添加批注',
          placement: 'rightBottom',
          nextButtonProps: {
            children: '添加批注',
            onClick: addComment
          },
          target: () => editorContainerRef.current
        }]}
      />
      <Modal
        title="修改批注"
        centered
        open={inputModalOpen}
        onOk={editComment}
        onCancel={() => setInputModalOpen(false)}
      >
        <div className="py-4">
          <Input.TextArea
            autoSize={{minRows: 2, maxRows: 5}}
            size="large"
            placeholder="请填写项批注内容"
            value={currentComment?.content ?? ''}
            onChange={e => setCurrentComment({...currentComment, content: e.target.value})}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DraftCommentPage;
