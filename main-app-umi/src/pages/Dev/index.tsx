import React, { useState } from 'react';
import { Button, Row, Space, Switch } from 'antd';
import { useAccess, useDispatch, useModel, useNavigate } from '@@/exports';
import { authApi } from '@/services/api';
import ChatDialog from '@/components/ChatDialog';
import SideMenuPanel from '@/components/SideMenuPanel';

const DevPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');
  const {loading, setLoading} = useModel('global');

  const {canSeeAdmin} = useAccess();

  const gotoLogin = () => {
    navigate('/auth/login', {
      state: {
        from: '/index'
      }
    });
  };

  const loginTest = async () => {
    await dispatch({
      type: 'user/loginByAccount',
      payload: {account: 'cowjiang@163.com', password: 'cow20010114'}
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
  const handleChatDialogClose = () => {
    setChatDialogDisplay(false);
    setLoading(false);
  };

  const handleSocketTest = () => {
    dispatch({
      type: 'app/connectSocket'
    });
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Row className="mb-4">
          <Space size={[8, 16]} wrap>
            <Button
              type="primary"
              onClick={gotoLogin}
            >
              登录页
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/admin')}
            >
              后台管理
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/project/edit/new')}
            >
              新建项目
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/department/1/detail')}
            >
              部门详情
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/department/1/members')}
            >
              部门成员信息
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/project/1/draft/list')}
            >
              稿件列表
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('./a')}
            >
              404
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/403')}
            >
              403
            </Button>
          </Space>
        </Row>
        <Row>
          <Space size={[8, 16]} wrap>
            <Button onClick={loginTest}>
              登录API
            </Button>
            <Button onClick={handleSocketTest}>
              Socket测试
            </Button>
            <Button onClick={logout}>
              退出登录
            </Button>
            <Button onClick={() => {
              console.log(canSeeAdmin);
            }}>
              检查权限
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

export default DevPage;
