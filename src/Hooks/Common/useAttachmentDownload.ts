import { useCallback } from 'react';
import useShadowLink from './useShadowLink';

interface DownloadAttachment {
  (url: string): Promise<void>;
}

type isReady = {} & boolean;

export default () => {
  const shadowLink = useShadowLink();

  const downloadAttachment = useCallback(
    (url: string) => {
      return new Promise((resolve, reject) => {
        if (shadowLink) {
          shadowLink.href = url;
          shadowLink.click();
          resolve();
        } else {
          reject("Download isn't ready yet");
        }
      });
    },
    [shadowLink],
  ) as DownloadAttachment;

  return [downloadAttachment, !!shadowLink as isReady] as const;
};
