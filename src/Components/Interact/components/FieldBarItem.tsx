import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import interact from 'interactjs';
import { DocumentFieldShape, DocumentFieldTypes } from 'Interfaces/DocumentFields';
import { capitalize } from 'Utils/formatters';

export interface FieldBarItemProps {
  handleSelectField: (string) => void;
  selectedFieldType?: string;
  fieldShape: DocumentFieldShape;
  onCursorMove: (event, fieldType: DocumentFieldTypes) => void;
  disabled?: boolean;
}

function FieldBarItem({
  handleSelectField,
  selectedFieldType,
  fieldShape: { type, iconType, icon },
  onCursorMove,
  disabled = false,
}: FieldBarItemProps) {
  const fieldTypeItemRef = useRef<HTMLLIElement>(null);
  const [isPointerCaptured, setIsPointerCaptured] = useState(false);

  useEffect(() => {
    if (fieldTypeItemRef.current && !disabled) {
      const interactableListItem = interact(fieldTypeItemRef.current)
        .on('down', () => {
          setIsPointerCaptured(true);
          handleSelectField(type);
        })
        .on('move', event => {
          isPointerCaptured && onCursorMove(event, type);
          setIsPointerCaptured(false);
        });

      return () => interactableListItem.unset();
    }
  }, [
    fieldTypeItemRef,
    isPointerCaptured,
    type,
    onCursorMove,
    disabled,
    handleSelectField,
  ]);

  const handleItemClick = useCallback(() => !disabled && handleSelectField(type), [
    type,
    disabled,
    handleSelectField,
  ]);

  return (
    <li
      ref={fieldTypeItemRef}
      className={classNames('interactModal__fieldBar-fieldItem', {
        'interactModal__fieldBar-fieldItem--active': type === selectedFieldType,
        'interactModal__fieldBar-fieldItem--stroke': iconType === 'stroke',
        'interactModal__fieldBar-fieldItem--fill': iconType === 'fill',
        'interactModal__fieldBar-fieldItem--disabled': disabled,
      })}
      onClick={handleItemClick}
    >
      <ReactSVG src={icon} className="interactModal__fieldBar-fieldItem-icon" />
      {capitalize(type)}
    </li>
  );
}

export default FieldBarItem;
