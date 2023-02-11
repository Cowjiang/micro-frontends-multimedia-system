import { defineStore } from 'pinia';
import { NavItemList } from '@/views/chat/components/nav-bar/typings';
import { GetPrivateChatListParams, GroupChat, MessageList } from '@/services/api/modules/chat/typings';
import { chatApi } from '@/services/api';
import { SocketPrivateMessage } from '@/services/socket/typings';

export const useChatStore = defineStore('chat', {
  state: () => ({
    // 导航栏项目列表
    navItemList: [] as NavItemList[],
    // 当前导航栏显示的项目的序号
    currentNavItemIndex: 0,
    // 私聊列表
    privateChatList: [] as MessageList[],
    // 群聊列表
    groupChatList: [] as GroupChat[]
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
    // 获取群聊列表
    async getGroupChatList() {
      await chatApi.getGroupChatList().then(res => {
        this.groupChatList = res.data ?? [];
      }).catch(err => {
        return Promise.reject(err);
      });
    },
    // 收到新私信
    receivePrivateChatMessage(message: SocketPrivateMessage) {
      const newMessage = message.messageInfo;
      const findIndex = this.privateChatList.findIndex(message => message.friendId === newMessage.friendId);
      if (findIndex !== -1) {
        // 消息列表中存在的消息
        const messageTemp = this.privateChatList[findIndex];
        this.privateChatList.splice(findIndex, 1);
        this.privateChatList.unshift({
          ...newMessage,
          friendId: messageTemp.friendId,
          friendInfo: messageTemp.friendInfo,
          senderId: messageTemp.senderId,
          unread: (messageTemp.unread ?? 0) + 1 || 1
        });
      } else {
        // 消息列表中不存在的消息
        this.privateChatList.unshift({
          ...newMessage,
          friendInfo: message.userInfo,
          unread: 1
        });
      }
    }
  }
});
