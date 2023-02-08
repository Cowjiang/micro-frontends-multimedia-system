<template>
  <div class="overview-frame-container w-100 h-100 d-flex flex-column">
    <div class="overview-title-container w-100 px-4 d-flex flex-shrink-0 align-center">
      <div class="flex-grow-0 text-grey-darken-4 text-no-wrap">
        <span>我的概览览</span>
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
                :alt="userInfo?.username ?? '未登录用户'" />
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
              v-for="n in 3"
              :key="n"
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
                title="This is a title"
                subtitle="This is a subtitle"
                text="This is content"
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
                    />
                  </v-avatar>
                </template>
              </v-card>
            </v-col>
          </v-row>
          <span class="mt-8 mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">置顶群聊</span>
          <v-row>
            <v-col
              v-for="n in 2"
              :key="n"
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
                title="This is a title"
                subtitle="This is a subtitle"
                text="This is content"
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
                    />
                  </v-avatar>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/user';
  import { chatApi } from '@/services/api';

  const {userInfo} = storeToRefs(useUserStore());
  const unreadCount = ref(0);

  onMounted(() => {
    chatApi.getUnreadCount().then(res => {
      unreadCount.value = res?.data ?? 0;
    });
  });
</script>

<style scoped lang="scss">
  @import "overview-frame";
</style>
