import { defineConfig } from '@umijs/max';
import routes from './routes';
import proxy from './proxy';

const {MOCK, OSS_BASE_URL} = process.env;

export default defineConfig({
  locale: {antd: true},
  access: {},
  model: {},
  dva: {},
  initialState: {},
  request: {},
  proxy,
  define: {
    'process.env': {
      SERVICE_BASE_URL: MOCK ? '/mock' : '/api',
      OSS_BASE_URL
    }
  },
  routes,
  npmClient: 'pnpm',
  tailwindcss: {},
});
