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
 * 分页参数
 */
export interface BasePageParam {
  pageNumber?: number | null;
  pageSize?: number | null;
}

export interface OrderItem {
  asc?: boolean;
  column?: string;
}
