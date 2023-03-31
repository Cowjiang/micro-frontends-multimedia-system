import { request, history } from '@@/exports';
import { authApi } from '@/services/api';
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
  let elem = document.createElement('input');
  elem.setAttribute('value', content);
  document.body.appendChild(elem);
  elem.select();
  document.execCommand('copy');
  document.body.removeChild(elem);
};

/**
 * 鉴权操作
 * @param access 是否允许操作
 * @param action 受保护的操作
 * @param replace 是否重定向至 403 页面
 */
export const protectedAccess = (access: boolean, action: Function, replace: boolean = false): void => {
  if (access && action) {
    action();
  } else {
    !replace && history.push('/403');
    replace && history.replace('/403');
  }
};
