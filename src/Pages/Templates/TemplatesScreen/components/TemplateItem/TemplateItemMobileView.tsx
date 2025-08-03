import React from 'react';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { User } from 'Interfaces/User';
import DropDownOptions from 'Components/DropDownOptions';
import EditableTitle from './EditableTitle';

interface TemplateItemMobileViewProps {
  template: Document;
  userId: User['id'];
  options: any;
  isActiveEditForm: boolean;
  handleUpdateTemplate: (value: any) => void;
}

const TemplateItemMobileView = ({
  template,
  userId,
  options,
  isActiveEditForm,
  handleUpdateTemplate,
}: TemplateItemMobileViewProps) => {
  return (
    <div className="table__row table__dataRow mobile">
      <div className="table__column table__column--template-text-container mobile">
        <div className="table__column--template-text mobile">
          {isActiveEditForm ? (
            <EditableTitle
              templateTitle={template.title}
              onSubmit={handleUpdateTemplate}
            />
          ) : (
            formatDocumentName(template.title, 'template')
          )}
        </div>
        <div className="table__column table__column--template-date">
          {template.createdAt && formatDate(template.createdAt)}
        </div>
        <div className="table__column table__column--status mobile">
          <div
            className={`documents__documentStatus mobile documents__documentStatus--${
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
        <div className="table__actions">
          <DropDownOptions options={options} anchorClassName="table__container" />
        </div>
      </div>
    </div>
  );
};

export default TemplateItemMobileView;
