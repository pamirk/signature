import { useCallback, useEffect } from 'react';

export default () => {
  const stopScroll = useCallback(() => {
    const body = document.body;
    body.classList.add('noscroll');
  }, []);

  const resetScroll = useCallback(() => {
    const body = document.body;
    body.classList.remove('noscroll');
  }, []);

  useEffect(() => {
    stopScroll();
    return () => resetScroll();
  }, [resetScroll, stopScroll]);
};
