import React from 'react';

import TemplateItem from './TemplateItem/TemplateItem';
import EmptyTable from 'Components/EmptyTable/EmptyTable';
import { TablePaginationProps } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableDocument } from 'Interfaces/Document';
import { defaultPaginationProps } from './Templates';
import { Document } from 'Interfaces/Document';

interface TemplatesMobileProps {
  templates: SelectableDocument[];
  paginationProps: TablePaginationProps;
  isLoading: boolean;
  onTemplateCreateClick: () => void;
  handleTemplateDelete: (templateIds?: Document['id'][]) => void;
}

function TemplatesMobile({
  templates,
  paginationProps = defaultPaginationProps,
  onTemplateCreateClick,
  handleTemplateDelete,
  isLoading,
}: TemplatesMobileProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;

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
      </div>
      <div className="table__container">
        <div className="table__innerContainer">
          <div className="table__row table__header mobile">Templates</div>
          {isLoading ? (
            <div className="documents__spinner">
              <UISpinner width={50} height={50} className="spinner--main__wrapper" />
            </div>
          ) : (
            templates.map(template => {
              return (
                <TemplateItem
                  key={template.id}
                  template={template}
                  onDelete={handleTemplateDelete}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplatesMobile;
