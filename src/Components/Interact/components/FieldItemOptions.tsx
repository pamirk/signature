import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { fontFamilyOptions, fontFamilyByValue } from 'Services/Fonts';
import { useDocumentFieldSignerChange } from 'Hooks/DocumentFields';
import { SelectableOption } from 'Interfaces/Common';
import {
  DocumentField,
  DocumentFieldShape,
  DocumentFieldTypes,
} from 'Interfaces/DocumentFields';
import { selectDocument } from 'Utils/selectors';
import { capitalize } from 'Utils/formatters';
import { fieldShapes } from '../common/fieldShapes';
import { checkIfDateOrText } from 'Utils/functions';

import UISelect from 'Components/UIComponents/UISelect';
import UICheckbox from 'Components/UIComponents/UICheckbox';

import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import { UpdateDocumentField } from 'Hooks/DocumentFields/useDocumentFieldUpdate';
import { DeleteDocumentField } from 'Hooks/DocumentFields/useDocumentFieldDelete';
import UITextArea from 'Components/UIComponents/UITextArea';

interface FieldItemOptionsProps {
  field: DocumentField;
  partisipantOptions: SelectableOption<string>[];
  onUpdate: UpdateDocumentField;
  onChangeSigner: (signerId: string) => void;
  onDelete: DeleteDocumentField;
  onStartPlaceholderTyping: () => void;
  onStopPlaceholderTyping: () => void;
}

const FieldItemOptions = ({
  field,
  partisipantOptions,
  onUpdate,
  onChangeSigner,
  onDelete,
  onStartPlaceholderTyping,
  onStopPlaceholderTyping,
}: FieldItemOptionsProps) => {
  const { id, signerId, required, checked } = field;
  const getFieldSignerUpdateData = useDocumentFieldSignerChange(field);
  const document = useSelector(state =>
    selectDocument(state, { documentId: field.documentId }),
  );
  const signer = useMemo(
    () => document?.signers.find(signer => signer.id === field.signerId),
    [document, field.signerId],
  );
  const isDateOrText = useMemo(() => checkIfDateOrText(field.type), [field.type]);
  const { icon, iconType, type } = fieldShapes.find(
    fieldShape => fieldShape.type === field.type,
  ) as DocumentFieldShape;

  const removeCurrentField = useCallback(() => {
    onDelete({ id });
  }, [id, onDelete]);

  const changeCurrentFieldData = useCallback(
    (data: Partial<DocumentField>) => {
      onUpdate({ id: field.id, ...data });
    },
    [onUpdate, field],
  );

  const handleFieldRequiretyChange = useCallback(
    () => changeCurrentFieldData({ required: !required }),
    [changeCurrentFieldData, required],
  );

  const handleFieldCheckedChange = useCallback(() => {
    changeCurrentFieldData({ checked: !checked });
  }, [checked, changeCurrentFieldData]);

  const changeFontFamily = useCallback(
    fontFamily => {
      if (fontFamily)
        changeCurrentFieldData({
          fontFamily,
          style: {
            fontFamily: fontFamilyByValue[fontFamily],
          },
        });
    },
    [changeCurrentFieldData],
  );

  const handlePlaceholderChange = useCallback(
    newPlaceholderValue => {
      changeCurrentFieldData({ placeholder: newPlaceholderValue });
    },
    [changeCurrentFieldData],
  );

  const handleSignerSelect = useCallback(
    signerId => {
      const updateData = getFieldSignerUpdateData(signerId);
      onChangeSigner(signerId);
      if (updateData) changeCurrentFieldData(updateData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changeCurrentFieldData, getFieldSignerUpdateData],
  );

  return (
    <li className="interactModal__fieldBar-selectField-item-wrapper">
      <div
        className={classNames('interactModal__fieldBar-selectField-item', {
          'interactModal__fieldBar-selectField-item--stroke': iconType === 'stroke',
          'interactModal__fieldBar-selectField-item--fill': iconType === 'fill',
        })}
      >
        <div className="interactModal__fieldBar-selectField-item-inner">
          <ReactSVG
            src={icon}
            className="interactModal__fieldBar-selectField-item-icon"
          />
          <p className="interactModal__fieldBar-selectField-item-label">
            {capitalize(type)}
          </p>
        </div>
        <ReactSVG
          src={RemoveIcon}
          onClick={removeCurrentField}
          className="interactModal__fieldBar-selectField-item-removeIcon"
        />
      </div>
      <div className="interactModal__fieldBar-selectField-selector-wrapper">
        <p className="interactModal__fieldBar-selectField-selector-title">Assigned To:</p>
        <UISelect
          value={signerId}
          handleSelect={handleSignerSelect}
          options={partisipantOptions}
          placeholder="Select Recipient"
        />
      </div>
      {isDateOrText && (
        <>
          <div className="interactModal__fieldBar-selectField-selector-wrapper">
            <p className="interactModal__fieldBar-selectField-selector-title">
              Font Family:{' '}
            </p>
            <UISelect
              value={field.fontFamily || ''}
              handleSelect={changeFontFamily}
              options={fontFamilyOptions}
              placeholder="Select font family"
            />
          </div>
        </>
      )}
      {field.type === DocumentFieldTypes.Text && !signer?.isPreparer && (
        <div className="interactModal__fieldBar-selectField-inputField">
          <p className="interactModal__fieldBar-selectField-inputField-title">
            Placeholder text
          </p>
          <UITextArea
            value={field.placeholder}
            placeholder="Enter your custom placeholder here"
            onChange={event => handlePlaceholderChange(event.target.value)}
            onFocus={onStartPlaceholderTyping}
            onBlur={onStopPlaceholderTyping}
          />
        </div>
      )}
      <div className="interactModal__fieldBar-selectField-checkbox">
        <UICheckbox
          handleClick={handleFieldRequiretyChange}
          check={required}
          label="Required"
        />
      </div>
      {field.type === DocumentFieldTypes.Checkbox && !signer?.isPreparer && (
        <div className="interactModal__fieldBar-selectField-checkbox">
          <UICheckbox
            handleClick={handleFieldCheckedChange}
            check={!!checked}
            label="Checked by default"
          />
        </div>
      )}
    </li>
  );
};

export default FieldItemOptions;
