import { useEffect, useState } from 'react';

export const createShadowIFrame = (): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.style.display = 'none';
  return iframe;
};

export default () => {
  const [shadowIFrame, setShadowIFrame] = useState<HTMLIFrameElement>();

  useEffect(() => {
    setShadowIFrame(createShadowIFrame());
  }, []);

  useEffect(() => {
    return () => {
      if (shadowIFrame) {
        shadowIFrame.remove();
      }
    };
  }, [shadowIFrame]);

  return shadowIFrame as HTMLIFrameElement;
};
