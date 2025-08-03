import { useCallback, useEffect, useState } from 'react';
import { IS_END_OF_YEAR } from 'Utils/constants';

export default () => {
  const [isShowBanner, setShowBanner] = useState<boolean>(false);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  useEffect(() => {
    if (IS_END_OF_YEAR) {
      setShowBanner(true);
    }
  }, []);

  return [isShowBanner, closeBanner] as const;
};
