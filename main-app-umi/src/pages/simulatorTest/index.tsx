import React, { useEffect, useMemo } from 'react';
import WujieReact from 'wujie-react';
import NProgress from 'nprogress';
import { useModel, useNavigate } from '@@/exports';
import { Modal } from 'antd';

const SimulatorTestPage: React.FC = () => {
  const {setLoading} = useModel('global');
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const wujieInstance = useMemo(() => (
    <WujieReact
      name="h5"
      width="100%"
      height="100%"
      url={`http://localhost:3001`}
      // alive={true}
      sync={false}
      degrade={true}
      beforeLoad={() => {
        NProgress.start();
        setLoading(true);
      }}
      beforeMount={() => {
        NProgress.done();
        setLoading(false);
      }}
      loadError={() => {
        NProgress.done();
        setLoading(false);
        // modal.error({
        //   centered: true,
        //   title: '服务加载失败',A
        //   content: '请检查网络连接或联系管理员',
        //   keyboard: false,
        //   okText: '返回',
        //   onOk: () => navigate(-1)
        // });
      }}
    />
  ), []);

  return (
    <div>
      {/*<div className="w-[450px] h-[950px]">*/}
      {/*  {wujieInstance}*/}
      {/*</div>*/}
      <div className="w-[450px] h-[950px]">
        <iframe className="border-none" src="http://localhost:3001" width={450} height={950}></iframe>
      </div>
      {contextHolder}
    </div>
  );
};

export default SimulatorTestPage;
