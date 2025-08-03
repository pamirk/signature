import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import useDropdown from 'use-dropdown';
import classNames from 'classnames';
import interact from 'interactjs';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import { fontFamilyOptions, fontFamilyByValue } from 'Services/Fonts';
import Interact from 'Services/Interact';
import {
  useDocumentFieldSignerChange,
  useDocumentFieldColor,
} from 'Hooks/DocumentFields';
import { isCheckbox, isRequisite } from 'Utils/functions';
import { selectRequisite, selectDocument } from 'Utils/selectors';
import { DatePipeOptions, SelectableOption } from 'Interfaces/Common';
import {
  DocumentField,
  DocumentFieldTypes,
  DocumentFieldUpdatePayload,
  DocumentFieldsCRUDMeta,
} from 'Interfaces/DocumentFields';
import {
  RequisiteType,
  Requisite,
  defaultRequisiteTypesOrder,
  SelectedSignature,
} from 'Interfaces/Requisite';
import { Signer } from 'Interfaces/Document';
import { getMinSize, fieldHasValue } from '../common/utils';

import UICheckbox from 'Components/UIComponents/UICheckbox';
import UISelect from 'Components/UIComponents/UISelect';
import { RequisiteSelectModal } from 'Components/RequisiteComponents';
import { CheckboxField, RequisiteField, DateField, TextFieldSign } from './FieldTypes';
import FieldItemView from './FieldItemView';
import NameField from './FieldTypes/NameField';

export enum InteractModes {
  PREPARING = 'preparing',
  SIGNING = 'signing',
}

export enum FieldModalPosition {
  BOTTOM = 'bottom',
  LEFT = 'left',
  TOP = 'top',
  TOP_LEFT = 'top-left',
}

export interface FieldItemProps {
  field: DocumentField;
  inFocus?: boolean;
  signersOptions?: SelectableOption<string>[];
  onChangeSigner: (signerId: string) => void;
  documentScale: number;
  onDocumentFieldUpdate?: (
    documentField: DocumentFieldUpdatePayload,
    meta?: DocumentFieldsCRUDMeta,
  ) => void;
  onFocus?: (id: string) => void;
  onBlur?: (id: string) => void;
  interactMode?: InteractModes;
  disabled?: boolean;
  isResizable?: boolean;
  onInteract?: (fieldId: DocumentField['id']) => void;
  lastSelectedSignature?: SelectedSignature | null;
  setLastSelectedSignature?: (signature: SelectedSignature) => void;
  isFontResize?: boolean;
  selectedScale?: number;
}

