import { theme } from 'antd';
import { SeedToken } from 'antd/es/theme/interface';
import { PRIMARY_COLOR } from '@/constants';

const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
const token: SeedToken = Object.assign(defaultSeed, {
  colorPrimary: localStorage.getItem('PRIMARY_COLOR') ?? PRIMARY_COLOR
});
const themePack = {
  light: defaultAlgorithm(token),
  dark: darkAlgorithm(token)
};

const vuetifyConfig = {
  vuetifyTheme: {
    light: {
      colors: {
        primary: themePack.light.colorPrimary,
        success: themePack.light.colorSuccess,
        warning: themePack.light.colorWarning,
        error: themePack.light.colorError,
        info: themePack.light.colorInfo,
        background: themePack.light.colorBgContainer,
        'on-primary': '#fff',
        'on-success': '#fff',
        'on-warning': '#fff',
        'on-error': '#fff'
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
        'on-primary': '#fff',
        'on-success': '#fff',
        'on-warning': '#fff',
        'on-error': '#fff'
      }
    }
  }
}

export {
  vuetifyConfig
}
