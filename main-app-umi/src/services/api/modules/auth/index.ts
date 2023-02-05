import { request } from '@@/exports';
import type { Response } from '@/services/typings';

async function loginByAccount(
  data: {
    username: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<Response>('/api/user/login', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

async function RegisterByEmail(
  data: {
    key: string;
    password: string;
  },
  options?: { [key: string]: any }
) {
  return request<Response>('/api/user/register', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

export default {
  loginByAccount,
  RegisterByEmail
};
