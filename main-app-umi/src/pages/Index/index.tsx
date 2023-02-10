import React, { useState } from 'react';
import { Button, Space, Switch } from 'antd';
import { useDispatch, useModel, useNavigate } from '@@/exports';
import { authApi } from '@/services/api';
import ChatDialog from '@/components/ChatDialog';
import { connectSocketTest } from '@/services/socket';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gotoLogin = () => {
    navigate('/auth/login', {
      state: {
        from: '/index'
      }
    });
  };

  const {messageApi} = useModel('messageApi');
  const showMessage = () => {
    messageApi.open({
      type: 'loading',
      content: '正在加载',
      duration: 1
    }).then(() => messageApi.warning('加载警告', 1).then(() => messageApi.error('加载失败')));
  };

  const loginTest = async () => {
    await authApi.loginByAccount({
      username: 'cowjiang@163.com',
      password: 'cow20010114'
    });
  };

  const clearCache = () => {
    localStorage.clear();
    dispatch({
      type: 'user/logOut'
    });
  };

  const {darkTheme, setDarkTheme} = useModel('theme');
  const switchTheme = (checked: boolean) => {
    setDarkTheme(checked);
  };

  const [chatDialogDisplay, setChatDialogDisplay] = useState(false);

  const handleSocketTest = () => {
    connectSocketTest().then(res => {
      console.log('[Socket测试]', res);
    }).catch(e => {
      console.error('[Socket测试错误]', e);
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
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
            聊天弹窗测试
          </Button>
          <ChatDialog
            open={chatDialogDisplay}
            onCancel={() => setChatDialogDisplay(false)}
          >
            <div className="w-full h-[75vh] bg-gray-200">

            </div>
          </ChatDialog>
        </>
        <Button onClick={loginTest}>
          登陆测试
        </Button>
        <Button onClick={handleSocketTest}>
          Socket测试
        </Button>
        <Button onClick={clearCache}>
          清除缓存
        </Button>
        <Switch
          checkedChildren="暗黑"
          unCheckedChildren="浅色"
          defaultChecked={darkTheme}
          onChange={switchTheme}
        />
      </Space>
    </div>
  );
};

export default IndexPage;
