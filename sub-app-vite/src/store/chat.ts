import { defineStore } from 'pinia';
import { NavItemList } from '@/views/chat/components/nav-bar/typings';

export const useChatStore = defineStore('chat', {
  state: () => ({
    // 导航栏项目列表
    navItemList: [] as NavItemList[],
    // 当前导航栏显示的项目的序号
    currentNavItemIndex: 0
  }),
  getters: {},
  actions: {}
});
