import { DocumentStatuses } from 'Interfaces/Document';
import { GridItem } from 'Interfaces/Grid';
import { useCallback } from 'react';
import { formatDateToHumanString } from 'Utils/formatters';

export default () => {
  const documentActivitiesFileKeyExtractor = useCallback((grid: GridItem) => {
    if (!grid.documents) {
      throw new Error('Selected items must be documents');
    }

    const document = grid.documents;
    return document.status === DocumentStatuses.COMPLETED &&
      document.resultActivitiesPdfFileKey
      ? [
          {
            fileKey: document.resultActivitiesPdfFileKey,
            fileName: `${document.title}_activities (${formatDateToHumanString(
              document.createdAt,
            )}).pdf`,
            itemName: document.title,
            chunkIndex: grid.chunkIndex,
          },
        ]
      : [{}];
  }, []);

  return [documentActivitiesFileKeyExtractor];
};
