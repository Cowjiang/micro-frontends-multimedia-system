import { Effect, Reducer } from '@@/plugin-dva/types';
import { authApi, userApi } from '@/services/api';
import { getDvaApp } from '@@/exports';
import { SimpleUserInfo } from '@/services/api/modules/user/typings';

export interface UserModelState {
  token: {
    accessToken: string,
    expireTime: number
  };
  userInfo: SimpleUserInfo;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    // 刷新AccessToken
    refreshToken: Effect;
    // 账号密码登录
    loginByAccount: Effect;
    // 退出登录
    logout: Effect;
    // 获取个人信息
    getUserInfo: Effect;
  };
  reducers: {
    // 存储UserInfo
    setUserInfo: Reducer<UserModelState>;
    // 存储AccessToken
    setAccessToken: Reducer<UserModelState>
    // 重置
    reset: Reducer<UserModelState>;
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
            type: 'logout'
          });
          return Promise.reject(e);
        }
      }
    },
    * loginByAccount({payload: {account, password}}, {put, call}) {
      try {
        const {success, message, code} = yield call(authApi.loginByAccount, {
          username: account ?? '',
          password: password ?? ''
        });
        if (success) {
          yield put({
            type: 'getUserInfo'
          });
          const {dispatch} = getDvaApp()._store;
          dispatch({type: 'app/connectSocket'});
        }
        return {success, message, code};
      } catch (e) {
        return Promise.reject(e);
      }
    },
    * getUserInfo({payload}, {put, call}) {
      const {data} = yield call(userApi.getCurrentUserInfo);
      yield put({
        type: 'setUserInfo',
        payload: data
      });
    },
    * logout({payload}, {put}) {
      sessionStorage.clear();
      localStorage.clear();
      yield put({type: 'app/closeSocket'});
      yield put({type: 'reset'});
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
    reset(state) {
      return {
        ...state,
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
