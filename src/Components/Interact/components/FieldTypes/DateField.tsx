import React, { CSSProperties, useCallback, useRef, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import MaskedInput from 'react-text-mask';
import { createAutoCorrectedDatePipe } from 'Utils/functions';
import { dateFormatMasks } from 'Utils/formatters';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';
import { DocumentField } from 'Interfaces/DocumentFields';
import { DateFormats } from 'Interfaces/User';

// @ts-ignore
import DateIcon from 'Assets/images/icons/date-icon.svg';
import { DatePipeOptions } from 'Interfaces/Common';

interface DateFieldProps {
  onFieldDataChange?: (fieldData: Partial<DocumentField>) => void;
  value?: string | null;
  style?: CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  dateFormat?: NonNullable<DocumentField['dateFormat']>;
  disabled?: boolean;
  isInsertable?: boolean;
  fieldColor?: FieldColorNames;
  datePipeOptions?: DatePipeOptions;
}

export const DateField = ({
  value,
  onFieldDataChange,
  style,
  onFocus,
  onBlur,
  dateFormat = DateFormats.MM_DD_YYYY,
  fieldColor,
  disabled,
  isInsertable,
  datePipeOptions,
}: DateFieldProps) => {
  const shadowRef = useRef<HTMLSpanElement>(null);
  const mask = useMemo(() => dateFormatMasks[dateFormat], [dateFormat]);

  const changeTextValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onFieldDataChange) {
        const { value } = event.target;

        return onFieldDataChange({
          text: value,
        });
      }
    },
    [onFieldDataChange],
  );

  const datePipe = useMemo(
    () => createAutoCorrectedDatePipe(dateFormat, datePipeOptions),
    [dateFormat, datePipeOptions],
  );

  return (
    <div
      style={style}
      className={classNames('fieldDropDown__trigger-date', `fieldColor__${fieldColor}`, {
        'fieldDropDown__trigger--disabled': disabled,
        disabled_pointer_event: disabled || !isInsertable,
      })}
    >
      <span
        ref={shadowRef}
        className="fieldDropDown__trigger-date-content fieldDropDown__trigger-date-shadow"
      >
        {value || dateFormat}
      </span>
      <MaskedInput
        onFocus={onFocus}
        onBlur={onBlur}
        mask={mask}
        pipe={datePipe}
        keepCharPositions
        type="text"
        className={classNames(
          'fieldDropDown__trigger-date-content',
          'fieldDropDown__trigger-date-input',
          {
            'fieldDropDown__trigger--disabled': disabled,
          },
        )}
        placeholder={dateFormat || 'MM/DD/YYYY'}
        value={value || ''}
        onChange={changeTextValue}
        disabled={disabled || !isInsertable}
      />
      <ReactSVG src={DateIcon} className="fieldDropDown__trigger-date-icon" />
    </div>
  );
};

export default DateField;
