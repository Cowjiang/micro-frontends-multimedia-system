import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import { ProjectContributionVo } from '@/services/api/modules/draft/typings';

// 获取稿件列表
async function getProjectDraftList(
  projectId: number|string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionVo[]>>(`/project/contribution/${projectId}/list`, {
    method: 'GET',
    ...(options || {})
  });
}

export default {
  getProjectDraftList
};
