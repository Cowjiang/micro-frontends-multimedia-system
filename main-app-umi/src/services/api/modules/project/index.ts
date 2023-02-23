import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import {
  Project,
  ProjectMemberVo,
  ProjectPersonnelAllocationConfig,
} from '@/services/api/modules/project/typings';

// 获取项目列表
async function getProjectList(
  options?: { [key: string]: any }
) {
  return request<IResponseData<Project[]>>('/project/list', {
    method: 'GET',
    ...(options || {})
  });
}

// 获取项目详情
async function getProjectDetail(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<Project>>(`/project/${projectId}`, {
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

// 添加项目信息（添加单个）
async function addProjectMemberConfig(
  data: {
    id: number;
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

// 修改项目信息（修改单个）
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

// 获取项目已指派成员
async function getProjectMember(
  projectId: number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<ProjectMemberVo>>(`/project/${projectId}/member`, {
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

export default {
  getProjectList,
  getProjectDetail,
  createProject,
  updateProject,
  deleteProject,
  addProjectMemberConfig,
  updateProjectMemberConfig,
  getProjectMember,
  addProjectMember,
  deleteProjectMember
};