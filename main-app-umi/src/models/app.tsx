import { Effect, Reducer } from '@@/plugin-dva/types';
import { closeSocket, connectSocket } from '@/services/socket';
import { Tabs } from '@/typings';
import React from 'react';
import IndexPage from '@/pages/Index';

export interface AppModelState {
  // Socket对象
  socket: SocketIOClient.Socket | null;
  // 标签页列表
  tabsList: Tabs[];
  // 当前激活的标签Key
  activeTabKey: string;
}

export interface AppModelType {
  namespace: 'app';
  state: AppModelState;
  effects: {
    // 连接Socket
    connectSocket: Effect;
    // 关闭Socket
    closeSocket: Effect;
    // 新增标签页
    addTab: Effect;
    // 移除标签页
    removeTab: Effect;
    // 修改标签页标题
    editTabTitle: Effect;
  };
  reducers: {
    // 存储Socket
    setSocket: Reducer<AppModelState>;
    // 设置标签页列表
    setTabsList: Reducer<AppModelState>;
    // 设置当前激活标签的Key
    setActiveTabKey: Reducer<AppModelState>;
  };
}

const appModel: AppModelType = {
  namespace: 'app',
  state: {
    socket: null,
    tabsList: [],
    activeTabKey: ''
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
    },
    * addTab({payload: {children, title, key}}, {put, select}) {
      if (!children) {
        children = <IndexPage />;
      }
      const {tabsList}: AppModelState = yield select((state: any) => state.app);
      const existIndex = tabsList.findIndex(item => item.key === key);
      if (existIndex !== -1) {
        yield put({type: 'setActiveTabKey', payload: {activeTabKey: tabsList[existIndex].key}});
      } else if (title && key) {
        const newTabsList = [...tabsList];
        newTabsList.push({label: title, children: children, key});
        yield put({type: 'setTabsList', payload: {tabsList: newTabsList}});
        yield put({type: 'setActiveTabKey', payload: {activeTabKey: key}});
      }
    },
    * removeTab({payload: {targetKey}}, {put, select}) {
      const {tabsList, activeTabKey}: AppModelState = yield select((state: any) => state.app);
      let newActiveKey = activeTabKey;
      let lastIndex = -1;
      tabsList.forEach((item, i) => {
        if (item.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const newTabsList = tabsList.filter((item) => item.key !== targetKey);
      if (newTabsList.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newTabsList[lastIndex].key;
        } else {
          newActiveKey = newTabsList[0].key;
        }
      }
      yield put({type: 'setTabsList', payload: {tabsList: newTabsList}});
      yield put({type: 'setActiveTabKey', payload: {activeTabKey: newActiveKey}});
    },
    * editTabTitle({payload: {key, title}}, {put, select}) {
      const {tabsList}: AppModelState = yield select((state: any) => state.app);
      const newTabsList = tabsList.map(item => {
        if (item.key === key) {
          return {...item, label: title};
        }
        return item;
      });
      yield put({type: 'setTabsList', payload: {tabsList: newTabsList}});
    }
  },
  reducers: {
    setSocket(state, {payload: {socket}}) {
      return {
        ...state,
        socket
      };
    },
    setTabsList(state, {payload: {tabsList}}) {
      return {
        ...state,
        tabsList
      };
    },
    setActiveTabKey(state, {payload: {activeTabKey}}) {
      return {
        ...state,
        activeTabKey
      };
    }
  }
};

export default appModel;
