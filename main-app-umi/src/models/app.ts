import { Effect, Reducer } from '@@/plugin-dva/types';
import { closeSocket, connectSocket } from '@/services/socket';

export interface AppModelState {
  socket: SocketIOClient.Socket | null;
}

export interface AppModelType {
  namespace: 'app';
  state: AppModelState;
  effects: {
    // 连接Socket
    connectSocket: Effect;
    // 关闭Socket
    closeSocket: Effect;
  };
  reducers: {
    // 存储Socket
    setSocket: Reducer<AppModelState>;
  };
}

const appModel: AppModelType = {
  namespace: 'app',
  state: {
    socket: null
  },
  effects: {
    * connectSocket({payload}, {put, call}) {
      try {
        const socket: SocketIOClient.Socket = yield call(connectSocket);
        yield put({
          type: 'setSocket',
          payload: {socket}
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    * closeSocket({payload}, {put, call}) {
      try {
        yield call(closeSocket);
        yield put({
          type: 'setSocket',
          payload: {
            socket: null
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  },
  reducers: {
    setSocket(state, {payload: {socket}}) {
      return {
        ...state,
        socket
      };
    }
  }
};

export default appModel;
