// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

const getVuetifyInstance = () => {
  const customThemesConfig = window.$wujie?.props?.vuetifyTheme;
  return createVuetify({
    theme: {
      themes: customThemesConfig ?? {
        light: {
          colors: {
            primary: '#1867C0'
            // secondary: '#5CBBF6',
          }
        },
        dark: {
          colors: {
            primary: '#1867C0'
          }
        }
      }
    }
  });
};

export default getVuetifyInstance();
