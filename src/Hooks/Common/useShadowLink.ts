import { useEffect, useState } from 'react';

export const createShadowLink = () => {
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.style.display = 'none';

  return link;
};

export default () => {
  const [shadowLink, setShadowLink] = useState<HTMLAnchorElement>();

  useEffect(() => {
    setShadowLink(createShadowLink());
  }, []);

  useEffect(() => {
    return () => {
      if (shadowLink) {
        shadowLink.remove();
      }
    };
  }, [shadowLink]);

  return shadowLink as HTMLAnchorElement;
};
