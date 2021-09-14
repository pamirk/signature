import React from 'react';
import classNames from 'classnames';
import { RangeModifier, DayModifiers } from 'react-day-picker';

interface DayElementProps {
  day: Date;
  modifiers: DayModifiers;
  selectedRange?: RangeModifier;
}

const DayElement = ({
  day,
  modifiers: { from, to, highlighted, sunday, saturday, inRange },
  selectedRange = { from: day, to: day },
}: DayElementProps) => {
  const isSame = from && to;
  const isFirst = day.getDate() === 1;
  const currentYear = day.getFullYear();
  const currentMonth = day.getMonth();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const isLast = lastDay === day.getDate();

  const top =
    day.getDate() <= 7 ||
      //@ts-ignore
    (day.getDate() - selectedRange?.from.getDate() <= 7 && currentMonth === selectedRange.from.getMonth());
  const bottom =
    day.getDate() + 7 > lastDay ||
      //@ts-ignore
    (selectedRange?.to.getDate() - day.getDate() <= 7 && currentMonth === selectedRange.to.getMonth());
  const saturdayInRange = saturday && inRange;
  const sundayInRange = sunday && inRange;

  const topRight = top && saturdayInRange;
  const bottomRight = bottom && saturdayInRange;
  const topLeft = top && sundayInRange;
  const bottomLeft = bottom && sundayInRange;

  const isLeftSide =
    (from && !isSame && !saturday) ||
    (inRange && sunday && !isSame && !to) ||
    (isFirst && !from && !to && inRange);
  const isRightSide =
    (to && !isSame && !sunday) ||
    (inRange && saturday && !isSame && !from) ||
    (isLast && !from && !to && inRange && !sunday);
  const isBothSides = isRightSide && isLeftSide;

  return (
    <div
      className={classNames('DayPicker__day-wrapper', {
        'DayPicker__day-wrapper--in-range': inRange && !from && !to,
        'DayPicker__day-wrapper--left-side': isLeftSide && !isBothSides,
        'DayPicker__day-wrapper--right-side': isRightSide && !isBothSides,
        'DayPicker__day-wrapper--both-sides': isBothSides && !from && !to,
        'DayPicker__day-wrapper--top-right': topRight || to || (isLast && !saturday),
        'DayPicker__day-wrapper--bottom-right': bottomRight || to || isLast,
        'DayPicker__day-wrapper--bottom-left': bottomLeft || from || (isFirst && !sunday),
        'DayPicker__day-wrapper--top-left': topLeft || from || isFirst,
      })}
    >
      <div
        className={classNames('DayPicker__custom-day', {
          'DayPicker__custom-day--highlighted': highlighted,
          'DayPicker__custom-day--is-box':
            highlighted || ((sunday || saturday || isFirst || isLast) && inRange),
          'DayPicker__custom-day--in-range': inRange,
        })}
      >
        {day.getDate()}
      </div>
    </div>
  );
};

export default DayElement;