function FieldItem({
  field,
  inFocus,
  onFocus,
  onBlur,
  signersOptions = [],
  onChangeSigner,
  documentScale,
  interactMode = InteractModes.PREPARING,
  disabled,
  onInteract,
  isResizable = true,
  onDocumentFieldUpdate,
  lastSelectedSignature,
  setLastSelectedSignature,
  isFontResize = true,
  selectedScale = 1,
}: FieldItemProps) {
  const {
    id,
    width,
    dateFormat,
    type,
    checked,
    height,
    fontFamily,
    fixedFontSize,
    signerId,
    required,
    style,
    pageNumber,
    text,
    placeholder,
    requisiteId,
    createType,
    minimizeWidth,
  } = field;
  const { isCheckboxType, isRequisiteType } = useMemo(() => {
    const isRequisiteType = isRequisite(type);
    const isCheckboxType = isCheckbox(type);

    return {
      isRequisiteType,
      isCheckboxType,
    };
  }, [type]);

  const [containerRef, isMenuOpen, openMenu] = useDropdown();
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const changeDocumentFieldSigner = useDocumentFieldSignerChange(field);
  const [dropdownMenuClassName, setDropdownMenuClassName] = useState(
    'fieldDropDown__content-wrapper--bottom',
  );

  const [fieldModalPosition, setFieldModalPosition] = useState<FieldModalPosition>(
    FieldModalPosition.BOTTOM,
  );

  const requisite: ReturnType<typeof selectRequisite> = useSelector(state =>
    selectRequisite(state, { requisiteId: field.requisiteId || '' }),
  );

  const getRelatedPage = useCallback(
    (): HTMLElement =>
      containerRef.current.parentNode.firstChild?.childNodes[pageNumber - 1],
    [containerRef, pageNumber],
  );

  const updateDocumentField = useCallback(
    (payload: Omit<DocumentFieldUpdatePayload, 'id'>, meta?: DocumentFieldsCRUDMeta) => {
      onDocumentFieldUpdate &&
        onDocumentFieldUpdate({ id: field.id, ...payload, type }, meta);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field.id, onDocumentFieldUpdate],
  );

  const updateDocumentRequisiteField = useCallback(
    (payload: Omit<DocumentFieldUpdatePayload, 'id'>, meta?: DocumentFieldsCRUDMeta) => {
      const { x: coordinateX } = Interact.getNodeCoords(containerRef.current);

      onDocumentFieldUpdate &&
        onDocumentFieldUpdate(
          {
            id: field.id,
            coordinateX: coordinateX - getRelatedPage().offsetLeft,
            pageNumber: field.pageNumber,
            ...payload,
            type,
          },
          meta,
        );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field.id, onDocumentFieldUpdate],
  );
  const document: ReturnType<typeof selectDocument> = useSelector(state =>
    selectDocument(state, { documentId: field.documentId }),
  );

  const signer = useMemo(() => {
    const signer = document?.signers.find(signer => signer.id === signerId) as Signer;

    return signer;
  }, [document, signerId]);

  const fieldColor = useDocumentFieldColor(signer, interactMode);

  const isPreparer = useMemo(() => !!signer?.isPreparer, [signer]);
  const handleFocus = useCallback(() => {
    onFocus && onFocus(field.id);
  }, [field.id, onFocus]);

  const handleBlur = useCallback(() => {
    onBlur && onBlur(field.id);
  }, [field.id, onBlur]);

  const { viewStyles, textStyles } = useMemo(() => {
    if (!style) return { viewStyles: {}, textStyles: {} };

    const { fontSize, fontFamily, ...viewStyles } = style;

    return {
      viewStyles,
      textStyles: {
        fontSize: fontSize || 8,
        fontFamily,
      },
    };
  }, [style]);

  const handleRequisiteAssign = useCallback(
    (requisite: Requisite) => {
      if (setLastSelectedSignature) {
        setLastSelectedSignature({
          id:
            field.type === DocumentFieldTypes.Signature
              ? requisite.id
              : requisite.siblingId,
          siblingId:
            field.type === DocumentFieldTypes.Initials
              ? requisite.id
              : requisite.siblingId,
        });
      }

      updateDocumentField({
        requisiteId: requisite.id,
      });
    },
    [field.type, setLastSelectedSignature, updateDocumentField],
  );

  const [openRequisiteSelectModal, closeRequisiteSelectModal] = useModal(
    () => (
      <RequisiteSelectModal
        signer={signer}
        onClose={closeRequisiteSelectModal}
        type={
          field.type === DocumentFieldTypes.Signature
            ? RequisiteType.SIGN
            : RequisiteType.INITIAL
        }
        availableSignatureTypes={
          field.availableSignatureTypes || defaultRequisiteTypesOrder
        }
        onSelect={(requisite: Requisite) => {
          handleRequisiteAssign(requisite);
          closeRequisiteSelectModal();
        }}
      />
    ),
    [handleRequisiteAssign, requisiteId],
  );

  const modifyDropDownMenu = useCallback(() => {
    if (dropdownMenuRef.current && containerRef.current) {
      const containerRect = interact.getElementRect(containerRef.current.parentNode);
      const triggerRect = interact.getElementRect(containerRef.current);
      const dropdownMenuRect = interact.getElementRect(dropdownMenuRef.current);
      const escapeRight =
        containerRect.right < triggerRect.left + dropdownMenuRect.width * selectedScale;
      const escapeBottom =
        containerRect.bottom <
        triggerRect.bottom + dropdownMenuRect.height * selectedScale + 20 * documentScale;

      const isOverflowX =
        containerRect.bottom < dropdownMenuRect.height * (1 / selectedScale);
      const isOverflowY =
        containerRect.right < dropdownMenuRect.width * (1 / selectedScale);

      const isOverflow = isOverflowX || isOverflowY;

      setFieldModalPosition(
        (!escapeRight && !escapeBottom) || isOverflow
          ? FieldModalPosition.BOTTOM
          : escapeRight && !escapeBottom
          ? FieldModalPosition.LEFT
          : escapeBottom && !escapeRight
          ? FieldModalPosition.TOP
          : FieldModalPosition.TOP_LEFT,
      );

      setDropdownMenuClassName(
        classNames({
          'fieldDropDown__content-wrapper--bottom':
            (!escapeRight && !escapeBottom) || isOverflow,
          'fieldDropDown__content-wrapper--left':
            escapeRight && !escapeBottom && !isOverflow,
          'fieldDropDown__content-wrapper--top':
            escapeBottom && !escapeRight && !isOverflow,
          'fieldDropDown__content-wrapper--top-left':
            escapeBottom && escapeRight && !isOverflow,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen, dropdownMenuRef, containerRef, documentScale]);

  useLayoutEffect(() => {
    modifyDropDownMenu();
  }, [modifyDropDownMenu]);

  const handleInteraction = useCallback(() => {
    onInteract && onInteract(field.id);
  }, [onInteract, field.id]);

  const toggleFieldChecked = useCallback(() => {
    updateDocumentField({ checked: !checked });
  }, [checked, updateDocumentField]);

  const imgRef = useRef<HTMLImageElement>(null);

  const setPrepareInteracting = useCallback(() => {
    const fieldContainer = containerRef.current as HTMLElement;
    const draggableContainer = fieldContainer.parentNode as HTMLElement;
    const relatedPage = getRelatedPage();
    const minimumSize = getMinSize(field.type);
    const interactable = new Interact(fieldContainer, relatedPage, draggableContainer);

    if (isCheckboxType) {
      minimumSize.width = minimumSize.height = 10;
    }

    minimumSize.width = minimumSize.width * documentScale;
    minimumSize.height = minimumSize.height * documentScale;

    const interactingOptions = isCheckboxType
      ? {
          resizableOptions: {
            modifiers: [
              interact.modifiers.aspectRatio({
                ratio: 1,
                equalDelta: true,
                modifiers: [
                  interact.modifiers.restrictSize({
                    min: minimumSize,
                  }),
                  interact.modifiers.restrictEdges({
                    outer: relatedPage,
                  }),
                ],
              }),
            ],
          },
        }
      : {
          resizableOptions: {
            restrictSize: {
              min: minimumSize,
            },
          },
        };
    const listeners = interactable
      //@ts-ignore
      .interacting(interactingOptions)
      .allowFrom(fieldContainer.firstChild as HTMLElement)
      .on('dragstart', () => {
        setIsDragging(true);
        handleInteraction();
      })
      .on('dragend', () => {
        setIsDragging(false);
      })
      .on('dragmove', event => {
        Interact.dragMoveListener(event, documentScale);
        modifyDropDownMenu();
      })
      .on('resizestart', handleInteraction)
      .on('resizemove', event => {
        Interact.resizeMoveListener(event, documentScale);
        if (
          isFontResize &&
          [
            DocumentFieldTypes.Name,
            DocumentFieldTypes.Text,
            DocumentFieldTypes.Date,
          ].includes(type)
        ) {
          Interact.rearrangeFontSizeAsync(event.target as HTMLElement, {
            checkWidth:
              type === DocumentFieldTypes.Date || type === DocumentFieldTypes.Name,
            isAsync: type === DocumentFieldTypes.Text,
          });
        }
        modifyDropDownMenu();
      })
      .on('resizeend', event => {
        const { x, y } = Interact.getNodeCoords(event.target);
        const width = event.rect.width;
        const height = event.rect.height;

        let updatePayload = {
          coordinateX: x - relatedPage.offsetLeft,
          coordinateY: y - relatedPage.offsetTop,
          width: width / documentScale,
          height: height / documentScale,
          style: {
            left: x,
            top: y,
            width: width / documentScale,
            height: height / documentScale,
          },
        } as Parameters<typeof updateDocumentField>[0];

        if (
          isFontResize &&
          [
            DocumentFieldTypes.Name,
            DocumentFieldTypes.Date,
            DocumentFieldTypes.Text,
          ].includes(type)
        ) {
          const fontSize = Interact.getNodeFontSize(event.target);
          updatePayload = {
            ...updatePayload,
            fontSize,
            style: {
              ...updatePayload.style,
              fontSize,
            },
          };
        }

        if (minimizeWidth && imgRef.current) {
          const rate = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
          const minimizedWidth = (height / documentScale) * rate;

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (minimizedWidth < updatePayload.width!) {
            updatePayload = {
              ...updatePayload,
              width: minimizedWidth,
              style: {
                ...updatePayload.style,
                width: minimizedWidth,
              },
            };
          }
        }

        updateDocumentField(updatePayload);
      })
      .on('tap', event => {
        if (event.currentTarget.id === field.id) {
          openMenu();
          handleInteraction();
        }
      })
      .on('doubletap', () => {
        if (isRequisiteType && isPreparer) {
          openRequisiteSelectModal();
        }
      });

    return listeners;
  }, [
    containerRef,
    documentScale,
    field.id,
    field.type,
    getRelatedPage,
    handleInteraction,
    isCheckboxType,
    isFontResize,
    isPreparer,
    isRequisiteType,
    modifyDropDownMenu,
    openMenu,
    openRequisiteSelectModal,
    type,
    updateDocumentField,
    minimizeWidth,
    imgRef,
  ]);

  const handleUpdateRequisisteField = useCallback(() => {
    if (!field.requisiteId && lastSelectedSignature) {
      updateDocumentField({
        requisiteId:
          field.type === DocumentFieldTypes.Signature
            ? lastSelectedSignature.id
            : lastSelectedSignature.siblingId,
      });
    } else {
      openRequisiteSelectModal();
    }
  }, [
    field.requisiteId,
    field.type,
    lastSelectedSignature,
    openRequisiteSelectModal,
    updateDocumentField,
  ]);

  const setSignInteracting = useCallback(() => {
    const fieldContainer = containerRef.current as HTMLElement;
    const interactable = new Interact(fieldContainer);
    const listeners = interactable
      .getInteractable()
      .allowFrom(fieldContainer.firstChild as HTMLElement)
      .on('click', () => {
        onFocus && onFocus(field.id);
        if (isRequisiteType) {
          handleUpdateRequisisteField();
        }
        if (isCheckboxType) {
          toggleFieldChecked();
        }
      });

    return listeners;
  }, [
    containerRef,
    field.id,
    handleUpdateRequisisteField,
    isCheckboxType,
    isRequisiteType,
    onFocus,
    toggleFieldChecked,
  ]);

  useEffect(() => {
    const fieldContainer = containerRef.current as HTMLElement;

    if (!fieldContainer || disabled) return;

    switch (interactMode) {
      case InteractModes.PREPARING: {
        const interactListeners = setPrepareInteracting();

        return () => interactListeners.unset();
      }
      case InteractModes.SIGNING: {
        const interactListeners = setSignInteracting();

        return () => interactListeners.unset();
      }
    }
  }, [containerRef, disabled, interactMode, setPrepareInteracting, setSignInteracting]);

  useEffect(() => {
    const fieldRef = textFieldRef.current || containerRef.current;
    if (fieldRef && inFocus) {
      fieldRef.focus();
    }
  }, [containerRef, inFocus]);

  const renderFieldTrigger = useCallback(() => {
    switch (type) {
      case DocumentFieldTypes.Name: {
        return (
          <NameField
            value={text}
            signer={signer}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onFieldDataChange={updateDocumentField}
            style={textStyles}
            fieldColor={fieldColor}
            isInsertable={isPreparer}
            disabled={isDragging || disabled}
          />
        );
      }
      case DocumentFieldTypes.Signature:
      case DocumentFieldTypes.Initials: {
        return (
          <RequisiteField
            disabled={isDragging || disabled}
            requisiteType={
              type === DocumentFieldTypes.Signature
                ? RequisiteType.SIGN
                : RequisiteType.INITIAL
            }
            fieldColor={fieldColor}
            signer={signer}
            requisite={requisite}
            createType={createType}
            imgRef={imgRef}
            updateField={
              interactMode === InteractModes.PREPARING
                ? updateDocumentRequisiteField
                : undefined
            }
          />
        );
      }
      case DocumentFieldTypes.Checkbox: {
        return (
          <CheckboxField
            fieldColor={fieldColor}
            disabled={isDragging || disabled}
            checked={!!checked}
          />
        );
      }
      case DocumentFieldTypes.Text: {
        return (
          <TextFieldSign
            ref={textFieldRef}
            onFieldDataChange={updateDocumentField}
            isFixedFontSize={fixedFontSize}
            value={text}
            placeholder={placeholder}
            signer={signer}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ ...textStyles, width, height }}
            fieldColor={fieldColor}
            disabled={
              isDragging ||
              disabled ||
              (interactMode === InteractModes.PREPARING && !isPreparer)
            }
          />
        );
      }
      case DocumentFieldTypes.Date: {
        const datePipeOptions: DatePipeOptions =
          interactMode === InteractModes.SIGNING
            ? { isSameOrFuture: true }
            : { minYY: 20, minYYYY: 2020 };

        return (
          <DateField
            value={text}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onFieldDataChange={updateDocumentField}
            style={textStyles}
            fieldColor={fieldColor}
            dateFormat={dateFormat as NonNullable<DocumentField['dateFormat']>}
            isInsertable={isPreparer}
            disabled={isDragging || disabled}
            datePipeOptions={datePipeOptions}
          />
        );
      }
      default: {
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    updateDocumentField,
    text,
    type,
    textStyles,
    isDragging,
    disabled,
    requisite,
    signer,
    checked,
    width,
    height,
  ]);

  const renderPartisipantsList = useCallback(
    (isCheckable: boolean) => {
      return (
        <ul className="fieldDropDown__list">
          {signersOptions.map(signerOption => (
            <li
              className={classNames('fieldDropDown__item', {
                'fieldDropDown__item--checkable': isCheckable,
                'fieldDropDown__item--active': signerId === signerOption.value,
              })}
              onClick={() => {
                const changePayload = changeDocumentFieldSigner(
                  signerOption.value as string,
                );
                onChangeSigner(signerOption.value);
                if (changePayload) updateDocumentField(changePayload);
              }}
              key={signerOption.value}
            >
              {signerOption.label}
            </li>
          ))}
        </ul>
      );
    },
    [
      signersOptions,
      signerId,
      changeDocumentFieldSigner,
      onChangeSigner,
      updateDocumentField,
    ],
  );

  const changeFontFamily = useCallback(
    fontFamily => {
      if (fontFamily)
        updateDocumentField({
          fontFamily,
          style: {
            fontFamily: fontFamilyByValue[fontFamily],
          },
        });
    },
    [updateDocumentField],
  );

  const changeFieldRequirety = useCallback(
    () => updateDocumentField({ required: !required }),
    [updateDocumentField, required],
  );

  const renderStyleSelectors = useCallback(() => {
    return (
      <div className="fieldDropDown__styles">
        <p className="fieldDropDown__styles-title">Styles</p>
        <div className="fieldDropDown__styles-select">
          <p className="fieldDropDown__styles-label">Font Family </p>
          <UISelect
            value={fontFamily || ''}
            handleSelect={changeFontFamily}
            options={fontFamilyOptions}
            placeholder="Select font family"
          />
        </div>
      </div>
    );
  }, [changeFontFamily, fontFamily]);

  const renderRequired = useCallback(() => {
    return (
      <div className="fieldDropDown__checkbox">
        <UICheckbox
          handleClick={changeFieldRequirety}
          check={required}
          label="Required"
        />
      </div>
    );
  }, [required, changeFieldRequirety]);

  const renderDefaultChecked = useCallback(
    () => (
      <div className="fieldDropDown__checkbox">
        <UICheckbox
          handleClick={toggleFieldChecked}
          check={!!checked}
          label="Checked by default"
        />
      </div>
    ),
    [checked, toggleFieldChecked],
  );

  const renderFieldMenu = useCallback(() => {
    switch (type) {
      case DocumentFieldTypes.Signature:
      case DocumentFieldTypes.Initials: {
        return (
          <div className="fieldDropDown__content-body">
            {renderPartisipantsList(true)}
            {renderRequired()}
          </div>
        );
      }
      case DocumentFieldTypes.Checkbox: {
        return (
          <div className="fieldDropDown__content-body">
            {renderPartisipantsList(true)}
            {renderRequired()}
            {!isPreparer && renderDefaultChecked()}
          </div>
        );
      }
      case DocumentFieldTypes.Name: {
        return (
          <div className="fieldDropDown__content-body">
            {renderPartisipantsList(true)}
            {renderStyleSelectors()}
          </div>
        );
      }
      case DocumentFieldTypes.Date:
      case DocumentFieldTypes.Text: {
        return (
          <div className="fieldDropDown__content-body">
            {renderPartisipantsList(true)}
            {renderStyleSelectors()}
            {renderRequired()}
          </div>
        );
      }
      default: {
        break;
      }
    }
  }, [
    type,
    renderPartisipantsList,
    renderRequired,
    isPreparer,
    renderDefaultChecked,
    renderStyleSelectors,
  ]);

  return (
    <FieldItemView
      id={id}
      isFilled={
        !!fieldHasValue(field, field.type) &&
        (interactMode === InteractModes.SIGNING || isPreparer)
      }
      inFocus={inFocus}
      fieldType={type}
      isMenuOpen={isMenuOpen}
      ref={containerRef}
      style={viewStyles}
      fieldColor={fieldColor}
      className={classNames({
        'fieldDropDown--tapable': interactMode === InteractModes.SIGNING,
        'fieldDropDown--required':
          interactMode === InteractModes.SIGNING && field.required,
      })}
      renderFieldTrigger={renderFieldTrigger}
      renderFieldMenu={renderFieldMenu}
      isResizable={isResizable && interactMode !== InteractModes.SIGNING}
      dropdownMenuRef={dropdownMenuRef}
      dropdownClassName={dropdownMenuClassName}
      selectedScale={0.9 * documentScale}
      fieldModalPosition={fieldModalPosition}
    />
  );
}

export default FieldItem;
