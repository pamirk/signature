import { useCallback } from 'react';
import { useAsyncAction } from 'Hooks/Common';

interface GetUrlParams {
  key?: string;
  pdfFileKey?: string;
}

//TODO: Remove this hook when the backend is updated to support the new API
const useCompatibleSignedGetUrl = () => {
  const getSignedUrl = useAsyncAction(async ({ key, pdfFileKey }: GetUrlParams) => {
    if (!key && !pdfFileKey) {
      throw new Error('Either key or pdfFileKey must be provided');
    }

    const fileKey = key || pdfFileKey;
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/signed-url/${fileKey}`);
      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      return {
        result: await response.text()
      };
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  });

  const wrappedGetSignedUrl = useCallback(//@ts-ignore
    (params: GetUrlParams) => getSignedUrl(params),
    [getSignedUrl]
  );

  return [wrappedGetSignedUrl] as const;
};

export default useCompatibleSignedGetUrl;