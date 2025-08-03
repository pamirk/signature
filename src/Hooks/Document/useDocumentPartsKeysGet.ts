import { useCallback } from 'react';
import { orderBy } from 'lodash';
import { DocumentPart } from 'Interfaces/Document';

export default () => {
  const getPages = useCallback((files: DocumentPart[]) => {
    const orderedFiles = orderBy(files, 'order', 'asc');
    return orderedFiles.map(file => file.pdfFileKey) as string[];
  }, []);

  return getPages;
};
