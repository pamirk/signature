import React, { useCallback, useState } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconSort from 'Assets/images/icons/sort.svg';

import TemplateItem from './TemplateItem/TemplateItem';
import EmptyTable from 'Components/EmptyTable/EmptyTable';
import { TablePaginationProps } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableDocument } from 'Interfaces/Document';
import UICheckbox from 'Components/UIComponents/UICheckbox';

interface TemplatesProps {
  templates: SelectableDocument[];
  paginationProps: TablePaginationProps;
  toggleItemSelection: (templateId: string | string[]) => void;
  isLoading: boolean;
  requestOrdering: (key: string) => void;
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
  onTemplateCreateClick: () => void;
}

export const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function Templates({
  templates,
  paginationProps = defaultPaginationProps,
  openDeleteModal,
  onTemplateCreateClick,
  toggleItemSelection,
  isLoading,
  requestOrdering,
  isDeleteModalOpen,
}: TemplatesProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;
  const [isAllSelected, setAllSelected] = useState<boolean>(false);

  const handleSelectAll = useCallback(() => {
    toggleItemSelection(templates.map(template => template.id));
    setAllSelected(prev => !prev);
  }, [templates, toggleItemSelection]);

  if (templates.length === 0 && !isLoading)
    return (
      <div className="documents__empty-table">
        <EmptyTable
          onClick={onTemplateCreateClick}
          buttonText="Create Template"
          headerText="You don't have any templates yet."
          description="Create your first template to save time when repeating the same signature documents."
        />
      </div>
    );
  return (
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
            <div className="table__column table__column--check select-all">
              <UICheckbox handleClick={handleSelectAll} check={isAllSelected} />
            </div>
            <div className="table__column table__column--template-text-container">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('title')}
              >
                <span>TITLE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--template-date">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('createdAt')}
              >
                <span>DATE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--template-action">ACTIONS</div>
          </div>
          {isLoading ? (
            <div className="documents__spinner">
              <UISpinner width={50} height={50} className="spinner--main__wrapper" />
            </div>
          ) : (
            templates.map(template => {
              const { isSelected } = template;

              return (
                <TemplateItem
                  key={template.id}
                  template={template}
                  toggleSelect={() => toggleItemSelection(template.id)}
                  isSelected={isSelected}
                  className={classNames({
                    'table__dataRow--delete': isDeleteModalOpen && isSelected,
                    'table__dataRow--inactive': isDeleteModalOpen && !isSelected,
                  })}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Templates;
