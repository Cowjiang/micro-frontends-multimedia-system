/**
 * 响应体封装
 */
export interface IResponseData<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T | null;
}
