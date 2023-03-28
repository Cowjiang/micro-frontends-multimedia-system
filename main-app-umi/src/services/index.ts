import type { AxiosResponse, RequestConfig } from '@@/plugin-request/request';
import qs from 'qs';
import { getDvaApp, request, history } from '@@/exports';

const {SERVICE_BASE_URL} = process.env;

export const requestConfig: RequestConfig = {
  // timeout: 1000,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},
  baseURL: SERVICE_BASE_URL,
  // 允许进入响应拦截器的status
  validateStatus: status => status >= 200 && status < 300 || status === 401,
  requestInterceptors: [
    (url, options) => {
      // console.log(url, options);
      const {method, headers, data} = options;
      const accessToken = sessionStorage.getItem('ACCESS_TOKEN') ?? '';
      if (accessToken) {
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
    //@ts-ignore
    async (v: AxiosResponse<any>): AxiosResponse<any> | undefined => {
      console.log(v);
      const {dispatch} = getDvaApp()?._store ?? {};
      const responseStatus = v.status;
      if (responseStatus === 200) {
        // 如果存在token信息，刷新状态以及缓存
        if (v.data?.data?.accessToken && v.data?.data?.refreshToken) {
          // 响应数据中存在AccessToken
          sessionStorage.setItem('ACCESS_TOKEN', v.data.data.accessToken);
          localStorage.setItem('REFRESH_TOKEN', v.data.data.refreshToken);
          localStorage.setItem('REFRESH_TOKEN_EXPIRE_IN', v.data.data.refreshTokenExpireIn);
        }
        if (!window.$socket && localStorage.getItem('userInfo')) {
          dispatch && dispatch({
            type: 'app/connectSocket'
          });
        }
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
              dispatch && dispatch({type: 'user/logOut'});
              history.push('/auth/login');
              return v;
            }
            dispatch && await dispatch({
              type: 'user/refreshToken'
            }).then(async () => {
              console.log('[HTTP]', '重试请求');
              await request(v.config.url as string, v.config).then((res: AxiosResponse<any, any>) => {
                v.data = res;
              });
            }).catch((e: any) => {
              dispatch && dispatch({type: 'user/logOut'});
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
      console.error(e);
    }
  }
};
