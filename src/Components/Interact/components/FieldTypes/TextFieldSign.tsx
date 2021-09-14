import React, { useCallback, CSSProperties, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { DocumentFieldUpdatePayload } from 'Interfaces/DocumentFields';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';

import UITextArea from 'Components/UIComponents/UITextArea';
import { Signer } from 'Interfaces/Document';
import Interact from 'Services/Interact';

interface TextFieldProps {
  onFieldDataChange?: (fieldData: Omit<DocumentFieldUpdatePayload, 'id'>) => void;
  onFocus?: () => void;
  value?: string | null;
  placeholder?: string;
  style: CSSProperties;
  disabled?: boolean;
  minFontSize?: number;
  maxFontSize?: number;
  signer?: Signer;
  fieldColor?: FieldColorNames;
}

const TextField = (
  {
    onFieldDataChange,
    onFocus,
    style,
    value,
    placeholder,
    disabled = false,
    minFontSize = 7,
    maxFontSize = 48,
    fieldColor,
    signer,
  }: TextFieldProps,
  ref,
) => {
  const signerName = signer?.name || signer?.role;

  const shadowRef = useRef<HTMLPreElement>(null);

  const changeTextValue = useCallback(
    async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onFieldDataChange && shadowRef.current) {
        const { value } = event.target;
        const prevValue = shadowRef.current.innerHTML;

        shadowRef.current.innerHTML = value;
        const newFontSize = await Interact.getRearrangedFontSize({
          initialFontSize: style.fontSize as number,
          shadowElement: shadowRef.current,
          minFontSize,
          maxFontSize,
        });

        if (newFontSize) {
          shadowRef.current.innerHTML = prevValue;
          shadowRef.current.style.fontSize = style.fontSize + 'px';

          onFieldDataChange({
            text: value,
            fontSize: newFontSize,
            style: {
              fontSize: newFontSize,
            },
          });
        }
      }
    },
    [onFieldDataChange, style.fontSize, minFontSize, maxFontSize],
  );

  const textValue = useMemo(() => value || '', [value]);

  const formattedValue = useMemo(
    () => (textValue || 'Textbox').replace(/\n/g, '\n&#8203;'),
    [textValue],
  );

  return (
    <div
      style={{
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
      }}
      className={classNames('fieldDropDown__trigger-text', `fieldColor__${fieldColor}`, {
        disabled_pointer_event: disabled,
      })}
    >
      <pre
        ref={shadowRef}
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
        }}
        dangerouslySetInnerHTML={{ __html: formattedValue }}
        className={classNames(
          'fieldDropDown__trigger-text-content',
          'fieldDropDown__trigger-text-shadow',
          'fieldDropDown__trigger-text-content--insertable',
        )}
      />
      <UITextArea
        onFocus={onFocus}
        onChange={changeTextValue}
        ref={ref}
        height="100%"
        value={textValue}
        className={classNames(
          'fieldDropDown__trigger-text-content',
          'fieldDropDown__trigger-text-input',
          'fieldDropDown__trigger-text-input--sign',
          'fieldDropDown__trigger-text-content--insertable',
        )}
        disabled={disabled}
        placeholder={placeholder || (!disabled ? textValue : signerName)}
      />
    </div>
  );
};

export default React.forwardRef(TextField);
