import { UserProfileExtVo } from '@/services/api/modules/user/typings';
import { UserRole } from '@/typings';

export default (initialState?: UserProfileExtVo) => {
  const userInfo = initialState;
  const isSuperAdmin = !!(userInfo && userInfo.roles?.find(role => role.roleName === UserRole.SUPER_ADMIN));
  const isDepartmentAdmin = !!(userInfo && userInfo.roles?.find(role => role.roleName === UserRole.DEPARTMENT_ADMIN));
  const canSeeAdmin = isSuperAdmin;
  return {
    // 是否为超级管理员
    isSuperAdmin,
    // 是否为部门管理员
    isDepartmentAdmin,
    // 能否看见后台管理
    canSeeAdmin,
  };
};
