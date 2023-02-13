import { defineStore } from 'pinia';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';
import { userApi } from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: {} as SimpleUserInfo
  }),
  getters: {},
  actions: {
    getUserInfo() {
      if (!localStorage.getItem('userInfo')) {
        return;
      }
      if (!this.userInfo?.id && !this.userInfo?.userId) {
        userApi.getCurrentUserInfo().then(res => {
          this.userInfo = res.data ?? {};
        }).catch(e => {
        });
      }
    }
  }
});
