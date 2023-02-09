import { connectSocket as connect, closeSocket as close } from './socket';
import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';
import { useAppStore } from '@/store/app';

// 连接socket
export const connectSocket = async (): Promise<void | string> => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();
  return new Promise<void | string>((resolve, reject) => {
    if (userStore.userInfo && userStore.userInfo.userId) {
      connect().then(() => {
        console.log('[Socket]', '已连接');
        appStore.socketStatus = 1;
        // eventApi.getUserUnread().then(res => {
        //   if (res.success) {
        //     const unread = res.data?.reduce((pre, current) => pre + Number(current.count), 0) ?? 0
        //     chatStore.unreadMessageCount = unread
        //   }
        // }).catch(err => {
        // })
        resolve();
      }).catch(err => {
        if (err !== '未登录' && err !== '正在连接') {
          console.error(err);
        }
      });
    } else {
      reject('未登录');
    }
  });
};

// 关闭socket
const closeSocket = async (): Promise<void> => {
  const appStore = useAppStore();
  const chatStore = useChatStore();
  // uni.onSocketClose(res => {
  //   appStore.socketStatus = -1
  //   console.log('[Socket]', '已关闭')
  // })
  await close().then(res => {
  }).catch(err => {
    if (err.errMsg === 'closeSocket:fail WebSocket is not connected') return;
    console.error(err);
  });
};
