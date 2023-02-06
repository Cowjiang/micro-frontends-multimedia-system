import { vuetifyConfig } from '@/config/vuetify';
import { getDvaApp, history } from '@@/exports';

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');
  const {dispatch} = getDvaApp()._store;
  if (!!refreshToken) {
    const refreshTokenExpireIn = Number(localStorage.getItem('REFRESH_TOKEN_EXPIRE_IN'));
    // refreshToken失效不重试
    if (!!refreshTokenExpireIn && refreshTokenExpireIn < new Date().getTime()) {
      console.log('[HTTP]', 'REFRESH_TOKEN过期');
      dispatch({type: 'user/logOut'});
      history.push('/auth/login');
      return Promise.reject();
    }
    try {
      await dispatch({
        type: 'user/refreshToken'
      });
      return;
    } catch (e) {
      dispatch({type: 'user/logOut'});
      history.push('/auth/login');
      return Promise.reject();
    }
  } else {
    history.push('/auth/login');
    return Promise.reject();
  }
};

const wujieDefaultProps = {
  ...vuetifyConfig,
  token: {
    accessToken: getDvaApp()._store.getState().user.token.accessToken ?? '',
    refreshToken
  }
};

export default wujieDefaultProps;
