import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  return {
    loading,
    setLoading
  };
};
