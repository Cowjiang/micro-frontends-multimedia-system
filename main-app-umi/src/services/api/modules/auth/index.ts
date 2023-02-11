import { request } from '@@/exports';
import type { IResponseData } from '@/services/typings';

// 使用账号登陆
async function loginByAccount(
  data: {
    username: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/user/login', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 使用邮箱注册
async function registerByEmail(
  data: {
    key: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/user/register', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 刷新AT
async function refreshToken(
  data: {
    refreshToken: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/user/token/refresh', {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

export default {
  loginByAccount,
  registerByEmail,
  refreshToken
};
