import { ChatGroupHistory, MessageList } from '@/services/api/modules/chat/typings';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';
import { ChatType } from '@/typings';

export interface SocketChatMessage {
  chatType: ChatType;
  message: SocketPrivateChatMessage | SocketGroupChatMessage;
}

export interface SocketGroupChatMessage {
  userInfo: SimpleUserInfo;
  message: ChatGroupHistory;
}

export interface SocketPrivateChatMessage {
  userInfo: SimpleUserInfo;
  messageInfo: MessageList;
}
