import { createVuetify } from 'vuetify';
import { PRIMARY_COLOR } from '@/constants';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

const getVuetifyInstance = () => {
  const customThemesConfig = window.$wujie?.props?.vuetifyTheme;
  return createVuetify({
    theme: {
      themes: customThemesConfig ?? {
        light: {
          colors: {
            primary: PRIMARY_COLOR
            // secondary: '#5CBBF6',
          }
        },
        dark: {
          colors: {
            primary: PRIMARY_COLOR
          }
        }
      }
    }
  });
};

export default getVuetifyInstance();
