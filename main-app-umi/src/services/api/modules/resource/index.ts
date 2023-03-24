import { request } from '@@/exports';
import type { IResponseData } from '@/services/typings';
import { FileInfo, GetResourceFilesParams } from '@/services/api/modules/resource/typings';

// 获取资源库文件（OSS）
async function getResourceFiles(
  params: GetResourceFilesParams,
  options?: { [key: string]: any }
) {
  return request<IResponseData<FileInfo[]>>('/oss/files', {
    method: 'GET',
    params,
    ...(options || {})
  });
}

export default {
  getResourceFiles
};
