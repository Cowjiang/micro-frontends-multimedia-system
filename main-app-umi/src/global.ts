// import eruda from 'eruda';
//
// eruda.init();

import WujieReact from 'wujie-react';

const {setupApp, preloadApp, bus} = WujieReact;

const lifecycles = {
  beforeLoad: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`),
  beforeMount: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} beforeMount 生命周期`),
  afterMount: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} afterMount 生命周期`),
  beforeUnmount: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} beforeUnmount 生命周期`),
  afterUnmount: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} afterUnmount 生命周期`),
  activated: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} activated 生命周期`),
  deactivated: (appWindow: Window) => console.log(`${appWindow.__WUJIE.id} deactivated 生命周期`),
  loadError: (url: string, e: Error) => console.log(`${url} 加载失败`, e)
};

setupApp({
  name: 'vite',
  url: 'http://localhost:3000/',
  exec: true,
  ...lifecycles
});

// preloadApp({
//   name: 'vite',
//   url: 'http://localhost:3000'
// });

