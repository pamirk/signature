import { useEffect } from 'react';
import { useAsyncAction } from 'Hooks/Common';
import {
  useDocumentFieldsMetaChange,
  useDocumentFieldStyleSet,
} from 'Hooks/DocumentFields';
import { NormalizedEntity, PDFMetadata } from 'Interfaces/Common';
import { Requisite } from 'Interfaces/Requisite';
import useDocumentFilesGet, {
  DocumentFilesGetPayload,
} from 'Hooks/Document/useDocumentFilesGet';
import { Document } from 'Interfaces/Document';
import { useRequisitesGet } from 'Hooks/Requisite';

export default (document?: Document) => {
  const [getDocumentFiles] = useDocumentFilesGet();
  const [setDocumentFieldsMeta, cleanDocumentFieldsMeta] = useDocumentFieldsMetaChange();
  const [getUserRequisites] = useRequisitesGet();
  const setDocumentFieldStyle = useDocumentFieldStyleSet();

  useEffect(() => {
    if (!document) return () => {};

    setDocumentFieldsMeta({ currentDocumentId: document.id });
    document.fields.forEach(documentField =>
      setDocumentFieldStyle(documentField, document.pdfMetadata as PDFMetadata),
    );

    return () => cleanDocumentFieldsMeta();
  }, [cleanDocumentFieldsMeta, document, setDocumentFieldStyle, setDocumentFieldsMeta]);

  return useAsyncAction((payload?: Omit<DocumentFilesGetPayload, 'document'>) => {
    if (!document) return [];

    // @ts-ignore
    return Promise.all([
      getDocumentFiles({ document, ...payload }),
      getUserRequisites(undefined),
    ]).then(res => res.flat()) as [string[], string[], {} | NormalizedEntity<Requisite>];
  });
};
