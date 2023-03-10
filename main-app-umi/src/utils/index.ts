import { authApi } from '@/services/api';
import { request } from '@@/exports';

// 上传文件
export const uploadFile = async (fileFormData: FormData, urlSuffix: string) => {
  try {
    const {data: signData} = await authApi.getUploadSignature({
      targetTypeName: 'mfms-chat'
    });
    if (signData) {
      fileFormData.append('key', `${signData.keyPrefix}${urlSuffix}`);
      fileFormData.append('token', signData.token);
      return await request(`http://${signData.uploadDomain}`, {
        method: 'POST',
        data: fileFormData,
        ...{headers: {'Content-Type': 'multipart/form-data'}}
      });
    } else {
      throw new Error('上传签名为空');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
