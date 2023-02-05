import { Action, AnyAction, Effect, Reducer, Subscription } from '@@/plugin-dva/types';
import { authApi } from '@/services/api';

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
  };
  reducers: {
    // 存储UserInfo
    setUserInfo: Reducer<UserModelState>;
    setAccessToken: Reducer<UserModelState>
    // 退出登录
    logOut: Reducer;
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
    logOut() {
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
