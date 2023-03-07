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
   * 渠道
   */
  channels?: string;
  /**
   * 稿件内容
   */
  content?: string;
  /**
   * 创建时间
   */
  createdTime?: string;
  /**
   * 创建人id
   */
  creatorId?: number;
  id?: number;
  /**
   * 封面url
   */
  imgUrl?: string;
  /**
   * 素材数
   */
  materialNum?: number;
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
  stat?: number;
  /**
   * 稿件类型 ARTICLE MEDIA HTML5
   */
  type?: DraftType | string;
  /**
   * 更新时间
   */
  updatedTime?: string;
  /**
   * 负责人id
   */
  userId?: number;
}

export enum DraftType {
  ARTICLE = 'ARTICLE',
  MEDIA = 'MEDIA',
  HTML5 = 'HTML5'
}

/**
 * ProjectContributionCommentVo
 */
export interface ProjectContributionCommentVo {
  projectContributionComment?: ProjectContributionComment;
  userProfile?: UserProfile;
}

/**
 * ProjectContributionComment
 */
export interface ProjectContributionComment {
  /**
   * 评论内容
   */
  content?: string;
  /**
   * 稿件id
   */
  contributionId?: number;
  /**
   * 创建时间
   */
  createdTime?: string;
  id?: number;
  /**
   * 状态 讨论中  已解决
   */
  state?: string;
  /**
   * 用户id
   */
  userId?: number;
}
