import { request } from '@@/exports';
import { IResponseData, OperationHistoryVo, ResponsePage } from '@/services/typings';
import {
  DraftType,
  ProjectContribution, ProjectContributionComment,
  ProjectContributionCommentVo,
  ProjectContributionVo
} from '@/services/api/modules/draft/typings';

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
    imgUrl?: string;
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

// 删除稿件
async function deleteDraft(
  id: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/contribution/${id}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取稿件批注列表
async function getDraftCommentList(
  draftId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionCommentVo[]>>(`/project/contribution/${draftId}/comment`, {
    method: 'GET',
    ...(options || {})
  });
}

// 获取稿件批注
async function getDraftComment(
  commentId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionCommentVo>>(`/project/contribution/comment/${commentId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加稿件批注
async function addDraftComment(
  data: {
    content: string;
    contributionId: string | number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionComment>>(`/project/contribution/comment`, {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 更新稿件批注
async function updateDraftComment(
  data: {
    id: number;
    content: string;
    contributionId: string | number;
    state?: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectContributionComment>>(`/project/contribution/comment`, {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

// 删除稿件批注
async function removeDraftComment(
  commentId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/contribution/comment/${commentId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 部署预览H5
async function deployPreviewH5(
  draftId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/contribution/publish/h5/${draftId}`, {
    method: 'POST',
    ...(options || {})
  });
}

// 获取稿件操作历史
async function getOperationHistory(
  draftId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ResponsePage<OperationHistoryVo>>>(`/operation/history/contribution/${draftId}`, {
    method: 'GET',
    ...(options || {})
  });
}

export default {
  getProjectDraftList,
  getDraftDetail,
  addDraft,
  updateDraft,
  deleteDraft,
  getDraftCommentList,
  getDraftComment,
  addDraftComment,
  updateDraftComment,
  removeDraftComment,
  deployPreviewH5,
  getOperationHistory
};
