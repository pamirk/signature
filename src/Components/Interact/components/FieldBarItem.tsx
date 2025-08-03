import React, { useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { capitalize } from 'lodash';
import classNames from 'classnames';
import interact from 'interactjs';
import { DocumentFieldShape, DocumentFieldTypes } from 'Interfaces/DocumentFields';

export interface FieldBarItemProps {
  selectedFieldType?: string;
  fieldShape: DocumentFieldShape;
  disabled?: boolean;
  handleSelectField: (string) => void;
  onCursorMove: (event, fieldType: DocumentFieldTypes) => void;
  handleClick: (e: any, type: DocumentFieldTypes, renderShape?: boolean) => void;
}

function FieldBarItem({
  selectedFieldType,
  fieldShape: { label, type, iconType, icon },
  onCursorMove,
  disabled = false,
  handleClick,
}: FieldBarItemProps) {
  const fieldTypeItemRef = useRef<HTMLLIElement>(null);
  const [isPointerCaptured, setIsPointerCaptured] = useState(false);

  useEffect(() => {
    if (fieldTypeItemRef.current && !disabled) {
      const interactableListItem = interact(fieldTypeItemRef.current)
        .on('down', event => {
          setIsPointerCaptured(true);
          handleClick(event, type);
        })
        .on('move', event => {
          isPointerCaptured && onCursorMove(event, type);
          setIsPointerCaptured(false);
        });

      return () => interactableListItem.unset();
    }
  }, [fieldTypeItemRef, isPointerCaptured, type, onCursorMove, disabled, handleClick]);

  return (
    <li
      ref={fieldTypeItemRef}
      className={classNames('interactModal__fieldBar-fieldItem', {
        'interactModal__fieldBar-fieldItem--active': type === selectedFieldType,
        'interactModal__fieldBar-fieldItem--stroke': iconType === 'stroke',
        'interactModal__fieldBar-fieldItem--fill': iconType === 'fill',
        'interactModal__fieldBar-fieldItem--disabled': disabled,
      })}
      onClick={event => !disabled && handleClick(event, type, true)}
    >
      <ReactSVG src={icon} className="interactModal__fieldBar-fieldItem-icon" />
      {capitalize(label)}
    </li>
  );
}

export default FieldBarItem;
