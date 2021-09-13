import React, { useCallback } from 'react';
import classNames from 'classnames';
import History from 'Services/History';
import { SelectableDocument, Document } from 'Interfaces/Document';
import { TablePaginationProps } from 'Interfaces/Common';
import EmptyTable from 'Components/EmptyTable/EmptyTable';
import UISpinner from '../../../Components/UIComponents/UISpinner';
import DocumentItem from './DocumentItem/DocumentItem';
import Toast from 'Services/Toast';

interface DocumentsListMobileProps {
  documents: SelectableDocument[];
  paginationProps?: TablePaginationProps;
  toggleItemSelection: (documentId: string) => void;
  openDeleteModal: () => void;
  isLoading: boolean;
  isDeleteModalOpen: boolean;
  isDownloading?: boolean;
  onDownload: (value: SelectableDocument[]) => void;
  onDelete?: (value: Document['id'][]) => void;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function DocumentsListMobile({
  documents,
  paginationProps = defaultPaginationProps,
  toggleItemSelection,
  isLoading,
  isDeleteModalOpen,
  onDownload,
  onDelete,
}: DocumentsListMobileProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;

  const handleDownload = useCallback(
    async (documentId: Document['id']) => {
      try {
        const document = documents.find(document => document.id === documentId);
        document && (await onDownload([document]));
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [documents, onDownload],
  );

  const handleDelete = useCallback(
    async (documentId: Document['id']) => {
      try {
        onDelete && (await onDelete([documentId]));
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [onDelete],
  );

  if (documents.length === 0 && !isLoading)
    return (
      <div className="documents__empty-table">
        <EmptyTable
          onClick={() => {
            History.push('/sign');
          }}
          iconClassName="empty-table__icon--document"
          buttonText="Create Document"
          headerText="You don't have any documents yet."
          description="Start uploading documents for signing and they will appear here."
        />
      </div>
    );

  return (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <p className="tableControls__pagingCounter">
          {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit +
            (itemsCount || itemsLimit)}`}
          &nbsp;of&nbsp;
          <span>{totalItems}</span>
          &nbsp;results
        </p>
      </div>
      <div className="table__container mobile">
        <div className="table__innerContainer">
          <div className="table__row table__header mobile">Documents</div>
          {isLoading ? (
            <UISpinner
              width={50}
              height={50}
              wrapperClassName="documents__spinner spinner--main__wrapper"
            />
          ) : (
            documents.map(document => {
              const { isSelected } = document;

              return (
                <DocumentItem
                  key={document.id}
                  document={document}
                  toggleSelect={() => toggleItemSelection(document.id)}
                  isSelected={isSelected}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  className={classNames({
                    'table__dataRow--delete': isDeleteModalOpen && isSelected,
                    'table__dataRow--inactive': isDeleteModalOpen && !isSelected,
                  })}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentsListMobile;
