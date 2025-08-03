import React from 'react';
import classnames from 'classnames';
import DocumentsIcon from 'Assets/images/icons/documents-icon.svg';
import { ReactSVG } from 'react-svg';

interface EmptyTrashTableProps {
  headerText: string;
  description?: string;
  icon?: string;
  iconClassName?: string;
}

const EmptyTrashTable = ({
  headerText,
  description,
  icon = DocumentsIcon,
  iconClassName,
}: EmptyTrashTableProps) => {
  return (
    <div className="empty-table">
      <div className="empty-table__wrapper">
        <div className={classnames('empty-table__icon', iconClassName)}>
          <ReactSVG src={icon} />
        </div>
        <div className="empty-table__header">{headerText}</div>
        <div className="empty-table__description">{description}</div>
      </div>
    </div>
  );
};

export default EmptyTrashTable;
