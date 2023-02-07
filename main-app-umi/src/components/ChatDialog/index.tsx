import React, { useMemo } from 'react';
import { Modal } from 'antd';
import { ChatDialogProps } from '@/components/ChatDialog/typings';
import './index.less';
import NProgress from 'nprogress';
import Loading from '@/components/Loading';
import WujieReact from 'wujie-react';
import wujieDefaultProps from '@/config/wujieProps';
import { useModel } from '@@/exports';

const ChatDialog: React.FC<ChatDialogProps> = (props) => {
  const {loading, setLoading} = useModel('global');
  const [modal, contextHolder] = Modal.useModal();

  const wujieInstance = useMemo(() => {
    return (
      <WujieReact
        name="chat"
        width="1000px"
        height="75vh"
        url={`http://localhost:3000/chat/home`}
        // alive={true}
        // sync={true}
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
  }, []);

  return (
    <Modal
      centered
      width={1000}
      footer={null}
      wrapClassName="chat-modal"
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
