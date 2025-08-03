import { useEffect } from 'react';
import { useRequisitesGet } from 'Hooks/Requisite';
import { useAsyncAction } from 'Hooks/Common';
import { useDocumentFieldsMetaChange } from 'Hooks/DocumentFields';
import { NormalizedEntity } from 'Interfaces/Common';
import { Requisite } from 'Interfaces/Requisite';
import { DocumentFilesGetPayload } from './useDocumentFilesGet';
import useDocumentFilesGet from './useDocumentFilesGet';

export default () => {
  const [getConvertedDocument] = useDocumentFilesGet();
  const [getUserRequisites] = useRequisitesGet();
  const [setDocumentFieldsMeta, cleanDocumentFieldsMeta] = useDocumentFieldsMetaChange();

  useEffect(() => {
    return () => cleanDocumentFieldsMeta();
  }, [cleanDocumentFieldsMeta]);

  return useAsyncAction((payload: DocumentFilesGetPayload) => {
    setDocumentFieldsMeta({ currentDocumentId: payload.document.id });

    // @ts-ignore
    return Promise.all([
      getConvertedDocument(payload),
      getUserRequisites(undefined),
    ]).then(res => res.flat()) as [string[], string[], {} | NormalizedEntity<Requisite>];
  });
};
