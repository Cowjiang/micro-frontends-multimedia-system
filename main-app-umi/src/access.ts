import { UserProfileExtVo } from '@/services/api/modules/user/typings';
import { UserRole } from '@/typings';

export default (initialState?: UserProfileExtVo) => {
  const userInfo = initialState;
  const canSeeAdmin = !!(userInfo && userInfo.roles?.find(role => role.roleName === UserRole.ADMIN));
  return {
    canSeeAdmin
  };
};
