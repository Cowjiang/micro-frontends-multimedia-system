<template>
  <div class="w-100 h-100 d-flex flex-row">
    <div class="nav-wrapper h-100 flex-shrink-0 flex-grow-0">
      <nav-bar @update="handleNavItemClick" />
    </div>
    <div class="content-wrapper h-100 flex-grow-1 pt-2 pr-2 pb-2">
      <div class="content-container w-100 h-100 rounded-lg bg-white overflow-hidden">
<!--        <search-popup v-model="showSearchPopup"/>-->
        <home-frame v-if="currentNavItemIndex === 0"/>
<!--        <group-frame v-else-if="currentNavItemIndex === 1"/>-->
<!--        <setting-frame v-else-if="currentNavItemIndex === navItemList.findIndex(item => item.name === 'setting')"/>-->
<!--        <top-chat-frame v-else/>-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/views/chat/components/nav-bar/nav-bar.vue';
  import HomeFrame from '@/views/chat/components/home-frame/home-frame.vue';
  import router from '@/router';
  import { useChatStore } from '@/store/chat';

  const {navItemList, currentNavItemIndex} = storeToRefs(useChatStore());
  const route = useRoute();

  // 导航栏点击事件
  const handleNavItemClick = ({index, detail}: { index: number, detail: any }) => {
    if (currentNavItemIndex.value !== index) {
      if (detail.name === 'search') {
        // showSearchPopup.value = true
      } else {
        currentNavItemIndex.value = index;
        const navItem = detail.name ?? 'home';
        router.replace({name: 'index', params: {navItem}});
      }
    }
  };

  onMounted(() => {
    navItemList.value = [
      {name: 'home', title: '主页', icon: 'fas fa-house'},
      {name: 'group', title: '我的群聊', icon: 'fas fa-user-friends'},
      // {
      //   name: '61be0f1ee7fd6865cbcd74d1',
      //   chatType: 0,
      //   title: 'Cowjiang',
      //   imgUrl: 'https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg'
      // },
      // {name: '61be0f1ee7fd6865cbcd74d2', chatType: 1, title: 'Cowjiang的群聊'},
      {name: 'search', title: '切换全屏', icon: 'fas fa-up-right-and-down-left-from-center'},
      {name: 'search', title: '搜索', icon: 'fas fa-search'},
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
</script>

<style scoped lang="scss">
  @import "index";
</style>
