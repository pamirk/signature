import { useMemo } from 'react';
import History from 'Services/History';

interface URLParams {
  [key: string]: string;
}

export default () => {
  const urlParams = useMemo(() => {
    const params = {};

    const searchString = History.location.search.slice(1);
    searchString.split('&').forEach(paramStr => {
      const [key, value] = paramStr.split('=');
      params[key] = value;
    });

    return params;
  }, []);

  return urlParams as URLParams;
};
