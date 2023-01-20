import { useState } from 'react';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

export default () => {
  const [messageApi] = message.useMessage();
  const [messageInstance, setMessageApi] = useState<MessageInstance>(messageApi);
  return {
    messageApi: messageInstance,
    setMessageApi
  };
};
