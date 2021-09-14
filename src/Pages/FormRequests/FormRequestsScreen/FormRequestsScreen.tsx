import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { RangeModifier } from 'react-day-picker';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import {
  selectFormRequests,
  selectDocumentsPaginationData,
  selectUserPlan,
  selectUser,
} from 'Utils/selectors';
import FormRequests from 'Pages/FormRequests/FormRequestsScreen/components/FormRequests';
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
import UISelect from 'Components/UIComponents/UISelect';
import DebounceInput from 'Components/DebounceInput';
import { useDocumentsGet, useDocumentsDelete } from 'Hooks/Document';
import { DocumentStatuses, DocumentTypes } from 'Interfaces/Document';
import { PlanTypes } from 'Interfaces/Billing';
import { TemplateUpgradeModal } from 'Components/UpgradeModal';
import { User, UserRoles } from 'Interfaces/User';
import { Billet } from 'Pages/Settings/Company/components';
import { useSubscriptionDataGet } from 'Hooks/Billing';
import EmptyTable from 'Components/EmptyTable';
import { Document } from 'Interfaces/Document';

type selectedPage = { selected: number };

type statusType = { status: DocumentStatuses };

const statusFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Live' },
];

const validStatuses: DocumentStatuses[] = [
  DocumentStatuses.DRAFT,
  DocumentStatuses.ACTIVE,
];
const FormRequestsScreen = ({ match }: RouteChildrenProps<statusType>) => {
  const userPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser) as User;
  const [getDocuments, isFetchLoading] = useDocumentsGet();
  const [deleteTemplates, isDeleteLoading] = useDocumentsDelete();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectDocumentsPaginationData,
  });
  const [selectedDates, setSelectedDates] = useState<RangeModifier>();
  const [getSubscriptionData, isSubscriptionDataLoading] = useSubscriptionDataGet();

  const forms = useSelector(selectFormRequests);
  const status = match?.params.status;

  const { requestOrdering, orderingConfig } = useDataOrdering(forms, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const [selectableTemplates, toggleItemSelection, selectedItems] = useSelectableItem(
    forms,
    'id',
  );

  const [templateNameFilter, setTemplateNameFilter] = useState('');

  const changeTemplateNameFilter = useCallback((value: string) => {
    setTemplateNameFilter(value);
  }, []);

  const handleDeleteTemplates = useCallback(
    async (formIds?: Document['id'][]) => {
      const { from, to }:any = selectedDates || {};
      const { key, direction } = orderingConfig;
      const orderingDirection = direction.toString().toUpperCase();
      formIds = formIds || selectedItems.map(item => item.id);
      try {
        await deleteTemplates(formIds);
        await getDocuments({
          page: 1,
          type: [DocumentTypes.FORM_REQUEST],
          limit: paginationProps.itemsLimit,
          searchTerm: templateNameFilter,
          status: [DocumentStatuses.DRAFT, DocumentStatuses.ACTIVE],
          dateFrom: formatDateToIsoString(from),
          dateTo: formatDateToIsoString(to),
          orderingKey: key,
          orderingDirection,
        });
        if (paginationProps.pageNumber !== 0) setPageNumber(0);
        Toast.success('Forms deleted successfully.');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [
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

  const handleTemplateCreateClick = useCallback(() => {
    if (
      !user.teamId &&
      (userPlan.type === PlanTypes.FREE ||
        userPlan.type == PlanTypes.PERSONAL ||
        !user.teamId)
    ) {
      openUpgradeModal();
    } else {
      History.push('/form-requests/create');
    }
  }, [openUpgradeModal, user.teamId, userPlan.type]);

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

  const handleGetTemplates = useCallback(async () => {
    const { from, to }:any = selectedDates || {};
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();

    try {
      await getDocuments({
        type: [DocumentTypes.FORM_REQUEST],
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
            Are you sure want to delete this form?
          </h5>
          <p className="modal__subTitle">
            Deleting this form will completely remove it. This cannot be undone.
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

  const handleChangeFilterStatus = useCallback((value?: string | number) => {
    if (value === 'all') {
      History.push('/form-requests');
    } else {
      History.push(`/form-requests/${value}`);
    }
  }, []);

  const isBusinessPlan = useMemo(() => {
    return !!user.plan.type && user.plan.type === PlanTypes.BUSINESS;
  }, [user.plan.type]);

  const isTableEmpty = useMemo(() => {
    return (!isBusinessPlan && !user.teamId) || forms.length === 0;
  }, [isBusinessPlan, user.teamId, forms.length]);

  const emptyTableProps = useMemo(() => {
    return !isBusinessPlan && !user.teamId
      ? {
          buttonText: 'Upgrade to Business',
          headerText: 'Start creating forms!',
          description: 'Upgrade to business to add forms to your account',
        }
      : {
          buttonClassName: 'team__button--hide',
          headerText: 'Start creating forms!',
        };
  }, [isBusinessPlan, user.teamId]);

  return (
    <div className="documents__wrapper">
      <div className="documents__header documents__header--template">
        <div className="documents__titleGroup">
          {user.plan.type !== PlanTypes.BUSINESS && !user.teamId ? (
            <div className="company__billet-container">
              <p className="team__header-title">Forms</p>
              <Billet title="Business Feature" />
            </div>
          ) : (
            <>
              <div className="company__billet-container">
                <p className="team__header-title">Forms</p>
              </div>
              <UIButton
                handleClick={handleTemplateCreateClick}
                priority="primary"
                title="Create Form"
                disabled={
                  (user.role === UserRoles.OWNER && !isBusinessPlan && !user.teamId) ||
                  isSubscriptionDataLoading
                }
              />
            </>
          )}
        </div>
        <p className="documents__subTitle documents__subTitle--template">
          Forms are reusable documents that you send often. Create a form once to allow
          you to send your documents faster.
        </p>
      </div>
      {!isTableEmpty && (
        <div className="tableFilters__wrapper tableFilters__itemGroup">
          <div className="tableFilters__item tableFilters__search">
            <DebounceInput
              placeholder="Search for Forms..."
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
      )}

      {isTableEmpty ? (
        <div className="documents__empty-table">
          <EmptyTable
            {...emptyTableProps}
            onClick={() => {
              History.push('/settings/billing/plan');
            }}
            iconClassName="empty-table__icon--team"
          />
        </div>
      ) : (
        <>
          <hr className="documents__hr" />

          <FormRequests
            paginationProps={paginationProps}
            templates={selectableTemplates}
            toggleItemSelection={toggleItemSelection}
            isLoading={isFetchLoading || isDeleteLoading}
            requestOrdering={requestOrdering}
            isDeleteModalOpen={isDeleteModalOpen}
            onTemplateCreateClick={handleTemplateCreateClick}
            openDeleteModal={openDeleteModal}
            handleFormDelete={handleDeleteTemplates}
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

export default FormRequestsScreen;
