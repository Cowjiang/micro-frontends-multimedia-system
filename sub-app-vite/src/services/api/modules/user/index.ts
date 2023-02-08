import { http } from '@/services';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';

// 获取当前用户信息
const getCurrentUserInfo = () => http.get<void, SimpleUserInfo>('/user/current/info');

export default {
  getCurrentUserInfo
};
