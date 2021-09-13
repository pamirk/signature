import { PDFPageMetadata } from 'Interfaces/Common';
import { INTERACT_SIZES } from './constants';
import { DocumentFieldTypes, DocumentField } from 'Interfaces/DocumentFields';

export const calculateSizeRatio = (pdfPageMeta?: PDFPageMetadata | null) => {
  if (!pdfPageMeta) return;

  return (
    INTERACT_SIZES.pageContainerWidth /
    (pdfPageMeta.width + INTERACT_SIZES.rightPagePadding + INTERACT_SIZES.leftPagePadding)
  );
};

export const getMinSize = (type: DocumentFieldTypes) => {
  switch (type) {
    case DocumentFieldTypes.Date: {
      return {
        width: 50,
        height: 20,
      };
    }
    default: {
      return {
        width: 15,
        height: 15,
      };
    }
  }
};

export const fieldHasValue = (
  fieldValues: Pick<DocumentField, 'requisiteId' | 'text' | 'checked'>,
  type: DocumentFieldTypes,
) => {
  switch (type) {
    case DocumentFieldTypes.Checkbox: {
      return fieldValues.checked;
    }
    case DocumentFieldTypes.Date:
    case DocumentFieldTypes.Text: {
      return fieldValues.text;
    }
    default: {
      return fieldValues.requisiteId;
    }
  }
};
