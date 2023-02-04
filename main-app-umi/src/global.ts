// import eruda from 'eruda';
//
// eruda.init();

import WujieReact from 'wujie-react';
import { vuetifyConfig } from '@/config/vuetify';

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
  setupApp({
    name: 'vite',
    url: 'http://localhost:3000/login',
    exec: true,
    ...lifecycles,
    props: {
      ...vuetifyConfig
    }
  });

  // preloadApp({
  //   name: 'vite',
  //   url: 'http://localhost:3000'
  // });
};
setupViteApp();
