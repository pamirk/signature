import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import UIDatePicker from 'Components/UIComponents/UIDatePicker';
import FieldInput from '../FieldInput';
import { UIDatePickerProps } from 'Components/UIComponents/UIDatePicker/UIDatePicker';
import { Modifier } from 'react-day-picker';
import dayjs from 'dayjs';

interface FieldSelectProps extends UIDatePickerProps, FieldRenderProps<string> {
  onDateSelect?: (date: Date | undefined) => void;
  position?: 'right' | 'left';
  onCancel?: () => void;
  disabled?: boolean;
  disabledDays?: Modifier | Modifier[];
  fromMonth?: Date;
}

const FieldDatePicker = ({
  onDateSelect,
  position,
  onCancel,
  disabled,
  disabledDays,
  fromMonth,
  ...restProps
}: FieldSelectProps) => {
  const handleSelect = useCallback(
    (date: Date) => {
      const diffDays =
        date &&
        Math.ceil(
          dayjs(date).diff(
            dayjs()
              .hour(date.getHours())
              .minute(date.getMinutes())
              .second(date.getSeconds()),
            'day',
            true,
          ),
        );

      const expirationDate = date
        ? dayjs()
            .add(diffDays, 'day')
            .toDate()
        : undefined;

      onDateSelect && onDateSelect(expirationDate);
      restProps.input.onChange(expirationDate);
    },
    [onDateSelect, restProps.input],
  );

  const handleCancel = useCallback(
    value => {
      handleSelect(value);
      onCancel && onCancel();
    },
    [handleSelect, onCancel],
  );

  return (
    <FieldInput
      {...restProps}
      renderInput={props => (
        <UIDatePicker
          {...props}
          onDateSelect={handleSelect}
          position={position}
          onCancel={handleCancel}
          disabled={disabled}
          disabledDays={disabledDays}
          fromMonth={fromMonth}
          value={props.value ? new Date(props.value) : undefined}
        />
      )}
    />
  );
};

export default FieldDatePicker;
