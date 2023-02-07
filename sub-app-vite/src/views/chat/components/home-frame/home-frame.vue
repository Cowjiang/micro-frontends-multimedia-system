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
            <i class="fa-solid fa-users mr-3"></i>
            <span>我的好友</span>
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
          私信
        </div>
        <div class="chat-list-container">
          <v-hover
            v-slot="{ isHovering, props }"
            v-for="(chat, index) in privateChatList"
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
                  :src="chat.friendInfo?.avgPath"
                  :alt="chat.friendInfo?.username">
                  <template v-slot:placeholder>
                    <div class="w-100 h-100 d-flex justify-center align-center">
                      <span class="text-h6 font-weight-bold text-grey-darken-3">
                        {{ chat.friendInfo?.username.charAt(0) }}
                      </span>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
              <div class="ml-2 mr-4 w-100 d-flex flex-column overflow-hidden text-no-wrap">
                <div class="d-flex overflow-hidden">
                  <span class="w-100 mr-2 flex-grow-1 text-subtitle-2 text-grey-darken-3 font-weight-bold">
                    {{ chat.friendInfo?.username ?? '' }}
                  </span>
                  <span class="ml-auto flex-shrink-0 text-caption text-grey-lighten-1">
                    {{ formatTime(chat.createdTime) }}
                  </span>
                </div>
                <span class="text-sm-body-2 text-grey-darken-2">
                  {{ chat.isText ? chat.content : '[图片]' }}
                </span>
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
                {{ chat.friendInfo?.username ?? '' }}
              </v-tooltip>
            </div>
          </v-hover>
        </div>
      </div>
      <div class="bottom-mask"></div>
    </div>
    <div class="home-main-container h-100 flex-grow-1">
      <!--      <friend-frame-->
      <!--        v-if="currentNavItemIndex === -1"-->
      <!--        :friend-type="currentFriendListType" />-->
      <!--      <chat-frame-->
      <!--        v-else-->
      <!--        :chat-info="currentChatInfo"-->
      <!--        @send="handleMessageSent" />-->
      <chat-frame
        v-if="currentNavItemIndex !== -1"
        :chat-info="currentChatInfo"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ChatFrame from '@/views/chat/components/chat-drame/chat-frame.vue';
  import { useChatStore } from '@/store/chat';
  import { formatTime } from '@/common/formats';
  import { ChatType } from '@/typings';
  import { ChatInfo } from '@/views/chat/components/chat-drame/typings';

  const chatStore = useChatStore();
  const {privateChatList} = storeToRefs(chatStore);
  const router = useRouter();
  const route = useRoute();
  const currentNavItemIndex = ref(-1); //当前左侧列表导航栏聚焦项的序号
  const currentFriendListType = ref(0); //好友列表的类型
  const currentChatInfo = ref<ChatInfo | {}>({}); //当前聊天信息

  /**
   * 左侧菜单点击事件
   * @param index 菜单项序号
   */
  const handleNavItemClick = (index: number): void => {
    currentNavItemIndex.value = index;
    if (index === -1) {
      router.replace({
        name: 'friend',
        params: {
          friendType: 'all'
        }
      });
    } else {
      router.replace({
        name: 'chat',
        params: {
          chatType: ChatType.PRIVATE,
          id: privateChatList.value[index].id
        }
      });
      const {friendId, friendInfo, content, createdTime} = privateChatList.value[currentNavItemIndex.value];
      currentChatInfo.value = {
        id: friendId,
        avatarUrl: friendInfo?.avgPath ?? '',
        username: friendInfo?.username ?? '',
        lastMessage: content,
        time: createdTime
      };
    }
  };

  /**
   * 发送消息的回调事件
   * @param message 消息内容
   */
  const handleMessageSent = (message: any) => {
    privateChatList.value.map(item => {
      if (item.id === message.roomId) {
        // @ts-ignore
        store.chatList.unshift(store.chatList.pop());
        item.createdTime = Number(new Date());
        // @ts-ignore
        item.lastMessage = message.messageType === 'image' ? '[图片]' : message.message;
        currentNavItemIndex.value = 0;
      }
    });
  };

  watch(
    () => route.params,
    ({id, friendType}) => {
      if (id) {
        const chatIndex = privateChatList.value.findIndex(chat => String(chat.id) === id);
        if (chatIndex !== -1) {
          currentNavItemIndex.value = chatIndex;
        } else {
          router.replace('/chat/home');
        }
      } else if (friendType) {
        const index = ['all', 'online', 'request', 'block'].findIndex(v => v === friendType);
        currentFriendListType.value = (index === -1 ? 0 : index);
      }
    },
    {immediate: true}
  );

  onMounted(() => {
    if (route.params.id) {
      const chatListWatcher = watch(
        () => privateChatList.value,
        () => {
          const chatIndex = privateChatList.value.findIndex(chat => String(chat.id) === route.params.id);
          if (chatIndex !== -1) {
            currentNavItemIndex.value = chatIndex;
          } else {
            router.replace({
              name: 'friend',
              params: {
                friendType: 'all'
              }
            });
          }
          chatListWatcher();
        }
      );
    }
  });
</script>

<style lang="scss" scoped>
  @import "home-frame";
  @include scrollbar-hidden;
</style>
