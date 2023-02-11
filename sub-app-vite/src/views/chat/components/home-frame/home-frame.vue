<template>
  <div class="home-frame-container w-100 h-100 d-flex">
    <div class="home-nav-container h-100 d-flex flex-column flex-grow-0 flex-shrink-0 overflow-y-auto">
      <div class="nav-top-container pa-5">
        <v-btn
          class="w-100 text-grey-darken-1"
          color="#e5e5ea"
          height="32"
          :flat="true">
          <i class="fas fa-search mr-1" />
          <span>搜索</span>
        </v-btn>
        <v-divider class="mt-4" color="#e5e5ea" />
      </div>
      <div class="nav-list-container mt-3 pt-3">
        <v-hover v-slot="{ isHovering, props }">
          <div
            class="my-friends-btn d-flex align-center position-relative ml-2 pl-4 py-6 text-subtitle-1 text-grey-darken-3 font-weight-bold"
            :class="[
              currentNavItemIndex === -1 ? 'nav-item__focus' : '',
              isHovering && currentNavItemIndex !== -1 ? 'nav-item__hover' : ''
            ]"
            v-bind="props"
            @click="handleNavItemClick(-1)">
            <i class="fa-solid fa-chart-pie mr-3"></i>
            <span>我的概览</span>
            <svg
              v-show="currentNavItemIndex === -1"
              width="16px"
              class="top-svg position-absolute"
              height="16px">
              <path d="M0 16 Q 16,16 16 0 L 16,16 Z"></path>
            </svg>
            <svg
              v-show="currentNavItemIndex === -1"
              width="16px"
              class="bottom-svg position-absolute"
              height="16px">
              <path d="M0 0 Q 16,0 16 16 L 16,0 Z"></path>
            </svg>
          </div>
        </v-hover>
        <div class="ml-4 mt-7 mb-2 text-body-2 text-grey-darken-4">
          我的{{ props.chatType === ChatType.PRIVATE ? '私信' : '群聊' }}
        </div>
        <div class="chat-list-container">
          <v-hover
            v-slot="{ isHovering, props }"
            v-for="(chat, index) in chatNavItemList"
            :key="chat.id">
            <div
              class="nav-chat-item d-flex align-center position-relative ml-2 pl-2 py-6"
              :class="[
                currentNavItemIndex === index ? 'nav-item__focus' : '',
                isHovering && currentNavItemIndex !== index ? 'nav-item__hover' : ''
              ]"
              v-bind="props"
              @click="handleNavItemClick(index)">
              <v-avatar
                class="flex-shrink-0"
                color="grey-lighten-2"
                size="default">
                <v-img
                  :src="chat.avgPath"
                  alt="">
                  <template v-slot:placeholder>
                    <div class="w-100 h-100 d-flex justify-center align-center">
                      <span class="text-h6 font-weight-bold text-grey-darken-2">
                        {{ chat.avgChar }}
                      </span>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
              <div class="ml-2 mr-4 w-100 d-flex flex-column overflow-hidden text-no-wrap">
                <div class="d-flex overflow-hidden">
                  <span class="w-100 mr-2 flex-grow-1 text-subtitle-2 text-grey-darken-3 font-weight-bold">
                    {{ chat.name }}
                  </span>
                  <span class="ml-auto flex-shrink-0 text-caption text-grey-lighten-1">
                    {{ chat.createTime }}
                  </span>
                </div>
                <div class="d-flex overflow-hidden">
                  <span
                    class="w-100 mr-2 flex-grow-1 text-sm-body-2 text-grey-darken-2"
                    style="min-height: 1rem"
                  >
                    {{ chat?.content ?? '' }}
                  </span>
                  <div class="ml-auto flex-shrink-0 text-caption" v-if="chat.unread">
                    <v-badge
                      dot
                      color="red-darken-3"
                      :max="99"
                      inline />
                    <span class="text-red-darken-3">
                      {{ chat.unread > 99 ? '99+' : chat.unread }}条
                    </span>
                  </div>
                </div>
              </div>
              <svg
                v-show="currentNavItemIndex === index"
                width="16px"
                class="top-svg position-absolute"
                height="16px">
                <path d="M0 16 Q 16,16 16 0 L 16,16 Z"></path>
              </svg>
              <svg
                v-show="currentNavItemIndex === index"
                width="16px"
                class="bottom-svg position-absolute"
                height="16px">
                <path d="M0 0 Q 16,0 16 16 L 16,0 Z"></path>
              </svg>
              <v-tooltip
                activator="parent"
                location="end">
                {{ chat.name }}
              </v-tooltip>
            </div>
          </v-hover>
        </div>
      </div>
      <div class="bottom-mask"></div>
    </div>
    <div class="home-main-container h-100 flex-grow-1">
      <chat-frame
        v-if="currentNavItemIndex !== -1 && currentChatInfo?.id"
        :chat-info="currentChatInfo"
        @private-message-sent="handlePrivateMessageSent"
        @group-message-sent="handleGroupMessageSent"
      />
      <overview-frame
        v-else
        @private-message-click="handlePrivateMessageSent"
        @group-message-click="handleGroupMessageSent"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ChatFrame from '@/views/chat/components/chat-drame/chat-frame.vue';
  import OverviewFrame from '@/views/chat/components/overview-frame/overview-frame.vue';
  import { useChatStore } from '@/store/chat';
  import { useUserStore } from '@/store/user';
  import { formatTime } from '@/common/formats';
  import { ChatType } from '@/typings';
  import { ChatInfo } from '@/views/chat/components/chat-drame/typings';
  import { ChatMessageType, GroupChat, MessageList } from '@/services/api/modules/chat/typings';

  interface Props {
    chatType: ChatType;
  }

  const props = withDefaults(defineProps<Props>(), {});
  const chatStore = useChatStore();
  const {userInfo} = storeToRefs(useUserStore());
  const {privateChatList, groupChatList, currentNavItemIndex: chatTypeIndex} = storeToRefs(chatStore);
  const router = useRouter();
  const route = useRoute();
  const currentNavItemIndex = ref(-1); //当前左侧列表导航栏聚焦项的序号
  const currentChatInfo = ref<ChatInfo | {}>({}); //当前聊天信息

  const chatNavItemList = computed(() => {
    if (props.chatType === ChatType.PRIVATE) {
      return privateChatList.value.map(chat => ({
        id: chat.id,
        avgPath: chat.friendInfo?.avgPath ?? '',
        avgChar: chat.friendInfo?.username?.charAt(0) ?? '',
        name: chat.friendInfo?.username ?? '',
        content: chat.isText ? chat.content : '[图片]',
        createdTime: formatTime(chat.createdTime ?? ''),
        unread: chat.unread
      }));
    } else {
      return groupChatList.value.map(chat => ({
        id: chat.chatGroup?.id,
        avgPath: '',
        avgChar: chat.chatGroup?.groupName?.charAt(0) ?? '',
        name: chat.chatGroup?.groupName ?? '',
        content:
          chat.chatGroupHistory?.content
            ? `${chat.userInfo?.userId === userInfo.value.userId
              ? '我'
              : chat.userInfo?.username}：${chat.chatGroupHistory.type === ChatMessageType.IMAGE ? '[图片]' : chat.chatGroupHistory?.content}`
            : '',
        createdTime: formatTime(chat.chatGroupHistory?.createdTime ?? ''),
        unread: 0
      }));
    }
  });

  /**
   * 左侧菜单点击事件
   * @param index 菜单项序号
   */
  const handleNavItemClick = (index: number): void => {
    if (currentNavItemIndex.value === index) {
      return;
    }
    currentNavItemIndex.value = index;
    if (index === -1) {
      router.replace('/chat/home');
    } else {
      if (props.chatType === ChatType.PRIVATE) {
        const {id, friendId, friendInfo} = privateChatList.value[currentNavItemIndex.value];
        currentChatInfo.value = {
          id,
          targetId: friendId,
          avatarUrl: friendInfo?.avgPath ?? '',
          targetName: friendInfo?.username ?? '',
          type: ChatType.PRIVATE
        };
        privateChatList.value[index].unread = 0;
        router.replace({
          name: 'chat',
          params: {
            chatType: ChatType.PRIVATE,
            id: privateChatList.value[index].friendId
          }
        });
      } else {
        const {chatGroup} = groupChatList.value[currentNavItemIndex.value];
        currentChatInfo.value = {
          id: chatGroup?.id,
          targetId: chatGroup?.id,
          targetName: chatGroup?.groupName ?? '',
          type: ChatType.GROUP
        };
        router.replace({
          name: 'chat',
          params: {
            chatType: ChatType.GROUP,
            id: groupChatList.value[currentNavItemIndex.value].chatGroup?.id
          }
        });
      }
    }
  };

  // 私聊发送消息的回调事件
  const handlePrivateMessageSent = (message: MessageList) => {
    const currentIdx = privateChatList.value.findIndex(chat => chat.friendId === message.friendId);
    if (currentIdx !== -1) {
      privateChatList.value.splice(currentIdx, 1);
      privateChatList.value.unshift(message);
      currentNavItemIndex.value = 0;
    } else {
      privateChatList.value.unshift(message);
    }
  };

  // 群聊发送消息的回调事件
  const handleGroupMessageSent = (message: GroupChat) => {
    const currentIdx = groupChatList.value.findIndex(({chatGroup}) => chatGroup?.id === message.chatGroup?.id);
    if (currentIdx !== -1) {
      groupChatList.value.splice(currentIdx, 1);
      groupChatList.value.unshift(message);
      currentNavItemIndex.value = 0;
    } else {
      groupChatList.value.unshift(message);
    }
  };

  watch(
    () => props.chatType,
    (nval, oval) => {
      if (nval !== oval) {
        currentNavItemIndex.value = -1;
      }
    }
  );

  watch(
    () => [privateChatList.value, groupChatList.value, route.params],
    () => {
      const {id, chatType} = route.params;
      if (chatType === ChatType.PRIVATE) {
        chatTypeIndex.value = 0;
      } else if (chatType === ChatType.GROUP) {
        chatTypeIndex.value = 1;
      }
      if (id) {
        if (chatType === ChatType.PRIVATE) {
          const chatIndex = privateChatList.value.findIndex(chat => String(chat.friendId) === route.params.id);
          if (chatIndex !== -1) {
            setTimeout(() => handleNavItemClick(chatIndex), 0);
            return;
          }
        } else {
          const chatIndex = groupChatList.value.findIndex(chat => String(chat.chatGroup?.id) === id);
          if (chatIndex !== -1) {
            setTimeout(() => handleNavItemClick(chatIndex), 0);
            return;
          }
        }
        router.replace('/chat/home');
      }
    }
  );
</script>

<style lang="scss" scoped>
  @import "home-frame";
  @include scrollbar-hidden;
</style>
