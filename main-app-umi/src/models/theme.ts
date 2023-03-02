import { useEffect, useState } from 'react';
import { useLocalStorageState } from 'ahooks';
import { PRIMARY_COLOR } from '@/constants';

export default () => {
  const [dark, setDark] = useLocalStorageState<boolean | undefined>(
    'dark',
    {
      defaultValue: false
    }
  );
  const [darkTheme, setDarkTheme] = useState(dark);
  useEffect(() => {
    if (darkTheme !== dark) {
      setDark(darkTheme);
    }
  }, [darkTheme]);

  const localPrimaryColor = localStorage.getItem('PRIMARY_COLOR') ?? PRIMARY_COLOR;
  const [primaryColor, setPrimaryColor] = useState(localPrimaryColor);
  useEffect(() => {
    if (primaryColor !== localPrimaryColor) {
      setPrimaryColor(primaryColor);
      localStorage.setItem('PRIMARY_COLOR', primaryColor);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
  }, [primaryColor]);

  return {
    darkTheme,
    setDarkTheme,
    primaryColor,
    setPrimaryColor
  };
};
