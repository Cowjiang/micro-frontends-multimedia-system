import React from 'react';
import { Button } from 'antd';
import { useNavigate } from '@@/exports';

const IndexPage: React.FC = () => {
  const navigate = useNavigate()
  const gotoLogin = () => {
    navigate("../login");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Button
        type="primary"
        size="large"
        onClick={() => gotoLogin()}
      >
        跳转登录页
      </Button>
    </div>
  );
};

export default IndexPage;
