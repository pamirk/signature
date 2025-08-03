import { useCallback } from 'react';
import { useAttachmentDownload } from 'Hooks/Common';
import { DocumentSeparateSignPayload } from 'Interfaces/Document';
import { isNotEmpty } from 'Utils/functions';
import useDocumentSeparateDownloadUrlGet from './useDocumentSeparateDownloadUrlGet';

interface DownloadDocument {
  (payload: DocumentSeparateSignPayload): Promise<void>;
}

export default () => {
  const [
    getSeparateDocumentDownloadUrl,
    isGettingSeparateDocumentDownloadUrl,
  ] = useDocumentSeparateDownloadUrlGet();
  const [downloadAttachment, isReady] = useAttachmentDownload();

  const downloadDocument = useCallback(
    async (payload: DocumentSeparateSignPayload) => {
      const signedUrlResponse = await getSeparateDocumentDownloadUrl(payload);

      if (isNotEmpty(signedUrlResponse)) {
        return downloadAttachment(signedUrlResponse.result);
      }

      throw new Error('Could not download document');
    },
    [downloadAttachment, getSeparateDocumentDownloadUrl],
  ) as DownloadDocument;

  return [downloadDocument, isGettingSeparateDocumentDownloadUrl, isReady] as const;
};
