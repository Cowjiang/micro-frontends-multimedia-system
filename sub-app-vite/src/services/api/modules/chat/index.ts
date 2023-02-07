import { http } from '@/services';
import {
  Chat,
  GetPrivateChatHistoryByUidParams,
  GetPrivateChatListParams,
  MessageList,
  SendPrivateMessageParams
} from '@/services/api/modules/chat/typings';
import { ResponsePage } from '@/services/typings';

// 获取私聊列表
const getPrivateChatList = <T extends GetPrivateChatListParams>(params: T) => http.get<T, ResponsePage<MessageList>>('/chat/list', params);

// 根据uid获取私聊记录
const getPrivateChatHistoryByUid = <T extends GetPrivateChatHistoryByUidParams>(params: T) => http.get<T, ResponsePage<Chat>>('/chat/user', params);

const sendPrivateMessage = <T extends SendPrivateMessageParams>(data: T) => http.post<T, Chat>('/chat/user', data);

export default {
  getPrivateChatList,
  getPrivateChatHistoryByUid,
  sendPrivateMessage
};
