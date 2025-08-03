import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { RangeModifier } from 'react-day-picker';
import { useSelector } from 'react-redux';
import { selectGrid, selectGridPaginationData, selectTemplates } from 'Utils/selectors';
import Toast from 'Services/Toast';
import {
  useDataOrdering,
  useDownloadFiles,
  useModal,
  usePagination,
  useSelectableItem,
} from 'Hooks/Common';
import { OrderingDirection } from 'Interfaces/Common';
import DeleteModal from 'Components/DeleteModal';
import {
  formatDateStringToEndDay,
  formatDateStringToStartDay,
  formatDateToIsoString,
} from 'Utils/formatters';
import UIButton from 'Components/UIComponents/UIButton';
import History from 'Services/History';
import IconSearch from 'Assets/images/icons/search.svg';
import UIDatePicker from 'Components/UIComponents/UIDatePicker';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import DebounceInput from 'Components/DebounceInput';
import { DocumentStatuses, DocumentTypes, SearchTypeEnum } from 'Interfaces/Document';
import { useApiSubscriptionGet } from 'Hooks/Billing';
import UISelect from 'Components/UIComponents/UISelect';
import { RouteChildrenProps } from 'react-router-dom';
import { useGridGet, useGridItemsDelete } from 'Hooks/Grid';
import { Folder } from 'Interfaces/Folder';
import Grid from 'Pages/Documents/components/Grid';
import { GridEntityType, GridItem } from 'Interfaces/Grid';
import DocumentFileKeyExtractor from 'Pages/Documents/DocumentFileKeyExtractor';
import DocumentActivitiesFileKeyExtractor from 'Pages/Documents/DocumentActivitiesFileKeyExtractor';
import useTemplateCreate from 'Hooks/Document/useTemplateCreate';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

type SelectedPage = { selected: number };

type TemplateTypes = DocumentStatuses.API | DocumentStatuses.ACTIVE;

type StatusType = { status: DocumentStatuses; type: TemplateTypes };

const validStatuses: DocumentStatuses[] = [
  DocumentStatuses.API,
  DocumentStatuses.DRAFT,
  DocumentStatuses.ACTIVE,
];

