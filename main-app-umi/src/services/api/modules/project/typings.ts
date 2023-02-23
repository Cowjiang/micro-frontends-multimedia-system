import { Department } from '@/services/api/modules/department/typings';
import { UserProfile } from '@/services/api/modules/user/typings';
import { BasePageParam, OrderItem } from '@/services/typings';

/**
 * Project
 */
export interface Project {
  createTime?: number;
  createUserId?: number;
  endTime?: number;
  groupId?: number;
  id?: number;
  isDeleted?: number;
  projectDesc?: string;
  projectName?: string;
  startTime?: number;
  stat?: string;
  updateTime?: number;
  userId?: number;
}

/**
 * ProjectMemberVo
 */
export interface ProjectMemberVo {
  department?: Department;
  userProfileList?: UserProfile[];
}

/**
 * ProjectPersonnelAllocationConfig
 */
export interface ProjectPersonnelAllocationConfig {
  /**
   * 部门id
   */
  departmentId?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 人员数量
   */
  num?: number;
  /**
   * 项目id
   */
  projectId?: number;
}
