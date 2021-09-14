import React from 'react';
import classNames from 'classnames';
import { TablePaginationProps } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableDocument } from 'Interfaces/Document';
import FormRequestItem from './FormRequestItem';
import { Document } from 'Interfaces/Document';

interface TemplatesProps {
  templates: SelectableDocument[];
  paginationProps: TablePaginationProps;
  toggleItemSelection: (templateId: string) => void;
  isLoading: boolean;
  isDeleteModalOpen: boolean;
  handleFormDelete: (formIds: Document['id'][]) => void;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function FormRequestsMobile({
  templates,
  paginationProps = defaultPaginationProps,
  toggleItemSelection,
  isLoading,
  isDeleteModalOpen,
  handleFormDelete,
}: TemplatesProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;

  return (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <p className="tableControls__pagingCounter tableControls__pagingCounter--template">
          {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit + itemsCount}`}
          &nbsp;of&nbsp;
          <span>{totalItems}</span>
          &nbsp;results
        </p>
      </div>

      <div className="table__container mobile">
        <div className="table__innerContainer">
          <div className="table__row table__header">Forms</div>
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
                  onDelete={handleFormDelete}
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

export default FormRequestsMobile;
