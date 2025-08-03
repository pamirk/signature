import { PDFMetadata } from 'Interfaces/Common';
import { Document } from 'Interfaces/Document';
import { orderBy } from 'lodash';
import { useCallback } from 'react';

export default (currentDocument: Document) => {
  const getPdfMetadata = useCallback(() => {
    const parts = currentDocument?.parts || [];
    const mergedMetadata = {};

    const metadatas = orderBy(parts, 'order').reduce((mergedMetadata, part) => {
      const pdfMetadata = part.pdfMetadata || {};

      const partMetadata = Object.keys(pdfMetadata)
        .filter(key => key !== 'pages')
        .map(key => pdfMetadata[key]);

      return [...mergedMetadata, ...partMetadata];
    }, [] as PDFMetadata[]);

    metadatas.forEach((v, i) => {
      mergedMetadata[i + 1] = {
        ...v,
        pageNumber: i + 1,
      };
    });

    mergedMetadata['pages'] = metadatas.length;

    return mergedMetadata as PDFMetadata;
  }, [currentDocument]);

  return getPdfMetadata;
};
