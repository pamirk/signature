import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectableItem } from 'Interfaces/Common';
import { GridItem } from 'Interfaces/Grid';
import DocumentFileKeyExtractor from 'Pages/Documents/DocumentFileKeyExtractor';
import DocumentSeparatedFileKeyExtractor from 'Pages/Documents/DocumentSeparatedFileKeyExtractor';
import DocumentActivitiesFileKeyExtractor from 'Pages/Documents/DocumentActivitiesFileKeyExtractor';
import { useBulkDownloadFiles } from 'Hooks/Common';
import { chunk } from 'lodash';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import IconArrowCircle from 'Assets/images/icons/arrow-circle.svg';
import UIProgressBar from 'Components/UIComponents/UIProgressBar';
import { ZIP_ARCHIVE_DOCUMENT_COUNT } from 'Utils/constants';

interface DownloadModalProps {
  onClose: () => void;
  selectedItems: SelectableItem<GridItem>[];
}

export interface DownloadChunksInterface {
  index: number;
  name: string;
  chunk: SelectableItem<GridItem>[];
  isFinished: boolean;
  percentage?: number;
}

const DownloadModal = ({ onClose, selectedItems }: DownloadModalProps) => {
  const [documentFileKeyExtractorForGrid] = DocumentFileKeyExtractor();
  const [documentSeparatedFileKeyExtractor] = DocumentSeparatedFileKeyExtractor();
  const [documentActivitiesFileKeyExtractor] = DocumentActivitiesFileKeyExtractor();

  const initialChunks: DownloadChunksInterface[] = useMemo(
    () =>
      chunk(selectedItems, ZIP_ARCHIVE_DOCUMENT_COUNT).map((chunk, index) => {
        const name = index === 0 ? `signaturely.zip` : `signaturely (${index}).zip`;
        return { index, name, chunk, isFinished: false };
      }) as DownloadChunksInterface[],
    [selectedItems],
  );

  const [chunks, setChunks] = useState<DownloadChunksInterface[]>(initialChunks);

  const handleSetChunks = useCallback(
    (percentageInput: number, chunkIndex: number) => {
      setChunks(
        chunks.map(chunk => {
          if (chunk.index === chunkIndex) {
            chunk.percentage = percentageInput;

            if (percentageInput === 100) {
              chunk.isFinished = true;
            }
          }

          return chunk;
        }),
      );
    },
    [chunks],
  );

  const downloadDocuments = useBulkDownloadFiles<GridItem>({
    fileExtractors: [
      documentFileKeyExtractorForGrid,
      documentSeparatedFileKeyExtractor,
      documentActivitiesFileKeyExtractor,
    ],
    setChunks: handleSetChunks,
  });

  const handleDownload = useCallback(async () => {
    for (const item of chunks) {
      item.chunk.map(gridItem => (gridItem.chunkIndex = item.index));
      await downloadDocuments(item.chunk);
    }
  }, [chunks, downloadDocuments]);

  useEffect(() => {
    handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="downloadModal__wrapper">
      <div className="modal__header downloadModal__header">
        <h4 className="modal__title downloadModal__title">Download Progress</h4>
        <p className="downloadModal__subtitle">Download starts automatically.</p>
      </div>
      <div className="downloadModal__zip-wrapper">
        <ul className="downloadModal__list">
          {chunks.map(item => {
            return (
              <li className="downloadModal__list-item" key={item.index}>
                <p className={classNames('downloadModal__label')}>{item.name}</p>
                {!item.isFinished ? (
                  <UIProgressBar percent={item.percentage} withStaging={false} />
                ) : (
                  <ReactSVG
                    src={IconArrowCircle}
                    className="documents__dropdownOptionSigners-icon"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="downloadModal__buttons-group">
        <div className="downloadModal__cancel" onClick={onClose}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
