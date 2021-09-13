import { useCallback } from 'react';
import pathParse from 'path-parse';
import * as _ from 'lodash';
import { DocumentPart } from 'Interfaces/Document';

export default () => {
  const getPreviews = useCallback((files: NonNullable<DocumentPart['files']>) => {
    const orderedFiles = _.orderBy(files, 'order', 'asc');
    const previews = orderedFiles.map(file => {
      const { dir, name } = pathParse(file.fileKey);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [rootFolder, userId] = dir.split('/');

      return `jpg/${userId}/small/${name}.jpg`;
    });

    return previews;
  }, []);

  return getPreviews;
};