const TemplatesScreen = ({ match }: RouteChildrenProps<StatusType>) => {
  const [getGrid, isFetching] = useGridGet();
  const [deleteGrids] = useGridItemsDelete();
  const [getApiSubscription, isApiSubscriptionLoading] = useApiSubscriptionGet();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectGridPaginationData,
  });
  const [selectedDates, setSelectedDates] = useState<RangeModifier>();

  const grid = useSelector(selectGrid);
  const [folderId, setFolderId] = useState<Folder['id'] | undefined>(undefined);

  const { type, status } = match?.params || {};
  const templates = useSelector(selectTemplates);
  const [selectedShowType] = useState('all');

  const { requestOrdering, orderingConfig } = useDataOrdering(templates, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const statusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      { value: 'draft', label: 'Draft' },
      type === DocumentStatuses.API
        ? { value: 'api', label: 'API' }
        : { value: 'active', label: 'Live' },
    ],
    [type],
  );

  const [templateNameFilter, setTemplateNameFilter] = useState('');

  const changeTemplateNameFilter = useCallback((value: string) => {
    setTemplateNameFilter(value);
  }, []);

  const [
    selectableGridItems,
    toggleItemSelection,
    selectedItems,
    clearSelection,
  ] = useSelectableItem(grid, 'entityId');
  const [documentFileKeyExtractorForGrid] = DocumentFileKeyExtractor();
  const [documentActivitiesFileKeyExtractor] = DocumentActivitiesFileKeyExtractor();

  const [downloadDocuments] = useDownloadFiles<GridItem>({
    fileExtractors: [documentFileKeyExtractorForGrid, documentActivitiesFileKeyExtractor],
  });

  const isSetSearchFilter = useMemo(
    () => !!templateNameFilter || !!status || !!selectedDates,
    [selectedDates, status, templateNameFilter],
  );

  const handleDownloads = useCallback(async () => {
    await downloadDocuments(selectedItems);
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleGetGrid = useCallback(async () => {
    const { from, to } = selectedDates || {};
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();
    try {
      if (status && !validStatuses.includes(status)) {
        return History.push(AuthorizedRoutePaths.TEMPLATES);
      }

      let statuses;
      if (!status) {
        if (type) {
          statuses = [type, DocumentStatuses.DRAFT];
        } else {
          statuses = validStatuses;
        }
      } else {
        statuses = [status];
      }

      await getGrid({
        type: [DocumentTypes.TEMPLATE],
        page: paginationProps.pageNumber + 1,
        limit: paginationProps.itemsLimit,
        status: statuses,
        searchTerm: templateNameFilter,
        dateFrom: formatDateToIsoString(from),
        dateTo: formatDateToIsoString(to),
        orderingKey: key,
        orderingDirection,
        showType: selectedShowType,
        searchType: SearchTypeEnum.DOCUMENTS,
        folderId,
      });
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationProps.itemsLimit,
    paginationProps.pageNumber,
    status,
    templateNameFilter,
    selectedDates,
    orderingConfig,
    selectedShowType,
    folderId,
  ]);

  const handleChangeFilterStatus = useCallback(
    (value?: string | number) => {
      if (value === 'all') {
        History.push(`${AuthorizedRoutePaths.TEMPLATES}/${type}`);
      } else {
        History.push(`${AuthorizedRoutePaths.TEMPLATES}/${type}/${value}`);
      }
    },
    [type],
  );

  const [handleTemplateCreateClick] = useTemplateCreate(type);

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

  const handleChangePage = (page: SelectedPage) => {
    setPageNumber(page.selected);
  };

  const handleApiSubscriptionGet = useCallback(async () => {
    try {
      await getApiSubscription(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getApiSubscription]);

  useEffect(() => {
    handleGetGrid();
    handleApiSubscriptionGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetGrid]);

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
              ${selectedItems.length > 1 ? 'these templates' : 'this template'}
            `}
          </h5>
          <p className="modal__subTitle">
            {`Deleting ${
              selectedItems.length > 1 ? 'these templates' : 'this template'
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
            } and all templates inside from your account. This action cannot be undone.`}
          </p>
        </div>
      );
    }

    return (
      <div className="documents__deleteHeader">
        <h5 className="documents__deleteTitle">
          Are you sure want to delete these templates and folders
        </h5>
        <p className="modal__subTitle">
          Deleting these folders will completely remove them and all templates inside from
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

  return (
    <div className="documents__wrapper">
      <div className="documents__header documents__header--template">
        <div className="documents__titleGroup">
          <h1 className="documents__title">
            {type === DocumentStatuses.API ? 'API Templates' : 'Templates'}
          </h1>
          <UIButton
            handleClick={handleTemplateCreateClick}
            priority="primary"
            isLoading={isApiSubscriptionLoading}
            disabled={isApiSubscriptionLoading}
            title={
              type === DocumentStatuses.API ? 'Create API Template' : 'Create Template'
            }
          />
        </div>
        <p className="documents__subTitle documents__subTitle--template">
          {type === DocumentStatuses.ACTIVE
            ? 'Templates are reusable documents that you send often. Create a template once to allow you to send your documents faster.'
            : 'API Templates will let you create automated Signature requests on the API. Create a template to get started on the API'}
        </p>
      </div>
      <div className="tableFilters__wrapper tableFilters__itemGroup">
        <div className="tableFilters__item tableFilters__search">
          <DebounceInput
            placeholder="Search for Templates..."
            onChange={changeTemplateNameFilter}
            icon={IconSearch}
          />
        </div>

        <div className="tableFilters__itemGroup">
          <div className="tableFilters__item tableFilters__item--small">
            <UISelect
              value={status}
              handleSelect={handleChangeFilterStatus}
              options={statusFilterOptions}
              placeholder="Status: All"
            />
          </div>
          <div className="tableFilters__item">
            <UIDatePicker
              position="right"
              value={selectedDates}
              onDateRangeSelect={handleChangeDateFilter}
              onCancel={handleCancelDateFilter}
            />
          </div>
        </div>
      </div>
      <hr className="documents__hr" />
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
        rootFolderName="Templates"
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

export default TemplatesScreen;
