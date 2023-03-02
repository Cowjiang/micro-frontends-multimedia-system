import React, { useMemo, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Avatar, Button, Input, Radio, Select, Switch, theme, Typography, Upload } from 'antd';
import { useLocation, useModel, useSelector } from '@@/exports';
import { useSize } from 'ahooks';
import { UserModelState } from '@/models/user';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { darkThemeImage, lightThemeImage } from '@/assets/images/svg/themeSvg';

const {Title, Text} = Typography;
const {useToken} = theme;

const colorList = ['#4c8045', '#4994c4', '#ba79b1', '#d23918', '#8d7bea'];

const SettingsPage = () => {
  const {darkTheme, setDarkTheme} = useModel('theme');
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {
    colorFillQuaternary,
    colorFillSecondary,
    colorFillTertiary,
    colorTextSecondary,
    colorTextDisabled,
    colorPrimary
  } = token;

  const location = useLocation();
  const currentSettingType = useMemo((): 'personal' | 'general' => {
    if (location.pathname.includes('/settings/general')) {
      return 'general';
    } else {
      return 'personal';
    }
  }, [location]);

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  return (
    <div className="settings-page w-full h-full px-16 flex justify-center">
      <div className="min-w-[500px] w-full max-w-[1000px] flex flex-col" ref={containerRef}>
        <Title level={1} className="mt-12">
          {currentSettingType === 'personal' ? '个人设置' : '通用设置'}
        </Title>
        {
          currentSettingType === 'personal' && (
            // 个人设置
            <div>
              <div
                className={classNames('w-full mt-6 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">账号设置</Title>
                  <span className="text-base">这里是你的个人信息设置，请填写并检查无误后再提交。</span>
                </div>
                <div
                  className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                    {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillQuaternary}}
                >
                  <div className="w-full flex">
                    <div className="w-full mr-8">
                      <div className="w-full">
                        <Title level={5}>用户名</Title>
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
                        <Title level={5}>我的性别</Title>
                        <Radio.Group
                          className="!mt-2"
                          buttonStyle="solid"
                          size="large"
                          value={[0, 1].includes(userInfo.gender as number) ? userInfo.gender : 1}
                          // onChange={onChange}
                        >
                          <Radio.Button
                            value={1}
                            style={{...userInfo.gender === 0 ? {background: darkTheme ? colorFillSecondary : '#fff'} : {}}}
                          >
                            <div className="flex items-center">
                              <i className="fi fi-rr-man-head mr-2" />
                              <span>男</span>
                            </div>
                          </Radio.Button>
                          <Radio.Button
                            value={0}
                            style={{...userInfo.gender !== 0 ? {background: darkTheme ? colorFillSecondary : '#fff'} : {}}}
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
                      <Title level={5}>我的头像</Title>
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
                    <Title level={5}>个人简介</Title>
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
                    <Title level={5}>手机号</Title>
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
                    <Title level={5}>电子邮箱</Title>
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

              <div
                className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">隐私设置</Title>
                  <span className="text-base">这里是隐私设置，可以设置保护自己的隐私。</span>
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
                    <Title level={5}>私信隐私</Title>
                    <div className="flex">
                      <span>允许在群聊中向我发起私信</span>
                      <Switch className="!ml-auto" defaultChecked />
                    </div>
                  </div>
                  <div className="w-full flex flex-col mt-12">
                    <Title level={5}>用户体验计划</Title>
                    <div className="flex">
                      <span>参加用户体验改善计划</span>
                      <Switch className="!ml-auto" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">安全设置</Title>
                  <span className="text-base">这里是安全设置，可以重置自己的密码或设置二次验证。</span>
                </div>
                <div
                  className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                    {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillQuaternary}}
                >
                  <div className="w-full flex flex-col">
                    <div>
                      <Title level={5}>重置密码</Title>
                      <div className="w-full flex flex-col mt-2">
                        <div>
                          <Button type="primary" size="large">更改我的密码</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <Title level={5}>登陆验证</Title>
                      <div className="w-full flex flex-col mt-2">
                        <div>
                          <Button type="primary" size="large" ghost>开启二次验证</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {
          currentSettingType === 'general' && (
            // 通用设置
            <div>
              <div
                className={classNames('w-full mt-6 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">外观设置</Title>
                  <span className="text-base">这里是外观设置，可以调整应用的外观与模式。</span>
                </div>
                <div
                  className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                    {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillQuaternary}}
                >
                  <div className="w-full flex flex-col">
                    <Title level={5}>主题模式</Title>
                    <div className="flex mt-2">
                      <div
                        className="h-[100px] mr-2 overflow-hidden border-2 rounded-xl border-solid cursor-pointer"
                        style={{borderColor: !darkTheme ? colorPrimary : 'transparent'}}
                        onClick={() => setDarkTheme(false)}
                      >
                        {lightThemeImage}
                      </div>
                      <div
                        className="h-[100px] ml-2 overflow-hidden border-2 rounded-xl border-solid cursor-pointer"
                        style={{borderColor: darkTheme ? colorPrimary : 'transparent'}}
                        onClick={() => setDarkTheme(true)}
                      >
                        {darkThemeImage}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col mt-6">
                    <Title level={5}>主题颜色</Title>
                    <div className="flex mt-2">
                      <div
                        className="w-[42px] h-[42px] flex justify-center items-center mr-4 rounded-full"
                        style={{background: colorPrimary}}
                      >
                        <i className="fi fi-br-check text-xl" />
                      </div>
                      {
                        colorList.map(background => (
                          <div
                            className="w-[42px] h-[42px] flex justify-center items-center mr-4 rounded-full"
                            style={{background}}
                            key={background}
                          ></div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">通知设置</Title>
                  <span className="text-base">这里是通知设置，可以设置消息提醒等。</span>
                </div>
                <div
                  className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                    {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillQuaternary}}
                >
                  <div className="w-full flex flex-col">
                    <Title level={5}>桌面通知</Title>
                    <div className="flex">
                      <span>开启桌面通知提醒</span>
                      <Switch className="!ml-auto" />
                    </div>
                  </div>
                  <div className="w-full flex flex-col mt-12">
                    <Title level={5}>声音提醒</Title>
                    <div className="flex">
                      <span>有新消息时开启声音提醒</span>
                      <Switch className="!ml-auto" defaultChecked />
                    </div>
                  </div>
                  <div className="w-full flex flex-col mt-12">
                    <Title level={5}>强提醒</Title>
                    <div className="flex">
                      <span>有新聊天消息时自动打开聊天</span>
                      <Switch className="!ml-auto" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
                  {'flex-col': containerSize?.width && containerSize.width < 800}
                )}
              >
                <div
                  className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                    {'!w-full': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillTertiary}}
                >
                  <Title level={2} className="mt-6">语言设置</Title>
                  <span className="text-base">这里是语言设置，可以设置应用默认显示的语言。</span>
                </div>
                <div
                  className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                    {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                  )}
                  style={{background: colorFillQuaternary}}
                >
                  <div className="w-full flex flex-col">
                    <Title level={5}>选择语言</Title>
                    <div className="flex items-center">
                      <span>应用默认显示的语言</span>
                      <Select
                        className="!ml-auto"
                        defaultValue="chinese"
                        disabled
                        size="large"
                        options={[{value: 'chinese', label: '中文（简体中文）'}]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/*底部*/}
        <div className="w-full h-48 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default SettingsPage;
