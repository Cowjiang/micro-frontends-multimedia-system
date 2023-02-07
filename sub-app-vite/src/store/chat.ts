import { defineStore } from 'pinia';
import { NavItemList } from '@/views/chat/components/nav-bar/typings';
import { GetPrivateChatListParams, MessageList } from '@/services/api/modules/chat/typings';
import { chatApi } from '@/services/api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    // 导航栏项目列表
    navItemList: [] as NavItemList[],
    // 当前导航栏显示的项目的序号
    currentNavItemIndex: 0,
    // 私聊列表
    privateChatList: [] as MessageList[]
  }),
  getters: {},
  actions: {
    // 获取私聊列表
    async getPrivateChatList(params: GetPrivateChatListParams) {
      await chatApi.getPrivateChatList(params).then(res => {
        this.privateChatList = res.data?.records ?? [];
      }).catch(err => {
        return Promise.reject(err);
      });
    },
    //根据roomId获取聊天消息记录
    // getChatMessageHistory(roomId: string) {
    //   const messageHistory = this.chatMessageHistory.get(roomId)
    //   return messageHistory ?? null
    // },
  }
});
