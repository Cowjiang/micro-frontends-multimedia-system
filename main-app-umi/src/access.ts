import { UserProfileExtVo } from '@/services/api/modules/user/typings';

export default (initialState: UserProfileExtVo) => {
  const userInfo = initialState;
  const canSeeAdmin = !!(userInfo && userInfo.roles?.find(role => role.roleName === 'ADMIN'));
  return {
    canSeeAdmin,
  };
};
