import { authApi } from '@/services/api';
import { request } from '@@/exports';
import { TargetTypeName } from '@/services/api/modules/auth/typings';

// 上传文件
export const uploadFile = async (fileFormData: FormData, type: TargetTypeName, urlSuffix: string) => {
  try {
    const {data: signData} = await authApi.getUploadSignature({
      targetTypeName: type
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

// 复制文本到剪贴板
export const setClipboard = (content: string): void => {
  let elem = document.createElement('input')
  elem.setAttribute('value', content)
  document.body.appendChild(elem)
  elem.select()
  document.execCommand('copy')
  document.body.removeChild(elem)
}
