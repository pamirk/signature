import React from 'react';
import { ReactSVG } from 'react-svg';
import className from 'classnames';
import CircleAdd from 'Assets/images/icons/circle-add-icon.svg';

interface UIAddButtonProps {
  onClick?: () => void;
  label?: string;
  wrapperClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export const UIAddButton = ({
  onClick,
  label,
  wrapperClassName,
  iconClassName,
  labelClassName,
}: UIAddButtonProps) => {
  return (
    <div onClick={onClick} className={className('addButton__wrapper', wrapperClassName)}>
      <ReactSVG src={CircleAdd} className={className('addButton__icon', iconClassName)} />
      {label && <p className={className('addButton__label', labelClassName)}>{label}</p>}
    </div>
  );
};
