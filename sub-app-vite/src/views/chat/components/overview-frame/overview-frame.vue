<template>
  <div class="overview-frame-container w-100 h-100 d-flex flex-column">
    <div class="overview-title-container w-100 px-4 d-flex flex-shrink-0 align-center">
      <div class="flex-grow-0 text-grey-darken-4 text-no-wrap">
        <span>我的概览</span>
      </div>
      <div class="ml-auto d-flex align-center flex-shrink-0">
        <v-btn
          color="primary"
          variant="tonal">
          编辑资料
        </v-btn>
      </div>
    </div>
    <div class="overview-content-container w-100 h-100 flex-grow-1">
      <div class="message-list-container w-100 h-0 position-relative">
        <div class="chat-header d-flex flex-column pa-6">
          <div class="w-100">
            <v-avatar
              class="flex-shrink-0"
              color="grey-lighten-2"
              size="80">
              <v-img
                :src="userInfo?.avgPath ?? ''"
                :alt="userInfo?.username ?? '未登录用户'">
                <template v-slot:placeholder>
                  <div class="w-100 h-100 d-flex justify-center align-center">
                    <span class="text-h4 text-grey-darken-2">
                      {{ userInfo?.username?.charAt(0) ?? '' }}
                    </span>
                  </div>
                </template>
              </v-img>
            </v-avatar>
          </div>
          <span class="mt-4 text-h4 text-grey-darken-4 text-no-wrap">
            Hi~ {{ userInfo?.username ?? '' }}
          </span>
          <span class="my-2 text-grey-darken-2 text-body-1">
            {{ unreadCount ? `你有${unreadCount}条未读消息，记得查看噢！` : '当前没有未读消息噢！' }}
          </span>
          <v-divider class="mt-3 mb-6" />
        </div>
        <div class="d-flex flex-column px-6">
          <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">置顶私信</span>
          <v-row>
            <v-col
              v-for="privateChat in stickyPrivateChatList"
              :key="privateChat"
              sm="12"
              md="6"
              lg="3"
            >
              <v-card
                width="inherit"
                min-width="200"
                class="bg-grey-lighten-4"
                variant="flat"
                rounded="lg"
                hover
                v-ripple
                :title="privateChat.friendInfo?.username ?? ''"
                :subtitle="`${formatTime(privateChat.message?.createdTime)}`"
              >
                <template v-slot:prepend>
                  <v-avatar
                    class="flex-shrink-0"
                    color="grey-lighten-2"
                    size="50"
                  >
                    <v-img
                      :src="privateChat.friendInfo?.avgPath"
                      alt=""
                    >
                      <template v-slot:placeholder>
                        <div class="w-100 h-100 d-flex justify-center align-center">
                          <span class="text-h5 text-grey-darken-2">
                            {{ privateChat.friendInfo?.username?.charAt(0) }}
                          </span>
                        </div>
                      </template>
                    </v-img>
                  </v-avatar>
                </template>
                <template v-slot:text>
                  <div class="d-flex align-center overflow-hidden">
                    <v-chip
                      class="flex-shrink-0"
                      size="x-small"
                      variant="tonal"
                      :color="privateChat.message?.isRead ? 'grey-darken-1' : 'red-darken-3'"
                    >
                      {{ privateChat.message?.isRead ? '已读' : '未读' }}
                    </v-chip>
                    <span
                      class="ml-1 text-truncate"
                      style="max-width: 30vw"
                    >
                      {{ privateChat.message?.content ?? '' }}
                    </span>
                  </div>
                </template>
              </v-card>
            </v-col>
            <empty v-if="!stickyPrivateChatList.length" />
          </v-row>
          <span class="mt-8 mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">置顶群聊</span>
          <v-row class="mb-8">
            <v-col
              v-for="groupChat in stickyGroupChatList"
              :key="groupChat"
              sm="12"
              md="6"
              lg="3"
            >
              <v-card
                width="100%"
                min-width="200"
                class="bg-grey-lighten-4"
                variant="flat"
                rounded="lg"
                hover
                v-ripple
                :title="groupChat.chatGroup?.groupName ?? ''"
                :subtitle="formatTime(groupChat.message?.createdTime)"
              >
                <template v-slot:prepend>
                  <v-avatar
                    class="flex-shrink-0"
                    color="grey-lighten-2"
                    size="50"
                  >
                    <v-img
                      src=""
                      alt=""
                    >
                      <template v-slot:placeholder>
                        <div class="w-100 h-100 d-flex justify-center align-center">
                          <span class="text-h5 text-grey-darken-2">
                            {{ groupChat.chatGroup?.groupName?.charAt(0) ?? '' }}
                          </span>
                        </div>
                      </template>
                    </v-img>
                  </v-avatar>
                </template>
                <template v-slot:text>
                  <div class="d-flex align-center overflow-hidden">
                    <span
                      class="text-truncate"
                      style="max-width: 30vw"
                    >
                      {{ groupChat.message?.content ?? '' }}
                    </span>
                  </div>
                </template>
              </v-card>
            </v-col>
            <empty v-if="!stickyGroupChatList.length" />
          </v-row>
        </div>
      </div>
      <loading
        v-model="loadingStatus"
        position="relative"
        enterDuration="0s"
        leave-duration="0.3s"
        z-index="1000"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Loading from '@/components/loading/loading.vue';
  import { useUserStore } from '@/store/user';
  import { chatApi } from '@/services/api';
  import { StickyChat, StickyGroupChat } from '@/services/api/modules/chat/typings';
  import { formatTime } from '@/common/formats';
  import Empty from '@/components/empty/empty.vue';

  const {appContext} = getCurrentInstance() ?? {};
  const message = appContext?.config.globalProperties.$message ?? {};
  const {userInfo} = storeToRefs(useUserStore());
  const unreadCount = ref(0);
  const stickyPrivateChatList = ref<StickyChat[]>([]);
  const stickyGroupChatList = ref<StickyGroupChat[]>([]);

  const loadingStatus = ref(true); //数据加载状态

  const init = async () => {
    const resList = await Promise.allSettled([
      chatApi.getUnreadCount(),
      chatApi.getStickyPrivateChatList(),
      chatApi.getStickyGroupChatList()
    ]).finally(() => {
      loadingStatus.value = false;
    });
    resList[0].status === 'fulfilled' && (unreadCount.value = resList[0]?.value?.data ?? 0);
    resList[1].status === 'fulfilled' && (stickyPrivateChatList.value = resList[1].value.data ?? []);
    resList[2].status === 'fulfilled' && (stickyGroupChatList.value = resList[2].value.data ?? []);
    if (resList.find(res => res.status === 'rejected')) {
      message?.error('网络异常');
    }
  };
  init();
</script>

<style scoped lang="scss">
  @import "overview-frame";
</style>
