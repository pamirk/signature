import { useMemo } from 'react';

export default () => {
  const GoogleAnalyticsObject = useMemo(() => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    return ga && ga;
  }, []);

  const clientId = useMemo(() => {
    if (!GoogleAnalyticsObject || !GoogleAnalyticsObject.getAll) {
      return;
    }

    return GoogleAnalyticsObject && GoogleAnalyticsObject.getAll()[0]?.get('clientId');
  }, [GoogleAnalyticsObject]);

  return clientId;
};
