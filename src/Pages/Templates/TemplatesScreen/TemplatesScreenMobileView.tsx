import DebounceInput from 'Components/DebounceInput';
import UIButton from 'Components/UIComponents/UIButton';
import UIDatePicker from 'Components/UIComponents/UIDatePicker';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import { usePagination } from 'Hooks/Common';
import React from 'react';
import { selectDocumentsPaginationData } from 'Utils/selectors';
import IconSearch from 'Assets/images/icons/search.svg';
import { RangeModifier } from 'react-day-picker';
import TemplatesMobile from './components/TemplatesMobile';
import { SelectableDocument } from 'Interfaces/Document';
import { Document } from 'Interfaces/Document';

interface TemplatesSreenMobileViewProps {
  templates: SelectableDocument[];
  isLoading: boolean;
  onCreate: () => void;
  onChangeNameFilter: (value: string) => void;
  onChangePage: (page: { selected: number }) => void;
  selectedDates?: RangeModifier;
  onChangeDateFilter: ({ from, to }: any) => void;
  onCancelDateFilter: () => void;
  handleTemplateDelete: (templateIds?: Document['id'][]) => void;
}

export const TemplatesSreenMobileView = ({
  templates,
  isLoading,
  onCreate,
  onChangeNameFilter,
  onChangePage,
  selectedDates,
  onChangeDateFilter,
  onCancelDateFilter,
  handleTemplateDelete,
}: TemplatesSreenMobileViewProps) => {
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectDocumentsPaginationData,
  });

  return (
    <div className="documents__wrapper">
      <div className="documents__header documents__header--template">
        <div className="documents__titleGroup">
          <h1 className="documents__title mobilex">Templates</h1>
        </div>
        <p className="documents__subTitle documents__subTitle--template">
          Templates are reusable documents that you send often. Create a template once to
          allow you to send your documents faster.
        </p>
      </div>
      <div className="tableFilters__wrapper tableFilters__itemGroup mobile">
        <div className="tableFilters__item tableFilters__search">
          <DebounceInput
            placeholder="Search for Templates..."
            onChange={onChangeNameFilter}
            icon={IconSearch}
          />
        </div>
        <div className="tableFilters__item">
          <UIDatePicker
            position="right"
            value={selectedDates}
            onDateRangeSelect={onChangeDateFilter}
            onCancel={onCancelDateFilter}
          />
        </div>
      </div>
      <div className="documents__create-btn">
        <UIButton handleClick={onCreate} priority="primary" title="Create Template" />
      </div>
      <TemplatesMobile
        paginationProps={paginationProps}
        templates={templates}
        isLoading={isLoading}
        onTemplateCreateClick={onCreate}
        handleTemplateDelete={handleTemplateDelete}
      />
      {paginationProps.pageCount > 1 && (
        <UIPaginator
          initialPage={paginationProps.pageNumber}
          pageCount={paginationProps.pageCount}
          onPageChange={onChangePage}
        />
      )}
    </div>
  );
};
