// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';

declare global {
  interface Window {
    $wujie?: any;
    __POWERED_BY_WUJIE__?: boolean;
    __WUJIE_MOUNT: () => void;
    __WUJIE_UNMOUNT: () => void;
    __WUJIE: { mount: () => void };
  }
}

if (window.__POWERED_BY_WUJIE__) {
  let app: any;
  window.__WUJIE_MOUNT = () => {
    app = createApp(App);
    registerPlugins(app);
    app.mount('#app');
  };
  window.__WUJIE_UNMOUNT = () => {
    app.unmount();
  };
  window.__WUJIE.mount();
} else {
  const app = createApp(App);
  registerPlugins(app);
  app.mount('#app');
}
