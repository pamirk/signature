import React from 'react';
import DebounceInput from 'Components/DebounceInput/DebounceInput';
// @ts-ignore
import IconSearch from 'Assets/images/icons/search.svg';
import UISelect from 'Components/UIComponents/UISelect';
import UIDatePicker from 'Components/UIComponents/UIDatePicker/UIDatePicker';
import { RangeModifier } from 'react-day-picker';
import { DocumentStatuses, SearchTypeEnum } from 'Interfaces/Document';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface DocumentSearchProps {
  changeDocumentNameFilter: (value: string) => void;
  handleChangeFilterStatus: (value?: string | number) => void;
  handleChangeDateFilter: (value: any) => void;
  handleCancelDateFilter: () => void;
  setSearchType: (searchType: SearchTypeEnum | undefined) => void;
  selectedDates?: RangeModifier;
  searchType: SearchTypeEnum | undefined;
  status?: DocumentStatuses;
}

const searchTypeOptions = [
  { value: SearchTypeEnum.DOCUMENTS, label: 'Documents' },
  { value: SearchTypeEnum.SIGNERS, label: 'Signers' },
];

const statusFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
  { value: 'awaiting', label: 'Awaiting' },
];

export const DocumentSearch = ({
  changeDocumentNameFilter,
  handleChangeFilterStatus,
  handleChangeDateFilter,
  handleCancelDateFilter,
  setSearchType,
  selectedDates,
  searchType,
  status,
}: DocumentSearchProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile ? (
        <div className="tableFilters__wrapper tableFilters__itemGroup">
          <div className="tableFilters__itemGroup">
            <div className="tableFilters__item tableFilters__item--small">
              <UISelect
                value={searchType}
                handleSelect={value => setSearchType(value)}
                options={searchTypeOptions}
                placeholder="Search type"
              />
            </div>
            <div className="tableFilters__item tableFilters__search">
              <DebounceInput
                placeholder={
                  searchType === SearchTypeEnum.DOCUMENTS
                    ? 'Search for Documents...'
                    : 'Search for Signers...'
                }
                onChange={changeDocumentNameFilter}
                icon={IconSearch}
              />
            </div>
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
      ) : (
        <div className="tableFilters__wrapper tableFilters__itemGroup">
          <div className="tableFilters__item">
            <UISelect
              value={searchType}
              handleSelect={value => setSearchType(value)}
              options={searchTypeOptions}
              placeholder="Search type"
            />
          </div>
          <div className="tableFilters__item tableFilters__search">
            <DebounceInput
              placeholder="Search for Documents..."
              onChange={changeDocumentNameFilter}
              icon={IconSearch}
            />
          </div>
          <div className="tableFilters__item">
            <UISelect
              value={status}
              handleSelect={handleChangeFilterStatus}
              options={statusFilterOptions}
              placeholder="Status: All"
            />
          </div>
          <div className="tableFilters__item">
            <UIDatePicker
              value={selectedDates}
              onDateRangeSelect={handleChangeDateFilter}
              onCancel={handleCancelDateFilter}
            />
          </div>
        </div>
      )}
    </>
  );
};
