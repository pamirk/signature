import React, { useEffect, useCallback, useState } from 'react';
import { RangeModifier } from 'react-day-picker';
import { useSelector } from 'react-redux';
import {
  selectTemplates,
  selectDocumentsPaginationData,
  selectUserPlan,
  selectUser,
  selectApiPlan,
  selectApiTemplatesCount,
  selectCommonTemplatesCount,
} from 'Utils/selectors';
import Templates from './components/Templates';
import Toast from 'Services/Toast';
import {
  useDataOrdering,
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
import { useDocumentsGet, useDocumentsDelete } from 'Hooks/Document';
import { Document, DocumentStatuses, DocumentTypes } from 'Interfaces/Document';
import { PlanTypes } from 'Interfaces/Billing';
import { TemplateUpgradeModal } from 'Components/UpgradeModal';
import { User } from 'Interfaces/User';
import { useApiSubscriptionGet } from 'Hooks/Billing';
import ConfirmModal from 'Components/ConfirmModal';
import { TemplatesSreenMobileView } from './TemplatesScreenMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import UISelect from 'Components/UIComponents/UISelect';
import { RouteChildrenProps } from 'react-router-dom';

type selectedPage = { selected: number };

type statusType = { status: DocumentStatuses };

const statusFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Live' },
];

const validStatuses: DocumentStatuses[] = [
  DocumentStatuses.API,
  DocumentStatuses.DRAFT,
  DocumentStatuses.ACTIVE,
];

