import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { RangeModifier } from 'react-day-picker';
import {
  usePagination,
  useSelectableItem,
  useDataOrdering,
  useModal,
} from 'Hooks/Common';
import { selectGrid, selectGridPaginationData } from 'Utils/selectors';
import Toast from 'Services/Toast';
import { DocumentStatuses, SearchTypeEnum } from 'Interfaces/Document';
import {
  formatDateStringToEndDay,
  formatDateStringToStartDay,
  formatDateToIsoString,
} from 'Utils/formatters';
import { OrderingDirection } from 'Interfaces/Common';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import DeleteModal from 'Components/DeleteModal';
import { DocumentSearch } from 'Pages/Documents/components/DocumentSearch';
import { useGridForSignatureRequestsGet, useGridItemsDelete } from 'Hooks/Grid';
import Grid from 'Pages/Documents/components/Grid';
import { Folder } from 'Interfaces/Folder';
import { GridEntityType } from 'Interfaces/Grid';
import { SignatureRequestStatuses } from 'Interfaces/SignatureRequest';
import UIModal from 'Components/UIComponents/UIModal';
import DownloadModal from 'Pages/Documents/components/modals/DownloadModal';
import ConfirmModal from 'Components/ConfirmModal';
import { ZIP_ARCHIVE_DOCUMENT_COUNT } from 'Utils/constants';

type selectedPage = { selected: number };

type statusType = { status: DocumentStatuses };

