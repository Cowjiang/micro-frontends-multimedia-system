import { SimpleUserInfo } from '@/services/api/modules/user/typings';

export interface GetPrivateChatListParams {
  pageSize?: number;
  time?: number;
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
