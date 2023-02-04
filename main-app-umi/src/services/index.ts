import type { AxiosResponse, RequestConfig } from '@@/plugin-request/request';
import type { Response } from '@/services/typings';
import qs from 'qs';
import { message } from 'antd';

export const requestConfig: RequestConfig = {
  // timeout: 1000,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},
  requestInterceptors: [
    (url, options) => {
      // console.log(url, options);
      const {method, headers, data} = options;
      // const {accessToken} = storeToRefs(useUserStore())
      // if (!!accessToken.value) {
      //   headers['etoken'] = accessToken.value
      // }
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
    (v: AxiosResponse<any>) => {
      //@ts-ignore
      const responseStatus = v.status || v.statusCode;
      // if (!v.data.success) {
      //   return Promise.reject(v)
      // }
      return v;
    }
  ],
  errorConfig: {
    errorHandler(e: any) {
      // console.warn(e);
      message.error({
        content: e.data.message
      });
    }
  }
};
