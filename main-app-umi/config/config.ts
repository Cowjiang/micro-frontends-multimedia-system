import { defineConfig } from '@umijs/max';
import routes from './routes';
import proxy from './proxy';

const {MOCK} = process.env;

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
      SERVICE_BASE_URL: MOCK ? '/mock' : '/api'
    }
  },
  routes,
  npmClient: 'pnpm',
  tailwindcss: {},
});
