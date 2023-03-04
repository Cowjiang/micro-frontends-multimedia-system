import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import { DraftType, ProjectContribution, ProjectContributionVo } from '@/services/api/modules/draft/typings';

// 获取稿件列表
async function getProjectDraftList(
  projectId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionVo[]>>(`/project/contribution/${projectId}/list`, {
    method: 'GET',
    ...(options || {})
  });
}

// 获取稿件详情
async function getDraftDetail(
  draftId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionVo>>(`/project/contribution/${draftId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加稿件
async function addDraft(
  data: {
    projectId: number | string;
    name: string;
    content: string;
    channels: string;
    type: DraftType;
    mediaUrl?: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContribution>>(`/project/contribution`, {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 更新稿件
async function updateDraft(
  data: ProjectContribution,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContribution>>(`/project/contribution`, {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

export default {
  getProjectDraftList,
  getDraftDetail,
  addDraft,
  updateDraft
};
