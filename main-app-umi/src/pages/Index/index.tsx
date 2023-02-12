import React, { useState } from 'react';
import { Button, Row, Space, Switch } from 'antd';
import { useDispatch, useModel, useNavigate } from '@@/exports';
import { authApi } from '@/services/api';
import ChatDialog from '@/components/ChatDialog';
import SideMenuPanel from '@/components/SideMenuPanel';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');

  const gotoLogin = () => {
    navigate('/auth/login', {
      state: {
        from: '/index'
      }
    });
  };

  const loginTest = async () => {
    await authApi.loginByAccount({
      username: 'cowjiang@163.com',
      password: 'cow20010114'
    });
  };

  const logout = () => {
    dispatch({
      type: 'user/logout'
    }).then(() => {
      messageApi.success('已退出登录');
    });
  };

  const {darkTheme, setDarkTheme} = useModel('theme');
  const switchTheme = (checked: boolean) => {
    setDarkTheme(checked);
  };

  const [chatDialogDisplay, setChatDialogDisplay] = useState(false);

  const handleSocketTest = () => {
    dispatch({
      type: 'app/connectSocket'
    });
  };

  return (
    <div className="w-full h-full flex">
      <SideMenuPanel />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Row className="mb-4">
          <Space size={[8, 16]} wrap>
            <Button
              type="primary"
              onClick={gotoLogin}
            >
              跳转登录页
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/test/h5-simulator')}
            >
              移动端H5模拟测试
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/test/rich-editor')}
            >
              富文本测试
            </Button>
            <>
              <Button
                type="primary"
                onClick={() => setChatDialogDisplay(true)}
              >
                聊天弹窗
              </Button>
              <ChatDialog
                open={chatDialogDisplay}
                onCancel={() => setChatDialogDisplay(false)}
              />
            </>
          </Space>
        </Row>
        <Row>
          <Space size={[8, 16]} wrap>
            <Button onClick={loginTest}>
              登陆测试
            </Button>
            <Button onClick={handleSocketTest}>
              Socket测试
            </Button>
            <Button onClick={logout}>
              退出登录
            </Button>
            <Switch
              checkedChildren="暗黑"
              unCheckedChildren="浅色"
              defaultChecked={darkTheme}
              onChange={switchTheme}
            />
          </Space>
        </Row>
      </div>
    </div>
  );
};

export default IndexPage;
