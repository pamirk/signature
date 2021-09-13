import React, { useState, useCallback, useEffect } from 'react';
import DayPicker, { RangeModifier, DateUtils } from 'react-day-picker';
import { ReactSVG } from 'react-svg';
// @ts-ignore
import useDropdown from 'use-dropdown';
import classNames from 'classnames';
import ArrowIcon from 'Assets/images/icons/select-arrow-icon.svg';
import DatePickerIcon from 'Assets/images/icons/datepicker.svg';
import CloseIcon from 'Assets/images/icons/close-icon.svg';
import { DayElement, NavbarElement } from './components';
import UIButton from '../UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';

const weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface UIDatePickerProps {
  onDateSelect?: (date: Date) => void;
  onDateRangeSelect?: (dateRange: RangeModifier) => void;
  position?: 'right' | 'left';
  value?: RangeModifier | Date;
  onCancel?: () => void;
}

const isDateRange = (date: RangeModifier | Date): date is RangeModifier => {
  return (date as RangeModifier).from !== undefined;
};

const isDate = (date: RangeModifier | Date): date is Date => {
  return (date as Date).getTime !== undefined;
};

const UIDatePicker = ({
  onDateSelect,
  onDateRangeSelect,
  position = 'left',
  value,
  onCancel,
}: UIDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDateRange, setSelectedDateRange] = useState<RangeModifier>();
  const [containerRef, isOpen, open, close] = useDropdown();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (value && isDateRange(value)) {
      return setSelectedDateRange(value);
    }

    if (value && isDate(value)) {
      return setSelectedDate(value);
    }
  }, [value]);

  const handleOpenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) {
      close(e);
    } else {
      open(e);
    }
  };

  const handleSelectButtonClick = () => {
    if (onDateRangeSelect && selectedDateRange) onDateRangeSelect(selectedDateRange);

    if (onDateSelect && selectedDate) onDateSelect(selectedDate);

    close();
  };

  const handleDayClick = useCallback(
    (day: Date) => {
      if (!onDateRangeSelect) {
        return setSelectedDate(day);
      }

      if (!selectedDateRange) {
        return setSelectedDateRange({ from: day, to: day });
      }
      const range = DateUtils.addDayToRange(day, selectedDateRange);

      if (range.from && range.to) {
        return setSelectedDateRange(range);
      }
    },
    [onDateRangeSelect, selectedDateRange],
  );

  const handleClickCancel = () => {
    close();
    if (onCancel) onCancel();
  };

  // @ts-ignore
  const currentValue = value && (isDate(value) ? value.toLocaleDateString() : `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`);
  const rangeDays = selectedDateRange
    ? [selectedDateRange.from, selectedDateRange.to]
    : [selectedDate];
  const modifiers:any = {
    highlighted: [...rangeDays],
    inRange: selectedDateRange,
    saturday: { daysOfWeek: [6] },
    sunday: { daysOfWeek: [0] },
    ...selectedDateRange,
  };

  return (
    <div className="DayPickerContainer" ref={containerRef}>
      <div className="DayPickerContainer__wrapper" onClick={handleOpenClick}>
        <ReactSVG src={DatePickerIcon} className="DayPickerContainer__icon" />
        <p className="dropDownUser__trigger-name">{currentValue || 'Select date'}</p>
        <ReactSVG
          src={ArrowIcon}
          className={classNames('DayPickerContainer__close-button', {
            'DayPickerContainer__close-button--open': isOpen,
          })}
        />
      </div>
      <div
        className={classNames('DayPickerContainer-Overlay', {
          'DayPickerContainer-Overlay--left': position === 'left',
          'DayPickerContainer-Overlay--right': position === 'right',
        })}
      >
        {isOpen && (
          <div className={classNames('DayPicker__wrapper', { mobile: isMobile })}>
            <ReactSVG
              src={CloseIcon}
              onClick={close}
              className="DayPicker__close-button"
            />
            <DayPicker
              modifiers={modifiers}
              weekdaysShort={weekdaysShort}
              renderDay={(day, modifiers) => (
                <DayElement
                  day={day}
                  modifiers={modifiers}
                  selectedRange={selectedDateRange}
                />
              )}
              navbarElement={NavbarElement}
              onDayClick={handleDayClick}
            />
            <div className="DayPicker__footer">
              <div
                className="DayPicker__button DayPicker__button--cancel"
                onClick={handleClickCancel}
              >
                Cancel
              </div>
              <div className="DayPicker__button DayPicker__button--select">
                <UIButton
                  title="Select"
                  handleClick={handleSelectButtonClick}
                  priority="primary"
                  disabled={!selectedDate && !selectedDateRange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIDatePicker;
