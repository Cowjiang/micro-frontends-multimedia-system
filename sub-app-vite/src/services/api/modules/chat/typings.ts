import { SimpleUserInfo } from '@/services/api/modules/user/typings';
import { OrderItem, PageParamByTime } from '@/services/typings';

export interface GetPrivateChatListParams extends PageParamByTime {
}

export interface GetPrivateChatHistoryByUidParams extends PageParamByTime {
  friendId: number;
}

interface SendMessageParams {
  content: string
  isText: boolean
}

export interface SendPrivateMessageParams extends SendMessageParams {
  receiverId: number
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
