import { useCallback } from 'react';

export default () => {
  const openNewTab = useCallback((url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_newblank';
    a.click();
  }, []);

  return [openNewTab] as const;
};
