import { request } from '@@/exports';
import { IResponseData, OperationHistoryVo, ResponsePage } from '@/services/typings';
import {
  Project,
  ProjectMemberVo,
  ProjectPersonnelAllocationConfig,
  ProjectVo
} from '@/services/api/modules/project/typings';

// 获取项目列表
async function getProjectList(
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo[]>>('/project/list', {
    method: 'GET',
    ...(options || {})
  });
}

// 获取用户参加的项目列表
async function getMyProjectList(
  userId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo[]>>(`/project/list/user/${userId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 获取部门下的项目列表
async function getDepartmentProjectList(
  departmentId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo[]>>(`/project/list/department/${departmentId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 获取超级项目列表
async function getSuperProjectList(
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo[]>>('/project/list/super', {
    method: 'GET',
    ...(options || {})
  });
}

// 获取项目详情
async function getProjectDetail(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo>>(`/project/${projectId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 创建项目
async function createProject(
  data: {
    projectName?: string;
    projectDesc?: string;
    startTime?: number;
    endTime?: number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<Project>>('/project/save', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 修改项目信息
async function updateProject(
  data: {
    id: number;
    projectName?: string;
    projectDesc?: string;
    startTime?: number;
    endTime?: number;
    stat?: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/project/update', {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

// 删除项目
async function deleteProject(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/${projectId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取项目人员指派配置
async function getProjectMemberConfig(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectPersonnelAllocationConfig[]>>(`/project/${projectId}/member/config`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加项目人员指派信息（添加单个）
async function addProjectMemberConfig(
  data: {
    departmentId: number;
    num: number;
    projectId: number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/project/member/config', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 修改项目人员指派信息（修改单个）
async function updateProjectMemberConfig(
  data: {
    id: number;
    departmentId: number;
    num: number;
    projectId: number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/project/member/config', {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

// 删除项目人员指派信息（单个）
async function deleteProjectMemberConfig(
  configId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/member/config/${configId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取项目已指派成员
async function getProjectMember(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectMemberVo[]>>(`/project/${projectId}/member`, {
    method: 'GET',
    ...(options || {})
  });
}

// 指派成员到项目
async function addProjectMember(
  data: {
    projectId: number;
    userId: number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/${data.projectId}/member/${data.userId}`, {
    method: 'POST',
    ...(options || {})
  });
}

// 撤销指派成员到项目
async function deleteProjectMember(
  data: {
    projectId: number;
    userId: number;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/${data.projectId}/member/${data.userId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取星标项目列表
async function getStaredProjectList(
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectVo[]>>('/project/list/star', {
    method: 'GET',
    ...(options || {})
  });
}

// 设置项目星标状态
async function setProjectStarStatus(
  data: {
    id: number;
    starFlag: 0 | 1;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/project/${data.id}/star/${data.starFlag}`, {
    method: 'PUT',
    ...(options || {})
  });
}

// 获取项目操作历史
async function getOperationHistory(
  projectId: number | string,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ResponsePage<OperationHistoryVo>>>(`/operation/history/project/${projectId}`, {
    method: 'GET',
    params: {
      pageNumber: 1,
      pageSize: 1000
    },
    ...(options || {})
  });
}

export default {
  getProjectList,
  getMyProjectList,
  getDepartmentProjectList,
  getSuperProjectList,
  getProjectDetail,
  createProject,
  updateProject,
  deleteProject,
  getProjectMemberConfig,
  addProjectMemberConfig,
  updateProjectMemberConfig,
  deleteProjectMemberConfig,
  getProjectMember,
  addProjectMember,
  deleteProjectMember,
  getStaredProjectList,
  setProjectStarStatus,
  getOperationHistory
};
