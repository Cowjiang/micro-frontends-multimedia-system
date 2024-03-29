import { Department } from '@/services/api/modules/department/typings';

export interface SimpleUserInfo {
  /**
   * 详细地址
   */
  addressDetails?: string;
  /**
   * 行政区代码
   */
  areaCode?: string;
  /**
   * 关注
   */
  attentions?: number;
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 封面图片
   */
  coverUrl?: string;
  /**
   * 信用积分
   */
  credit?: number;
  /**
   * 粉丝
   */
  fans?: number;
  /**
   * 性别:1 男 0 女
   */
  gender?: number;
  /**
   * 是否被关注
   */
  isConcerned?: boolean;
  /**
   * 是否关注
   */
  isFriend?: boolean;
  /**
   * 积分
   */
  point?: number;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * 个性签名
   */
  signature?: string;
  /**
   * 修改时间
   */
  updatedTime?: number;
  userId?: number;
  /**
   * 用户名
   */
  username?: string;
}


/**
 * UserProfile
 */
export interface UserProfile {
  /**
   * 详细地址
   */
  addressDetails?: string;
  /**
   * 行政区代码
   */
  areaCode?: string;
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 封面图片
   */
  coverUrl?: string;
  /**
   * 信用积分
   */
  credit?: number;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 性别:1 男 0 女
   */
  gender?: number;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 积分
   */
  point?: number;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * 个性签名
   */
  signature?: string;
  /**
   * 修改时间
   */
  updatedTime?: number;
  userId?: number;
  /**
   * 用户名
   */
  username?: string;
}

/**
 * UserProfileExtVo
 */
export interface UserProfileExtVo {
  /**
   * 详细地址
   */
  addressDetails?: string;
  /**
   * 行政区代码
   */
  areaCode?: string;
  /**
   * 关注
   */
  attentions?: number;
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 封面图片
   */
  coverUrl?: string;
  /**
   * 信用积分
   */
  credit?: number;
  department?: Department;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 粉丝
   */
  fans?: number;
  /**
   * 性别:1 男 0 女
   */
  gender?: number;
  /**
   * 是否被关注
   */
  isConcerned?: boolean;
  /**
   * 是否关注
   */
  isFriend?: boolean;
  /**
   * 勋章
   */
  medals?: MedalVo[];
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 积分
   */
  point?: number;
  /**
   * 姓名
   */
  realName?: string;
  roles?: UserRole[];
  /**
   * 个性签名
   */
  signature?: string;
  /**
   * 修改时间
   */
  updatedTime?: number;
  userId?: number;
  /**
   * 用户名
   */
  username?: string;
}

/**
 * UserSearchListVo
 */
export interface UserSearchListVo {
  department?: Department;
  sysUser?: any;
  userProfile: UserProfile;
}

/**
 * MedalVo
 */
export interface MedalVo {
  createdTime?: number;
  desc?: string;
  id?: number;
  name?: string;
  stat?: number;
  style?: string;
}

/**
 * UserProfileDto
 */
export interface UserProfileDto {
  /**
   * 详细地址
   */
  addressDetails?: string;
  /**
   * 行政区代码
   */
  areaCode?: string;
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 生日 yyyy-MM-dd
   */
  birthday?: Date;
  /**
   * 封面图片
   */
  coverUrl?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 性别:1 男 0 女
   */
  gender?: number;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 真实姓名
   */
  realName?: string;
  /**
   * 学校id
   */
  schoolId?: number;
  /**
   * 个人简介
   */
  signature?: string;
  /**
   * 用户id
   */
  userId: number;
  /**
   * 用户名
   */
  username?: string;
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
