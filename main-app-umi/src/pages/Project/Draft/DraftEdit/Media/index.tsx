import React from 'react';
import { useModel } from '@@/exports';
import { theme, Typography, Upload } from 'antd';
import type { UploadProps } from 'antd';

const {Text} = Typography;
const {useToken} = theme;

const MediaEdit: React.FC<UploadProps> = (props: UploadProps) => {
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {colorPrimary} = token;

  return (
    <div className="pt-6">
      <Upload.Dragger
        {...props}
        name="file"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        multiple
      >
        <div className="h-24"></div>
        <p className="ant-upload-drag-icon">
          <i
            className="fi fi-rr-folder-upload text-5xl"
            style={{color: colorPrimary}}
          />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
        <p className="ant-upload-hint">
          请上传音频或视频的素材文件，上传完成将会同步至当前稿件的素材库
        </p>
        <div className="h-24"></div>
      </Upload.Dragger>
    </div>
  );
};

export default MediaEdit;
