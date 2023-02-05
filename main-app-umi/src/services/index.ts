import type { AxiosResponse, RequestConfig } from '@@/plugin-request/request';
import qs from 'qs';
import { message } from 'antd';
import { getDvaApp, request, history } from '@@/exports';

export const requestConfig: RequestConfig = {
  // timeout: 1000,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},
  requestInterceptors: [
    (url, options) => {
      // console.log(url, options);
      const {method, headers, data} = options;
      const {getState} = getDvaApp()._store;
      const {accessToken} = getState().user.token;
      if (!!accessToken) {
        headers['etoken'] = accessToken;
      }
      if (method === 'get' || method === 'delete') {
        headers['Cache-Control'] = 'no-cache';
        headers['Content-type'] = 'application/x-www-form-urlencoded';
      } else if (method === 'post' || method === 'put') {
        headers['Content-type'] = 'application/json';
      }
      if (typeof headers['Content-type'] === 'string' && headers['Content-type'].includes('application/x-www-form-urlencoded')) {
        options.data = qs.stringify(data);
      }
      return {url, options};
    }
  ],
  responseInterceptors: [
    // @ts-ignore
    (v: AxiosResponse<any>) => {
      console.log(v.data);
      const {dispatch, getState} = getDvaApp()._store;
      // @ts-ignore
      const responseStatus = v.status || v.statusCode;
      if (responseStatus === 200) {
        // 如果存在token信息，刷新状态以及缓存
        if (v.data?.data?.accessToken && v.data?.data?.refreshToken) {
          // 响应数据中存在AccessToken
          dispatch({
            type: 'user/setAccessToken',
            payload: {
              accessToken: v.data.data.accessToken,
              expireTime: v.data.data.expireIn
            }
          });
          localStorage.setItem('REFRESH_TOKEN', v.data.data.refreshToken);
          localStorage.setItem('REFRESH_TOKEN_EXPIRE_IN', v.data.data.refreshTokenExpireIn);
        }
        // if (systemStore.socketStatus !== 1 && getState().user.userInfo) {
        //   connectSocket().then(() => {
        //   })
        // }
        return v;
      } else if (responseStatus === 401) {
        // 3002 Token过期  3003 Token不合法
        if ([2001, 3002, 3003].includes(v.data.code)) {
          const refreshToken = localStorage.getItem('REFRESH_TOKEN');
          if (!!refreshToken) {
            const refreshTokenExpireIn = Number(localStorage.getItem('REFRESH_TOKEN_EXPIRE_IN'));
            // refreshToken失效不重试
            if (!!refreshTokenExpireIn && refreshTokenExpireIn < new Date().getTime()) {
              console.log('[HTTP]', 'REFRESH_TOKEN过期');
              dispatch({type: 'user/logOut'});
              history.push('/auth/login');
              return v;
            }
            dispatch({
              type: 'user/refreshToken'
            }).then(async () => {
              console.log('[HTTP]', '重试请求');
              await request(v.config.url as string, v.config).then((res: AxiosResponse<any, any>) => {
                v = res;
              });
            }).catch((e: any) => {
              dispatch({type: 'user/logOut'});
              history.push('/auth/login');
              console.log(e);
            });
          } else {
            history.push('/auth/login');
          }
          return v;
        }
      }
    }
  ],
  errorConfig: {
    errorHandler(e: any) {
      message.error({
        content: e.data.message
      });
    }
  }
};
