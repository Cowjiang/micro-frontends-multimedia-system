import { request } from '@@/exports';
import type { Response } from '@/services/typings';

async function loginByAccount(
  data: {
    username: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<Response>('/user/login', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

async function registerByEmail(
  data: {
    key: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<Response>('/user/register', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

async function refreshToken(
  data: {
    refreshToken: string;
  },
  options?: { [key: string]: any }
) {
  return request<Response>('/user/token/refresh', {
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
