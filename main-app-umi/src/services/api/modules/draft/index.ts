import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import {
  DraftType,
  ProjectContribution,
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

export default {
  getProjectDraftList,
  getDraftDetail,
  addDraft,
  updateDraft,
  getDraftCommentList,
  getDraftComment
};
