import { http } from '@/services';
import {
  Chat, GetGroupChatHistoryByGidParams,
  GetPrivateChatHistoryByUidParams,
  GetPrivateChatListParams,
  SendPrivateMessageParams,
  SetStickyPrivateChatParams,
  SetStickyGroupChatParams,
  SendGroupMessageParams,
  StickyChat,
  StickyGroupChat,
  GroupChat,
  GroupHistoryList,
  MessageList,
  ChatGroupHistory, GetGroupUserListParams, UserProfile
} from '@/services/api/modules/chat/typings';
import { ResponsePage } from '@/services/typings';

// 获取消息未读数
const getUnreadCount = () => http.get<void, number>('/chat/list/count/unread');

// 获取私聊列表
const getPrivateChatList = <T extends GetPrivateChatListParams>(params: T) => http.get<T, ResponsePage<MessageList>>('/chat/list', params);

// 根据uid获取私聊记录
const getPrivateChatHistoryByUid = <T extends GetPrivateChatHistoryByUidParams>(params: T) => http.get<T, ResponsePage<Chat>>('/chat/user', params);

// 发送私聊消息
const sendPrivateMessage = <T extends SendPrivateMessageParams>(data: T) => http.post<T, Chat>('/chat/user', data);

// 获取我的群聊列表
const getGroupChatList = () => http.get<void, GroupChat[]>('/chat/group');

// 根据GroupId获取群聊记录
const getGroupChatHistoryByGid = <T extends GetGroupChatHistoryByGidParams>({groupId}: T) => http.get<T, GroupHistoryList[]>(`/chat/group/${groupId}/history`);

// 发送群聊消息
const sendGroupMessage = <T extends SendGroupMessageParams>(data: T) => http.post<T, ChatGroupHistory>(`/chat/group/${data.groupId}/send`, data);

// 获取群聊用户名单
const getGroupUserList = <T extends GetGroupUserListParams>(params: T) => http.get<void, UserProfile[]>(`/chat/group/${params.groupId}/users`);

// 获取置顶私聊列表
const getStickyPrivateChatList = () => http.get<void, StickyChat[]>('/chat/chat/sticky');

// 获取置顶群聊列表
const getStickyGroupChatList = () => http.get<void, StickyGroupChat[]>('/chat/group/sticky');

// 置顶私聊
const setStickyPrivateChat = <T extends SetStickyPrivateChatParams>({friendId}: T) => http.post<T, null>(`/chat/friend/${friendId}/sticky`);

// 置顶群聊
const setStickyGroupChat = <T extends SetStickyGroupChatParams>({groupId}: T) => http.post<T, null>(`/chat/group/${groupId}/sticky`);

export default {
  getUnreadCount,
  getPrivateChatList,
  getPrivateChatHistoryByUid,
  sendPrivateMessage,
  getGroupChatList,
  getGroupChatHistoryByGid,
  sendGroupMessage,
  getGroupUserList,
  getStickyPrivateChatList,
  getStickyGroupChatList,
  setStickyPrivateChat,
  setStickyGroupChat
};
