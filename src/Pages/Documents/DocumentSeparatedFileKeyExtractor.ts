import { Document, DocumentStatuses } from 'Interfaces/Document';
import { GridItem } from 'Interfaces/Grid';
import { useCallback } from 'react';
import { formatDateToHumanString } from 'Utils/formatters';

export default () => {
  const documentSeparatedFileKeyExtractor = useCallback((grid: GridItem) => {
    if (!grid.documents) {
      throw new Error('Selected items must be documents');
    }

    const document = grid.documents;
    return document.status === DocumentStatuses.COMPLETED &&
      document.resultDocumentPdfFileKey
      ? [
          {
            fileKey: document.resultDocumentPdfFileKey,
            fileName: `${document.title} (${formatDateToHumanString(
              document.createdAt,
            )}).pdf`,
            itemName: document.title,
            chunkIndex: grid.chunkIndex,
          },
        ]
      : [{}];
  }, []);

  const documentSeparatedFileKeyExtractorForDocument = useCallback(
    (document: Document) => {
      let fileKey: string | null;

      if (document.status === DocumentStatuses.COMPLETED) {
        fileKey = document.resultDocumentPdfFileKey;
      } else {
        if (document.pdfFileKey) {
          fileKey = document.pdfFileKey;
        } else {
          if (document.parts.length) {
            return document.parts
              .filter(part => part.filesUploaded)
              .map(part => ({
                fileKey: part.pdfFileKey,
                fileName: `${part.originalFileName.replace(
                  /\.[^/.]+$/,
                  '',
                )} (${formatDateToHumanString(document.createdAt)}).pdf`,
                itemName: document.title,
              }));
          } else {
            return [];
          }
        }
      }

      return [
        {
          fileKey,
          fileName: `${document.title} (${formatDateToHumanString(
            document.createdAt,
          )}).pdf`,
          itemName: document.title,
        },
      ];
    },
    [],
  );

  const documentSeparatedFileKeyExtractorForDocumentActivities = useCallback(
    (document: Document) => {
      let fileKey: string | null;

      if (document.status === DocumentStatuses.COMPLETED) {
        fileKey = document.resultActivitiesPdfFileKey;
      } else {
        if (document.pdfFileKey) {
          fileKey = document.pdfFileKey;
        } else {
          if (document.parts.length) {
            return document.parts
              .filter(part => part.filesUploaded)
              .map(part => ({
                fileKey: part.pdfFileKey,
                fileName: `${part.originalFileName.replace(
                  /\.[^/.]+$/,
                  '',
                )} (${formatDateToHumanString(document.createdAt)}).pdf`,
                itemName: document.title,
              }));
          } else {
            return [];
          }
        }
      }

      return [
        {
          fileKey,
          fileName: `${document.title}-activities (${formatDateToHumanString(
            document.createdAt,
          )}).pdf`,
          itemName: document.title,
        },
      ];
    },
    [],
  );

  return [
    documentSeparatedFileKeyExtractor,
    documentSeparatedFileKeyExtractorForDocument,
    documentSeparatedFileKeyExtractorForDocumentActivities,
  ] as const;
};
