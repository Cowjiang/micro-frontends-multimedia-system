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
   * 性别:1 男 0 女
   */
  gender?: number;
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
 * UserSearchListVo
 */
export interface UserSearchListVo {
  department?: Department;
  sysUser?: any;
  userProfile: UserProfile;
}

