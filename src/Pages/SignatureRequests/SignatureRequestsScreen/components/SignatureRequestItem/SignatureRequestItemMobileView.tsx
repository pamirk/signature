import React from 'react';
import classNames from 'classnames';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import DropDownOptionsMobile from 'Pages/Documents/components/DocumentItem/DropDownOptionsMobile';
import { SignatureRequestStatuseLabels } from 'Interfaces/SignatureRequest';

interface SignatureRequestItemMobileViewProps {
  document: Document;
  grid: any;
  options: any;
  className?: string;
}

const SignatureRequestItemMobileView = ({
  document,
  grid,
  options,
  className,
}: SignatureRequestItemMobileViewProps) => {
  return (
    <div className={classNames('table__row', 'mobile', 'table__dataRow', className)}>
      <div className="table__column--title mobile">
        <div className="table__column table__column--text mobile">
          {formatDocumentName(document.title, 'document')}
        </div>
        <div className="table__column table__column--date">
          {document.createdAt && formatDate(document.createdAt)}
        </div>
        <div className="table__column table__column--status mobile">
          <div
            className={`documents__documentStatus mobile documents__documentStatus--${grid.signatureRequests.status}`}
          >
            <span className="documents__documentStatus-text">
              {SignatureRequestStatuseLabels[grid.signatureRequests.status]}
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

export default SignatureRequestItemMobileView;
