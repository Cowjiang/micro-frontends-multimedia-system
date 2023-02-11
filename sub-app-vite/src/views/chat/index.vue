<template>
  <div class="w-100 h-100 d-flex flex-row" ref="chatPageRef">
    <div class="nav-wrapper h-100 flex-shrink-0 flex-grow-0">
      <nav-bar @update="handleNavItemClick" />
    </div>
    <div class="content-wrapper h-100 flex-grow-1 pt-2 pr-2 pb-2">
      <div class="content-container w-100 h-100 rounded-lg bg-white overflow-hidden">
        <!--        <search-popup v-model="showSearchPopup"/>-->
        <home-frame
          v-if="!refreshTrigger"
          :chat-type="chatType"
          @chat-type-change="handleChatTypeChange"
        />
        <!--        <home-frame-->
        <!--          v-else-if="currentNavItemIndex === 1"-->
        <!--          :chat-type="ChatType.GROUP"-->
        <!--          @chat-type-change="handleChatTypeChange"-->
        <!--        />-->
        <!--        <group-frame v-else-if="currentNavItemIndex === 1"/>-->
        <!--        <setting-frame v-else-if="currentNavItemIndex === navItemList.findIndex(item => item.name === 'setting')"/>-->
        <!--        <top-chat-frame v-else/>-->
      </div>
    </div>
    <loading
      v-model="loadingStatus"
      enterDuration="0s"
      z-index="2300"
    />
    <v-dialog v-model="loadError" persistent attach>
      <v-card
        class="align-self-center"
        width="400"
        rounded="lg"
        title="数据加载失败，请重新加载"
        subtitle="网络异常，请检查你的网络"
      >
        <v-card-actions>
          <v-btn color="error" :block="true" @click="reloadApp">重新加载</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/views/chat/components/nav-bar/nav-bar.vue';
  import HomeFrame from '@/views/chat/components/home-frame/home-frame.vue';
  import Loading from '@/components/loading/loading.vue';
  import router from '@/router';
  import { useChatStore } from '@/store/chat';
  import { ChatType } from '@/typings';
  import { computed } from 'vue';
  import { SocketChatMessage } from '@/services/socket/typings';

  const {navItemList, currentNavItemIndex} = storeToRefs(useChatStore());
  const route = useRoute();
  const chatStore = useChatStore();
  const loadingStatus = ref(true); //数据加载状态
  const loadError = ref(false); //数据是否加载失败
  const refreshTrigger = ref(false); //强制刷新组件触发器

  const chatType = computed(() => currentNavItemIndex.value === 0 ? ChatType.PRIVATE : ChatType.GROUP);

  const init = async () => {
    await Promise.all([
      chatStore.getPrivateChatList({pageSize: 100}),
      chatStore.getGroupChatList()
    ]).then(() => {
      loadingStatus.value = false;
    }).catch(err => {
      console.error(err);
      loadError.value = true;
    });
    window.$wujie?.bus.$on('newChatMessage', onReceiveChatMessage);
  };
  init();

  // 接收新聊天消息
  const onReceiveChatMessage = (data: SocketChatMessage) => {
    chatStore.receiveChatMessage(data);
  };

  const chatPageRef = ref<HTMLElement | null>(null);
  const {toggle} = useFullscreen(chatPageRef);
  // 导航栏点击事件
  const handleNavItemClick = ({index, detail}: { index: number, detail: any }) => {
    if (currentNavItemIndex.value !== index) {
      if (detail.name === 'search') {
        // showSearchPopup.value = true
      } else if (detail.name === 'fullscreen') {
        toggle();
      } else if (detail.name === 'refresh') {
        loadingStatus.value = true;
        init();
        refreshTrigger.value = true;
        nextTick(() => {
          refreshTrigger.value = false;
        });
      } else if (detail.name === 'setting') {
        // 设置
      } else {
        currentNavItemIndex.value = index;
        const navItem = detail.name ?? 'home';
        router.replace({name: 'index', params: {navItem}});
      }
    }
  };

  const handleChatTypeChange = (chatType: ChatType) => {
    if (chatType === ChatType.PRIVATE) {
      currentNavItemIndex.value = 0;
    } else if (chatType === ChatType.GROUP) {
      currentNavItemIndex.value = 1;
    }
  };

  // 重新加载应用
  const reloadApp = () => router.go(0);

  onMounted(() => {
    navItemList.value = [
      {name: 'home', title: '主页', icon: 'fas fa-house'},
      {name: 'group', title: '我的群聊', icon: 'fas fa-user-friends'},
      {name: 'fullscreen', title: '切换全屏', icon: 'fas fa-up-right-and-down-left-from-center'},
      {name: 'search', title: '搜索', icon: 'fas fa-search'},
      {name: 'refresh', title: '刷新', icon: 'fas fa-rotate'},
      {name: 'setting', title: '设置中心', icon: 'fas fa-cog'}
    ];
    if (route.params.navItem) {
      const navItemIndex = navItemList.value.findIndex((navItem: { name: string }) => navItem.name === route.params.navItem);
      if (navItemIndex !== -1) {
        currentNavItemIndex.value = navItemIndex;
        router.replace({
          name: 'index',
          params: {
            navItem: route.params.navItem
          }
        });
      }
    }
  });

  onUnmounted(() => {

  });
</script>

<style scoped lang="scss">
  @import "index";
</style>
