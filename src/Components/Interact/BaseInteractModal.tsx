import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { isEmpty, minBy, throttle } from 'lodash';
import ReactModal from 'react-modal';
import interact from 'interactjs';
import classNames from 'classnames';
import uuid from 'uuid/v4';
import Interact from 'Services/Interact';
import Toast from 'Services/Toast';
import { fontFamilyByValue } from 'Services/Fonts';
import { useDocumentFieldUpdateLocally } from 'Hooks/DocumentFields';
import { useModal } from 'Hooks/Common';
import {
  selectDocument,
  selectDocumentFields,
  selectDocumentSignerOptions,
  selectUser,
} from 'Utils/selectors';
import { checkIfDateOrText, getCurrentDate, isRequisite } from 'Utils/functions';
import {
  defaultRequisiteTypesOrder,
  Requisite,
  RequisiteType,
  RequisiteValueType,
} from 'Interfaces/Requisite';
import {
  Document,
  DocumentTypes,
  DocumentUpdatePayload,
  Signer,
} from 'Interfaces/Document';
import {
  DocumentField,
  DocumentFieldAddType,
  DocumentFieldDeletePayload,
  DocumentFieldsCRUDMeta,
  DocumentFieldTypes,
  DocumentFieldUpdatePayload,
  FieldCreateType,
} from 'Interfaces/DocumentFields';
import { DateFormats, User } from 'Interfaces/User';
import { INTERACT_SIZES } from './common/constants';
import { calculateSizeRatio } from './common/utils';
import { defaultSizesByFieldType, fieldShapes } from './common/fieldShapes';

import UISpinner from 'Components/UIComponents/UISpinner';
import UIProgressBar from 'Components/UIComponents/UIProgressBar';
import { DocumentPage } from 'Components/DocumentPage';
import { PDFDocument } from 'Components/PDFDocument';
import { RequisiteSelectModal } from 'Components/RequisiteComponents';
import FieldBarItem from './components/FieldBarItem';
import FieldItemOptions from './components/FieldItemOptions';
import FieldItemView from './components/FieldItemView';
import ModalHeader from './components/ModalHeader';
import DocumentNavigationItem from './components/DocumentNavigationItem';
import FieldItem from './components/FieldItem';
import { DocumentActions } from 'Interfaces/Document';
import History from 'Services/History';
import { UnregisterCallback } from 'history';
import MeOptionModal from './components/MeOptionModal';
import useGetPdfMetadataFromDocumentPart from 'Hooks/Document/useGetPdfMetadataFromDocumentPart';
import useIsMobile from 'Hooks/Common/useIsMobile';
import FontSizeSelect from './components/FontSizeSelect';
import FontFamilySelect from './components/FontFamilySelect';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import { DocumentFilesGetPayload } from 'Hooks/Document/useDocumentFilesGet';
import { NormalizedEntity } from 'Interfaces/Common';

export interface BaseInteractModalProps {
  documentId: Document['id'];
  onClose: () => void;
  handleSubmit: (...args: any[]) => void;
  submitting?: boolean;
  buttonSendTitle?: DocumentActions;
  createDocumentField: (
    documentField: DocumentField,
    meta?: DocumentFieldsCRUDMeta,
  ) => void;
  deleteDocumentField: (
    payload: DocumentFieldDeletePayload,
    meta?: DocumentFieldsCRUDMeta,
  ) => void;
  updateDocumentField: (
    documentField: DocumentFieldUpdatePayload,
    meta?: DocumentFieldsCRUDMeta,
  ) => void;
  updateDocument: (values: DocumentUpdatePayload) => void;
  cancelDocumentUpdate: () => void;
  isDisableCancelButton: boolean;
  isDisablePreparerSigner: boolean;
  dateFormat?: DateFormats;
  availableSignatureTypes?: RequisiteValueType[];
  initDocumentInteract: (
    payload: DocumentFilesGetPayload,
  ) => Promise<[string[], string[], {} | NormalizedEntity<Requisite>]>;
  isDocumentInteractLoading: boolean;
  redoDocumentFieldAction: () => void;
  undoDocumentFieldAction: () => void;
  isNextAvailable: boolean;
  isPrevAvailable: boolean;
  enableFullscreen?: boolean;
}

