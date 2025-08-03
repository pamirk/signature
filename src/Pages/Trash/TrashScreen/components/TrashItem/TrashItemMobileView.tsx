import React from 'react';
import classNames from 'classnames';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import EditableTitle from 'Pages/Documents/components/DocumentItem/EditableTitle';
import DropDownOptionsMobile from 'Pages/Documents/components/DocumentItem/DropDownOptionsMobile';

interface TrashItemMobileViewProps {
  document: Document;
  isActiveEditForm: boolean;
  options: any;
  className?: string;
  handleUpdateDocument: (value: any) => void;
}

const TrashItemMobileView = ({
  document,
  options,
  className,
  isActiveEditForm,
  handleUpdateDocument,
}: TrashItemMobileViewProps) => {
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
            className={`documents__documentStatus mobile documents__documentStatus--deleted`}
          >
            <span className="documents__documentStatus-text">DELETED</span>
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

export default TrashItemMobileView;
