// import eruda from 'eruda';
//
// eruda.init();

import WujieReact from 'wujie-react';
import { theme } from 'antd';
import { SeedToken } from 'antd/es/theme/interface';
import { PRIMARY_COLOR } from '@/constants';

const {setupApp, preloadApp, bus} = WujieReact;

const lifecycles = {
  beforeLoad: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} beforeLoad`),
  beforeMount: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} beforeMount`),
  afterMount: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} afterMount`),
  beforeUnmount: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} beforeUnmount`),
  afterUnmount: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} afterUnmount`),
  activated: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} activated`),
  deactivated: (appWindow: Window) => console.log('[生命周期]', `${appWindow.__WUJIE.id} deactivated`),
  loadError: (url: string, e: Error) => console.log('[生命周期]', `${url} 加载失败`, e)
};

export const setupViteApp = () => {
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const token: SeedToken = Object.assign(defaultSeed, {
    colorPrimary: PRIMARY_COLOR
  });
  const themePack = {
    light: defaultAlgorithm(token),
    dark: darkAlgorithm(token)
  };

  setupApp({
    name: 'vite',
    url: 'http://localhost:3000/',
    exec: true,
    ...lifecycles,
    props: {
      vuetifyTheme: {
        light: {
          colors: {
            primary: themePack.light.colorPrimary,
            success: themePack.light.colorSuccess,
            warning: themePack.light.colorWarning,
            error: themePack.light.colorError,
            info: themePack.light.colorInfo,
            background: themePack.light.colorBgContainer,
            'on-primary': '#fff'
          }
        },
        dark: {
          colors: {
            primary: themePack.dark.colorPrimary,
            success: themePack.dark.colorSuccess,
            warning: themePack.dark.colorWarning,
            error: themePack.dark.colorError,
            info: themePack.dark.colorInfo,
            background: themePack.dark.colorBgContainer,
            'on-primary': '#fff'
          }
        }
      }
    }
  });

  // preloadApp({
  //   name: 'vite',
  //   url: 'http://localhost:3000'
  // });
};
setupViteApp();
