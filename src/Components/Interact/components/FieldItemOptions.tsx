import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { fontFamilyByValue } from 'Services/Fonts';
import { useDocumentFieldSignerChange } from 'Hooks/DocumentFields';
import { SelectableOption } from 'Interfaces/Common';
import {
  DocumentField,
  DocumentFieldsCRUDMeta,
  DocumentFieldShape,
  DocumentFieldTypes,
} from 'Interfaces/DocumentFields';
import { selectDocument } from 'Utils/selectors';
import { capitalize } from 'lodash';
import { fieldShapes } from '../common/fieldShapes';
import { checkIfDateOrText } from 'Utils/functions';

import UISelect from 'Components/UIComponents/UISelect';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import UITextArea from 'Components/UIComponents/UITextArea';
import UITextInput from 'Components/UIComponents/UITextInput';

import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import { UpdateDocumentField } from 'Hooks/DocumentFields/useDocumentFieldUpdate';
import { DeleteDocumentField } from 'Hooks/DocumentFields/useDocumentFieldDelete';
import UIButton from 'Components/UIComponents/UIButton';
import { DocumentTypes } from 'Interfaces/Document';
import FontSizeSelect from './FontSizeSelect';
import FontFamilySelect from './FontFamilySelect';

interface FieldItemOptionsProps {
  field: DocumentField;
  partisipantOptions: SelectableOption<string>[];
  onUpdate: UpdateDocumentField;
  onChangeSigner: (signerId: string) => void;
  onDelete: DeleteDocumentField;
  onStartInputTyping: () => void;
  onStopInputTyping: () => void;
  validateTag: (id: string, tag: string) => boolean;
  onApplyFontToEachField: (fontFamily: string, fontSize: number) => void;
}

const FieldItemOptions = ({
  field,
  partisipantOptions,
  onUpdate,
  onChangeSigner,
  onDelete,
  onStartInputTyping,
  onStopInputTyping,
  validateTag,
  onApplyFontToEachField,
}: FieldItemOptionsProps) => {
  const { id, signerId, required, checked, minimizeWidth } = field;
  const [isTagInvalid, setIsTagInvalid] = useState(false);
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
    (data: Partial<DocumentField>, meta?: DocumentFieldsCRUDMeta) => {
      onUpdate({ id: field.id, ...data }, meta);
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

  const handleFieldMinimizeWidthChange = useCallback(() => {
    changeCurrentFieldData({ minimizeWidth: !minimizeWidth });
  }, [changeCurrentFieldData, minimizeWidth]);

  const handleTagFieldChange = useCallback(
    (tag: string) => {
      changeCurrentFieldData({ tag: tag });
      setIsTagInvalid(!validateTag(id, tag));
    },
    [validateTag, id, changeCurrentFieldData],
  );

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

  const changeFontSize = useCallback(
    fontSize => {
      if (fontSize)
        changeCurrentFieldData(
          {
            fontSize,
            fixedFontSize: true,
            style: {
              fontSize,
            },
          },
          { stopFontAutoSize: true, pushToHistory: true },
        );
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

  const handleApplyToDocumentButton = (field: DocumentField) => () => {
    onApplyFontToEachField(field.fontFamily || 'arial', field.fontSize || 14);
  };

  const showTagHint = useMemo(() => {
    if (field.tag) {
      return field.tag.length > 0;
    }

    return false;
  }, [field.tag]);

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
            <FontFamilySelect value={field.fontFamily} onSelect={changeFontFamily} />
          </div>
          <div className="interactModal__fieldBar-selectField-selector-wrapper">
            <p className="interactModal__fieldBar-selectField-selector-title">
              Font size:&nbsp;
            </p>
            <FontSizeSelect onSelect={changeFontSize} value={field.fontSize || null} />
          </div>
          <div className="interactModal__fieldBar-selectField-selector-apply">
            <UIButton
              priority="primary"
              className="centered-text"
              title="Apply to Document"
              handleClick={handleApplyToDocumentButton(field)}
            />
          </div>
        </>
      )}
      {field.type === DocumentFieldTypes.Text && !signer?.isPreparer && (
        <div className="interactModal__fieldBar-selectField-inputField">
          <p className="interactModal__fieldBar-selectField-inputField-title">Label</p>
          <UITextArea
            value={field.placeholder}
            placeholder="Enter your custom label here"
            onChange={event => handlePlaceholderChange(event.target.value)}
            onFocus={onStartInputTyping}
            onBlur={onStopInputTyping}
          />
        </div>
      )}
      {field.type !== DocumentFieldTypes.Name && (
        <div className="interactModal__fieldBar-selectField-checkbox">
          <UICheckbox
            handleClick={handleFieldRequiretyChange}
            check={required}
            label="Required"
          />
        </div>
      )}
      {field.type === DocumentFieldTypes.Checkbox && !signer?.isPreparer && (
        <div className="interactModal__fieldBar-selectField-checkbox">
          <UICheckbox
            handleClick={handleFieldCheckedChange}
            check={!!checked}
            label="Checked by default"
          />
        </div>
      )}
      {field.type === DocumentFieldTypes.Initials && signer?.isPreparer && (
        <div className="interactModal__fieldBar-selectField-checkbox">
          <UICheckbox
            handleClick={handleFieldMinimizeWidthChange}
            check={!!minimizeWidth}
            label="Minimize width"
          />
        </div>
      )}
      {field.type !== DocumentFieldTypes.Signature &&
        field.type !== DocumentFieldTypes.Initials &&
        document?.type === DocumentTypes.TEMPLATE && (
          <div className="interactModal__fieldBar-selectField-inputField">
            <p className="interactModal__fieldBar-selectField-inputField-title">Tag</p>
            <UITextInput
              value={field.tag || ''}
              placeholder="Tag"
              error={isTagInvalid}
              onChange={event => handleTagFieldChange(event.target.value)}
              onFocus={onStartInputTyping}
              onBlur={onStopInputTyping}
            />
            {showTagHint && (
              <p className="interactModal__fieldBar-selectField-inputField-hint">
                We recommend you to adjust font size and field size with example value in
                placeholder. When you&apos;re using API to fill this fields, we don&apos;t
                automatically adjust font size or field size.
              </p>
            )}
          </div>
        )}
    </li>
  );
};

export default FieldItemOptions;
