import React, { useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Avatar, Input, Radio, theme, Typography, Upload } from 'antd';
import { useModel, useSelector } from '@@/exports';
import { useSize } from 'ahooks';
import { UserModelState } from '@/models/user';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const {Title, Text} = Typography;
const {useToken} = theme;

const SettingsPage = () => {
  const {darkTheme} = useModel('theme');
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {
    colorFillQuaternary,
    colorFillSecondary,
    colorFillTertiary,
    colorTextSecondary,
    colorTextDisabled
  } = token;

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  return (
    <div className="settings-page w-full h-full px-16 flex justify-center">
      <div className="min-w-[500px] w-full max-w-[1000px] flex flex-col" ref={containerRef}>
        <Title level={1} className="mt-12">设置中心</Title>
        <div
          className={
            classNames(
              'w-full mt-6 flex rounded-lg overflow-hidden',
              {'flex-col': containerSize?.width && containerSize.width < 800}
            )
          }
        >
          {/*个人设置*/}
          <div
            // ref={formRefList[0]}
            className={
              classNames(
                'w-2/5 min-w-[40%] p-10 pt-2',
                {'!w-full': containerSize?.width && containerSize.width < 800}
              )
            }
            style={{background: colorFillTertiary}}
          >
            <Title level={2} className="mt-6">个人设置</Title>
            <span className="text-base">这里是你的个人信息设置，请填写并检查无误后再提交。</span>
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
            {/*账号设置*/}
            <Title level={4}>账号设置</Title>
            <div className="w-full mt-6 flex">
              <div className="w-full mr-8">
                <div className="w-full">
                  <Text type="secondary" strong>用户名</Text>
                  <Input
                    className="custom-input !mt-2"
                    style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                    size="large"
                    placeholder="我的用户名"
                    value={userInfo.username}
                    // onChange={(e) => setFormValue({...formValue, name: e.target.value})}
                  />
                </div>
                <div className="w-full flex flex-col mt-4">
                  <Text type="secondary" strong>我的性别</Text>
                  <Radio.Group
                    className="!mt-2"
                    buttonStyle="solid"
                    size="large"
                    value={[0, 1].includes(userInfo.gender as number) ? userInfo.gender : 1}
                    // onChange={onChange}
                  >
                    <Radio.Button
                      value={1}
                      style={{...userInfo.gender === 0 ?{background: darkTheme ? colorFillSecondary : '#fff'} : {}}}
                    >
                      <div className="flex items-center">
                        <i className="fi fi-rr-man-head mr-2" />
                        <span>男</span>
                      </div>
                    </Radio.Button>
                    <Radio.Button
                      value={0}
                      style={{...userInfo.gender !== 0 ?{background: darkTheme ? colorFillSecondary : '#fff'} : {}}}
                    >
                      <div className="flex items-center">
                        <i className="fi fi-rr-woman-head mr-2" />
                        <span>女</span>
                      </div>
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <div className="flex flex-col ml-auto">
                <Text type="secondary" strong>我的头像</Text>
                <Upload
                  className="!mt-2"
                  name="projectImage"
                  listType="picture-circle"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  showUploadList={false}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  // onChange={handleChange}
                >
                  {
                    userInfo.avgPath
                      ? (
                        <Avatar
                          src={userInfo.avgPath}
                          size={100}
                          shape="square"
                          icon={
                            <i
                              className="fi fi-sr-user opacity-70"
                              style={{color: darkTheme ? colorTextSecondary : colorTextDisabled}}
                            />
                          }
                        />
                      )
                      : uploadButton
                  }
                </Upload>
              </div>
            </div>
            <div className="w-full mt-6">
              <Text type="secondary" strong>个人简介</Text>
              <Input.TextArea
                className="custom-input !mt-2"
                style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                autoSize={{minRows: 2, maxRows: 3}}
                size="large"
                placeholder="我的个人简介"
                value={userInfo?.signature ?? ''}
                // onChange={(e) => setFormValue({...formValue, description: e.target.value})}
              />
            </div>
            <div className="w-full mt-6">
              <Text type="secondary" strong>手机号</Text>
              <Input
                className="custom-input !mt-2"
                style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                size="large"
                placeholder="我的手机号"
                value={userInfo.phone}
                // onChange={(e) => setFormValue({...formValue, name: e.target.value})}
              />
            </div>
            <div className="w-full mt-6">
              <Text type="secondary" strong>电子邮箱</Text>
              <Input
                className="custom-input !mt-2"
                style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                size="large"
                placeholder="我的电子邮箱"
                value={userInfo.email}
                // onChange={(e) => setFormValue({...formValue, name: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
