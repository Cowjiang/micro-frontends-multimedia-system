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
   * 私聊消息
   */
  CHAT = 'chat'
}
