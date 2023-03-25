import React from 'react';
import { Button, Image, Typography } from 'antd';
import NotFoundImage from '@/assets/images/placeholder/404.png';
import { useNavigate } from '@@/exports';

const {Text} = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Image
        width={500}
        src={NotFoundImage}
        preview={false}
      />
      <Text className="mt-8">
        抱歉，你访问的链接不存在
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

export default NotFoundPage;
