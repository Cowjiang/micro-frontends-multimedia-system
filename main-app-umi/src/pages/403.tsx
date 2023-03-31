import React from 'react';
import { Button, Image, Typography } from 'antd';
import ForbiddenImage from '@/assets/images/placeholder/403.png';
import { useNavigate } from '@@/exports';

const {Text} = Typography;

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Image
        width={500}
        src={ForbiddenImage}
        preview={false}
      />
      <Text className="mt-8">
        抱歉，你没有权限访问或操作
      </Text>
      <Button
        className="!w-32 mt-6"
        type="primary"
        size="large"
        onClick={() => navigate('/index', {replace: true})}
      >
        返回首页
      </Button>
      <div className="w-full h-18"></div>
    </div>
  );
};

export default ForbiddenPage;
