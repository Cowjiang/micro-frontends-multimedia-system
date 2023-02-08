import { http } from '@/services';
import {
  Chat, GetGroupChatHistoryByGidParams,
  GetPrivateChatHistoryByUidParams,
  GetPrivateChatListParams,
  SendPrivateMessageParams,
  GroupChat,
  GroupHistoryList,
  MessageList,
  StickyChatVo, SetStickyPrivateChatParams, SetStickyGroupChatParams
} from '@/services/api/modules/chat/typings';
import { IResponseData, ResponsePage } from '@/services/typings';

// 获取消息未读数
const getUnreadCount = () => http.get<void, number>('/chat/list/count/unread');

// 获取私聊列表
const getPrivateChatList = <T extends GetPrivateChatListParams>(params: T) => http.get<T, ResponsePage<MessageList>>('/chat/list', params);

// 根据uid获取私聊记录
const getPrivateChatHistoryByUid = <T extends GetPrivateChatHistoryByUidParams>(params: T) => http.get<T, ResponsePage<Chat>>('/chat/user', params);

// 发送私信
const sendPrivateMessage = <T extends SendPrivateMessageParams>(data: T) => http.post<T, Chat>('/chat/user', data);

// 获取我的群聊列表
const getGroupChatList = () => http.get<void, GroupChat[]>('/chat/group');

// 根据GroupId获取群聊记录
const getGroupChatHistoryByGid = <T extends GetGroupChatHistoryByGidParams>({groupId}: T) => http.get<T, GroupHistoryList>(`/chat/group/${groupId}/history`);

// 获取置顶私聊列表
const getStickyPrivateChatList = () => http.get<void, StickyChatVo[]>('/chat/chat/sticky');

// 获取置顶群聊列表
const getStickyGroupChatList = () => http.get<void, GroupChat[]>('/chat/group/sticky');

// 置顶私聊
const setStickyPrivateChat = <T extends SetStickyPrivateChatParams>({friendId}: T) => http.post<T, IResponseData<null>>(`/chat/friend/${friendId}/sticky`);

// 置顶群聊
const setStickyGroupChat = <T extends SetStickyGroupChatParams>({groupId}: T) => http.post<T, IResponseData<null>>(`/chat/group/${groupId}/sticky`);

export default {
  getUnreadCount,
  getPrivateChatList,
  getPrivateChatHistoryByUid,
  sendPrivateMessage,
  getGroupChatList,
  getGroupChatHistoryByGid,
  getStickyPrivateChatList,
  getStickyGroupChatList,
  setStickyPrivateChat,
  setStickyGroupChat
};
