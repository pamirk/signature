import { useEffect } from 'react';
import { useAsyncAction } from 'Hooks/Common';
import {
  useDocumentFieldsMetaChange,
  useDocumentFieldStyleSet,
} from 'Hooks/DocumentFields';
import { NormalizedEntity, PDFMetadata } from 'Interfaces/Common';
import { Requisite } from 'Interfaces/Requisite';
import { DocumentFilesGetPayload } from 'Hooks/Document/useDocumentFilesGet';
import { Document } from 'Interfaces/Document';
import { useRequisitesGet } from 'Hooks/Requisite';
import { useCompatibleSignedGetUrl } from '../User';
import { isNotEmpty } from 'Utils/functions';

export default (document?: Document) => {
  const [setDocumentFieldsMeta, cleanDocumentFieldsMeta] = useDocumentFieldsMetaChange();
  const [getUserRequisites] = useRequisitesGet();
  const [getCompatibleSignedGetUrl] = useCompatibleSignedGetUrl();
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

    const fileKey =
      isNotEmpty(document.files) && document.files && document.files[0].fileKey;
    const key = fileKey ? fileKey : (document.pdfFileKey as string);

    // @ts-ignore
    return Promise.all([
      getCompatibleSignedGetUrl({ key, pdfFileKey: document.pdfFileKey }),
      getUserRequisites(undefined),
    ]).then(res => res.flat()) as [
      { result: string },
      string[],
      {} | NormalizedEntity<Requisite>,
    ];
  });
};
