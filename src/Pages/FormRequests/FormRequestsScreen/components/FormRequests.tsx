import React from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconSort from 'Assets/images/icons/sort.svg';

import { TablePaginationProps } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableDocument } from 'Interfaces/Document';
import FormRequestItem from './FormRequestItem';
import useIsMobile from 'Hooks/Common/useIsMobile';
import FormRequestsMobile from './FormRequestsMobile';
import { Document } from 'Interfaces/Document';

interface FromRequestsProps {
  templates: SelectableDocument[];
  paginationProps: TablePaginationProps;
  toggleItemSelection: (templateId: string) => void;
  isLoading: boolean;
  requestOrdering: (key: string) => void;
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
  onTemplateCreateClick: () => void;
  handleFormDelete: (formIds: Document['id'][]) => void;
  handleGetForms: () => void;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function FromRequests({
  templates,
  paginationProps = defaultPaginationProps,
  openDeleteModal,
  toggleItemSelection,
  isLoading,
  requestOrdering,
  isDeleteModalOpen,
  handleFormDelete,
  handleGetForms,
}: FromRequestsProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;
  const isMobile = useIsMobile();

  return isMobile ? (
    <FormRequestsMobile
      templates={templates}
      paginationProps={paginationProps}
      toggleItemSelection={toggleItemSelection}
      isLoading={isLoading}
      isDeleteModalOpen={isDeleteModalOpen}
      handleFormDelete={handleFormDelete}
      handleGetForms={handleGetForms}
    />
  ) : (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <p className="tableControls__pagingCounter tableControls__pagingCounter--template">
          {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit + itemsCount}`}
          &nbsp;of&nbsp;
          <span>{totalItems}</span>
          &nbsp;results
        </p>
        <div className="tableControls__controlsGroup">
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
            <div className="table__column table__column--check" />
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
                className="tableControls__headerControl status"
                onClick={() => requestOrdering('status')}
              >
                <span>STATUS</span>
                <ReactSVG src={IconSort} />
              </button>
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
            templates.map(template => {
              const { isSelected } = template;

              return (
                <FormRequestItem
                  key={template.id}
                  template={template}
                  toggleSelect={() => toggleItemSelection(template.id)}
                  isSelected={isSelected}
                  className={classNames({
                    'table__dataRow--delete': isDeleteModalOpen && isSelected,
                    'table__dataRow--inactive': isDeleteModalOpen && !isSelected,
                  })}
                  handleGetForms={handleGetForms}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default FromRequests;
