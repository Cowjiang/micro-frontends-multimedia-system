import { http } from '@/services';
import {
  Chat,
  GetPrivateChatHistoryByUidParams,
  GetPrivateChatListParams,
  MessageList,
  SendPrivateMessageParams
} from '@/services/api/modules/chat/typings';
import { ResponsePage } from '@/services/typings';

// 获取消息未读数
const getUnreadCount = () => http.get<void, number>('/chat/list/count/unread');

// 获取私聊列表
const getPrivateChatList = <T extends GetPrivateChatListParams>(params: T) => http.get<T, ResponsePage<MessageList>>('/chat/list', params);

// 根据uid获取私聊记录
const getPrivateChatHistoryByUid = <T extends GetPrivateChatHistoryByUidParams>(params: T) => http.get<T, ResponsePage<Chat>>('/chat/user', params);

// 发送私信
const sendPrivateMessage = <T extends SendPrivateMessageParams>(data: T) => http.post<T, Chat>('/chat/user', data);

export default {
  getUnreadCount,
  getPrivateChatList,
  getPrivateChatHistoryByUid,
  sendPrivateMessage
};
