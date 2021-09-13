import { useCallback } from 'react';
import { DocumentField } from 'Interfaces/DocumentFields';
import useDocumentFieldUpdateLocally from './useDocumentFieldUpdateLocally';
import { PDFMetadata } from 'Interfaces/Common';

interface SetDocumentFieldStyles {
  (documentField: DocumentField, documentMetadata: PDFMetadata): void;
}

export default () => {
  const updateDocumentFieldLocally = useDocumentFieldUpdateLocally();

  const setDocumentFieldsStyles: SetDocumentFieldStyles = useCallback(
    (documentField: DocumentField, documentMetadata: PDFMetadata) => {
      const greaterPageWidth = Object.values(documentMetadata).reduce(
        (greaterWidth, pageMetadata) => {
          return greaterWidth < pageMetadata.width ? pageMetadata.width : greaterWidth;
        },
        0,
      );

      const pageOffset =
        (greaterPageWidth - documentMetadata[documentField.pageNumber].width) / 2 || 0;

      const updatedField = {
        ...documentField,
        style: {
          ...documentField.style,
          width: documentField.width as number,
          height: documentField.height as number,
          left: documentField.coordinateX + pageOffset,
          top: documentField.coordinateY,
          fontFamily: documentField.fontFamily || undefined,
          fontSize: documentField.fontSize ? documentField.fontSize : undefined,
        },
      };

      updateDocumentFieldLocally(updatedField);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateDocumentFieldLocally],
  );

  return setDocumentFieldsStyles;
};
