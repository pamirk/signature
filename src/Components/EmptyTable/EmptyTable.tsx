import React from 'react';
import classnames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import DocumentsIcon from 'Assets/images/icons/documents-icon.svg';
import { ReactSVG } from 'react-svg';

interface EmptyTableProps {
  onClick: () => void;
  headerText: string;
  description?: string;
  buttonText?: string;
  icon?: string;
  iconClassName?: string;
  buttonClassName?: string;
}

const EmptyTable = ({
  headerText,
  description,
  buttonText,
  icon = DocumentsIcon,
  iconClassName,
  buttonClassName,
  onClick,
}: EmptyTableProps) => {
  return (
    <div className="empty-table">
      <div className="empty-table__wrapper">
        <div className={classnames('empty-table__icon', iconClassName)}>
          <ReactSVG src={icon} />
        </div>
        <div className="empty-table__header">{headerText}</div>
        <div className="empty-table__description">{description}</div>
        <div className="empty-table__button">
          <UIButton
            priority="primary"
            handleClick={onClick}
            title={buttonText}
            className={buttonClassName}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyTable;
