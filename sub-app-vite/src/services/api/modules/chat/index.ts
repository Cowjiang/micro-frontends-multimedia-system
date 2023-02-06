import { http } from '@/services';
import { GetPrivateChatListParams, MessageList } from '@/services/api/modules/chat/typings';
import { ResponsePage } from '@/services/typings';

// 获取私聊列表
const getPrivateChatList = (params: GetPrivateChatListParams) => http.get<GetPrivateChatListParams, ResponsePage<MessageList>>('/api/chat/list', params);

export default {
  getPrivateChatList
};
