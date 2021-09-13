import { useAsyncAction } from 'Hooks/Common';
import { useSignedGetUrlBulk } from 'Hooks/User';
import { useDocumentPreviewPagesGet } from 'Hooks/DocumentSign';
import { isNotEmpty } from 'Utils/functions';
import {
  Document,
  DocumentStatuses,
  DocumentPreviewPagesPayload,
} from 'Interfaces/Document';
import useDocumentPageKeysGet from './useDocumentPageKeysGet';
import useDocumentPagePreviewKeysGet from './useDocumentPagePreviewKeysGet';
import * as _ from 'lodash';

export interface DocumentFilesGetPayload {
  document: Document;
  pickPreviews?: boolean;
}

export default () => {
  const [getPresignedGetUrlBulk] = useSignedGetUrlBulk();
  const [getDocumentPreviewPages] = useDocumentPreviewPagesGet();
  const getDocumentPageKeys = useDocumentPageKeysGet();
  const getDocumentPagePreviewKeys = useDocumentPagePreviewKeysGet();

  return useAsyncAction(async ({ document, pickPreviews }: DocumentFilesGetPayload) => {
    const isDocumentCompleted = document.status === DocumentStatuses.COMPLETED;

    let files:any;

    if (document.parts) {
      const sortedDocumentParts = _.orderBy(document.parts, 'order');
      files = _.flatten(
        sortedDocumentParts.map(part => _.orderBy(part.files, 'order') || []),
      ).map((file, index) => ({ ...file, order: index + 1 }));
    } else {
      files = document.files;
    }

    if (isDocumentCompleted) {
      const documentPreviewPages = (await getDocumentPreviewPages({
        documentId: document.id,
      })) as DocumentPreviewPagesPayload;

      files = _.orderBy(documentPreviewPages.files, 'file.order');
    }

    if (!files) return [[], []];

    const previewKeys = pickPreviews ? getDocumentPagePreviewKeys(files) : [];
    const pageKeys = getDocumentPageKeys(files);
    const documentFilesKeys = [...pageKeys, ...previewKeys];

    const presignedUrls = await getPresignedGetUrlBulk({ keys: documentFilesKeys });

    if (!isNotEmpty(presignedUrls)) return [[], []];

    const presignedPagesUrls = pageKeys.map(key => presignedUrls[key]);
    const presignedPreviewsUrls = previewKeys.map(key => presignedUrls[key]);

    return [presignedPagesUrls, presignedPreviewsUrls];
  });
};
