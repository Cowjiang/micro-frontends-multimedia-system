import { UserProfile } from '@/services/api/modules/user/typings';

/**
 * Department
 */
export interface Department {
  description?: string;
  id?: number;
  name?: string;
  userId?: number;
}

/**
 * DepartMemberListVo
 */
export interface DepartMemberListVo {
  departmentMember?: DepartmentMember;
  userProfile?: UserProfile;
  userRoles?: UserRole[];
}

/**
 * DepartmentMember
 */
export interface DepartmentMember {
  /**
   * 部门id
   */
  departmentId?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 员工用户id
   */
  userId?: number;
}

/**
 * UserRole
 */
export interface UserRole {
  /**
   * 所属部门
   */
  departmentId?: number;
  id?: number;
  /**
   * 角色说明
   */
  roleDescription?: string;
  /**
   * 角色名
   */
  roleName?: string;
}

/**
 * UserPermission
 */
export interface UserPermission {
  id?: number;
  /**
   * 权限代码
   */
  permissionCode?: string;
  /**
   * 权限名
   */
  permissionName?: string;
}

export interface AddUserRole {
  role?: UserRole;
  userPermissions?: UserPermission[];
}
