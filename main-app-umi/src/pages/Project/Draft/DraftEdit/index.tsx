import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { useLocation, useModel, useNavigate, useParams } from '@@/exports';
import { Affix, Button, Input, Radio, Select, Steps, theme, Typography, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { DRAFT_RELEASE_CHANNEL, DRAFT_TYPE_LABEL } from '@/constants';
import ArticleEdit from '@/pages/Project/Draft/DraftEdit/Article';
import { draftApi } from '@/services/api';
import { ProjectContribution } from '@/services/api/modules/draft/typings';
import H5Edit from '@/pages/Project/Draft/DraftEdit/H5';
import MediaEdit from '@/pages/Project/Draft/DraftEdit/Media';
import { formatDraftType } from '@/utils/format';
// import { useSetDocTitle } from '@/utils/hooks';

const {Title, Text} = Typography;
const {useToken} = theme;

const DraftEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {messageApi} = useModel('messageApi');

  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillQuaternary, colorFillSecondary, colorFillTertiary} = token;

  const {projectId, editAction, draftType, draftId} = useParams();
  useEffect(() => {
    if (location.pathname.includes('/draft/edit/') || location.pathname.includes('/draft/new/')) {
      if (editAction === 'edit') {
        getDraftDetail();
      }
    }
  }, [editAction, draftType, draftId]);
  const title = useMemo(() => {
    if (editAction && DRAFT_TYPE_LABEL && draftType) {
      return `${editAction === 'new' ? '新建' : '编辑'}${DRAFT_TYPE_LABEL[draftType ?? '']?.label ?? ''}稿件`;
    } else {
      return '新建稿件';
    }
  }, [editAction, DRAFT_TYPE_LABEL, draftType]);
  // useSetDocTitle(title)

  // 稿件详情
  const [draftDetail, setDraftDetail] = useState<ProjectContribution>();
  const [draftDetailTemp, setDraftDetailTemp] = useState<ProjectContribution>();
  // 获取稿件详情
  const getDraftDetail = () => {
    if (draftId && !draftDetailTemp) {
      draftApi.getDraftDetail(draftId).then((res) => {
        setDraftDetail(res.data?.projectContribution);
        setDraftDetailTemp(res.data?.projectContribution);
      });
    }
  };

  // 提交保存稿件
  const submitDraft = () => {
    if (editAction === 'edit') {
      draftApi.updateDraft(draftDetail as ProjectContribution).then(res => {
        messageApi.success('保存成功');
        navigate(`/project/${projectId}/draft/detail/${draftType}/${draftId}`, {replace: true});
      }).catch(() => {
        messageApi.error('保存失败');
      });
    } else if (projectId) {
      draftApi.addDraft({
        projectId,
        name: draftDetail?.name ?? '',
        content: draftDetail?.content ?? '',
        channels: draftDetail?.channels ?? '',
        type: DRAFT_TYPE_LABEL[draftType ?? ''].type ?? 'others'
      }).then(res => {
        messageApi.success('新建成功');
        res.data?.id && navigate(`/project/${projectId}/draft/detail/${draftType}/${res.data.id}`, {replace: true});
      }).catch(() => {
        messageApi.error('新建失败');
      });
    }
  };

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const headerContext = useMemo(() => (
    <>
      <Title level={1} className="mt-6">{title}</Title>
      <Steps
        className={classNames('h-full',
          containerSize?.width && containerSize.width >= 800 ? '!mt-8' : '!mt-2'
        )}
        current={currentFormIndex}
        onChange={setCurrentFormIndex}
        direction={containerSize?.width && containerSize.width < 800 ? 'horizontal' : 'vertical'}
        items={[
          {
            title: '填写稿件基本信息',
            description: '第一步'
          },
          {
            title: '编辑稿件内容',
            description: '第二步'
          },
          {
            title: '填写稿件详细信息',
            description: '第三步'
          }
        ]}
      />
    </>
  ), [containerSize, currentFormIndex]);

  return (
    <div className="draft-edit-page w-full h-full flex flex-col items-center">
      {
        containerSize?.width && containerSize.width < 800 && (
          <div className="min-w-[600px] w-4/5 max-w-[1500px] flex flex-col">
            {headerContext}
          </div>
        )
      }
      <div className="min-w-[600px] w-4/5 max-w-[1500px] flex" ref={containerRef}>
        {
          containerSize?.width && containerSize.width >= 800 && (
            <Affix offsetTop={30} target={() => document.querySelector('.ant-tabs-content') as HTMLElement | null}>
              <div
                className={classNames('min-w-[250px] h-[250px] mt-16',
                  {'min-w-[230px]': containerSize?.width && containerSize.width < 800}
                )}
              >
                {headerContext}
              </div>
            </Affix>
          )
        }
        <div
          className={classNames('flex-grow',
            {'ml-[3vw]': containerSize?.width && containerSize.width >= 800}
          )}
        >
          <div
            className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
              {'flex-col': containerSize?.width && containerSize.width < 900},
              {'hidden': currentFormIndex !== 0}
            )}
          >
            {/*基本信息*/}
            <div
              className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                {'!w-full': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">基本信息</Title>
              <span className="text-base">这里是稿件的基本信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                {'!w-full !p-10': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillQuaternary}}
            >
              {/*基本信息*/}
              <div className="w-full">
                <Text type="secondary" strong>稿件名称</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  size="large"
                  placeholder="请填写稿件名称"
                  value={draftDetail?.name ?? ''}
                  onChange={(e) => setDraftDetail({...draftDetail, name: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>稿件描述</Text>
                <Input.TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 2, maxRows: 5}}
                  size="large"
                  placeholder="请填写项稿件描述"
                  // value={formValue.description}
                  // onChange={(e) => setFormValue({...formValue, description: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>稿件缩略图</Text>
                <Upload
                  className="!mt-2"
                  name="projectImage"
                  listType="picture-card"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  showUploadList={false}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  // onChange={handleChange}
                >
                  {uploadButton}
                </Upload>
              </div>
            </div>
          </div>
          <div
            className={classNames('w-full mt-6',
              {'hidden': currentFormIndex !== 1}
            )}
          >
            {
              draftType === 'article' && (
                <ArticleEdit
                  initialValue={draftDetailTemp?.content ?? ''}
                  onValueChange={value => setDraftDetail({...draftDetail, content: value})}
                />
              )
            }
            {
              draftType === 'h5' && (
                <H5Edit
                  onChange={(info) => {
                    const {status} = info.file;
                    if (status !== 'uploading') {
                      console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                      // message.success(`${info.file.name} file uploaded successfully.`);
                    } else if (status === 'error') {
                      // message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                  onDrop={(e) => {
                    console.log('Dropped files', e.dataTransfer.files);
                  }}
                />
              )
            }
            {
              draftType === 'media' && (
                <MediaEdit
                  onChange={(info) => {
                    const {status} = info.file;
                    if (status !== 'uploading') {
                      console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                      // message.success(`${info.file.name} file uploaded successfully.`);
                    } else if (status === 'error') {
                      // message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                  onDrop={(e) => {
                    console.log('Dropped files', e.dataTransfer.files);
                  }}
                />
              )
            }
          </div>
          <div
            className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
              {'flex-col': containerSize?.width && containerSize.width < 900},
              {'hidden': currentFormIndex !== 2}
            )}
          >
            {/*详细信息*/}
            <div
              className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                {'!w-full': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">详细信息</Title>
              <span className="text-base">这里是稿件的详细信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                {'!w-full !p-10': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillQuaternary}}
            >
              {/*基本信息*/}
              <div className="w-full flex flex-col">
                <Text type="secondary" strong>稿件标签</Text>
                <Select
                  className="w-full !mt-2"
                  mode="tags"
                  size="large"
                  placeholder="添加稿件标签"
                  // onChange={handleChange}
                  // options={options}
                />
              </div>
              <div className="w-full flex flex-col mt-6">
                <Text type="secondary" strong>发布渠道</Text>
                <Select
                  className="w-full !mt-2"
                  mode="multiple"
                  size="large"
                  placeholder="选择发布渠道"
                  options={DRAFT_RELEASE_CHANNEL}
                  value={
                    JSON.parse(draftDetail?.channels ?? '[]')?.map((channel: string) =>
                      DRAFT_RELEASE_CHANNEL.find(c => c.value === channel)?.value ?? '')
                    ?? []
                  }
                  onChange={value => setDraftDetail({...draftDetail, channels: JSON.stringify(value)})}
                />
              </div>
              <div className="w-full flex flex-col mt-6">
                <Text type="secondary" strong>私密稿件</Text>
                <Radio.Group
                  className="!mt-2"
                  buttonStyle="solid"
                  size="large"
                  value={0}
                >
                  <Radio.Button value={0}>
                    公开
                  </Radio.Button>
                  <Radio.Button
                    value={1}
                    style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                    disabled
                  >
                    私密
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>备注信息</Text>
                <Input.TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 3, maxRows: 5}}
                  size="large"
                  placeholder="稿件备注信息"
                  // value={formValue.description}
                  // onChange={(e) => setFormValue({...formValue, description: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
              onClick={() => {
                if (currentFormIndex === 2) {
                  submitDraft();
                } else {
                  setCurrentFormIndex(currentFormIndex + 1);
                }
              }}
            >
              {currentFormIndex === 2 ? '保存稿件' : '下一步'}
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-36"></div>
        </div>
      </div>
    </div>
  );
};

export default DraftEditPage;
