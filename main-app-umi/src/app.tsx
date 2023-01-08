// 运行时配置
import React, { ReactElement } from 'react';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import { RequestConfig, AxiosResponse } from '@@/plugin-request/request';
import dayjs from 'dayjs';
import isoWeekPlugin from 'dayjs/plugin/isoWeek';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import isoWeeksInYearPlugin from 'dayjs/plugin/isoWeeksInYear';
import isLeapYearPlugin from 'dayjs/plugin/isLeapYear';

dayjs.extend(isoWeekPlugin);
dayjs.extend(isoWeeksInYearPlugin);
dayjs.extend(isLeapYearPlugin);
dayjs.extend(weekOfYearPlugin);

export async function getInitialState(): Promise<{ loading: boolean }> {
  return {loading: false};
}

export function rootContainer(container: ReactElement): React.FunctionComponentElement<any> {
  return (
    () => (
      <StyleProvider
        hashPriority="high"
        transformers={[legacyLogicalPropertiesTransformer]}
      >
        {container}
      </StyleProvider>
    )
  )();
}

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false
//     }
//   };
// };

export const request: RequestConfig = {
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
