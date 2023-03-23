import { request } from '@@/exports';
import type { IResponseData } from '@/services/typings';
import { Chat, SendPrivateMessageParams } from '@/services/api/modules/chat/typings';

// 发送私聊消息
async function sendPrivateMessage(
  data: SendPrivateMessageParams,
  options?: { [key: string]: any }
) {
  return request<IResponseData<Chat>>('/chat/user', {
    method: 'POST',
    data,
    ...(options || {})
  });
}

export default {
  sendPrivateMessage
};
