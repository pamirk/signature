import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import Toast from 'Services/Toast';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import { useDocumentUpdate } from 'Hooks/Document';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import DropDownOptions from 'Components/DropDownOptions';
import EditableTitle from './EditableTitle';

interface TemplateItemProps {
  template: Document;
  className?: string;
  options: any;
}

const FormRequestItemMobile = ({ template, className, options }: TemplateItemProps) => {
  const [isActiveEditForm, setIsEditFormActive] = useState<boolean>(false);

  const [updateTemplate] = useDocumentUpdate();

  const handleUpdateTemplate = useCallback(
    async ({ title }) => {
      try {
        await updateTemplate({
          values: {
            title,
            type: template.type,
            documentId: template.id,
          },
        });
        Toast.success('Template successfully updated!');
        setIsEditFormActive(false);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [updateTemplate, template.type, template.id],
  );

  return (
    <div className={classNames('table__row', 'table__dataRow', 'mobile', className)}>
      <div>
        <div className="table__column table__column--text mobile">
          {isActiveEditForm ? (
            <EditableTitle
              templateTitle={template.title}
              onSubmit={handleUpdateTemplate}
            />
          ) : (
            formatDocumentName(template.title, 'template')
          )}
        </div>
        <div className="table__column table__column--date">
          {template.createdAt && formatDate(template.createdAt)}
        </div>
        <div className="table__column table__column--status mobile">
          <div
            className={`documents__documentStatus documents__documentStatus--${
              template.status === DocumentStatuses.ACTIVE
                ? template.deletedAt
                  ? 'disabled'
                  : 'completed'
                : template.status
            } mobile`}
          >
            <span className="documents__documentStatus-text">
              {template.status === DocumentStatuses.ACTIVE
                ? template.deletedAt
                  ? 'disabled'
                  : 'live'
                : template.status}
            </span>
          </div>
        </div>
      </div>
      <div className="table__column table__column--action mobile">
        {template.status !== DocumentStatuses.PREPARING && (
          <DropDownOptions options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default FormRequestItemMobile;
