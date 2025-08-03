import { useAsyncAction } from 'Hooks/Common';
import { useSignedGetUrlBulk } from 'Hooks/User';
import { isNotEmpty } from 'Utils/functions';
import { Document, DocumentDownloadTypes, DocumentStatuses } from 'Interfaces/Document';
import useDocumentPageKeysGet from './useDocumentPartsKeysGet';

export interface DocumentFilesGetPayload {
  document: Document;
}

export default () => {
  const [getPresignedGetUrlBulk] = useSignedGetUrlBulk();
  const getDocumentPageKeys = useDocumentPageKeysGet();

  return useAsyncAction(async ({ document }: DocumentFilesGetPayload) => {
    let pageKeys;
    if (document.status === DocumentStatuses.DRAFT) {
      if (!document.parts) return [[], []];
      pageKeys = getDocumentPageKeys(document.parts);
    } else if (document.status === DocumentStatuses.COMPLETED) {
      pageKeys =
        document.downloadType === DocumentDownloadTypes.MERGED
          ? [document.resultPdfFileKey]
          : [document.resultDocumentPdfFileKey];
    } else {
      pageKeys = document.pdfFileKey
        ? [document.pdfFileKey]
        : getDocumentPageKeys(document.parts);
    }

    const documentFilesKeys = [...pageKeys, ...[]];

    const presignedUrls = await getPresignedGetUrlBulk({ keys: documentFilesKeys });

    if (!isNotEmpty(presignedUrls)) return [[], []];

    const presignedPagesUrls = pageKeys.map(key => presignedUrls[key]);
    // const presignedPreviewsUrls = previewKeys.map(key => presignedUrls[key]);

    return [presignedPagesUrls, []];
  });
};
