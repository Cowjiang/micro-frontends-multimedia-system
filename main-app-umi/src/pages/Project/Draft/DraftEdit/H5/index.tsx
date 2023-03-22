import React from 'react';
import { useModel } from '@@/exports';
import { theme, Typography, Upload } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { uploadFile } from '@/utils';
import { H5EditProps } from '@/pages/Project/Draft/DraftEdit/H5/typings';

const {Text} = Typography;
const {useToken} = theme;

const H5Edit: React.FC<H5EditProps> = (props: H5EditProps) => {
  const {messageApi} = useModel('messageApi');
  const {token} = useToken();
  const {colorPrimary} = token;

  const {uploadUrlSuffix, ...uploadProps} = props;

  const beforeUpload = (file: RcFile) => {
    const isZip = file.type === 'application/x-zip-compressed';
    if (!isZip) {
      messageApi.error('请上传 zip 格式的压缩包！');
    }
    return isZip || Upload.LIST_IGNORE;
  };

  return (
    <div className="pt-6">
      <Upload.Dragger
        {...uploadProps}
        name="file"
        customRequest={async ({file, onSuccess, onError}) => {
          let fileForm = new window.FormData();
          fileForm.append('file', file);
          uploadFile(fileForm, 'mfms-material', `${uploadUrlSuffix}/${Date.now()}.zip`).then((res) => {
            onSuccess && onSuccess(res);
          }).catch(err => {
            onError && onError(err);
          });
        }}
        multiple={false}
        maxCount={1}
        beforeUpload={beforeUpload}
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
          请上传根目录包含 <Text strong type="warning">index.html</Text> 文件的 zip 格式压缩包文件，体积不得超过15Mb
        </p>
        <div className="h-24"></div>
      </Upload.Dragger>
    </div>
  );
};

export default H5Edit;
