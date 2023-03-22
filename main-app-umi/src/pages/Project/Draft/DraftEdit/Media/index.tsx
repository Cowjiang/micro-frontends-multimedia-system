import React from 'react';
import { useModel } from '@@/exports';
import { theme, Typography, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { MediaEditProps } from '@/pages/Project/Draft/DraftEdit/Media/typings';
import { uploadFile } from '@/utils';

const {Text} = Typography;
const {useToken} = theme;

const MediaEdit: React.FC<MediaEditProps> = (props: MediaEditProps) => {
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {colorPrimary} = token;

  const {uploadUrlSuffix, ...uploadProps} = props;

  return (
    <div className="pt-6">
      <Upload.Dragger
        {...uploadProps}
        name="file"
        customRequest={async ({file, onSuccess, onError}) => {
          let fileForm = new window.FormData();
          fileForm.append('file', file);
          uploadFile(fileForm, 'mfms-material', `${uploadUrlSuffix}/${Date.now()}`).then((res) => {
            onSuccess && onSuccess(res);
          }).catch(err => {
            onError && onError(err);
          });
        }}
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
