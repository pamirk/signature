import { useCallback } from 'react';
import { useAttachmentDownload } from 'Hooks/Common';
import { DocumentDownloadPayload } from 'Interfaces/Document';
import { isNotEmpty } from 'Utils/functions';
import useDocumentDownloadUrlGet from './useDocumentDownloadUrlGet';

interface DownloadDocument {
  (payload: DocumentDownloadPayload): Promise<void>;
}

export default () => {
  const [
    getDocumentDownloadUrl,
    isGettingDocumentDownloadUrl,
  ] = useDocumentDownloadUrlGet();
  const [downloadAttachment, isReady] = useAttachmentDownload();

  const downloadDocument = useCallback(
    async (payload: DocumentDownloadPayload) => {
      const signedUrlResponse = await getDocumentDownloadUrl(payload);

      if (isNotEmpty(signedUrlResponse)) {
        return downloadAttachment(signedUrlResponse.result);
      }

      throw new Error('Could not download document');
    },
    [downloadAttachment, getDocumentDownloadUrl],
  ) as DownloadDocument;

  return [downloadDocument, isGettingDocumentDownloadUrl, isReady] as const;
};
