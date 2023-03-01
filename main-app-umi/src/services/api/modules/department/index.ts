import { request } from '@@/exports';
import { IResponseData } from '@/services/typings';
import {
  AddUserRole,
  DepartMemberListVo,
  Department,
  UserPermission,
  UserRole
} from '@/services/api/modules/department/typings';

// 获取部门列表
async function getDepartmentList(
  options?: { [key: string]: any }
) {
  return request<IResponseData<Department[]>>('/department/list', {
    method: 'GET',
    ...(options || {})
  });
}

// 获取部门详情
async function getDepartmentDetail(
  departmentId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<Department>>(`/department/${departmentId}/detail`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加部门
async function addDepartment(
  data: {
    description?: string;
    name?: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/department/save', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 修改部门信息
async function updateDepartment(
  data: {
    id: number;
    description?: string;
    name?: string;
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>('/department/update', {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

// 删除部门
async function deleteDepartment(
  departmentId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/${departmentId}/delete`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取部门成员
async function getDepartmentUser(
  departmentId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<DepartMemberListVo[]>>(`/department/${departmentId}/user`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加部门成员
async function addDepartmentUser(
  data: {
    departmentId: string | number,
    userId: string | number,
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/${data.departmentId}/user`, {
    method: 'POST',
    data: {
      userId: data.userId
    },
    ...(options || {})
  });
}

// 移除部门成员
async function removeDepartmentUser(
  data: {
    departmentId: string | number,
    userId: string | number,
  },
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/${data.departmentId}/user/${data.userId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 获取部门成员角色
async function getDepartmentUserRoles(
  departmentId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<UserRole[]>>(`/department/${departmentId}/roles`, {
    method: 'GET',
    ...(options || {})
  });
}

// 获取部门可分配权限
async function getDepartmentPermissions(
  departmentId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<UserPermission[]>>(`/department/${departmentId}/permission`, {
    method: 'GET',
    ...(options || {})
  });
}

// 添加部门成员角色
async function addDepartmentUserRole(
  departmentId: string | number,
  data: AddUserRole,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/${departmentId}/role`, {
    method: 'POST',
    data,
    ...(options || {})
  });
}

// 修改部门成员角色
async function updateDepartmentUserRole(
  departmentId: string | number,
  data: AddUserRole,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/${departmentId}/role`, {
    method: 'PUT',
    data,
    ...(options || {})
  });
}

// 移除部门成员角色
async function removeDepartmentUserRole(
  roleId: string | number,
  options?: { [key: string]: any }
) {
  return request<IResponseData<any>>(`/department/role/${roleId}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

export default {
  getDepartmentList,
  getDepartmentDetail,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentUser,
  addDepartmentUser,
  removeDepartmentUser,
  getDepartmentUserRoles,
  getDepartmentPermissions,
  addDepartmentUserRole,
  updateDepartmentUserRole,
  removeDepartmentUserRole
};
