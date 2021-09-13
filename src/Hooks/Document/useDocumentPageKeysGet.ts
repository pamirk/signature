import { useCallback } from 'react';
import * as _ from 'lodash';
import { DocumentPart } from 'Interfaces/Document';

export default () => {
  const getPages = useCallback((files: NonNullable<DocumentPart['files']>) => {
    const orderedFiles = _.orderBy(files, 'order', 'asc');

    return orderedFiles.map(file => file.fileKey);
  }, []);

  return getPages;
};
