// 运行时配置
import React from 'react';
import { matchRoutes, RuntimeConfig } from '@@/exports';
import { ConfigProvider } from 'antd';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import dayjs from 'dayjs';
import isoWeekPlugin from 'dayjs/plugin/isoWeek';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import isoWeeksInYearPlugin from 'dayjs/plugin/isoWeeksInYear';
import isLeapYearPlugin from 'dayjs/plugin/isLeapYear';
import { requestConfig } from '@/services';
import { PRIMARY_COLOR } from '@/constants';

dayjs.extend(isoWeekPlugin);
dayjs.extend(isoWeeksInYearPlugin);
dayjs.extend(isLeapYearPlugin);
dayjs.extend(weekOfYearPlugin);

export const getInitialState: RuntimeConfig['getInitialState'] = async () => {
  return {loading: false};
};

export const rootContainer: RuntimeConfig['rootContainer'] = (container) => {
  return (
    () => (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: PRIMARY_COLOR
          }
        }}
      >
        <StyleProvider
          hashPriority="high"
          transformers={[legacyLogicalPropertiesTransformer]}
        >
          {container}
        </StyleProvider>
      </ConfigProvider>
    )
  )();
};

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false
//     }
//   };
// };

export const onRouteChange: RuntimeConfig['onRouteChange'] = ({clientRoutes, location, action}) => {
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route as RouteObject;
  if (route) {
    document.title = route.title ?? '';
    route.action = action;
  }
};

export const request: RuntimeConfig['request'] = requestConfig;
