import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { ChatDialogProps } from '@/components/ChatDialog/typings';
import './index.less';
import NProgress from 'nprogress';
import Loading from '@/components/Loading';
import WujieReact from 'wujie-react';
import wujieDefaultProps from '@/config/wujieProps';
import { useSelector } from '@@/exports';
import { AppModelState } from '@/models/app';
import { handleSocketMessage } from '@/services/socket';
import { SocketMessageType } from '@/services/socket/typings';

const ChatDialog: React.FC<ChatDialogProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const {socket, chatAppConfig}: AppModelState = useSelector((state: any) => state.app);
  const {bus} = WujieReact;

  useEffect(() => {
    if (socket) {
      socket?.on('message', (data: any) => {
        const {type, message} = handleSocketMessage(data);
        if (type === SocketMessageType.CHAT) {
          bus.$emit('newChatMessage', message);
        }
      });
    }
  }, [socket]);

  const wujieInstance = useMemo(() => {
    return (
      <WujieReact
        name="chat"
        width="75vw"
        height="75vh"
        url={chatAppConfig.url}
        // alive={true}
        sync
        props={{
          ...wujieDefaultProps
        }}
        beforeLoad={() => {
          NProgress.start();
          setLoading(true);
        }}
        beforeMount={() => {
          NProgress.done();
          setLoading(false);
        }}
        loadError={() => {
          // messageApi.error('加载失败')
          NProgress.done();
          setLoading(false);
          modal.error({
            centered: true,
            title: '服务加载失败',
            content: '请检查网络连接或联系管理员',
            keyboard: false,
            okText: '返回',
            onOk: props.onCancel
          });
        }}
      />
    );
  }, [chatAppConfig]);

  return (
    <Modal
      centered
      width="75vw"
      footer={null}
      wrapClassName="chat-modal"
      closable={false}
      destroyOnClose={true}
      {...props}
    >
      <Loading
        spinning={loading}
        size="large"
        className="!h-full !max-h-full"
      >
        {wujieInstance}
        {contextHolder}
      </Loading>
    </Modal>
  );
};

export default ChatDialog;
