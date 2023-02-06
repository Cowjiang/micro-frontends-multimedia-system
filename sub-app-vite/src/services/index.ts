import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import qs from 'qs';
import { IResponseData } from '@/services/typings';

axios.interceptors.request.use((config) => {
  const {method} = config;
  const headers: AxiosRequestHeaders = config.headers ?? {};
  const accessToken = window.$wujie?.props?.token.accessToken ?? '';
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
    config.data = qs.stringify(config.data);
  }
  return {
    ...config,
    headers
  };
});

axios.interceptors.response.use(async (v: AxiosResponse<any>) => {
  //@ts-ignore
  const responseStatus = v.status || v.statusCode;
  if (responseStatus === 200) {
    // 请求正常
  } else if (responseStatus === 401) {
    // 3002 Token过期  3003 Token不合法
    if ([2001, 3002, 3003].includes(v.data.code)) {
      await window.$wujie?.props?.token.refreshToken().then(async () => {
        await axios(v.config).then(res => {
          v = res;
        });
      }).catch(() => {
        // Token刷新失败
      });
      return v;
    }
  }
  return v;
}, error => {
  return error;
});

const httpPack = {
  get: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.get<P, IResponseData<R>>(url, param, config),
  delete: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.delete<P, IResponseData<R>>(url, param, config),
  post: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.post<P, IResponseData<R>>(url, data, config),
  put: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<IResponseData<R>> => httpNative.put<P, IResponseData<R>>(url, data, config)
};

const httpNative = {
  get: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
    const paramStr = qs.stringify(param);
    axios.get(`${url}?${paramStr}`, config).then((res) => {
      !res.data && reject(res);
      res.data.success ? resolve(res.data as R) : reject(res.data as R);
    }).catch(err => reject(err));
  }),
  delete: <P, R>(url: string, param?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
    const paramStr = qs.stringify(param);
    axios.delete(`${url}?${paramStr}`, config).then((res) => {
      !res.data && reject(res);
      res.data.success ? resolve(res.data as R) : reject(res.data as R);
    }).catch(err => reject(err));
  }),
  post: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
    axios.post(url, data, config).then((res) => {
      !res.data && reject(res);
      res.data.success ? resolve(res.data as R) : reject(res.data as R);
    }).catch(err => reject(err));
  }),
  put: <P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<R> => new Promise<R>((resolve, reject) => {
    axios.put(url, data, config).then((res) => {
      !res.data && reject(res);
      res.data.success ? resolve(res.data as R) : reject(res.data as R);
    }).catch(err => reject(err));
  })
};

// 包装响应体后的http请求
export const http = httpPack;

// 原生不包装的http请求
export const httpNa = httpNative;
