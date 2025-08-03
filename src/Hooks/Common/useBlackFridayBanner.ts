import { useCallback, useEffect, useState } from 'react';
import { IS_BLACK_FRIDAY } from 'Utils/constants';

export default () => {
  const [isShowBanner, setShowBanner] = useState<boolean>(false);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  useEffect(() => {
    if (IS_BLACK_FRIDAY) {
      setShowBanner(true);
    }
  }, []);

  return [isShowBanner, closeBanner] as const;
};
