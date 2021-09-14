import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ReactModal from 'react-modal';
import interact from 'interactjs';
import classNames from 'classnames';
import uuid from 'uuid/v4';
import { minBy } from 'lodash';
import Interact from 'Services/Interact';
import Toast from 'Services/Toast';
import { fontFamilyByValue } from 'Services/Fonts';
import {
  useDocumentInteractInit,
  useDocumentUpdateCancel,
  useDocumentUpdate,
} from 'Hooks/Document';
import {
  useDocumentFieldCreate,
  useDocumentFieldDelete,
  useDocumentFieldHistory,
  useDocumentFieldUpdate,
  useDocumentFieldUpdateLocally,
} from 'Hooks/DocumentFields';
import { useModal } from 'Hooks/Common';
import {
  selectDocumentFields,
  selectDocument,
  selectDocumentSignerOptions,
  selectUser,
  selectAvailableSignatureTypes,
} from 'Utils/selectors';
import { getCurrentDate, checkIfDateOrText, isRequisite } from 'Utils/functions';
import {
  RequisiteType,
  Requisite,
  defaultRequisiteTypesOrder,
} from 'Interfaces/Requisite';
import { Document, DocumentTypes, Signer } from 'Interfaces/Document';
import {
  DocumentFieldTypes,
  DocumentField,
  DocumentFieldAddType,
  DocumentFieldUpdatePayload,
  DocumentFieldsCRUDMeta,
} from 'Interfaces/DocumentFields';
import { PDFMetadata } from 'Interfaces/Common';
import { User } from 'Interfaces/User';
import { INTERACT_SIZES } from './common/constants';
import { calculateSizeRatio } from './common/utils';
import { defaultSizesByFieldType, fieldShapes } from './common/fieldShapes';

import UISpinner from 'Components/UIComponents/UISpinner';
import UIProgressBar from 'Components/UIComponents/UIProgressBar';
import { DocumentPage } from 'Components/DocumentPage';
import { RequisiteSelectModal } from 'Components/RequisiteComponents';
import FieldBarItem from './components/FieldBarItem';
import FieldItemOptions from './components/FieldItemOptions';
import FieldItemView from './components/FieldItemView';
import ModalHeader from './components/ModalHeader';
import DocumentNavigationItem from './components/DocumentNavigationItem';
import FieldItem from './components/FieldItem';
import { DocumentActions } from 'Components/DocumentForm/DocumentForm';
import History from 'Services/History';
import { UnregisterCallback } from 'history';
import * as _ from 'lodash';
import MeOptionModal from './components/MeOptionModal';

export interface InteractModalProps {
  documentId: Document['id'];
  onClose: () => void;
  handleSubmit: (...args: any[]) => void;
  submitting?: boolean;
  buttonSendTitle?: DocumentActions;
}

enum DocumentFieldActions {
  CREATE = 'create',
  UPDATE = 'update',
}

interface DocumentFieldAction<T extends DocumentFieldActions> {
  type: T;
  payload: T extends DocumentFieldActions.CREATE
    ? DocumentField
    : DocumentFieldUpdatePayload;
  meta?: DocumentFieldsCRUDMeta;
}

