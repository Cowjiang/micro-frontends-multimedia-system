import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';

// 获取当前用户信息
async function getCurrentUserInfo(
  options?: { [key: string]: any }
) {
  return request<IResponseData<SimpleUserInfo>>('/user/current/info', {
    method: 'GET',
    ...(options || {})
  });
}

export default {
  getCurrentUserInfo
};
