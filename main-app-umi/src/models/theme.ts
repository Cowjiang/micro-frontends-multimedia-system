import { useEffect, useState } from 'react';
import { useLocalStorageState } from 'ahooks';

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

  return {
    darkTheme,
    setDarkTheme
  };
};
