export interface SocketMessage {
  type: SocketMessageType;
  message: any;
}

export enum SocketMessageType {
  /**
   * 系统消息，忽略
   */
  IGNORE = 'ignore',
  /**
   * 聊天消息
   */
  CHAT = 'chat'
}
