import ClientSocketIO from 'socket.io-client';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store/app';

export const wsBaseUrl = 'ws://localhost:8887/service/websocket';

// 连接socket
export const connectSocket = async () => {
  const store = useAppStore();
  if (store.socketStatus !== 0) {
    return new Promise<string>(async (resolve, reject) => {
      console.log('[Socket]', '开始连接');
      store.socketStatus = 0;
      authApi.getSocketToken().then(res => {
        if (res.code === 3002) {
          store.socketStatus = -1;
          reject('未登录');
        } else {
          store.$socket = ClientSocketIO(`${wsBaseUrl}/${res.data}`, {
            transports: ['websocket']
          });
          store.$socket.on('connect', () => {
            console.log('[Socket]', '已连接');
          });
        }
      }).catch(err => {
        store.socketStatus = -1;
        reject(err);
      });
      store.$socket.on('message', (data: any) => {
        console.log('[Socket]: ', data);
      });
    });
  } else {
    return new Promise<string>((resolve, reject) => {
      reject('正在连接');
    });
  }
};

// 关闭WebSocket连接
export const closeSocket = (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const store = useAppStore();
    store.$socket.on('disconnect', (data: any) => {
      console.log('[Socket]','已断开',data);
      resolve(data);
    });
    store.$socket.disconnect();
  });
};
