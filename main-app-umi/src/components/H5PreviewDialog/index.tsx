import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import { H5PreviewDialogProps } from '@/components/H5PreviewDialog/typings';
import SimulatorBg from '@/assets/images/placeholder/iPhone.png';

const H5PreviewDialog: React.FC<H5PreviewDialogProps> = (props) => {
  const {url, ...antdModalProps} = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !props.open && setLoading(true);
  }, [props.open]);

  return (
    <Modal
      centered
      footer={null}
      destroyOnClose
      // width={390}
      {...antdModalProps}
    >
      <div className="p-8 flex justify-center items-center">
        <Spin className="w-full h-full" spinning={loading} size="large">
          <div
            className="w-[318px] h-[627px] pt-[48px] pb-[25px] px-[13px] bg-cover bg-no-repeat"
            style={{backgroundImage: `url(${SimulatorBg})`}}
          >
            <div className="preview-container w-full h-full rounded-2xl overflow-hidden">
              <iframe
                className="w-full h-full border-none"
                src={url}
                scrolling="no"
                onLoad={() => setLoading(false)}
              />
            </div>
          </div>
        </Spin>
      </div>
    </Modal>
  );
};

export default H5PreviewDialog;