function InteractModal({
  documentId,
  onClose,
  handleSubmit,
  submitting,
  buttonSendTitle,
}: InteractModalProps) {
  const currentDocument = useSelector(state => selectDocument(state, { documentId }));
  const [redoDocumentFieldAction, undoDocumentFieldAction] = useDocumentFieldHistory();

  const pdfPageMeta = useMemo(() => {
    const parts = currentDocument?.parts || [];
    const mergedMetadata = {};

    const metadatas = _.orderBy(parts, 'order').reduce((mergedMetadata, part) => {
      const pdfMetadata = part.pdfMetadata || {};

      const partMetadata = Object.keys(pdfMetadata)
        .filter(key => key !== 'pages')
        .map(key => pdfMetadata[key]);

      return [...mergedMetadata, ...partMetadata];
    }, [] as PDFMetadata[]);

    metadatas.forEach((v, i) => {
      mergedMetadata[i + 1] = {
        ...v,
        pageNumber: i + 1,
      };
    });

    mergedMetadata['pages'] = metadatas.length;

    return mergedMetadata as PDFMetadata;
  }, [currentDocument]);

  const greaterWidthMetadata = useMemo(() => {
    return Object.values(pdfPageMeta).reduce(
      (greaterWidth, pageMetadata) => {
        return greaterWidth.width < pageMetadata.width ? pageMetadata : greaterWidth;
      },
      { width: 0 },
    );
  }, [pdfPageMeta]);

  const sizeRatio = useMemo(() => calculateSizeRatio(greaterWidthMetadata), [
    greaterWidthMetadata,
  ]);

  const signersOptions = useSelector(state =>
    selectDocumentSignerOptions(state, { documentId }),
  );

  const [selectedScale, setSelectedScale] = useState(1);
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);
  const [documentScale, setDocumentScale] = useState(sizeRatio || selectedScale);
  const [pages, setPages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loadedPagesCount, setLoadedPagesCount] = useState(0);
  const [selectedFieldType, setSelectedFieldType] = useState<DocumentFieldTypes>(
    DocumentFieldTypes.Signature,
  );
  const [lastInteractedFieldId, setLastInteractedFieldId] = useState<string | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [currentFieldAction, setCurrentFieldAction] = useState<
    DocumentFieldAction<DocumentFieldActions> | undefined
  >();
  const [meOptionSelected, setMeOptionSelected] = useState(false);

  const documentOffset = useMemo(() => {
    return sizeRatio && sizeRatio < 1 && selectedScale === 1
      ? `translateX(-${((1 - sizeRatio) / (2 * sizeRatio)) * 100}%)`
      : '';
  }, [selectedScale, sizeRatio]);

  const [openMeOptionModal, closeMeOptionModal] = useModal(() => (
    <MeOptionModal onClose={closeMeOptionModal} />
  ));

  const [
    isAbleToDeleteLastInteractedField,
    setIsAbleDeleteLastInteractedField,
  ] = useState(true);

  const unblockHistoryCallback = useRef<UnregisterCallback>();

  const [clipboard, setClipboard] = useState<DocumentField | null>(null);
  const [initDocumentInteract, isDocumentInteractLoading] = useDocumentInteractInit();
  const createDocumentField = useDocumentFieldCreate();
  const deleteDocumentField = useDocumentFieldDelete();
  const updateDocumentField = useDocumentFieldUpdate();
  const updateDocumentFieldLocally = useDocumentFieldUpdateLocally();
  const cancelDocumentUpdate = useDocumentUpdateCancel();
  const [updateDocument, isSaving] = useDocumentUpdate();
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const documentViewRef = useRef<HTMLDivElement>(null);

  const { lastInteractedField, lastInteractedFieldSigner } = useMemo(() => {
    const field = documentFields.find(
      documentField => documentField.id === lastInteractedFieldId,
    );
    const signer = currentDocument?.signers.find(signer => signer.id === field?.signerId);

    return { lastInteractedField: field, lastInteractedFieldSigner: signer };
  }, [currentDocument, documentFields, lastInteractedFieldId]);

  const { dateFormat }: User = useSelector(selectUser);
  const availableSignatureTypes = useSelector(selectAvailableSignatureTypes);

  useEffect(() => {
    return () => {
      cancelDocumentUpdate();
    };
  }, [documentId, cancelDocumentUpdate]);

  useEffect(() => {
    const callback = History.block('All changes will be lost');
    unblockHistoryCallback.current = callback;

    return () => {
      unblockHistoryCallback.current && unblockHistoryCallback.current();
    };
  }, [unblockHistoryCallback]);

  const setConvertedDocument = useCallback(async () => {
    try {
      if (!currentDocument) {
        return Toast.error('Document not found');
      }

      const [pages, previews] = await initDocumentInteract({
        document: currentDocument,
        pickPreviews: true,
      });

      setPages(pages);
      setPreviews(previews);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [initDocumentInteract, currentDocument]);

  const getFieldPageComponent = useCallback(
    (pageNumber: DocumentField['pageNumber']) => {
      const pagesContainerComponent = pagesContainerRef.current as HTMLElement;

      return pagesContainerComponent.children[pageNumber] as HTMLElement;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagesContainerRef.current],
  );

  const newFieldSigner = useMemo(
    () =>
      currentDocument?.signers.reduce((accumSigner, signer) => {
        if (lastInteractedFieldSigner && !lastInteractedFieldSigner.isPreparer) {
          return lastInteractedFieldSigner;
        }

        if (!accumSigner || accumSigner.isPreparer) return signer;

        return accumSigner;
      }, undefined as Signer | undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument?.signers, lastInteractedFieldSigner],
  );

  const [openRequisiteSelectModal, closeRequisiteSelectModal, isModalOpen] = useModal(
    () => (
      <RequisiteSelectModal
        onClose={() => {
          setCurrentFieldAction(undefined);
          closeRequisiteSelectModal();
        }}
        type={
          currentFieldAction?.payload?.type === DocumentFieldTypes.Signature
            ? RequisiteType.SIGN
            : RequisiteType.INITIAL
        }
        availableSignatureTypes={
          currentFieldAction?.payload?.availableSignatureTypes ||
          defaultRequisiteTypesOrder
        }
        onSelect={(requisite: Requisite) => {
          if (!currentFieldAction) return;

          setCurrentFieldAction({
            ...currentFieldAction,
            payload: {
              ...currentFieldAction.payload,
              requisiteId: requisite.id,
            },
          });
          closeRequisiteSelectModal();
        }}
      />
    ),
    [currentFieldAction],
  );

  const setFieldCreateAction = useCallback(
    (fieldData: DocumentFieldAddType, meta?: DocumentFieldsCRUDMeta) => {
      const { type } = fieldData;
      const isDateOrText = checkIfDateOrText(type);
      const defaultSizes = defaultSizesByFieldType[type];
      const fieldPageComponent = getFieldPageComponent(fieldData.pageNumber - 1);
      const fontStyles = isDateOrText
        ? {
            fontSize: 14,
            fontFamily: 'arial',
          }
        : undefined;
      const coordinateX =
        fieldData.coordinateX + defaultSizes.width > fieldPageComponent.clientWidth
          ? fieldData.coordinateX -
            (fieldData.coordinateX + defaultSizes.width - fieldPageComponent.clientWidth)
          : fieldData.coordinateX;
      const coordinateY =
        fieldData.coordinateY + defaultSizes.height > fieldPageComponent.clientHeight
          ? fieldData.coordinateY -
            (fieldData.coordinateY +
              defaultSizes.height -
              fieldPageComponent.clientHeight)
          : fieldData.coordinateY;
      const newField: DocumentField = {
        id: uuid(),
        documentId,
        dateFormat: fieldData.type === DocumentFieldTypes.Date ? dateFormat : null,
        requisiteId: null,
        availableSignatureTypes:
          fieldData.type === DocumentFieldTypes.Signature
            ? availableSignatureTypes
            : null,
        checked:
          fieldData.type === DocumentFieldTypes.Checkbox
            ? newFieldSigner?.isPreparer
            : null,
        ...fontStyles,
        ...defaultSizes,
        ...fieldData,
        text:
          fieldData.type === DocumentFieldTypes.Date && newFieldSigner?.isPreparer
            ? getCurrentDate(dateFormat)
            : undefined,
        signerId: newFieldSigner?.id || null,
        coordinateX,
        coordinateY,
        required: true,
        style: {
          maxWidth: fieldPageComponent.clientWidth,
          maxHeight: fieldPageComponent.clientHeight,
          width: defaultSizes.width,
          height: defaultSizes.height,
          fontSize: fontStyles?.fontSize,
          fontFamily: fontFamilyByValue[fontStyles?.fontFamily as string],
          ...fieldData.style,
          left: coordinateX + fieldPageComponent.offsetLeft,
          top: coordinateY + fieldPageComponent.offsetTop,
        },
      };

      setCurrentFieldAction({
        type: DocumentFieldActions.CREATE,
        payload: newField,
        meta,
      });
    },
    [
      getFieldPageComponent,
      documentId,
      dateFormat,
      availableSignatureTypes,
      newFieldSigner,
    ],
  );

  const setFieldUpdateAction = useCallback(
    (payload: DocumentFieldUpdatePayload, meta?: DocumentFieldsCRUDMeta) => {
      let sizePayload = {};

      if (payload.width && payload.coordinateX && payload.pageNumber) {
        const fieldPageComponent = getFieldPageComponent(payload.pageNumber - 1);
        const newWidth =
          payload.coordinateX + payload.width > fieldPageComponent.clientWidth
            ? fieldPageComponent.clientWidth - payload.coordinateX
            : payload.width;

        sizePayload = {
          width: newWidth,
          style: {
            width: newWidth,
          },
        };
      }

      setCurrentFieldAction({
        type: DocumentFieldActions.UPDATE,
        payload: { ...payload, ...sizePayload },
        meta,
      });
    },
    [getFieldPageComponent],
  );

  const addField = useCallback(
    (action: DocumentFieldAction<DocumentFieldActions.CREATE>) => {
      createDocumentField(action.payload, action.meta);
      setLastInteractedFieldId(action.payload.id);
    },
    [createDocumentField],
  );

  const updateField = useCallback(
    (action: DocumentFieldAction<DocumentFieldActions.UPDATE>) => {
      updateDocumentField(action.payload, action.meta);
    },
    [updateDocumentField],
  );

  const executeCurrentFieldAction = useCallback(
    (action: DocumentFieldAction<DocumentFieldActions>) => {
      switch (action.type) {
        case DocumentFieldActions.CREATE: {
          return addField(action as DocumentFieldAction<DocumentFieldActions.CREATE>);
        }
        case DocumentFieldActions.UPDATE: {
          return updateField(action as DocumentFieldAction<DocumentFieldActions.UPDATE>);
        }
        default:
          return;
      }
    },
    [addField, updateField],
  );

  useEffect(() => {
    if (!currentFieldAction || !currentDocument) return () => {};

    const fieldSigner = currentDocument?.signers.find(
      signer => signer.id === currentFieldAction.payload.signerId,
    );

    if (
      currentFieldAction.payload.type &&
      isRequisite(currentFieldAction.payload.type) &&
      fieldSigner?.isPreparer &&
      !currentFieldAction.payload.requisiteId
    ) {
      return openRequisiteSelectModal();
    }

    setCurrentFieldAction(undefined);

    return executeCurrentFieldAction(currentFieldAction);
  }, [
    currentFieldAction,
    openRequisiteSelectModal,
    currentDocument,
    executeCurrentFieldAction,
  ]);

  const recalculateDocumentFieldStyles = useCallback(
    (documentField: DocumentField) => {
      const pagesContainerComponent = pagesContainerRef.current as HTMLElement;
      const fieldPageComponent = getFieldPageComponent(documentField.pageNumber - 1);

      if (!fieldPageComponent) return;

      const pageOffset =
        (greaterWidthMetadata.width - pdfPageMeta[documentField.pageNumber].width) / 2 ||
        0;

      const updatedField = {
        ...documentField,
        style: {
          ...documentField.style,
          width: documentField.width || documentField.style?.width,
          height: documentField.height || documentField.style?.height,
          maxWidth: fieldPageComponent.clientWidth,
          maxHeight: fieldPageComponent.clientHeight,
          left:
            documentField.coordinateX + pagesContainerComponent.offsetLeft + pageOffset,
          top: documentField.coordinateY + fieldPageComponent.offsetTop,
          fontFamily: documentField.fontFamily
            ? fontFamilyByValue[documentField.fontFamily]
            : undefined,
          fontSize: documentField.fontSize || undefined,
        },
      };

      updateDocumentFieldLocally(updatedField);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateDocumentFieldLocally, pagesContainerRef.current],
  );

  useEffect(() => {
    if (pagesContainerRef.current) {
      documentFields.forEach(recalculateDocumentFieldStyles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesContainerRef.current]);

  const handleDocumentScaleChange = useCallback(
    (nextDocumentScale: number) => {
      if (documentViewRef.current) {
        documentViewRef.current.scrollTop = Math.round(
          (documentViewRef.current.scrollTop / documentScale) * nextDocumentScale,
        );
      }

      documentFields.forEach(recalculateDocumentFieldStyles);

      if (sizeRatio) {
        setDocumentScale(sizeRatio * nextDocumentScale);
        setSelectedScale(nextDocumentScale);
      }
    },
    [documentFields, documentScale, recalculateDocumentFieldStyles, sizeRatio],
  );

  const navigateToPage = useCallback(
    previewNumber => {
      const targetPage = pagesContainerRef.current?.childNodes[
        previewNumber
      ] as HTMLDivElement;

      targetPage.scrollIntoView({
        behavior: 'smooth',
      });
    },
    [pagesContainerRef],
  );

  const changeFieldPositionInvalidity = useCallback((event, invalidPosition: boolean) => {
    const targetFieldNode = event.dragEvent.target as HTMLDivElement;

    if (invalidPosition) {
      targetFieldNode.classList.add('fieldDropDown--invalid');
    } else {
      targetFieldNode.classList.remove('fieldDropDown--invalid');
    }
  }, []);

  const handleFieldDropOnPageContainer = useCallback(
    event => {
      changeFieldPositionInvalidity(event, false);

      const targetFieldNode = event.dragEvent.target as HTMLDivElement;
      const isClone = targetFieldNode.getAttribute('clone') === 'true';

      if (isClone) {
        return targetFieldNode.remove();
      }

      const targetFieldId = targetFieldNode.id;
      const targetDocumentField = documentFields.find(
        documentField => documentField.id === targetFieldId,
      ) as DocumentField;
      const targetFieldStyles = targetDocumentField?.style;

      if (targetFieldStyles?.left) {
        targetFieldNode.style.left = `${targetFieldStyles.left}px`;
        targetFieldNode.setAttribute('coord-x', targetFieldStyles.left.toString());
      }

      if (targetFieldStyles?.top) {
        targetFieldNode.style.top = `${targetFieldStyles.top}px`;
        targetFieldNode.setAttribute('coord-y', targetFieldStyles.top.toString());
      }
    },
    [changeFieldPositionInvalidity, documentFields],
  );

  const handleFieldDropOnPage = useCallback(
    (event, pageNumber: number) => {
      const { dragEvent, target: targetPage } = event;
      const targetFieldNode = dragEvent.target as HTMLElement;
      const fieldRect = interact.getElementRect(targetFieldNode);
      const dropzoneRect = interact.getElementRect(event.target);
      const isClone = targetFieldNode.getAttribute('clone') === 'true';
      const documentView = documentViewRef.current;
      const offsetX = Math.abs(fieldRect.left - dropzoneRect.left) / documentScale;
      const offsetY = Math.abs(fieldRect.top - dropzoneRect.top) / documentScale;
      const positioning = {
        coordinateX: offsetX,
        coordinateY: offsetY,
        style: {
          left: offsetX + targetPage.offsetLeft,
          top: offsetY + targetPage.offsetTop,
        },
      };

      if (isClone && documentView) {
        const type = targetFieldNode.getAttribute('field-type') as DocumentFieldTypes;

        setFieldCreateAction({
          signerId: null,
          required: false,
          type,
          pageNumber: pageNumber + 1,
          ...positioning,
        });

        return targetFieldNode.remove();
      }

      const targetFieldId = targetFieldNode.id;
      const targetField = documentFields.find(
        documentField => documentField.id === targetFieldId,
      ) as DocumentField;

      setFieldUpdateAction({
        ...targetField,
        pageNumber: pageNumber + 1,
        ...positioning,
        style: {
          ...targetField.style,
          ...positioning.style,
        },
      });
    },
    [
      setFieldCreateAction,
      setFieldUpdateAction,
      documentFields,
      documentViewRef,
      documentScale,
    ],
  );

  const handleFieldBarItemCursorMove = useCallback(
    (event, fieldType: DocumentFieldTypes) => {
      const { interaction } = event;

      if (
        interaction.pointerIsDown &&
        !interaction.interacting() &&
        containerRef.current
      ) {
        const { target, offsetX: pointerX, offsetY: pointerY } = event;
        const { width, height } = defaultSizesByFieldType[fieldType];
        const draggable = document.createElement('div');
        containerRef.current.appendChild(draggable);
        const isDateOrText = checkIfDateOrText(fieldType);

        ReactDOM.render(
          <FieldItemView
            clone="true"
            fieldType={fieldType}
            className={fieldType}
            style={{
              left: target.offsetLeft + pointerX - (width * documentScale) / 2,
              top: target.offsetTop + pointerY - (height * documentScale) / 2,
              userSelect: 'none',
              [isDateOrText ? 'minWidth' : 'width']: width,
              [isDateOrText ? 'minHeight' : 'height']: height,
              transform: `scale(${documentScale})`,
              transformOrigin: 'top left',
            }}
          />,
          draggable,
        );

        const dragStartEvent = new PointerEvent('pointerdown', {
          bubbles: true,
          ...event,
        });

        draggable.firstChild?.dispatchEvent(dragStartEvent);
      }
    },
    [documentScale],
  );

  useEffect(() => {
    setConvertedDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const draggableFieldItem = interact(`div[clone=true]`)
      .draggable({
        onmove: Interact.dragMoveListener,
      })
      .on('down', event => {
        const { interaction } = event;

        interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
      });

    return () => draggableFieldItem.unset();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const listeners = interact(containerRef.current).dropzone({
        overlap: 0,
        ondragenter: event => changeFieldPositionInvalidity(event, true),
        ondragleave: event => changeFieldPositionInvalidity(event, false),
        ondrop: handleFieldDropOnPageContainer,
      });

      return () => listeners.unset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    changeFieldPositionInvalidity,
    handleFieldDropOnPageContainer,
    documentFields,
    containerRef.current,
  ]);

  const handleSignerChange = (signerId: string) => {
    signersOptions.forEach(signer => {
      if (signer.value === signerId && signer.label === 'Me (now)') {
        if (!meOptionSelected) {
          openMeOptionModal();
          setMeOptionSelected(true);
        }
      }
    });
  };

  const handleDocumentFieldsSubmit = useCallback(async () => {
    try {
      if (currentDocument) {
        const updateValues = {
          documentId: documentId,
          fields: documentFields,
          type: currentDocument.type,
        };

        await updateDocument({ values: updateValues, query: { log: true } });
        unblockHistoryCallback.current && unblockHistoryCallback.current();
        await handleSubmit();

        Toast.success('Document successfully saved!');
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    currentDocument,
    documentId,
    documentFields,
    updateDocument,
    unblockHistoryCallback,
    handleSubmit,
  ]);

  const handlePageTap = useCallback(
    (event, pageNumber: number) => {
      setLastInteractedFieldId(null);

      if (selectedFieldType) {
        setFieldCreateAction({
          signerId: null,
          type: selectedFieldType,
          required: false,
          coordinateX: event.offsetX,
          coordinateY: event.offsetY,
          pageNumber: pageNumber + 1,
          style: {
            left: event.offsetX + event.currentTarget.offsetLeft,
            top: event.offsetY + event.currentTarget.offsetTop,
          },
        });
      }
    },
    [selectedFieldType, setFieldCreateAction],
  );

  const incrementLoadedPagesCount = useCallback(
    () => setLoadedPagesCount(loadedPagesCount + 1),
    [loadedPagesCount],
  );

  const isPreparingInteract = useMemo(() => loadedPagesCount !== pages.length, [
    loadedPagesCount,
    pages.length,
  ]);

  const percentageLoadedPages = useMemo(() => 100 * (loadedPagesCount / pages.length), [
    loadedPagesCount,
    pages.length,
  ]);

  const lowScale = useMemo(() => documentScale < 1, [documentScale]);

  const copyDocumentField = useCallback(() => {
    const activeField = documentFields.find(
      documentField => documentField.id === lastInteractedFieldId,
    );

    setClipboard(activeField || null);
  }, [documentFields, lastInteractedFieldId]);

  const deleteLastInteractedField = useCallback(() => {
    if (
      lastInteractedFieldSigner?.isPreparer &&
      focusedFieldId === lastInteractedFieldId &&
      (lastInteractedField?.type === DocumentFieldTypes.Text ||
        lastInteractedField?.type === DocumentFieldTypes.Date)
    ) {
      return;
    }

    if (lastInteractedFieldId) {
      deleteDocumentField({ id: lastInteractedFieldId });
    }
  }, [
    deleteDocumentField,
    focusedFieldId,
    lastInteractedField,
    lastInteractedFieldId,
    lastInteractedFieldSigner,
  ]);

  const handleBlur = useCallback(() => {
    setFocusedFieldId(null);
  }, []);

  const getPagesRects = useCallback(() => {
    if (pagesContainerRef.current) {
      const pages = [...new Array(pagesContainerRef.current.children.length)];
      return pages.map((item, index) => {
        return interact.getElementRect(
          pagesContainerRef.current?.children[index] as HTMLElement,
        );
      });
    }
  }, [pagesContainerRef]);

  const getDocumentViewCenter = useCallback(() => {
    if (documentViewRef.current) {
      const documentViewRect = interact.getElementRect(documentViewRef.current);

      return documentViewRect.top + documentViewRect.height / 2;
    }
  }, [documentViewRef]);

  const findPageClosestToCenter = useCallback(() => {
    const pagesRects = getPagesRects();
    if (pagesRects) {
      const pagesCenters = pagesRects
        .map((pageRect, index) => {
          return {
            index,
            center: pageRect.top + pageRect.height / 2,
          };
        })
        .filter(page => page.center > 0);
      const documentViewCenter = getDocumentViewCenter() as number;

      return minBy(pagesCenters, page =>
        Math.abs(documentViewCenter - page.center),
      ) as typeof pagesCenters[0];
    }
  }, [getPagesRects, getDocumentViewCenter]);

  const pasteDocumentField = useCallback(() => {
    if (clipboard && documentViewRef.current && pagesContainerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...fieldData } = clipboard;
      const closestPage = findPageClosestToCenter();

      if (!closestPage) return;

      const pageComponent = getFieldPageComponent(closestPage.index);
      const pageCenterX = pageComponent.clientWidth / 2 - (fieldData.width as number) / 2;
      const pageCenterY =
        pageComponent.clientHeight / 2 - (fieldData.height as number) / 2;

      setFieldCreateAction({
        ...fieldData,
        pageNumber: (closestPage?.index || 0) + 1,
        coordinateX: pageCenterX,
        coordinateY: pageCenterY,
        style: {
          ...fieldData.style,
          left: pageComponent.offsetLeft + pageCenterX,
          top: pageComponent.offsetTop + pageCenterY,
        },
      });
    }
  }, [clipboard, setFieldCreateAction, getFieldPageComponent, findPageClosestToCenter]);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (isModalOpen) {
        return;
      }

      if (
        isAbleToDeleteLastInteractedField &&
        (event.key === 'Backspace' || event.key === 'Delete')
      ) {
        return deleteLastInteractedField();
      }

      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLocaleLowerCase()) {
          case 'c': {
            return copyDocumentField();
          }
          case 'v': {
            return pasteDocumentField();
          }
          case 'z': {
            if (event.shiftKey) {
              return redoDocumentFieldAction();
            }
            return undoDocumentFieldAction();
          }
        }
      }
    },
    [
      isAbleToDeleteLastInteractedField,
      copyDocumentField,
      deleteLastInteractedField,
      isModalOpen,
      pasteDocumentField,
      redoDocumentFieldAction,
      undoDocumentFieldAction,
    ],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  return (
    <ReactModal className="interactModal" overlayClassName="modal" isOpen>
      {isDocumentInteractLoading ? (
        <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />
      ) : (
        <div ref={containerRef} className="interactModal__inner">
          <ModalHeader
            handleClose={onClose}
            onScaleChange={handleDocumentScaleChange}
            documentScale={selectedScale}
            handleSubmit={handleDocumentFieldsSubmit}
            isSubmitting={submitting}
            onCopy={copyDocumentField}
            onPaste={pasteDocumentField}
            submitButtonTitle={buttonSendTitle}
            isForm={currentDocument?.type === DocumentTypes.FORM_REQUEST}
          />
          <div className="interactModal__body">
            <aside className="interactModal__fieldBar-wrapper">
              <div className="interactModal__fieldBar">
                <div className="interactModal__fieldBar-fieldWrapper">
                  <p className="interactModal__fieldBar-fieldTitle">Fields</p>
                  <ul className="interactModal__fieldBar-fieldList">
                    {fieldShapes.map(fieldShape => (
                      <FieldBarItem
                        key={fieldShape.type}
                        selectedFieldType={selectedFieldType}
                        handleSelectField={setSelectedFieldType}
                        fieldShape={fieldShape}
                        onCursorMove={handleFieldBarItemCursorMove}
                        disabled={isPreparingInteract}
                      />
                    ))}
                  </ul>
                </div>
                {isPreparingInteract && (
                  <div className="interactModal__fieldBar-progressWrapper">
                    <div className="interactModal__fieldBar-progressInfo">
                      <p className="interactModal__fieldBar-progressInfo-title">
                        Loading pages
                      </p>
                      <p className="interactModal__fieldBar-progressInfo-count">
                        {`${loadedPagesCount} / ${pages.length}`}
                      </p>
                    </div>
                    <UIProgressBar percentage={percentageLoadedPages} />
                  </div>
                )}
                {lastInteractedField && (
                  <ul className="interactModal__fieldBar-selectField-list">
                    <FieldItemOptions
                      key={lastInteractedField.id}
                      field={lastInteractedField}
                      partisipantOptions={signersOptions}
                      onUpdate={setFieldUpdateAction}
                      onChangeSigner={handleSignerChange}
                      onDelete={deleteDocumentField}
                      onStartPlaceholderTyping={() =>
                        setIsAbleDeleteLastInteractedField(false)
                      }
                      onStopPlaceholderTyping={() =>
                        setIsAbleDeleteLastInteractedField(true)
                      }
                    />
                  </ul>
                )}
              </div>
            </aside>
            <div className="interactModal__documentView" ref={documentViewRef}>
              <div style={{ height: 0 }}>
                <div
                  className="interactModal__documentView-inner"
                  style={{
                    transform: `scale(${documentScale}) ${documentOffset}`,
                    transformOrigin: `top ${lowScale ? 'center' : 'left'}`,
                    width: greaterWidthMetadata.width,
                    margin: lowScale ? 'auto' : 0,
                  }}
                >
                  <div ref={pagesContainerRef}>
                    {pages.map((page, pageNumber) => (
                      <DocumentPage
                        className={classNames({
                          'interactModal--cursor-pointer': selectedFieldType,
                        })}
                        key={pageNumber}
                        page={page}
                        style={{
                          height: pdfPageMeta[pageNumber + 1].height,
                          width: pdfPageMeta[pageNumber + 1].width,
                          marginBottom: INTERACT_SIZES.pageMarginBottom,
                        }}
                        onLoad={incrementLoadedPagesCount}
                        onDrop={event => handleFieldDropOnPage(event, pageNumber)}
                        onTap={event => handlePageTap(event, pageNumber)}
                      />
                    ))}
                  </div>
                  {documentFields
                    .filter(field => !isEmpty(field.style))
                    .map(field => (
                      <FieldItem
                        key={field.id}
                        field={field}
                        documentScale={documentScale}
                        signersOptions={signersOptions}
                        onChangeSigner={handleSignerChange}
                        disabled={isPreparingInteract}
                        onInteract={setLastInteractedFieldId}
                        onFocus={setFocusedFieldId}
                        onBlur={handleBlur}
                        onDocumentFieldUpdate={setFieldUpdateAction}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="interactModal__documentNavigation-wrapper">
              <p className="interactModal__documentNavigation-title">
                Pages <span>({pages.length})</span>
              </p>
              <ul className="interactModal__documentNavigation">
                {previews.map((preview, previewNumber) => (
                  <DocumentNavigationItem
                    key={previewNumber}
                    page={preview}
                    pageMeta={pdfPageMeta[previewNumber + 1]}
                    fields={documentFields.filter(
                      documentField => documentField.pageNumber === previewNumber + 1,
                    )}
                    navigateToPage={() => navigateToPage(previewNumber)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </ReactModal>
  );
}

export default InteractModal;
