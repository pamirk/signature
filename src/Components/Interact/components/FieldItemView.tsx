import React, { CSSProperties, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { DocumentFieldTypes } from 'Interfaces/DocumentFields';

import { TextFieldSign, RequisiteField, CheckboxField, DateField } from './FieldTypes';
import { RequisiteType } from 'Interfaces/Requisite';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';
import { FieldModalPosition } from './FieldItem';
import NameField from './FieldTypes/NameField';

interface FieldItemViewProps {
  style: CSSProperties;
  fieldType: string;
  renderFieldTrigger?: () => JSX.Element | undefined;
  renderFieldMenu?: () => JSX.Element | undefined;
  id?: string;
  className?: string;
  dropdownClassName?: string;
  dropdownMenuRef?: React.RefObject<HTMLDivElement>;
  fieldColor: FieldColorNames;
  isMenuOpen?: boolean;
  isResizable?: boolean;
  inFocus?: boolean;
  isFilled?: boolean;
  selectedScale: number;
  fieldModalPosition: FieldModalPosition;
  [key: string]: any;
}

const FieldItemView = (
  {
    id,
    fieldType,
    style,
    fieldColor,
    inFocus,
    renderFieldTrigger,
    renderFieldMenu,
    className,
    dropdownClassName,
    dropdownMenuRef,
    isMenuOpen = false,
    isResizable = false,
    isFilled = false,
    selectedScale,
    fieldModalPosition,
    ...restProps
  }: FieldItemViewProps,
  ref,
) => {
  const fieldColorClassName = useMemo(
    () =>
      fieldColor ? `fieldColor__${fieldColor}` : `fieldColor__${FieldColorNames.EMPTY}`,
    [fieldColor],
  );

  const translateModalX = useMemo(() => {
    switch (fieldModalPosition) {
      case FieldModalPosition.BOTTOM:
        return ((1 - selectedScale) * 100) / 2;
      case FieldModalPosition.LEFT:
        return ((1 - selectedScale) * -100) / 2;
      case FieldModalPosition.TOP:
        return ((1 - selectedScale) * 100) / 2;
      case FieldModalPosition.TOP_LEFT:
        return ((1 - selectedScale) * -100) / 2;
      default:
        return 0;
    }
  }, [fieldModalPosition, selectedScale]);

  const translateModalY = useMemo(() => {
    switch (fieldModalPosition) {
      case FieldModalPosition.BOTTOM:
        return ((1 - selectedScale) * 100) / 2;
      case FieldModalPosition.LEFT:
        return ((1 - selectedScale) * 100) / 2;
      case FieldModalPosition.TOP:
        return ((1 - selectedScale) * -100) / 2;
      case FieldModalPosition.TOP_LEFT:
        return ((1 - selectedScale) * -100) / 2;
      default:
        return 0;
    }
  }, [fieldModalPosition, selectedScale]);

  const defaultFieldTriggerRender = useCallback(() => {
    switch (fieldType) {
      case DocumentFieldTypes.Name: {
        return (
          <NameField
            fieldColor={FieldColorNames.EMPTY}
            disabled
            style={{
              fontSize: 14,
              fontFamily: 'Arial',
            }}
          />
        );
      }
      case DocumentFieldTypes.Signature:
      case DocumentFieldTypes.Initials: {
        return (
          <RequisiteField
            fieldColor={FieldColorNames.EMPTY}
            requisiteType={
              fieldType === DocumentFieldTypes.Signature
                ? RequisiteType.SIGN
                : RequisiteType.INITIAL
            }
            disabled
          />
        );
      }
      case DocumentFieldTypes.Checkbox: {
        return <CheckboxField disabled fieldColor={FieldColorNames.EMPTY} />;
      }
      case DocumentFieldTypes.Text: {
        return (
          <TextFieldSign
            disabled
            fieldColor={FieldColorNames.EMPTY}
            style={{
              fontSize: 14,
              fontFamily: 'Arial',
            }}
          />
        );
      }
      case DocumentFieldTypes.Date: {
        return (
          <DateField
            fieldColor={FieldColorNames.EMPTY}
            disabled
            style={{
              fontSize: 14,
              fontFamily: 'Arial',
            }}
          />
        );
      }
      default: {
        break;
      }
    }
  }, [fieldType]);

  return (
    <div
      ref={ref}
      tabIndex={1}
      className={classNames('fieldDropDown', 'draggable', className, {
        'fieldDropDown--opened': isMenuOpen,
      })}
      role="presentation"
      field-type={fieldType}
      coord-x={style.left}
      coord-y={style.top}
      size-width={style.width}
      size-height={style.height}
      id={id}
      style={style}
      {...restProps}
    >
      <div
        className={classNames(
          `fieldDropDown__trigger fieldDropDown__trigger--${fieldType}`,
          fieldColorClassName,
          {
            'fieldDropDown__trigger--inFocus': inFocus,
            'fieldDropDown__trigger--filled': isFilled,
          },
        )}
      >
        {renderFieldTrigger ? renderFieldTrigger() : defaultFieldTriggerRender()}
        {isResizable && (
          <>
            <div className="fieldDropDown__trigger-triangle fieldDropDown__trigger-triangle--topLeft" />
            <div className="fieldDropDown__trigger-triangle fieldDropDown__trigger-triangle--topRight" />
            <div className="fieldDropDown__trigger-triangle fieldDropDown__trigger-triangle--bottomRight" />
            <div className="fieldDropDown__trigger-triangle fieldDropDown__trigger-triangle--bottomLeft" />
          </>
        )}
      </div>
      {isMenuOpen && (
        <div
          ref={dropdownMenuRef}
          style={{
            transform: `scale(${1 /
              selectedScale}) translate(${translateModalX}%, ${translateModalY}%)`,
          }}
          className={classNames('fieldDropDown__content-wrapper', dropdownClassName)}
        >
          <p className="fieldDropDown__title">
            Who {fieldType === 'checkbox' ? 'check' : 'fills'} this out?
          </p>
          {renderFieldMenu && renderFieldMenu()}
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(FieldItemView);
