import React from 'react';
import { Button, Space } from 'antd';
import { useModel, useNavigate } from '@@/exports';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const gotoLogin = () => {
    navigate('../login', {
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

  const {darkTheme, setDarkTheme} = useModel('theme');
  const switchTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Space>
        <Button
          type="primary"
          size="large"
          onClick={() => gotoLogin()}
        >
          跳转登录页
        </Button>
        <Button
          size="large"
          onClick={() => showMessage()}
        >
          全局消息提醒
        </Button>
        <Button
          size="large"
          onClick={() => switchTheme()}
        >
          黑暗模式切换
        </Button>
      </Space>
    </div>
  );
};

export default IndexPage;
