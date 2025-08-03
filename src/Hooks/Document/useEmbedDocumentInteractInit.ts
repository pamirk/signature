import { useEffect } from 'react';
import { useAsyncAction } from 'Hooks/Common';
import { useDocumentFieldsMetaChange } from 'Hooks/DocumentFields';
import { DocumentFilesGetPayload } from './useDocumentFilesGet';
import useEmbedDocumentFilesGet from './useEmbedDocumentFilesGet';

export default () => {
  const [getConvertedDocument] = useEmbedDocumentFilesGet();
  const [setDocumentFieldsMeta, cleanDocumentFieldsMeta] = useDocumentFieldsMetaChange();

  useEffect(() => {
    return () => cleanDocumentFieldsMeta();
  }, [cleanDocumentFieldsMeta]);

  return useAsyncAction((payload: DocumentFilesGetPayload) => {
    setDocumentFieldsMeta({ currentDocumentId: payload.document.id });

    // @ts-ignore
    return getConvertedDocument(payload) as [string[], string[], {}];
  });
};
