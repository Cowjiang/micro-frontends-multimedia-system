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
 * SimpleUserInfo
 */
export interface SimpleUserInfo {
  /**
   * 头像
   */
  avgPath?: string;
  /**
   * 用户id
   */
  id?: number;
  /**
   * 用户id
   */
  userId?: number;
  /**
   * 是否被关注
   */
  isConcerned?: boolean;
  /**
   * 是否关注
   */
  isFriend?: boolean;
  /**
   * 勋章
   */
  medals?: Medal[];
  /**
   * 个人简介
   */
  signature?: string;
  /**
   * 用户名
   */
  username?: string;
}

/**
 * Medal
 */
export interface Medal {
  createdTime?: number;
  desc?: string;
  id?: number;
  isDeleted?: boolean;
  name?: string;
  stat?: number;
  style?: string;
}
