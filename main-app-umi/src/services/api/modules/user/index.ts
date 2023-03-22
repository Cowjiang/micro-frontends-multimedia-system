import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import { UserProfileDto, UserProfileExtVo, UserSearchListVo } from '@/services/api/modules/user/typings';

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


// 获取用户信息
async function getUserInfo(
  params: {
    userId: number
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<UserProfileExtVo>>('/user/simple/info', {
    method: 'GET',
    params,
    ...(options || {})
  });
}

// 修改用户信息
async function updateUserInfo(
  data: UserProfileDto,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/user/profile', {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

export default {
  getCurrentUserInfo,
  searchUser,
  getUserInfo,
  updateUserInfo
};
