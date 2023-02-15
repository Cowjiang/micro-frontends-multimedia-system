import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Typography,
  Steps,
  Button,
  Input,
  theme,
  Upload,
  DatePicker, Affix
} from 'antd';
import { useModel } from '@@/exports';
import './index.less';
import { useInViewport, useSize } from 'ahooks';
import classNames from 'classnames';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const {Title, Text} = Typography;
const {TextArea} = Input;

const NewProjectPage: React.FC = () => {
  const {darkTheme} = useModel('theme');
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {
    colorFillQuaternary,
    colorFillSecondary,
    colorFillTertiary
  } = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const formRefList = [useRef(null), useRef(null), useRef(null)];
  const formInViewport = [
    useInViewport(formRefList[0], {threshold: 1}),
    useInViewport(formRefList[1], {threshold: 1}),
    useInViewport(formRefList[2], {threshold: 1})
  ];
  useEffect(() => {
    const index = formInViewport.findIndex(item => item[0]);
    if (index !== -1) {
      setCurrentFormIndex(index);
    }
  }, [formInViewport]);

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = (
    <div>
      {imgUploading ? <LoadingOutlined /> : <PlusOutlined />}
    </div>
  );

  const [formValue, setFormValue] = useState({
    projectName: '',
    projectDescription: '',
    projectImageUrl: '',
    startTime: '',
    endTime: ''
  });

  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  return (
    <div className="w-full h-full px-16 flex justify-center">
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
                  title: '填写人员信息',
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
              style={{
                background: colorFillTertiary
              }}
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
              style={{
                background: colorFillQuaternary
              }}
            >
              {/*基本信息*/}
              <div className="w-full">
                <Text type="secondary" strong>项目名称</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{
                    background: darkTheme ? colorFillSecondary : '#fff'
                  }}
                  size="large"
                  placeholder="请填写项目名称"
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>项目简介</Text>
                <TextArea
                  className="custom-input !mt-2"
                  style={{
                    background: darkTheme ? colorFillSecondary : '#fff'
                  }}
                  autoSize={{minRows: 2, maxRows: 5}}
                  size="large"
                  placeholder="请填写项目简介"
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>项目图片</Text>
                <Upload
                  className="!mt-2"
                  name="projectImage"
                  listType="picture-card"
                  style={{
                    background: darkTheme ? colorFillSecondary : '#fff'
                  }}
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
              style={{
                background: colorFillTertiary
              }}
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
              style={{
                background: colorFillQuaternary
              }}
            >
              <div className="w-full flex flex-col">
                <Text type="secondary" strong>项目开始时间</Text>
                <DatePicker
                  className="custom-input !mt-2"
                  style={{
                    background: darkTheme ? colorFillSecondary : '#fff'
                  }}
                  showTime
                  size="large"
                  format="YYYY年MM月DD日 hh:mm"
                />
              </div>
              <div className="w-full mt-6 flex flex-col">
                <Text type="secondary" strong>项目结束时间</Text>
                <DatePicker
                  className="custom-input !mt-2"
                  style={{
                    background: darkTheme ? colorFillSecondary : '#fff'
                  }}
                  showTime
                  size="large"
                  format="YYYY年MM月DD日 hh:mm"
                />
              </div>
            </div>
          </div>
          {/*人员信息*/}
          <div
            ref={formRefList[2]}
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
              style={{
                background: colorFillTertiary
              }}
            >
              <Title level={2}>人员信息</Title>
              <span className="text-base">这里是项目的人员安排信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={
                classNames(
                  'w-3/5 min-h-[300px] p-12 flex flex-col',
                  {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{
                background: colorFillQuaternary
              }}
            >
            </div>
          </div>
          {/*提交按钮*/}
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
            >
              确认并提交
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
