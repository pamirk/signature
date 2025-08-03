import { useAttachmentDownload } from 'Hooks/Common';
import { DocumentActivitiesDownloadPayload } from 'Interfaces/Document';
import { useCallback } from 'react';
import { isNotEmpty } from 'Utils/functions';
import useDocumentActivitiesDownloadUrlGet from './useDocumentActivitiesDownloadUrlGet';

interface DownloadDocumentActivities {
  (payload: DocumentActivitiesDownloadPayload): Promise<void>;
}

export default () => {
  const [
    getDocumentActivitiesDownloadUrl,
    isGettingDocumentActivitiesDownloadUrl,
  ] = useDocumentActivitiesDownloadUrlGet();
  const [downloadAttachment, isReady] = useAttachmentDownload();

  const downloadDocumentActivities = useCallback(
    async (payload: DocumentActivitiesDownloadPayload) => {
      const signedUrlResponse = await getDocumentActivitiesDownloadUrl(payload);

      if (isNotEmpty(signedUrlResponse)) {
        return downloadAttachment(signedUrlResponse.result);
      }

      throw new Error('Could not download document');
    },
    [downloadAttachment, getDocumentActivitiesDownloadUrl],
  ) as DownloadDocumentActivities;

  return [
    downloadDocumentActivities,
    isGettingDocumentActivitiesDownloadUrl,
    isReady,
  ] as const;
};
