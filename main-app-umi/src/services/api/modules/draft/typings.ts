import { UserProfile } from '@/services/api/modules/user/typings';

/**
 * ProjectContributionVo
 */
export interface ProjectContributionVo {
  creatorInfo: UserProfile;
  projectContribution: ProjectContribution;
  userInfo: UserProfile;
}

/**
 * ProjectContribution
 */
export interface ProjectContribution {
  /**
   * 稿件内容
   */
  content?: string;
  /**
   * 创建时间
   */
  createdTime?: string;
  id?: number;
  /**
   * 封面url
   */
  imgUrl?: string;
  /**
   * 媒体文件url(音视频)
   */
  mediaUrl?: string;
  /**
   * 稿件名称
   */
  name?: string;
  /**
   * 项目id
   */
  projectId?: number;
  /**
   * 状态
   */
  state?: number;
  /**
   * 稿件类型 ARTICLE MEDIA HTML5
   */
  type?: string;
  /**
   * 更新时间
   */
  updatedTime?: string;
}
