import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { Affix, Button, DatePicker, Input, Steps, theme, Typography, Upload } from 'antd';
import { useModel, useNavigate } from '@@/exports';
import { useInViewport, useSize } from 'ahooks';
import classNames from 'classnames';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { projectApi } from '@/services/api';

const {Title, Text} = Typography;
const {TextArea} = Input;
const {useToken} = theme;

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {colorFillQuaternary, colorFillSecondary, colorFillTertiary} = token;

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const formRefList = [useRef(null), useRef(null)];
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const formInViewport = [
    useInViewport(formRefList[0], {threshold: 1}),
    useInViewport(formRefList[1], {threshold: 1})
  ];
  useEffect(() => {
    const index = formInViewport.findIndex(item => item[0]);
    if (index !== -1) {
      setCurrentFormIndex(index);
    }
  }, [formInViewport]);

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    projectImageUrl: '',
    startTime: '' as number | string | undefined,
    endTime: '' as number | string | undefined
  });

  const createProject = () => {
    const {
      name,
      description,
      projectImageUrl,
      startTime,
      endTime
    } = formValue;
    if (!(name && description && startTime && endTime)) {
      messageApi.warning('请完整填写项目信息');
      // return;
    }
    projectApi.createProject({
      projectName: name,
      projectDesc: description,
      startTime: startTime as number,
      endTime: endTime as number
    }).then(({success, data}) => {
      if (success && data) {
        navigate(`/project/${data.id}/member/config`, {replace: true});
      } else {
        messageApi.error('项目创建失败');
      }
    });
  };

  return (
    <div className="new-project-page w-full h-full px-16 flex justify-center">
      <div className="min-w-[500px] w-full max-w-[1200px] flex" ref={containerRef}>
        <Affix offsetTop={30} target={() => document.querySelector('.ant-tabs-content') as HTMLElement | null}>
          <div
            className={
              classNames(
                'min-w-[250px] h-[250px] mt-16',
                {'min-w-[200px]': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            <Title level={1}>新建项目</Title>
            <Steps
              className="!mt-12 h-full"
              current={currentFormIndex}
              size={containerSize?.width && containerSize.width < 800 ? 'small' : 'default'}
              direction="vertical"
              items={[
                {
                  title: '填写项目基本信息',
                  description: '第一步'
                },
                {
                  title: '填写详细信息',
                  description: '第二步'
                },
                {
                  title: '设置人员',
                  description: '第三步'
                }
              ]}
            />
          </div>
        </Affix>
        <div className="flex-grow ml-[3vw]">
          <div
            className={
              classNames(
                'w-full mt-20 flex rounded-lg overflow-hidden',
                {'flex-col': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            {/*基本信息*/}
            <div
              ref={formRefList[0]}
              className={
                classNames(
                  'w-2/5 min-w-[40%] p-10 pt-2',
                  {'!w-full': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillTertiary}}
            >
              <Title level={2}>基本信息</Title>
              <span className="text-base">这里是项目的基本信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={
                classNames(
                  'w-3/5 min-h-[300px] p-12 flex flex-col',
                  {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillQuaternary}}
            >
              {/*基本信息*/}
              <div className="w-full">
                <Text type="secondary" strong>项目名称</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  size="large"
                  placeholder="请填写项目名称"
                  value={formValue.name}
                  onChange={(e) => setFormValue({...formValue, name: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>项目简介</Text>
                <TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 2, maxRows: 5}}
                  size="large"
                  placeholder="请填写项目简介"
                  onChange={(e) => setFormValue({...formValue, description: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>项目图片</Text>
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
                  {
                    formValue.projectImageUrl
                      ? <img src={formValue.projectImageUrl} alt="projectImage" style={{width: '100%'}} />
                      : uploadButton
                  }
                </Upload>
              </div>
            </div>
          </div>
          {/*详细信息*/}
          <div
            ref={formRefList[1]}
            className={
              classNames(
                'w-full mt-10 flex rounded-lg overflow-hidden',
                {'flex-col': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            <div
              className={
                classNames(
                  'w-2/5 min-w-[40%] p-10 pt-2',
                  {'!w-full': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillTertiary}}
            >
              <Title level={2}>详细信息</Title>
              <span className="text-base">这里是项目的详细信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={
                classNames(
                  'w-3/5 min-h-[300px] p-12 flex flex-col',
                  {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillQuaternary}}
            >
              <div className="w-full flex flex-col">
                <Text type="secondary" strong>项目开始时间</Text>
                <DatePicker
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  showTime
                  size="large"
                  format="YYYY年MM月DD日 hh:mm"
                  onChange={(date) => setFormValue({...formValue, startTime: date?.unix()})}
                />
              </div>
              <div className="w-full mt-6 flex flex-col">
                <Text type="secondary" strong>项目结束时间</Text>
                <DatePicker
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  showTime
                  size="large"
                  format="YYYY年MM月DD日 hh:mm"
                  onChange={(date) => setFormValue({...formValue, endTime: date?.unix()})}
                />
              </div>
            </div>
          </div>

          {/*提交按钮*/}
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
              onClick={createProject}
            >
              下一步
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-48"></div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectPage;
