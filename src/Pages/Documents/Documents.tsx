import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { RangeModifier } from 'react-day-picker';
import useDocumentsGet from 'Hooks/Document/useDocumentsGet';
import {
  usePagination,
  useSelectableItem,
  useDataOrdering,
  useModal,
  useDownloadFiles,
  useWindowSize,
} from 'Hooks/Common';
import { useDocumentsDelete } from 'Hooks/Document';
import { selectDocuments, selectDocumentsPaginationData } from 'Utils/selectors';
import Toast from 'Services/Toast';
import {
  DocumentStatuses,
  Document,
  DocumentTypes,
  SearchTypeEnum,
} from 'Interfaces/Document';
import History from 'Services/History';
import {
  formatDateStringToEndDay,
  formatDateStringToStartDay,
  formatDateToIsoString,
  formatDateToHumanString,
} from 'Utils/formatters';
import { OrderingDirection } from 'Interfaces/Common';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import DeleteModal from 'Components/DeleteModal/DeleteModal';
import { DocumentSearch } from './components/DocumentSearch';
import DocumentsListMobile from './components/DocumentListMobile';
import DocumentsList from './components/DocumentsList';

type selectedPage = { selected: number };

type statusType = { status: DocumentStatuses };

const validStatuses: DocumentStatuses[] = [
  DocumentStatuses.DRAFT,
  DocumentStatuses.AWAITING,
  DocumentStatuses.COMPLETED,
  DocumentStatuses.PREPARING,
];

const DocumentsScreen = ({ match }: RouteChildrenProps<statusType>) => {
  const [getDocuments, isFetchLoading] = useDocumentsGet();
  const [deleteDocuments, isDeleteLoading] = useDocumentsDelete();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectDocumentsPaginationData,
  });
  const documents = useSelector(selectDocuments);
  const [width] = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);

  const status = match?.params.status;
  const [selectedDates, setSelectedDates] = useState<RangeModifier>();

  const { requestOrdering, orderingConfig } = useDataOrdering(documents, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const [searchType, setSearchType] = useState<SearchTypeEnum | undefined>(
    SearchTypeEnum.DOCUMENTS,
  );

  const [
    selectableDocuments,
    toggleItemSelection,
    selectedItems,
    clearSelection,
  ] = useSelectableItem(documents, 'id');
  const [documentNameFilter, setDocumentNameFilter] = useState('');
  const documentFileKeyExtractor = useCallback((document: Document) => {
    const fileKey =
      document.status === DocumentStatuses.COMPLETED
        ? document.resultPdfFileKey
        : document.pdfFileKey;

    return {
      fileKey,
      fileName: `${document.title} (${formatDateToHumanString(document.createdAt)}).pdf`,
      itemName: document.title,
    };
  }, []);
  const [downloadDocuments, isDownloadingDocuments] = useDownloadFiles<Document>({
    fileExtractor: documentFileKeyExtractor,
  });

  const handleDownloads = useCallback(async () => {
    await downloadDocuments(selectedItems);
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleChangeFilterStatus = useCallback((value?: string | number) => {
    if (value === 'all') {
      History.push('/documents');
    } else {
      History.push(`/documents/${value}`);
    }
  }, []);

  const changeDocumentNameFilter = useCallback(
    (value: string) => {
      setPageNumber(0);
      setDocumentNameFilter(value);
    },
    [setPageNumber],
  );

  const handleDeleteDocuments = useCallback(
    async (documentIds?: Document['id'][]) => {
      const { from, to }:any = selectedDates || {};
      const { key, direction } = orderingConfig;
      const orderingDirection = direction.toString().toUpperCase();
      documentIds = documentIds || selectedItems.map(item => item.id);
      try {
        await deleteDocuments(documentIds);
        await getDocuments({
          type: [DocumentTypes.ME, DocumentTypes.ME_AND_OTHER, DocumentTypes.OTHERS],
          page: 1,
          limit: paginationProps.itemsLimit,
          status: status ? [status] : validStatuses,
          searchTerm: documentNameFilter,
          dateFrom: formatDateToIsoString(from),
          dateTo: formatDateToIsoString(to),
          orderingKey: key,
          orderingDirection,
        });
        if (paginationProps.pageNumber !== 0) setPageNumber(0);
        clearSelection();
        Toast.success('Documents deleted successfully.');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [
      selectedDates,
      orderingConfig,
      selectedItems,
      deleteDocuments,
      getDocuments,
      paginationProps.itemsLimit,
      paginationProps.pageNumber,
      status,
      documentNameFilter,
      setPageNumber,
      clearSelection,
    ],
  );

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDeleteDocuments();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this document?
          </h5>
          <p className="modal__subTitle">
            Deleting this document will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDeleteDocuments],
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

  const handleGetDocuments = useCallback(async () => {
    const { from, to }:any = selectedDates || {};
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();

    try {
      if (status && !validStatuses.includes(status)) {
        return History.push('/documents');
      }
      await getDocuments({
        type: [DocumentTypes.ME, DocumentTypes.ME_AND_OTHER, DocumentTypes.OTHERS],
        page: paginationProps.pageNumber + 1,
        limit: paginationProps.itemsLimit,
        status: status ? [status] : validStatuses,
        searchTerm: documentNameFilter,
        dateFrom: formatDateToIsoString(from),
        dateTo: formatDateToIsoString(to),
        orderingKey: key,
        orderingDirection,
        searchType,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationProps.itemsLimit,
    paginationProps.pageNumber,
    status,
    documentNameFilter,
    selectedDates,
    orderingConfig,
  ]);

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  useEffect(() => {
    handleGetDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetDocuments]);

  return (
    <div className="documents__wrapper">
      <div className="documents__header">
        <h1 className="documents__title">Documents</h1>
        <p className="documents__subTitle">
          Browse all past, active and draft documents uploaded to your Signaturely
          account.
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
      />
      {isMobile ? (
        <DocumentsListMobile
          paginationProps={paginationProps}
          documents={selectableDocuments}
          toggleItemSelection={toggleItemSelection}
          isLoading={isFetchLoading || isDeleteLoading}
          isDeleteModalOpen={isDeleteModalOpen}
          openDeleteModal={openDeleteModal}
          onDownload={downloadDocuments}
          onDelete={handleDeleteDocuments}
          isDownloading={isDownloadingDocuments}
        />
      ) : (
        <>
          <hr className="documents__hr" />
          <DocumentsList
            paginationProps={paginationProps}
            documents={selectableDocuments}
            toggleItemSelection={toggleItemSelection}
            isLoading={isFetchLoading || isDeleteLoading}
            requestOrdering={requestOrdering}
            isDeleteModalOpen={isDeleteModalOpen}
            openDeleteModal={openDeleteModal}
            onDownload={handleDownloads}
            isDownloading={isDownloadingDocuments}
          />
        </>
      )}
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

export default DocumentsScreen;
