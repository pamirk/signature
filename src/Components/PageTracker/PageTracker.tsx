import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Bing from 'Services/Integrations/Analytics/Bing';

export const PageTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    Bing.firePageChangeEvent(pathname);
  }, [pathname]);
  return null;
};

export default PageTracker;
