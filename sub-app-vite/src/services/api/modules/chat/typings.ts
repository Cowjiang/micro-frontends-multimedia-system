import { SimpleUserInfo } from '@/services/api/modules/user/typings';
import { OrderItem, PageParamByTime } from '@/services/typings';

export interface GetPrivateChatListParams extends PageParamByTime {
}

export interface GetPrivateChatHistoryByUidParams extends PageParamByTime {
  friendId: number;
}

interface SendMessageParams {
  content: string;
  isText?: boolean;
  type?: string;
}

export interface SendPrivateMessageParams extends SendMessageParams {
  receiverId: number;
}

export interface SendGroupMessageParams extends SendMessageParams {
  groupId: number;
}

export interface GetGroupChatHistoryByGidParams {
  groupId: number;
}

export interface GetGroupUserListParams {
  groupId: number;
}

export interface SetStickyPrivateChatParams {
  friendId: number;
}

export interface SetStickyGroupChatParams {
  groupId: number;
}

/**
 * MessageList
 */
export interface MessageList {
  /**
   * 聊天内容
   */
  content?: string;
  /**
   * 发送时间
   */
  createdTime?: number;
  /**
   * 私信对方id
   */
  friendId?: number;
  friendInfo?: SimpleUserInfo;
  /**
   * 聊天id
   */
  id?: number;
  isBlocked?: boolean;
  /**
   * 是否逻辑删除
   */
  isDeleted?: boolean;
  /**
   * 接收方是否已读
   */
  isRead?: boolean;
  /**
   * 是或否为纯文本
   */
  isText?: boolean;
  /**
   * 接受者id
   */
  receiverId?: number;
  /**
   * 发送方id
   */
  senderId?: number;
  unread?: number;
  /**
   * 用户id
   */
  userId?: number;
}

/**
 * Chat
 */
export interface Chat {
  /**
   * 聊天内容
   */
  content?: string;
  /**
   * 发送时间
   */
  createdTime?: number;
  /**
   * 私信对方id
   */
  friendId?: number;
  /**
   * 聊天id
   */
  id?: number;
  /**
   * 是否逻辑删除
   */
  isDeleted?: boolean;
  /**
   * 接收方是否已读
   */
  isRead?: boolean;
  /**
   * 是或否为纯文本
   */
  isText?: boolean;
  /**
   * 接受者id
   */
  receiverId?: number;
  /**
   * 发送方id
   */
  senderId?: number;
  /**
   * 用户id
   */
  userId?: number;
}

export interface StickyChat {
  friendInfo?: SimpleUserInfo;
  message?: Chat;
}

export interface StickyGroupChat extends GroupChat {
}

export interface GroupChat {
  chatGroup?: ChatGroup;
  chatGroupHistory?: ChatGroupHistory;
  userInfo?: SimpleUserInfo;
}

/**
 * ChatGroup
 */
export interface ChatGroup {
  /**
   * 创建时间
   */
  createTime?: number;
  /**
   * 创建者id
   */
  creatorId?: number;
  /**
   * 群聊名称
   */
  groupName?: string;
  /**
   * 主键
   */
  id?: number;
}

/**
 * GroupHistoryList
 */
export interface GroupHistoryList {
  message?: ChatGroupHistory;
  userInfo?: UserProfile;
}

/**
 * UserProfile
 */
export interface UserProfile {
  /**
   * 详细地址
   */
  addressDetails?: string;
  /**
   * 行政区代码
   */
  areaCode?: string;
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 封面图片
   */
  coverUrl?: string;
  /**
   * 信用积分
   */
  credit?: number;
  /**
   * 性别:1 男 0 女
   */
  gender?: number;
  /**
   * 积分
   */
  point?: number;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * 个性签名
   */
  signature?: string;
  /**
   * 修改时间
   */
  updatedTime?: number;
  userId?: number;
  /**
   * 用户名
   */
  username?: string;
}

/**
 * ChatGroupHistory
 */
export interface ChatGroupHistory {
  /**
   * 内容
   */
  content?: string;
  /**
   * 发送时间
   */
  createdTime?: number;
  /**
   * 群id
   */
  groupId?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 发送方id
   */
  senderId?: number;
  /**
   * 是否为纯文本
   */
  type?: string;
}

export enum ChatMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}
