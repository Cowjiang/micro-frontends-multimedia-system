import React from 'react';
import { Button, Space, Switch } from 'antd';
import { useModel, useNavigate } from '@@/exports';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
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

  const {darkTheme, setDarkTheme} = useModel('theme');
  const switchTheme = (checked: boolean) => {
    setDarkTheme(checked);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Space>
        <Button
          type="primary"
          onClick={() => gotoLogin()}
        >
          跳转登录页
        </Button>
        <Button
          onClick={() => showMessage()}
        >
          全局消息提醒
        </Button>
        <Button
          type="primary"
          onClick={() => navigate('/simulatorTest')}
        >
          移动端H5模拟测试
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
