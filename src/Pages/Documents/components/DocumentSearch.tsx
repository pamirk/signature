import React from 'react';
import DebounceInput from 'Components/DebounceInput';
import IconSearch from 'Assets/images/icons/search.svg';
import UISelect from 'Components/UIComponents/UISelect';
import UIDatePicker from 'Components/UIComponents/UIDatePicker';
import { RangeModifier } from 'react-day-picker';
import UIMultiSelect from 'Components/UIComponents/UIMultiSelect';
import useTeamMembersGet from 'Hooks/Team/useTeamMembersGet';
import { DocumentStatuses, SearchTypeEnum } from 'Interfaces/Document';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { SignatureRequestStatuses } from 'Interfaces/SignatureRequest';
import { isNotEmpty } from 'Utils/functions';
import { useCallback, useEffect, useState } from 'react';
import { MultiValue } from 'react-select';

interface DocumentSearchProps {
  changeDocumentNameFilter: (value: string | string[]) => void;
  handleChangeFilterStatus: (value?: string | number) => void;
  handleChangeDateFilter: (value: any) => void;
  handleCancelDateFilter: () => void;
  setSearchType?: (searchType: SearchTypeEnum | undefined) => void;
  selectedDates?: RangeModifier;
  searchType: SearchTypeEnum | undefined;
  status?: DocumentStatuses | SignatureRequestStatuses;
  isSignatureRequestPage?: boolean;
  setSignatureRequestStatus?: (status: SignatureRequestStatuses | undefined) => void;
  hideElements?: boolean;
}

const searchTypeOptions = [
  { value: SearchTypeEnum.DOCUMENTS, label: 'Documents' },
  { value: SearchTypeEnum.SIGNERS, label: 'Signers' },
  { value: SearchTypeEnum.CREATORS, label: 'Creators' },
];

const statusFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
  { value: 'awaiting', label: 'Awaiting' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

const signatureRequestStatusFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'awaiting_others', label: 'Awaiting others' },
  { value: 'awaiting_you', label: 'Awaiting you' },
  { value: 'signed', label: 'Signed' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
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
  isSignatureRequestPage,
  setSignatureRequestStatus,
  hideElements = false,
}: DocumentSearchProps) => {
  const isMobile = useIsMobile();

  const handleMultiSelectOnChange = (
    data: MultiValue<{ value: string; label: string }>,
  ) => {
    changeDocumentNameFilter(data.map(value => value.value));
  };
  const [getTeamMembers, isLoading] = useTeamMembersGet();
  const [teamMemberValues, setTeamMemberValues] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const handleGetTeamMembersOptions = useCallback(async () => {
    const teamMembers = await getTeamMembers({});
    setTeamMemberValues(
      isNotEmpty(teamMembers)
        ? Object.values(teamMembers.teamMembers).map(teamMember => ({
            value: teamMember.id,
            label: teamMember.name ?? teamMember.email ?? '',
          }))
        : [],
    );
  }, [getTeamMembers]);

  useEffect(() => {
    handleGetTeamMembersOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterOption = (
    option: {
      value: string;
      label: string;
    },
    inputValue: string,
  ) => {
    return option.label.toLowerCase().includes(inputValue.trim().toLowerCase());
  };

  return (
    <>
      {!isMobile ? (
        <div className="tableFilters__wrapper tableFilters__itemGroup">
          <div className="tableFilters__itemGroup">
            {!isSignatureRequestPage && (
              <div className="tableFilters__item tableFilters__item--small">
                <UISelect
                  value={searchType}
                  handleSelect={value => setSearchType && setSearchType(value)}
                  options={searchTypeOptions}
                  placeholder="Search type"
                />
              </div>
            )}
            <div className="tableFilters__item tableFilters__search">
              {searchType !== SearchTypeEnum.CREATORS ? (
                <DebounceInput
                  placeholder={
                    searchType === SearchTypeEnum.DOCUMENTS
                      ? 'Search for Documents...'
                      : 'Search for Signers...'
                  }
                  onChange={changeDocumentNameFilter}
                  icon={IconSearch}
                />
              ) : (
                <UIMultiSelect
                  options={teamMemberValues}
                  filterOption={filterOption}
                  onChange={handleMultiSelectOnChange}
                  isLoading={isLoading}
                  placeholder="Select Creators..."
                />
              )}
            </div>
          </div>
          <div className="tableFilters__itemGroup">
            {!hideElements && (
              <div className="tableFilters__item tableFilters__item--small">
                <UISelect
                  value={status}
                  handleSelect={
                    isSignatureRequestPage
                      ? value => {
                          value &&
                            setSignatureRequestStatus &&
                            setSignatureRequestStatus(
                              SignatureRequestStatuses[value.toUpperCase()],
                            );
                        }
                      : handleChangeFilterStatus
                  }
                  options={
                    isSignatureRequestPage
                      ? signatureRequestStatusFilterOptions
                      : statusFilterOptions
                  }
                  placeholder="Status: All"
                />
              </div>
            )}
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
          {!isSignatureRequestPage && (
            <div className="tableFilters__item">
              <UISelect
                value={searchType}
                handleSelect={value => setSearchType && setSearchType(value)}
                options={searchTypeOptions}
                placeholder="Search type"
              />
            </div>
          )}
          <div className="tableFilters__item tableFilters__search">
            {searchType !== SearchTypeEnum.CREATORS ? (
              <DebounceInput
                placeholder="Search for Documents..."
                onChange={changeDocumentNameFilter}
                icon={IconSearch}
              />
            ) : (
              <UIMultiSelect
                options={teamMemberValues}
                filterOption={filterOption}
                onChange={handleMultiSelectOnChange}
                isLoading={isLoading}
                placeholder="Select Creators..."
              />
            )}
          </div>
          {!hideElements && (
            <div className="tableFilters__item">
              <UISelect
                value={status}
                handleSelect={
                  isSignatureRequestPage
                    ? value => {
                        value &&
                          setSignatureRequestStatus &&
                          setSignatureRequestStatus(
                            SignatureRequestStatuses[value.toUpperCase()],
                          );
                      }
                    : handleChangeFilterStatus
                }
                options={
                  isSignatureRequestPage
                    ? signatureRequestStatusFilterOptions
                    : statusFilterOptions
                }
                placeholder="Status: All"
              />
            </div>
          )}
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
