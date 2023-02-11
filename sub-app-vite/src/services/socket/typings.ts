import { MessageList } from '@/services/api/modules/chat/typings';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';

export interface SocketPrivateMessage {
  messageInfo: MessageList;
  userInfo: SimpleUserInfo;
}
