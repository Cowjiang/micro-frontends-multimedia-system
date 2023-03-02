import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import { UserProfileExtVo, UserSearchListVo } from '@/services/api/modules/user/typings';

// 获取当前用户信息
async function getCurrentUserInfo(
  options?: { [key: string]: any }
) {
  return request<IResponseData<UserProfileExtVo>>('/user/current/info', {
    method: 'GET',
    ...(options || {})
  });
}

// 搜索用户
async function searchUser(
  params: {
    keywords: string
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<UserSearchListVo[]>>('/admin/user/search', {
    method: 'GET',
    params,
    ...(options || {})
  });
}

export default {
  getCurrentUserInfo,
  searchUser
};
