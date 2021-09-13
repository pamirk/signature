import React from 'react';
import classNames from 'classnames';

interface RequisiteTabItemProps {
  title?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const RequisiteTabItem = ({ title, isActive, onClick }: RequisiteTabItemProps) => {
  return (
    <li
      className={classNames('requisiteModal__nav-item', {
        'requisiteModal__nav-item--active': isActive,
      })}
      onClick={onClick}
    >
      {title}
    </li>
  );
};

export default RequisiteTabItem;
