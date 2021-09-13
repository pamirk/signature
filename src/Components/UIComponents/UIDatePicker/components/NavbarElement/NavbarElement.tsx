import React from 'react';
import { NavbarElementProps } from 'react-day-picker';
import Arrow from 'Assets/images/icons/angle-arrow.svg';
import { ReactSVG } from 'react-svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const NavbarElement = ({
  className,
  month,
  onPreviousClick,
  onNextClick,
}: NavbarElementProps) => {
  const currentMonth = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
  const isMobile = useIsMobile();
  return (
    <div className={className}>
      <ReactSVG
        className="DayPicker__nav DayPicker__nav--left"
        src={Arrow}
        onClick={() => onPreviousClick()}
      />
      <div className={classNames('DayPicker__nav-title', { mobile: isMobile })}>
        {currentMonth}
      </div>
      <ReactSVG className="DayPicker__nav" src={Arrow} onClick={() => onNextClick()} />
    </div>
  );
};
export default NavbarElement;
