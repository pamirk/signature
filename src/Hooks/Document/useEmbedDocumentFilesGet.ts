import { useAsyncAction } from 'Hooks/Common';
import { useEmbedSignedUrlBulkGet } from 'Hooks/User';
import { isNotEmpty } from 'Utils/functions';
import { Document, DocumentStatuses, DocumentDownloadTypes } from 'Interfaces/Document';
import useDocumentPageKeysGet from './useDocumentPartsKeysGet';

export interface DocumentFilesGetPayload {
  document: Document;
  pickPreviews?: boolean;
}

export default () => {
  const [getPresignedGetUrlBulk] = useEmbedSignedUrlBulkGet();
  const getDocumentPageKeys = useDocumentPageKeysGet();

  return useAsyncAction(async ({ document, pickPreviews }: DocumentFilesGetPayload) => {
    let pageKeys;
    if (document.status === DocumentStatuses.DRAFT) {
      if (!document.parts) return [[], []];
      pageKeys = getDocumentPageKeys(document.parts);
    } else if (document.status === DocumentStatuses.AWAITING) {
      pageKeys = document.pdfFileKey
        ? getDocumentPageKeys(document.parts)
        : [document.pdfFileKey];
    } else {
      pageKeys =
        document.downloadType === DocumentDownloadTypes.MERGED
          ? [document.resultPdfFileKey]
          : [document.resultDocumentPdfFileKey];
    }

    const documentFilesKeys = [...pageKeys, ...[]];

    const presignedUrls = await getPresignedGetUrlBulk({ keys: documentFilesKeys });

    if (!isNotEmpty(presignedUrls)) return [[], []];

    const presignedPagesUrls = pageKeys.map(key => presignedUrls[key]);
    // const presignedPreviewsUrls = previewKeys.map(key => presignedUrls[key]);

    return [presignedPagesUrls, []];
  });
};
