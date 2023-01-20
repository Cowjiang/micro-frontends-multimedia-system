import { useState } from 'react';

export default () => {
  const [darkTheme, setDarkTheme] = useState(false);
  return {
    darkTheme,
    setDarkTheme
  };
};
