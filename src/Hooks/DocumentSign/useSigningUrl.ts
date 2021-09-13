import { NormalizedEntity } from 'Interfaces/Common';
import { SigningUrlPayload } from 'Interfaces/Document';
import { useCallback, useState } from 'react';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import useSigningUrlGet from './useSigningUrlGet';

export default () => {
  const [getSigningUrl, isLoading] = useSigningUrlGet();
  const [signingUrls, setSigningUrls] = useState<
    NormalizedEntity<SigningUrlPayload> | {}
  >({});

  const handleCopyInClipboard = useCallback(async signingUrl => {
    try {
      await navigator.clipboard.writeText(signingUrl);
      Toast.success('Copied in clipboard');
    } catch (err) {
      Toast.error('Cannot copy to clipboard. Please try again.');
    }
  }, []);

  const handleGetSigningUrl = useCallback(
    async (documentId, userId) => {
      try {
        if (documentId && userId) {
          if (signingUrls[userId]) {
            await handleCopyInClipboard(signingUrls[userId].signingUrl);
            return;
          }

          const response:any = await getSigningUrl({ documentId, userId });

          if (!isNotEmpty(response)) {
            return Toast.error('Something went wrong. Please, try again.');
          }

          setSigningUrls({ ...signingUrls, [userId]: response });

          setTimeout(() => {
            handleCopyInClipboard(response.signingUrl);
          }, 0);
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [getSigningUrl, handleCopyInClipboard, signingUrls],
  );

  return [handleGetSigningUrl, isLoading] as const;
};
