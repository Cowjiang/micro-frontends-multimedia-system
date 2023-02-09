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

export interface StickyGroupChat {
  chatGroup?: ChatGroup;
  message?: ChatGroupHistory;
  userInfo?: SimpleUserInfo;
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
 * GroupHistoryListVo
 */
export interface GroupHistoryList {
  message?: ChatGroupHistory;
  userInfo?: SimpleUserInfo;
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

