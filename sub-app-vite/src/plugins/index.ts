// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import pinia from '@/store';
import router from '@/router';
import 'animate.css';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(vuetify)
    .use(pinia)
    .use(router);
}
