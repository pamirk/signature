import React from 'react';
import classNames from 'classnames';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import EditableTitle from './EditableTitle';
import DropDownOptionsMobile from './DropDownOptionsMobile';

interface DocumentItemMobileViewProps {
  document: Document;
  isActiveEditForm: boolean;
  options: any;
  className?: string;
  handleUpdateDocument: ({ title }: { title: string }) => Promise<void>;
}

const DocumentItemMobileView = ({
  document,
  options,
  className,
  isActiveEditForm,
  handleUpdateDocument,
}: DocumentItemMobileViewProps) => {
  return (
    <div className={classNames('table__row', 'mobile', 'table__dataRow', className)}>
      <div className="table__column--title mobile">
        <div className="table__column table__column--text mobile">
          {isActiveEditForm ? (
            <EditableTitle
              documentTitle={document.title}
              onSubmit={handleUpdateDocument}
            />
          ) : (
            formatDocumentName(document.title, 'document')
          )}
        </div>
        <div className="table__column table__column--date">
          {document.createdAt && formatDate(document.createdAt)}
        </div>
        <div className="table__column table__column--status mobile">
          <div
            className={`documents__documentStatus mobile documents__documentStatus--${document.status}`}
          >
            <span className="documents__documentStatus-text">
              {document.status === DocumentStatuses.PREPARING
                ? 'processing'
                : document.status}
            </span>
          </div>
        </div>
      </div>
      <div className="table__column table__column--action mobile">
        {document.status !== DocumentStatuses.PREPARING && (
          <DropDownOptionsMobile options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default DocumentItemMobileView;
