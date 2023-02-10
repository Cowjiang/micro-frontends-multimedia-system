import io from 'socket.io-client';

export const wsBaseUrl = 'http://localhost:8888';

export const connectSocketTest = () => {
  return new Promise<string>(async (resolve, reject) => {
    const at = sessionStorage.getItem('ACCESS_TOKEN') ?? '';
    const socket = io(`${wsBaseUrl}?etoken=${at}`, {
      transports: ['websocket']
    });
    socket.on('message', (data: any) => {
      console.log('[Socket]消息: ', data);
    });
    socket.on('connect', () => {
      console.log('[Socket]', '已连接');
      resolve('已连接');
    });
    socket.on('connect_error', (e: any) => {
      console.log('[Socket]', '连接失败');
      reject(e);
    });
  });
};

// 连接socket
// export const connectSocket = async () => {
//   if (store.socketStatus !== 0) {
//     return new Promise<string>(async (resolve, reject) => {
//       console.log('[Socket]', '开始连接');
//       store.socketStatus = 0;
//       store.$socket = io(`${wsBaseUrl}/${sessionStorage.getItem('ACCESS_TOKEN')}`, {
//         transports: ['websocket']
//       });
//       store.$socket?.on('connect', () => {
//         console.log('[Socket]', '已连接');
//         resolve('已连接');
//       });
//       store.$socket?.on('message', (data: any) => {
//         console.log('[Socket]: ', data);
//       });
//     });
//   } else {
//     return new Promise<string>((resolve, reject) => {
//       reject('正在连接');
//     });
//   }
// };

// 关闭WebSocket连接
// export const closeSocket = (): Promise<any> => {
//   return new Promise<any>((resolve, reject) => {
//     const store = useAppStore();
//     store.$socket.on('disconnect', (data: any) => {
//       console.log('[Socket]', '已断开', data);
//       resolve(data);
//     });
//     store.$socket.disconnect();
//   });
// };
