import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { RangeModifier } from 'react-day-picker';
import {
  usePagination,
  useSelectableItem,
  useDataOrdering,
  useModal,
  useDownloadFiles,
} from 'Hooks/Common';
import { selectGrid, selectGridPaginationData } from 'Utils/selectors';
import Toast from 'Services/Toast';
import { DocumentStatuses, DocumentTypes, SearchTypeEnum } from 'Interfaces/Document';
import History from 'Services/History';
import {
  formatDateStringToEndDay,
  formatDateStringToStartDay,
  formatDateToIsoString,
} from 'Utils/formatters';
import { OrderingDirection } from 'Interfaces/Common';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import DeleteModal from 'Components/DeleteModal';
import { DocumentSearch } from 'Pages/Documents/components/DocumentSearch';
import { useGridGet, useGridItemsDelete } from 'Hooks/Grid';
import Grid from 'Pages/Documents/components/Grid';
import { Folder } from 'Interfaces/Folder';
import { GridEntityType, GridItem } from 'Interfaces/Grid';
import DocumentFileKeyExtractor from 'Pages/Documents/DocumentFileKeyExtractor';
import DocumentActivitiesFileKeyExtractor from 'Pages/Documents/DocumentActivitiesFileKeyExtractor';
import DocumentSeparatedFileKeyExtractor from 'Pages/Documents/DocumentSeparatedFileKeyExtractor';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

type selectedPage = { selected: number };

type statusType = { status: DocumentStatuses };

const validStatuses: DocumentStatuses[] = [
  DocumentStatuses.DRAFT,
  DocumentStatuses.AWAITING,
  DocumentStatuses.COMPLETED,
  DocumentStatuses.PREPARING,
  DocumentStatuses.DECLINED,
  DocumentStatuses.EXPIRED,
];

const TrashScreen = ({ match }: RouteChildrenProps<statusType>) => {
  const [getGrid, isFetching] = useGridGet();
  const [deleteGrids] = useGridItemsDelete();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectGridPaginationData,
  });
  const grid = useSelector(selectGrid);
  const [folderId, setFolderId] = useState<Folder['id'] | undefined>(undefined);

  const status = match?.params.status;
  const [selectedDates, setSelectedDates] = useState<RangeModifier>();
  const [selectedShowType] = useState('all');

  const { requestOrdering, orderingConfig } = useDataOrdering(grid, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const [searchType, setSearchType] = useState<SearchTypeEnum | undefined>(
    SearchTypeEnum.DOCUMENTS,
  );

  const [
    selectableGridItems,
    toggleItemSelection,
    selectedItems,
    clearSelection,
  ] = useSelectableItem(grid, 'entityId');
  const [documentNameFilter, setDocumentNameFilter] = useState<string | string[]>('');
  const [documentFileKeyExtractorForGrid] = DocumentFileKeyExtractor();
  const [documentSeparatedFileKeyExtractor] = DocumentSeparatedFileKeyExtractor();
  const [documentActivitiesFileKeyExtractor] = DocumentActivitiesFileKeyExtractor();

  const [downloadDocuments] = useDownloadFiles<GridItem>({
    fileExtractors: [
      documentFileKeyExtractorForGrid,
      documentSeparatedFileKeyExtractor,
      documentActivitiesFileKeyExtractor,
    ],
  });

  const isSetSearchFilter = useMemo(
    () => !!documentNameFilter || !!status || !!selectedDates,
    [documentNameFilter, selectedDates, status],
  );

  const handleDownloads = useCallback(async () => {
    await downloadDocuments(selectedItems);
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleChangeFilterStatus = useCallback((value?: string | number) => {
    if (value === 'all') {
      History.push(AuthorizedRoutePaths.DOCUMENTS);
    } else {
      History.push(`${AuthorizedRoutePaths.DOCUMENTS}/${value}`);
    }
  }, []);

  const changeDocumentNameFilter = useCallback(
    (value: string | string[]) => {
      setPageNumber(0);
      setDocumentNameFilter(value);
    },
    [setPageNumber],
  );

  const handleGetGrid = useCallback(async () => {
    const { from, to } = selectedDates || {};
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();
    try {
      if (status && !validStatuses.includes(status)) {
        return History.push(AuthorizedRoutePaths.DOCUMENTS);
      }
      await getGrid({
        type: [DocumentTypes.ME, DocumentTypes.ME_AND_OTHER, DocumentTypes.OTHERS],
        page: paginationProps.pageNumber + 1,
        limit: paginationProps.itemsLimit,
        status: status ? [status] : validStatuses,
        searchTerm: documentNameFilter, // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
        dateFrom: formatDateToIsoString(from), // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
        dateTo: formatDateToIsoString(to),
        orderingKey: key,
        orderingDirection,
        showType: selectedShowType,
        searchType,
        folderId,
        deleted: true,
      });
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationProps.itemsLimit,
    paginationProps.pageNumber,
    status,
    documentNameFilter,
    selectedDates,
    orderingConfig,
    selectedShowType,
    folderId,
  ]);

  const handleDeleteGrids = useCallback(async () => {
    const entityIds = selectedItems.map(item => item.entityId);
    try {
      await deleteGrids({ entityIds });

      if (paginationProps.pageNumber !== 0) {
        setPageNumber(0);
      }

      clearSelection();
      Toast.success('Documents deleted successfully.');
      await handleGetGrid();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    selectedItems,
    deleteGrids,
    paginationProps.pageNumber,
    clearSelection,
    handleGetGrid,
    setPageNumber,
  ]);

  const renderDeleteModalMessage = useCallback(() => {
    if (selectedItems.every(item => item.entityType === GridEntityType.DOCUMENT)) {
      return (
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            {`
              Are you sure want to delete
              ${selectedItems.length > 1 ? 'these documents' : 'this document'}
            `}
          </h5>
          <p className="modal__subTitle">
            {`Deleting ${
              selectedItems.length > 1 ? 'these documents' : 'this document'
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
          Are you sure want to delete these documents and folders
        </h5>
        <p className="modal__subTitle">
          Deleting these folders will completely remove them and all documents inside from
          your account. This action cannot be undone.
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
  }, [setPageNumber, status]);

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  useEffect(() => {
    handleGetGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetGrid]);

  return (
    <div className="documents__wrapper">
      <div className="documents__header trash">
        <h1 className="documents__title trash">Trash</h1>
        <p className="documents__subTitle">
          The Trash folder stores deleted documents temporarily. You can restore files
          within 30 days, after which they will be permanently deleted. Review the
          contents regularly to avoid losing important documents.
        </p>
      </div>
      <DocumentSearch
        handleChangeFilterStatus={handleChangeFilterStatus}
        handleChangeDateFilter={handleChangeDateFilter}
        handleCancelDateFilter={handleCancelDateFilter}
        changeDocumentNameFilter={changeDocumentNameFilter}
        selectedDates={selectedDates}
        status={status}
        searchType={searchType}
        setSearchType={setSearchType}
        isSignatureRequestPage={true}
        hideElements={true}
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

export default TrashScreen;