const TemplatesScreen = ({ match }: RouteChildrenProps<statusType>) => {
  const userPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser) as User;
  const apiPlan = useSelector(selectApiPlan);
  const [getDocuments, isFetchLoading] = useDocumentsGet();
  const [getApiSubscription, isApiSubscriptionLoading] = useApiSubscriptionGet();
  const [deleteTemplates, isDeleteLoading] = useDocumentsDelete();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectDocumentsPaginationData,
  });
  const [selectedDates, setSelectedDates] = useState<RangeModifier>();
  const isMobile = useIsMobile();

  const status = match?.params.status;
  const templates = useSelector(selectTemplates);

  const { requestOrdering, orderingConfig } = useDataOrdering(templates, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const [selectableTemplates, toggleItemSelection, selectedItems] = useSelectableItem(
    templates,
    'id',
  );

  const apiTemplatesCount = useSelector(selectApiTemplatesCount);
  const commonTemplatesCount = useSelector(selectCommonTemplatesCount);

  const [templateNameFilter, setTemplateNameFilter] = useState('');

  const changeTemplateNameFilter = useCallback((value: string) => {
    setTemplateNameFilter(value);
  }, []);

  const handleDeleteTemplates = useCallback(
    async (templateIds?: Document['id'][]) => {
      const { from, to }:any = selectedDates || {};
      const { key, direction }:any = orderingConfig;
      const orderingDirection = direction.toString().toUpperCase();
      templateIds = templateIds || selectedItems.map(item => item.id);
      try {
        await deleteTemplates(templateIds);
        await getDocuments({
          page: 1,
          type: [DocumentTypes.TEMPLATE],
          limit: paginationProps.itemsLimit,
          searchTerm: templateNameFilter,
          status: status ? [status] : validStatuses,
          dateFrom: formatDateToIsoString(from),
          dateTo: formatDateToIsoString(to),
          orderingKey: key,
          orderingDirection,
        });
        if (paginationProps.pageNumber !== 0) setPageNumber(0);
        Toast.success('Templates deleted successfully.');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [
      status,
      deleteTemplates,
      getDocuments,
      selectedDates,
      orderingConfig,
      selectedItems,
      paginationProps.itemsLimit,
      paginationProps.pageNumber,
      setPageNumber,
      templateNameFilter,
    ],
  );

  const [openUpgradeModal, closeUpgradeModal] = useModal(
    () => <TemplateUpgradeModal onClose={closeUpgradeModal} />,
    [userPlan],
  );

  const [openApiTemplateCreateModal, closeApiTemplateCreateModal] = useModal(
    () => (
      <ConfirmModal
        onConfirm={() => History.push('/templates/create?status=api')}
        onClose={closeApiTemplateCreateModal}
        onCancel={closeApiTemplateCreateModal}
      >
        <p className="empty-table__api-description">
          You can only create API template. Do you want to continue?
        </p>
      </ConfirmModal>
    ),
    [userPlan],
  );

  const handleChangeFilterStatus = useCallback((value?: string | number) => {
    if (value === 'all') {
      History.push('/templates');
    } else {
      History.push(`/templates/${value}`);
    }
  }, []);

  const handleTemplateCreateClick = useCallback(() => {
    if (
      !user.teamId &&
      (userPlan.type === PlanTypes.FREE ||
        (userPlan.type == PlanTypes.PERSONAL && commonTemplatesCount >= 1))
    ) {
      if (apiTemplatesCount >= apiPlan.templateLimit && apiPlan.templateLimit !== -1) {
        openUpgradeModal();
      } else {
        History.push('/templates/create?status=api');
      }
    } else {
      History.push('/templates/create');
    }
  }, [
    apiPlan.templateLimit,
    apiTemplatesCount,
    commonTemplatesCount,
    openUpgradeModal,
    user.teamId,
    userPlan.type,
  ]);

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

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  const handleApiSubscriptionGet = useCallback(async () => {
    try {
      await getApiSubscription(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getApiSubscription]);

  const handleGetTemplates = useCallback(async () => {
    const { from, to }:any = selectedDates || {};
    const { key, direction }:any = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();

    try {
      await getDocuments({
        type: [DocumentTypes.TEMPLATE],
        page: paginationProps.pageNumber + 1,
        limit: paginationProps.itemsLimit,
        searchTerm: templateNameFilter,
        dateFrom: formatDateToIsoString(from),
        dateTo: formatDateToIsoString(to),
        status: status ? [status] : validStatuses,
        orderingKey: key,
        orderingDirection,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationProps.itemsLimit,
    paginationProps.pageNumber,
    selectedDates,
    orderingConfig,
    templateNameFilter,
  ]);

  useEffect(() => {
    handleGetTemplates();
    handleApiSubscriptionGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetTemplates]);

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        deleteTitle="Yes, Delete"
        onConfirm={() => {
          handleDeleteTemplates();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this template?
          </h5>
          <p className="modal__subTitle">
            Deleting this template will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDeleteTemplates],
  );

  const openDeleteModal = useCallback(() => {
    if (selectedItems.length) {
      showDeleteModal();
    }
  }, [selectedItems, showDeleteModal]);

  return isMobile ? (
    <TemplatesSreenMobileView
      templates={selectableTemplates}
      isLoading={isFetchLoading}
      onCreate={handleTemplateCreateClick}
      onChangeNameFilter={changeTemplateNameFilter}
      onChangePage={handleChangePage}
      selectedDates={selectedDates}
      onChangeDateFilter={handleChangeDateFilter}
      onCancelDateFilter={handleCancelDateFilter}
      handleTemplateDelete={handleDeleteTemplates}
    />
  ) : (
    <div className="documents__wrapper">
      <div className="documents__header documents__header--template">
        <div className="documents__titleGroup">
          <h1 className="documents__title">Templates</h1>
          <UIButton
            handleClick={handleTemplateCreateClick}
            priority="primary"
            isLoading={isApiSubscriptionLoading}
            disabled={isApiSubscriptionLoading}
            title="Create Template"
          />
        </div>
        <p className="documents__subTitle documents__subTitle--template">
          Templates are reusable documents that you send often. Create a template once to
          allow you to send your documents faster.
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
      <Templates
        paginationProps={paginationProps}
        templates={selectableTemplates}
        toggleItemSelection={toggleItemSelection}
        isLoading={isFetchLoading || isDeleteLoading || isApiSubscriptionLoading}
        requestOrdering={requestOrdering}
        isDeleteModalOpen={isDeleteModalOpen}
        onTemplateCreateClick={handleTemplateCreateClick}
        openDeleteModal={openDeleteModal}
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
