import { defineStore } from 'pinia';
import { PRIMARY_COLOR } from '@/constants';
import { Socket } from 'socket.io-client';
import { SocketStatus } from '@/typings';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 背景颜色
    backgroundColor: '#6d7888',
    // 主题颜色
    primaryColor: PRIMARY_COLOR,
    // socket实例
    $socket: {} as Socket,
    //Socket的状态
    socketStatus: -1 as SocketStatus
  }),
  getters: {},
  actions: {}
});
