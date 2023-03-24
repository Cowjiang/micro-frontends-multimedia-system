import { TargetTypeName } from '@/services/api/modules/auth/typings';

export interface GetResourceFilesParams {
  targetTypeName: TargetTypeName;
  preKey: string;
}

/**
 * FileInfo
 */
export interface FileInfo {
  endUser?: string;
  expiration?: number;
  fsize?: number;
  hash?: string;
  key?: string;
  md5?: string;
  meta?: { [key: string]: any };
  mimeType?: string;
  putTime?: number;
  restoreStatus?: number;
  status?: number;
  transitionToArchive?: number;
  transitionToDeepArchive?: number;
  transitionToIA?: number;
  type?: number;
}
