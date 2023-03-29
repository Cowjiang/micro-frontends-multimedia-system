import { UserProfile } from '@/services/api/modules/user/typings';

/**
 * 响应体封装
 */
export interface IResponseData<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T | null;
}

/**
 * 分页数据封装
 */
export interface ResponsePage<T> {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: OrderItem[];
  pages?: number;
  records: T[];
  searchCount?: boolean;
  size?: number;
  total?: number;
}

/**
 * 基础分页参数
 */
export interface BasePageParam {
  pageNumber?: number | null;
  pageSize?: number | null;
}

/**
 * 根据时间分页参数
 */
export interface PageParamByTime {
  pageSize?: number;
  time?: number;
}

export interface OrderItem {
  asc?: boolean;
  column?: string;
}

/**
 * 操作历史
 */
export interface OperationHistoryVo {
  /**
   * 操作内容
   */
  comment?: string;
  /**
   * 操作时间
   */
  createdTime?: Date;
  id?: number;
  /**
   * 目标id
   */
  targetId?: number;
  /**
   * 类型 project-项目 contribution-稿件
   */
  targetType?: string;
  /**
   * 操作id
   */
  userId?: number;
  userProfile?: UserProfile;
}

