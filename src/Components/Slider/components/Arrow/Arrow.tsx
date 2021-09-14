import React from 'react';
import { ReactSVG } from 'react-svg';
import ArrowIcon from 'Assets/images/icons/select-arrow-icon.svg';
import classNames from 'classnames';

interface ArrowButtonProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  orientation: 'left' | 'right';
}

const ArrowButton = (props: ArrowButtonProps) => {
  const { onClick, orientation } = props;

  return (
    <div
      onClick={onClick}
      className={classNames('slider__button', {
        'slider__button--next': orientation === 'right',
        'slider__button--prev': orientation === 'left',
      })}
    >
      <ReactSVG src={ArrowIcon} />
    </div>
  );
};

export default ArrowButton;
