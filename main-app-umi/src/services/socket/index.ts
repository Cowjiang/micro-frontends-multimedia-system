import io from 'socket.io-client';
import { IResponseData } from '@/services/typings';
import { SocketMessage, SocketMessageType } from '@/services/socket/typings';

export const wsBaseUrl = 'http://localhost:8888';

// 连接Socket
export const connectSocket = () => {
  return new Promise<SocketIOClient.Socket | string | void>(async (resolve, reject) => {
    if (!window.$socket) {
      const at = sessionStorage.getItem('ACCESS_TOKEN') ?? '';
      window.$socket = io(`${wsBaseUrl}?etoken=${at}`, {
        transports: ['websocket']
      });
      window.$socket.on('message', (data: any) => {
        console.log('[Socket]', '新消息 ');
        if (data) {
          handleSocketMessage(data);
        }
      });
      window.$socket.on('connect', () => {
        console.log('[Socket]', '已连接');
        resolve(window.$socket);
      });
      window.$socket.on('connect_error', (e: any) => {
        console.error('[Socket]', '连接失败', e);
        reject(e);
      });
      window.$socket.on('error', (e: any) => {
        console.error('[Socket]', '发生错误', e);
        reject(e);
      });
    } else {
      console.log('[Socket]', '重复连接');
      resolve(window.$socket);
    }
  });
};

// 关闭Socket连接
export const closeSocket = (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    if (!window.$socket) {
      resolve('Socket未连接');
    } else {
      window.$socket.on('disconnect', (data: string) => {
        console.log('[Socket]', '已断开连接');
        resolve('已断开连接');
      });
      window.$socket.close();
    }
  });
};

// 接收处理Socket消息
export const handleSocketMessage = (messageString: string): SocketMessage => {
  const message: IResponseData<string> = JSON.parse(messageString);
  if (!message?.data) {
    return {type: SocketMessageType.IGNORE, message: null};
  }
  if (message.code === 120) {
    // 聊天消息
    return {
      type: SocketMessageType.CHAT,
      message: message.data
    };
  } else {
    return {type: SocketMessageType.IGNORE, message: message.data};
  }
};
