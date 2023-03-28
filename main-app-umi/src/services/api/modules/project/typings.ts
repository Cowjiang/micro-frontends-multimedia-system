import { Department } from '@/services/api/modules/department/typings';
import { UserProfile } from '@/services/api/modules/user/typings';

/**
 * ProjectVo
 */
export interface ProjectVo {
  charge: UserProfile;
  /**
   * 稿件数
   */
  contributionNum?: number;
  creator: UserProfile;
  project: Project;
}

/**
 * Project
 */
export interface Project {
  /**
   * 创建时间
   */
  createdTime?: number;
  /**
   * 创建人id
   */
  createUserId?: number;
  /**
   * 结束时间
   */
  endTime?: number;
  groupId?: number;
  id?: number;
  isDeleted?: number;
  projectDesc?: string;
  /**
   * 项目名称
   */
  projectName?: string;
  star?: number;
  /**
   * 开始时间
   */
  startTime?: number;
  stat?: string;
  /**
   * 创建时间
   */
  updatedTime?: number;
  /**
   * 负责人id
   */
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
