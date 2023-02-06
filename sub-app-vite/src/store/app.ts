import { defineStore } from 'pinia';
import { PRIMARY_COLOR } from '@/constants';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 背景颜色
    backgroundColor: '#6d7888',
    // 主题颜色
    primaryColor: PRIMARY_COLOR
  }),
  getters: {},
  actions: {}
});