enum DocumentFieldActions {
  CREATE = 'create',
  UPDATE = 'update',
}

const ApplyFontTexts = {
  [DocumentTypes.FORM_REQUEST]: 'form',
  [DocumentTypes.TEMPLATE]: 'template',
  [DocumentTypes.ME]: 'document',
  [DocumentTypes.ME_AND_OTHER]: 'document',
  [DocumentTypes.OTHERS]: 'document',
};

interface DocumentFieldAction<T extends DocumentFieldActions> {
  type: T;
  payload: T extends DocumentFieldActions.CREATE
    ? DocumentField
    : DocumentFieldUpdatePayload;
  meta?: DocumentFieldsCRUDMeta;
}

export function BaseInteractModal({
  documentId,
  onClose,
  handleSubmit,
  submitting,
  buttonSendTitle,
  createDocumentField,
  deleteDocumentField,
  updateDocumentField,
  updateDocument,
  cancelDocumentUpdate,
  isDisableCancelButton,
  isDisablePreparerSigner,
  dateFormat,
  availableSignatureTypes,
  initDocumentInteract,
  isDocumentInteractLoading,
  redoDocumentFieldAction,
  undoDocumentFieldAction,
  isNextAvailable,
  isPrevAvailable,
  enableFullscreen = false,
}: BaseInteractModalProps) {
  const isMobile = useIsMobile();

  const currentDocument = useSelector(state => selectDocument(state, { documentId }));
  const getPdfPageMeta = useGetPdfMetadataFromDocumentPart(currentDocument as Document);

  const pdfPageMeta = useMemo(() => getPdfPageMeta(), [getPdfPageMeta]);

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
    selectDocumentSignerOptions(state, {
      documentId,
      isPreparerSigner: !isDisablePreparerSigner,
    }),
  );

  const [selectedScale, setSelectedScale] = useState(1);
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);
  const [documentScale, setDocumentScale] = useState(sizeRatio || selectedScale);
  const [pagesPerDocument, setPagesPerDocument] = useState<Record<string, number[]>>({});
  const [pdfDocumentFiles, setPdfDocumentFiles] = useState<string[]>([]);
  const [loadedPagesCount, setLoadedPagesCount] = useState(0);
  const [renderedPages, setRenderedPages] = useState<Record<number, boolean>>({});
  const [selectedFieldType, setSelectedFieldType] = useState<
    DocumentFieldTypes | undefined
  >();
  const [lastInteractedFieldId, setLastInteractedFieldId] = useState<string | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [currentFieldAction, setCurrentFieldAction] = useState<
    DocumentFieldAction<DocumentFieldActions> | undefined
  >();
  const [meOptionSelected, setMeOptionSelected] = useState(false);
  const [isFieldShapeExist, setFieldShapeExist] = useState<boolean>(false);

  const [defaultFontFamily, setDefaultFontFamily] = useState<string>('arial');
  const [defaultFontSize, setDefaultFontSize] = useState<number>(14);

  const isPageRendered = useCallback(
    (absolutePageNumber: number) => renderedPages[absolutePageNumber],
    [renderedPages],
  );

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

  const [mainFieldProps, setMainFieldProps] = useState<{
    fontSize?: number;
    fontFamily?: string;
  }>({
    fontFamily: 'arial',
    fontSize: 14,
  });
  const [clipboard, setClipboard] = useState<DocumentField | null>(null);

  const updateDocumentFieldLocally = useDocumentFieldUpdateLocally();
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const documentViewRef = useRef<HTMLDivElement>(null);
  const [enableResizeFont, setEnableResizeFont] = useState<boolean>(true);

  const { lastInteractedField, lastInteractedFieldSigner } = useMemo(() => {
    const field = documentFields.find(
      documentField => documentField.id === lastInteractedFieldId,
    );
    const signer = currentDocument?.signers.find(signer => signer.id === field?.signerId);

    return { lastInteractedField: field, lastInteractedFieldSigner: signer };
  }, [currentDocument, documentFields, lastInteractedFieldId]);

  const { name: userName } = useSelector(selectUser) as User;

  useEffect(() => {
    return () => {
      cancelDocumentUpdate();
    };
  }, [documentId, cancelDocumentUpdate, currentDocument]);

  useEffect(() => {
    unblockHistoryCallback.current = History.block('All changes will be lost');

    return () => {
      unblockHistoryCallback.current && unblockHistoryCallback.current();
    };
  }, [unblockHistoryCallback]);

  const totalPagesCount = useMemo(() => {
    return Object.values(pagesPerDocument).reduce((a, b) => a + b.length, 0);
  }, [pagesPerDocument]);

  const setConvertedDocument = useCallback(async () => {
    try {
      if (!currentDocument) {
        return Toast.error('Document not found');
      }

      const [pdfUrls] = await initDocumentInteract({
        document: currentDocument,
      });

      setPdfDocumentFiles(pdfUrls);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [currentDocument, initDocumentInteract]);

  const getFieldPageComponent = useCallback(
    (pageNumber: DocumentField['pageNumber']) => {
      const pagesContainerComponent = pagesContainerRef.current as HTMLElement;

      return pagesContainerComponent.children[pageNumber - 1] as HTMLElement;
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
      const fieldPageComponent = getFieldPageComponent(fieldData.pageNumber);

      const fontStyles = isDateOrText
        ? {
            fontSize: defaultFontSize,
            fontFamily: defaultFontFamily,
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
        text: newFieldSigner?.isPreparer
          ? fieldData.type === DocumentFieldTypes.Date
            ? getCurrentDate(dateFormat)
            : fieldData.type === DocumentFieldTypes.Name
            ? userName
            : undefined
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
          left: coordinateX + fieldPageComponent?.offsetLeft,
          top: coordinateY + fieldPageComponent?.offsetTop,
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
      defaultFontSize,
      defaultFontFamily,
      documentId,
      dateFormat,
      availableSignatureTypes,
      newFieldSigner,
      userName,
    ],
  );

  const setFieldUpdateAction = useCallback(
    (payload: DocumentFieldUpdatePayload, meta?: DocumentFieldsCRUDMeta) => {
      let sizePayload = {};

      if (payload.width && payload.coordinateX && payload.pageNumber) {
        const fieldPageComponent = getFieldPageComponent(payload.pageNumber);
        const newWidth =
          payload.coordinateX + payload.width > fieldPageComponent.clientWidth
            ? fieldPageComponent.clientWidth - payload.coordinateX
            : payload.width;

        sizePayload = {
          width: newWidth,
          style: {
            ...payload.style,
            width: newWidth,
          },
        };
      }

      if (meta?.stopFontAutoSize) {
        setEnableResizeFont(false);
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

  const handleDefaultFontSizeChange = useCallback(
    (fontSize: number | undefined | null) => {
      if (!fontSize) {
        return;
      }

      setDefaultFontSize(fontSize);
      documentFields
        .map(
          (field): DocumentFieldUpdatePayload => ({
            ...field,
            fontSize,
            style: {
              ...field.style,
              fontSize,
            },
          }),
        )
        .forEach(payload =>
          updateField({
            type: DocumentFieldActions.UPDATE,
            payload,
          }),
        );
    },
    [setDefaultFontSize, documentFields, updateField],
  );

  const handleDefaultFontFamilyChange = useCallback(
    (fontFamily: string | undefined | null) => {
      if (!fontFamily) {
        return;
      }

      setDefaultFontFamily(fontFamily);
      documentFields
        .map(
          (field): DocumentFieldUpdatePayload => ({
            ...field,
            fontFamily,
            style: {
              ...field.style,
              fontFamily: fontFamilyByValue[fontFamily],
            },
          }),
        )
        .forEach(payload =>
          updateField({
            type: DocumentFieldActions.UPDATE,
            payload,
          }),
        );
    },
    [setDefaultFontFamily, documentFields, updateField],
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

  const { isAllPdfFilesLoaded, isAllPagesRendered } = useMemo(() => {
    const isAllPdfFilesLoaded = !pdfDocumentFiles.find(
      pdfFile => !pagesPerDocument[pdfFile],
    );

    let isAllPagesRendered = false;
    if (isAllPdfFilesLoaded) {
      const renderedPagesCount = Object.values(renderedPages).filter(Boolean).length;
      isAllPagesRendered = renderedPagesCount === totalPagesCount;
    }

    return { isAllPdfFilesLoaded, isAllPagesRendered };
  }, [pagesPerDocument, pdfDocumentFiles, renderedPages, totalPagesCount]);

  const recalculateDocumentFieldStyles = useCallback(
    (documentField: DocumentField) => {
      const pagesContainerComponent = pagesContainerRef.current as HTMLElement;
      const fieldPageComponent = getFieldPageComponent(documentField.pageNumber);
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
    if (pagesContainerRef.current && isAllPdfFilesLoaded && isAllPagesRendered) {
      documentFields.forEach(recalculateDocumentFieldStyles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesContainerRef.current, isAllPdfFilesLoaded, isAllPagesRendered]);

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
    absolutePageNumber => {
      const targetPage = pagesContainerRef.current?.childNodes[
        absolutePageNumber - 1
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
          pageNumber: pageNumber,
          ...positioning,
          createType: FieldCreateType.ADD,
        });

        return targetFieldNode.remove();
      }

      const targetFieldId = targetFieldNode.id;
      const targetField = documentFields.find(
        documentField => documentField.id === targetFieldId,
      ) as DocumentField;

      setFieldUpdateAction({
        ...targetField,
        pageNumber: pageNumber,
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
        const { clientX: pointerX, clientY: pointerY } = event;
        const { width, height } = defaultSizesByFieldType[fieldType];
        const draggable = document.createElement('div');
        containerRef.current.appendChild(draggable);
        const isDateOrText = checkIfDateOrText(fieldType);

        ReactDOM.render(
          <FieldItemView
            clone="true"
            fieldType={fieldType}
            className={fieldType}
            selectedScale={0.9 * documentScale}
            style={{
              position: 'fixed',
              left: pointerX - (width * documentScale) / 2,
              top: pointerY - (height * documentScale) / 2,
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
      if (!isFieldShapeExist) {
        return;
      }
      setLastInteractedFieldId(null);

      if (selectedFieldType) {
        setFieldCreateAction({
          signerId: null,
          type: selectedFieldType,
          required: false,
          coordinateX: event.offsetX,
          coordinateY: event.offsetY,
          pageNumber: pageNumber,
          style: {
            left: event.offsetX + event.currentTarget.offsetLeft,
            top: event.offsetY + event.currentTarget.offsetTop,
          },
          createType: FieldCreateType.ADD,
        });
      }
    },
    [isFieldShapeExist, selectedFieldType, setFieldCreateAction],
  );

  const handlePageRendered = useCallback((absolutePageNumber: number) => {
    setLoadedPagesCount(prevState => prevState + 1);
    setRenderedPages(prevState => ({
      ...prevState,
      [absolutePageNumber]: true,
    }));
  }, []);

  const isPreparingInteract = useMemo(() => loadedPagesCount !== totalPagesCount, [
    loadedPagesCount,
    totalPagesCount,
  ]);

  const percentageLoadedPages = useMemo(
    () => 100 * (loadedPagesCount / totalPagesCount),
    [loadedPagesCount, totalPagesCount],
  );

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
      lastInteractedField?.type &&
      [
        DocumentFieldTypes.Name,
        DocumentFieldTypes.Text,
        DocumentFieldTypes.Date,
      ].includes(lastInteractedField?.type)
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

      if (focusedFieldId) return;

      const closestPage = findPageClosestToCenter();

      if (!closestPage) return;

      const pageComponent = getFieldPageComponent(closestPage.index + 1);

      const pageCenterX = pageComponent?.clientWidth
        ? pageComponent.clientWidth / 2 - (fieldData.width as number) / 2
        : 0;
      const pageCenterY = pageComponent?.clientHeight
        ? pageComponent.clientHeight / 2 - (fieldData.height as number) / 2
        : 0;

      setFieldCreateAction({
        ...fieldData,
        pageNumber: (closestPage?.index || 0) + 1,
        coordinateX: pageCenterX,
        coordinateY: pageCenterY,
        style: {
          ...fieldData.style,
          left: pageComponent?.offsetLeft + pageCenterX,
          top: pageComponent?.offsetTop + pageCenterY,
        },
        createType: FieldCreateType.COPY,
      });
    }
  }, [
    clipboard,
    findPageClosestToCenter,
    focusedFieldId,
    getFieldPageComponent,
    setFieldCreateAction,
  ]);

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

  const fieldShapeContainerRef = useRef<HTMLDivElement | null>(null);

  const handleRemoveFieldShape = useCallback(() => {
    if (
      fieldShapeContainerRef.current &&
      fieldShapeContainerRef.current.classList.contains('invalid') &&
      setFieldShapeExist &&
      !isMobile
    ) {
      ReactDOM.unmountComponentAtNode(fieldShapeContainerRef.current);
      setFieldShapeExist(false);
      setSelectedFieldType(undefined);
    }
  }, [isMobile]);

  const handleCreateFieldShape = useCallback(
    (event: any, type: DocumentFieldTypes, renderShape?: boolean) => {
      event.stopPropagation();

      if (fieldShapeContainerRef.current && !renderShape) {
        return ReactDOM.unmountComponentAtNode(fieldShapeContainerRef.current);
      }

      handleRemoveFieldShape();

      if (fieldShapeContainerRef.current && renderShape && type !== selectedFieldType) {
        fieldShapeContainerRef.current.style.top = `${event.clientY}px`;
        fieldShapeContainerRef.current.style.left = `${event.clientX}px`;

        !isMobile &&
          ReactDOM.render(
            <FieldItemView
              clone="true"
              fieldType={type}
              className={type}
              style={{
                userSelect: 'none',
                transform: `scale(${documentScale})`,
                transformOrigin: 'top left',
                width: defaultSizesByFieldType[type].width,
                height: defaultSizesByFieldType[type].height,
              }}
              selectedScale={selectedScale}
            />,
            fieldShapeContainerRef.current,
          );

        setSelectedFieldType(type);
        setFieldShapeExist(true);
      }
    },
    [documentScale, handleRemoveFieldShape, isMobile, selectedFieldType, selectedScale],
  );

  const handleMouseMoveWithFieldShape = useCallback(e => {
    if (fieldShapeContainerRef.current) {
      fieldShapeContainerRef.current.style.top = `${e.y}px`;
      fieldShapeContainerRef.current.style.left = `${e.x}px`;
    }
  }, []);

  useEffect(() => {
    const callback = throttle(handleMouseMoveWithFieldShape, 20);

    if (fieldShapeContainerRef.current && isFieldShapeExist) {
      window.addEventListener('mousemove', callback);
      window.addEventListener('click', handleRemoveFieldShape);
    }

    return () => {
      window.removeEventListener('mousemove', callback);
      window.removeEventListener('click', handleRemoveFieldShape);
    };
  }, [
    handleMouseMoveWithFieldShape,
    handleRemoveFieldShape,
    isFieldShapeExist,
    fieldShapeContainerRef,
  ]);

  const validateTag = useCallback(
    (id: string, tag: string) => {
      if (tag) {
        const fieldWithSameTag = documentFields.find(
          field => field.tag === tag && field.id !== id,
        );
        return !fieldWithSameTag;
      }

      return true;
    },
    [documentFields],
  );

  const updateForEachFontProps = () => {
    documentFields.forEach(field => {
      updateDocumentField(
        {
          ...field,
          fixedFontSize: true,
          fontFamily: mainFieldProps?.fontFamily,
          fontSize: mainFieldProps?.fontSize,
          style: {
            fontFamily: fontFamilyByValue[mainFieldProps.fontFamily || 'arial'],
            fontSize: mainFieldProps?.fontSize,
          },
        },
        {
          pushToHistory: true,
        },
      );
    });
  };

  const [openApplyFontsModal, closeApplyFontsModal] = useModal(
    () => (
      <UIModal className="apply-modal" onClose={closeApplyFontsModal}>
        <div className="apply-modal__title">Change Font Settings</div>
        <div className="apply-modal__description">
          {`Are you sure that you want to apply these settings to all the fields on the ${
            ApplyFontTexts[currentDocument?.type || DocumentTypes.ME]
          }?`}
        </div>
        <div className="apply-modal__buttons">
          <UIButton
            title="Yes"
            priority="primary"
            className="centered-text"
            handleClick={() => {
              updateForEachFontProps();
              closeApplyFontsModal();
            }}
          />
          <UIButton
            title="No"
            priority="primary"
            className="centered-text"
            handleClick={closeApplyFontsModal}
          />
        </div>
      </UIModal>
    ),
    [mainFieldProps],
  );

  const handleApplyFontToEachField = (fontFamily: string, fontSize: number) => {
    setMainFieldProps({
      fontSize,
      fontFamily,
    });
    openApplyFontsModal();
  };

  const recalculateFieldStyle = useCallback(
    (field: DocumentField): DocumentField => {
      if (!pagesContainerRef.current) return field;

      const fieldPageComponent = getFieldPageComponent(field.pageNumber);

      return {
        ...field,
        style: {
          ...field.style,
          left: field.coordinateX + fieldPageComponent?.offsetLeft,
          top: field.coordinateY + fieldPageComponent?.offsetTop,
        },
      };
    },
    [getFieldPageComponent],
  );

  const handlePdfDocumentLoadSuccess = useCallback(
    (pdfDocumentFile: string, pdfDocumentProxy) => {
      const pagesNumbers: number[] = [];
      for (let i = 1; i <= pdfDocumentProxy.numPages; i++) {
        pagesNumbers.push(i);
      }

      setPagesPerDocument(prevState => {
        const newState = {
          ...prevState,
          [pdfDocumentFile]: pagesNumbers,
        };

        return newState;
      });
    },
    [],
  );

  const getPreviousPagesCount = useCallback(
    currentPdfDocumentFileIdx => {
      const previousPdfDocuments = pdfDocumentFiles.slice(0, currentPdfDocumentFileIdx);
      const pagesCounts = previousPdfDocuments.map(key => pagesPerDocument[key]);
      return pagesCounts.reduce((a, b) => a + b.length, 0);
    },
    [pagesPerDocument, pdfDocumentFiles],
  );

  const getAbsolutePageNumber = useCallback(
    (pdfDocumentFileIdx: number, pageNumber: number) => {
      return getPreviousPagesCount(pdfDocumentFileIdx) + pageNumber;
    },
    [getPreviousPagesCount],
  );

  let pdfDocumentFilesCount = 0;
  return (
    <ReactModal
      className={classNames('interactModal', { fullscreen: enableFullscreen })}
      overlayClassName="modal"
      isOpen
    >
      <div
        className="fieldShape invalid"
        ref={fieldShapeContainerRef}
        style={{
          position: 'absolute',
          zIndex: 1000,
          width: 'max-content',
          pointerEvents: 'none',
        }}
      />
      {isDocumentInteractLoading ? (
        <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />
      ) : (
        <div
          ref={containerRef}
          className={classNames('interactModal__inner', { fullscreen: enableFullscreen })}
        >
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
            isDisableCancelButton={isDisableCancelButton}
            redoDocumentFieldAction={redoDocumentFieldAction}
            undoDocumentFieldAction={undoDocumentFieldAction}
            isNextAvailable={isNextAvailable}
            isPrevAvailable={isPrevAvailable}
          />
          <div className="interactModal__bodyWrapper">
            <div
              className={classNames('interactModal__body', {
                fullscreen: enableFullscreen,
              })}
            >
              <aside className="interactModal__fieldBar-wrapper">
                <div className="interactModal__fieldBar">
                  <div className="interactModal__fieldBar-fieldWrapper">
                    <p className="interactModal__fieldBar-fieldTitle">Default font</p>
                    <div className="interactModal__fieldBar-selectField-selector-wrapper">
                      <p className="interactModal__fieldBar-selectField-selector-title">
                        Font family:&nbsp;
                      </p>
                      <FontFamilySelect
                        onSelect={handleDefaultFontFamilyChange}
                        value={defaultFontFamily}
                      />
                    </div>
                    <div className="interactModal__fieldBar-selectField-selector-wrapper">
                      <p className="interactModal__fieldBar-selectField-selector-title">
                        Font size:&nbsp;
                      </p>
                      <FontSizeSelect
                        onSelect={handleDefaultFontSizeChange}
                        value={defaultFontSize}
                      />
                    </div>
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
                          handleClick={handleCreateFieldShape}
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
                          {`${loadedPagesCount} / ${totalPagesCount}`}
                        </p>
                      </div>
                      <UIProgressBar percent={percentageLoadedPages} />
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
                        validateTag={validateTag}
                        onDelete={deleteDocumentField}
                        onStartInputTyping={() =>
                          setIsAbleDeleteLastInteractedField(false)
                        }
                        onStopInputTyping={() => setIsAbleDeleteLastInteractedField(true)}
                        onApplyFontToEachField={handleApplyFontToEachField}
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
                    <div
                      onMouseEnter={() => {
                        if (fieldShapeContainerRef.current) {
                          fieldShapeContainerRef.current.classList.remove('invalid');
                        }
                      }}
                      onMouseLeave={() => {
                        if (fieldShapeContainerRef.current) {
                          fieldShapeContainerRef.current.classList.add('invalid');
                        }
                      }}
                      ref={pagesContainerRef}
                    >
                      {pdfDocumentFiles.map((pdfDocumentFile, pdfDocumentFileIdx) => (
                        <PDFDocument
                          key={pdfDocumentFile}
                          file={pdfDocumentFile}
                          loading={<></>}
                          onLoadSuccess={proxy =>
                            handlePdfDocumentLoadSuccess(pdfDocumentFile, proxy)
                          }
                        >
                          {isAllPdfFilesLoaded &&
                            pagesPerDocument[pdfDocumentFile].map(pageNumber => (
                              <DocumentPage
                                className={classNames({
                                  'interactModal--cursor-pointer': selectedFieldType,
                                })}
                                key={pageNumber}
                                pageNumber={pageNumber}
                                renderAnnotationLayer={false}
                                style={{
                                  height:
                                    pdfPageMeta[
                                      getAbsolutePageNumber(
                                        pdfDocumentFileIdx,
                                        pageNumber,
                                      )
                                    ].height,
                                  width:
                                    pdfPageMeta[
                                      getAbsolutePageNumber(
                                        pdfDocumentFileIdx,
                                        pageNumber,
                                      )
                                    ].width,
                                  marginBottom: INTERACT_SIZES.pageMarginBottom,
                                }}
                                onLoad={() =>
                                  handlePageRendered(
                                    getAbsolutePageNumber(pdfDocumentFileIdx, pageNumber),
                                  )
                                }
                                onDrop={event =>
                                  handleFieldDropOnPage(
                                    event,
                                    getAbsolutePageNumber(pdfDocumentFileIdx, pageNumber),
                                  )
                                }
                                onTap={event =>
                                  handlePageTap(
                                    event,
                                    getAbsolutePageNumber(pdfDocumentFileIdx, pageNumber),
                                  )
                                }
                              />
                            ))}
                        </PDFDocument>
                      ))}
                    </div>
                    {documentFields
                      .filter(field => !isEmpty(field.style))
                      .filter(field => isPageRendered(field.pageNumber))
                      .map(field => recalculateFieldStyle(field))
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
                          isFontResize={enableResizeFont}
                          selectedScale={selectedScale}
                        />
                      ))}
                  </div>
                </div>
              </div>
              <div className="interactModal__documentNavigation-wrapper">
                <p className="interactModal__documentNavigation-title">
                  Pages <span>({totalPagesCount})</span>
                </p>
                <ul className="interactModal__documentNavigation">
                  {pdfDocumentFiles.map((pdfDocumentFile, pdfDocumentFileIdx) => (
                    <PDFDocument file={pdfDocumentFile} key={pdfDocumentFile}>
                      {isAllPdfFilesLoaded &&
                        pagesPerDocument[pdfDocumentFile].map(pageNumber => (
                          <DocumentNavigationItem
                            key={pageNumber}
                            pageNumber={pageNumber}
                            pageMeta={pdfPageMeta[++pdfDocumentFilesCount]}
                            fields={documentFields.filter(
                              documentField =>
                                documentField.pageNumber ===
                                getAbsolutePageNumber(pdfDocumentFileIdx, pageNumber),
                            )}
                            navigateToPage={() =>
                              navigateToPage(
                                getAbsolutePageNumber(pdfDocumentFileIdx, pageNumber),
                              )
                            }
                          />
                        ))}
                    </PDFDocument>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </ReactModal>
  );
}

export default BaseInteractModal;
