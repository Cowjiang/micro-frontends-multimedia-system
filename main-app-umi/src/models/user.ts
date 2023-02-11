import { Effect, Reducer } from '@@/plugin-dva/types';
import { authApi } from '@/services/api';
import { getDvaApp } from '@@/exports';

export interface UserModelState {
  token: {
    accessToken: string,
    expireTime: number
  };
  userInfo: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    // 刷新AccessToken
    refreshToken: Effect;
    // 退出登录
    logout: Effect;
  };
  reducers: {
    // 存储UserInfo
    setUserInfo: Reducer<UserModelState>;
    // 存储AccessToken
    setAccessToken: Reducer<UserModelState>
    // 重置
    reset: Reducer;
  };
}

const userModel: UserModelType = {
  namespace: 'user',
  state: {
    token: {
      accessToken: '',
      expireTime: 0
    },
    userInfo: {}
  },
  effects: {
    * refreshToken({payload}, {put, call}) {
      const refreshToken = localStorage.getItem('REFRESH_TOKEN');
      if (!!refreshToken) {
        const refreshTokenExpireIn = Number(localStorage.getItem('REFRESH_TOKEN_EXPIRE_IN'));
        // refreshToken失效
        if (!!refreshTokenExpireIn && refreshTokenExpireIn < new Date().getTime()) {
          return;
        }
        try {
          yield call(authApi.refreshToken, {refreshToken});
        } catch (e) {
          yield put({
            type: 'setUserInfo',
            payload: {}
          });
          localStorage.removeItem('userInfo');
          return Promise.reject(e);
        }
      }
    },
    * logout({payload}, {put}) {
      sessionStorage.clear();
      localStorage.clear();
      const {dispatch} = getDvaApp()._store;
      dispatch({type: 'app/closeSocket'});
      put({type: 'reset'});
    }
  },
  reducers: {
    setUserInfo(state, {payload: userInfo}) {
      localStorage.setItem('userInfo', userInfo);
      return {
        ...state,
        userInfo
      };
    },
    setAccessToken(state, {payload: {accessToken, expireTime}}) {
      return {
        ...state,
        token: {
          accessToken,
          expireTime
        }
      };
    },
    reset() {
      return {
        token: {
          accessToken: '',
          expireTime: 0
        },
        userInfo: {}
      };
    }
  }
};

export default userModel;
