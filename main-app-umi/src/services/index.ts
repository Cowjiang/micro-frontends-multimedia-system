import { AxiosResponse, RequestConfig } from '@@/plugin-request/request';

export const requestConfig: RequestConfig = {
  // timeout: 1000,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},
  requestInterceptors: [
    (url, options) => {
      // console.log(url, options);
      const token = localStorage.getItem('token') ?? '';
      if (token) {
        options.headers['Authorization'] = token;
      }
      if (['post', 'put'].includes(options.method.toLowerCase())) {
        options.headers['Content-Type'] = 'application/json';
      }
      return {url, options};
    }
  ],
  responseInterceptors: [
    (response: AxiosResponse<any>) => {
      const {data: resData} = response;
      // if(!resData.success){
      //   console.error('请求失败！');
      // }
      const data = resData?.data ?? null;
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      // console.log(resData)
      return response;
    }
  ]
};
