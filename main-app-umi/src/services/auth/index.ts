import { request } from '@@/exports';
import type { Response } from '@/services/typings';

export async function loginByAccount(
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
