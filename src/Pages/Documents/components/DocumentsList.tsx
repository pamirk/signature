import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import History from 'Services/History';
import { SelectableDocument } from 'Interfaces/Document';
import { TablePaginationProps } from 'Interfaces/Common';
import EmptyTable from 'Components/EmptyTable';
import IconDownload from 'Assets/images/icons/download-icon.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconSort from 'Assets/images/icons/sort.svg';
import DocumentItem from './DocumentItem';
import UISpinner from '../../../Components/UIComponents/UISpinner';
import UICheckbox from 'Components/UIComponents/UICheckbox';

interface DocumentsListProps {
  documents: SelectableDocument[];
  paginationProps?: TablePaginationProps;
  toggleItemSelection: (documentId: string | string[]) => void;
  requestOrdering: (key: string) => void;
  openDeleteModal: () => void;
  onDownload: () => void;
  isLoading: boolean;
  isDeleteModalOpen: boolean;
  isDownloading?: boolean;
}

interface AllSelectedItem {
  [pageNumber: string]: boolean;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function DocumentsList({
  documents,
  paginationProps = defaultPaginationProps,
  toggleItemSelection,
  isLoading,
  requestOrdering,
  isDeleteModalOpen,
  openDeleteModal,
  onDownload,
  isDownloading = false,
}: DocumentsListProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;
  const [allSelected, setAllSelected] = useState<AllSelectedItem>({});
  const isAllSelectedChecked = useMemo(() => allSelected[paginationProps.pageNumber], [
    allSelected,
    paginationProps.pageNumber,
  ]);

  const handleSelectAll = useCallback(() => {
    toggleItemSelection(documents.map(document => document.id));
    const prevValue = !!allSelected[paginationProps.pageNumber];
    setAllSelected(prev => ({ ...prev, [paginationProps.pageNumber]: !prevValue }));
  }, [allSelected, documents, paginationProps.pageNumber, toggleItemSelection]);

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
        <div className="tableControls__controlsGroup">
          <button
            className="tableControls__control tableControls__control--blue"
            disabled={isDownloading}
            onClick={onDownload}
          >
            {isDownloading ? (
              <UISpinner
                width={16}
                height={16}
                wrapperClassName="tableControls__control-spinner"
              />
            ) : (
              <ReactSVG src={IconDownload} className="tableControls__control-icon" />
            )}
            Download
          </button>
          <button
            onClick={openDeleteModal}
            className="tableControls__control tableControls__control--red"
          >
            <ReactSVG src={IconRemove} className="tableControls__control-icon" />
            Delete
          </button>
        </div>
      </div>
      <div className="table__container">
        <div className="table__innerContainer">
          <div className="table__row table__header">
            <div className="table__column table__column--check select-all">
              <UICheckbox handleClick={handleSelectAll} check={isAllSelectedChecked} />
            </div>
            <div className="table__column table__column--text">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('title')}
              >
                <span>TITLE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--date">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('createdAt')}
              >
                <span>DATE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--status">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('status')}
              >
                <span>STATUS</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--signer">
              <span>SIGNERS</span>
            </div>
            <div className="table__column table__column--action">ACTIONS</div>
          </div>
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

export default DocumentsList;
