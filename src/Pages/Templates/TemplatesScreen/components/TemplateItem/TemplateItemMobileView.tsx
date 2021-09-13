import React from 'react';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { User } from 'Interfaces/User';
import DropDownOptions from 'Components/DropDownOptions/DropDownOptions';

interface TemplateItemMobileViewProps {
  template: Document;
  userId: User['id'];
  options: any;
}

const TemplateItemMobileView = ({
  template,
  userId,
  options,
}: TemplateItemMobileViewProps) => {
  return (
    <div className="table__row table__dataRow mobile">
      <div className="table__column table__column--template-text-container mobile">
        <div className="table__column--template-text mobile">
          {formatDocumentName(template.title, 'template')}
        </div>
        <div className="table__column table__column--template-date">
          {template.createdAt && formatDate(template.createdAt)}
        </div>
        <div className="table__column table__column--status mobile">
          <div
            className={`documents__documentStatus documents__documentStatus--${
              template.status === DocumentStatuses.ACTIVE ? 'completed' : template.status
            }`}
          >
            <span className="documents__documentStatus-text">
              {template.status === DocumentStatuses.ACTIVE ? 'Live' : template.status}
            </span>
          </div>
        </div>
      </div>
      <div className="table__column table__column--template-action table__column-item--template-action mobile">
        {template.userId === userId && (
          <div className="table__actions">
            <DropDownOptions options={options} anchorClassName="table__container" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateItemMobileView;