const validSignatureRequestStatuses: SignatureRequestStatuses[] = [
  SignatureRequestStatuses.AWAITING_OTHERS,
  SignatureRequestStatuses.AWAITING_YOU,
  SignatureRequestStatuses.COMPLETED,
  SignatureRequestStatuses.SIGNED,
  SignatureRequestStatuses.DECLINED,
  SignatureRequestStatuses.EXPIRED,
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignatureRequestsScreen = ({ match }: RouteChildrenProps<statusType>) => {
  const [getGridForSignatureRequests, isFetching] = useGridForSignatureRequestsGet();
  const [deleteGrids] = useGridItemsDelete();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectGridPaginationData,
  });

  const grid = useSelector(selectGrid);
  const [folderId, setFolderId] = useState<Folder['id'] | undefined>(undefined);

  const [selectedDates, setSelectedDates] = useState<RangeModifier>();

  const { requestOrdering, orderingConfig } = useDataOrdering(grid, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const [searchType] = useState(SearchTypeEnum.DOCUMENTS);

  const [
    selectableGridItems,
    toggleItemSelection,
    selectedItems,
    clearSelection,
  ] = useSelectableItem(grid, 'entityId');
  const [documentNameFilter, setDocumentNameFilter] = useState<string | string[]>('');
  const [signatureRequestStatus, setSignatureRequestStatus] = useState<
    SignatureRequestStatuses
  >();

  const isSetSearchFilter = useMemo(
    () => !!documentNameFilter || !!signatureRequestStatus || !!selectedDates,
    [documentNameFilter, selectedDates, signatureRequestStatus],
  );

  const [showExtraDownloadModal, closeExtraDownloadModal] = useModal(() => {
    const handleCloseModal = () => {
      closeExtraDownloadModal();
      clearSelection();
    };

    return (
      <UIModal className="downloadModal" onClose={handleCloseModal}>
        <DownloadModal onClose={handleCloseModal} selectedItems={selectedItems} />
      </UIModal>
    );
  }, [selectedItems]);

  const [showExtraDownloadConfirmModal, closeExtraDownloadConfirmModal] = useModal(
    () => (
      <ConfirmModal
        onClose={() => {
          closeExtraDownloadConfirmModal();
        }}
        onCancel={closeExtraDownloadConfirmModal}
        onConfirm={() => {
          closeExtraDownloadConfirmModal();
          showExtraDownloadModal();
        }}
        confirmText="Download"
        hideCloseIcon
      >
        <div className="modal__header">
          <h4 className="modal__title">Download documents</h4>
        </div>
        <p className="modal__subTitle modal__subTitle--center">
          You have selected {selectedItems.length} documents.
          <br />
          {Math.ceil(selectedItems.length / ZIP_ARCHIVE_DOCUMENT_COUNT)} ZIP files will be
          downloaded.
          <br />
          Would you like to continue downloading?
        </p>
      </ConfirmModal>
    ),
    [selectedItems],
  );

  const handleDownloads = useCallback(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedItems.length > ZIP_ARCHIVE_DOCUMENT_COUNT
      ? showExtraDownloadConfirmModal()
      : showExtraDownloadModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const changeDocumentNameFilter = useCallback(
    (value: string | string[]) => {
      setPageNumber(0);
      setDocumentNameFilter(value);
    },
    [setPageNumber],
  );

  const handleGetGrid = useCallback(
    async () => {
      const { from, to } = selectedDates || {};
      const { key, direction } = orderingConfig;
      const orderingDirection = direction.toString().toUpperCase();
      try {
          await getGridForSignatureRequests({
          page: paginationProps.pageNumber + 1,
          limit: paginationProps.itemsLimit,
          searchTerm: documentNameFilter, // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
          dateFrom: formatDateToIsoString(from), // @ts-expect-error* eslint-disable-next-line @typescript-eslint/ban-ts-comment
          dateTo: formatDateToIsoString(to),
          orderingKey: key,
          orderingDirection,
          searchType,
          folderId,
          signatureRequestStatus: signatureRequestStatus
            ? [signatureRequestStatus]
            : validSignatureRequestStatuses,
        });
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      paginationProps.itemsLimit,
      paginationProps.pageNumber,
      documentNameFilter,
      selectedDates,
      orderingConfig,
      folderId,
      signatureRequestStatus,
    ],
  );

  const handleChangeFilterStatus = useCallback(
    async (value?: string | number) => {
      if (value) {
        const status: SignatureRequestStatuses =
          SignatureRequestStatuses[String(value).toUpperCase()];
        await setSignatureRequestStatus(status);
        setPageNumber(0);
        await handleGetGrid();
      }
    },
    [handleGetGrid, setPageNumber],
  );

  const handleDeleteGrids = useCallback(async () => {
    try {
      const entityIds = selectedItems.map(item => item.entityId);
      await deleteGrids({ entityIds });
      if (paginationProps.pageNumber !== 0) {
        setPageNumber(0);
      }
      clearSelection();
      Toast.success('Signature requests deleted successfully.');
      await handleGetGrid();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    clearSelection,
    deleteGrids,
    handleGetGrid,
    paginationProps.pageNumber,
    selectedItems,
    setPageNumber,
  ]);

  const renderDeleteModalMessage = useCallback(() => {
    if (
      selectedItems.every(item => item.entityType === GridEntityType.SIGNATURE_REQUEST)
    ) {
      return (
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            {`
              Are you sure want to delete
              ${
                selectedItems.length > 1
                  ? 'these signature requests'
                  : 'this signature request'
              }
            `}
          </h5>
          <p className="modal__subTitle">
            {`Deleting ${
              selectedItems.length > 1
                ? 'these signature requests'
                : 'this signature request'
            }  will completely remove ${
              selectedItems.length > 1 ? 'them' : 'it'
            } from your account. This action cannot be undone.`}
          </p>
        </div>
      );
    }

    if (selectedItems.every(item => item.entityType === GridEntityType.FOLDER)) {
      return (
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            {`
              Are you sure want to delete
              ${selectedItems.length > 1 ? 'these folders' : 'this folder'}
            `}
          </h5>
          <p className="modal__subTitle">
            {`Deleting ${
              selectedItems.length > 1 ? 'these folder' : 'this folders'
            }  will completely remove ${
              selectedItems.length > 1 ? 'them' : 'it'
            } and all documents inside from your account. This action cannot be undone.`}
          </p>
        </div>
      );
    }

    return (
      <div className="documents__deleteHeader">
        <h5 className="documents__deleteTitle">
          Are you sure want to delete these signature requests and folders
        </h5>
        <p className="modal__subTitle">
          Deleting these folders will completely remove them and all signature requests
          inside from your account. This action cannot be undone.
        </p>
      </div>
    );
  }, [selectedItems]);

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDeleteGrids();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        {renderDeleteModalMessage()}
      </DeleteModal>
    ),
    [handleDeleteGrids],
  );

  const openDeleteModal = useCallback(() => {
    if (selectedItems.length) {
      showDeleteModal();
    }
  }, [selectedItems, showDeleteModal]);

  const handleChangeDateFilter = useCallback(
    ({ from, to }) => {
      if (from && to) {
        setSelectedDates({
          from: formatDateStringToStartDay(from),
          to: formatDateStringToEndDay(to),
        });
      } else {
        setSelectedDates(undefined);
      }

      setPageNumber(0);
    },
    [setPageNumber],
  );

  const handleCancelDateFilter = useCallback(() => {
    setSelectedDates(undefined);
  }, []);

  useEffect(() => {
    return () => setPageNumber(0);
  }, [setPageNumber]);

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  useEffect(() => {
    handleGetGrid();
  }, [handleGetGrid]);

  const handleSetSignatureRequestStatus = useCallback(
    (status?: SignatureRequestStatuses) => {
      setSignatureRequestStatus(status);
      setPageNumber(0);
    },
    [setPageNumber],
  );

  return (
    <div className="documents__wrapper">
      <div className="documents__header">
        <h1 className="documents__title">Documents Received</h1>
        <p className="documents__subTitle">
          Browse the documents sent by others for you to sign.
        </p>
      </div>
      <DocumentSearch
        handleChangeFilterStatus={handleChangeFilterStatus}
        handleChangeDateFilter={handleChangeDateFilter}
        handleCancelDateFilter={handleCancelDateFilter}
        changeDocumentNameFilter={changeDocumentNameFilter}
        selectedDates={selectedDates}
        status={signatureRequestStatus}
        searchType={searchType}
        isSignatureRequestPage={true}
        setSignatureRequestStatus={handleSetSignatureRequestStatus}
      />
      <Grid
        grids={selectableGridItems}
        paginationProps={paginationProps}
        toggleItemSelection={toggleItemSelection}
        requestOrdering={requestOrdering}
        openDeleteModal={openDeleteModal}
        handleGetGrid={handleGetGrid}
        setPageNumber={setPageNumber}
        selectedItems={selectedItems}
        setFolderId={setFolderId}
        folderId={folderId}
        clearSelection={clearSelection}
        isLoading={isFetching}
        onDownload={handleDownloads}
        rootFolderName="Documents Received"
        isSetSearchFilter={isSetSearchFilter}
      />
      {paginationProps.pageCount > 1 && (
        <UIPaginator
          initialPage={paginationProps.pageNumber}
          pageCount={paginationProps.pageCount}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
};

export default SignatureRequestsScreen;
