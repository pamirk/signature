import { createAction } from 'typesafe-actions';
import {
  DocumentField,
  DocumentFieldDeletePayload,
  DocumentFieldsState,
  DocumentFieldUpdatePayload,
  DocumentFieldsCRUDPayload,
  DocumentFieldHistoryActionItem,
  DocumentFieldHistory,
  EmbedDocumentFieldHistoryActionItem,
} from 'Interfaces/DocumentFields';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  DocumentFieldUpdateLocallyType,
  DocumentFieldMetaActionTypes,
  DocumentFieldsSetType,
  DocumentFieldHistoryUndoType,
  DocumentFieldHistoryRedoType,
  DocumentFieldHistoryPushType,
  DocumentFieldCreateActionTypes,
  DocumentFieldUpdateActionTypes,
  DocumentFieldDeleteActionTypes,
  EmbedDocumentFieldCreateActionTypes,
  EmbedDocumentFieldUpdateActionTypes,
  EmbedDocumentFieldDeleteActionTypes,
  EmbedDocumentFieldHistoryPushType,
  EmbedDocumentFieldMetaActionTypes,
  EmbedDocumentFieldHistoryUndoType,
  EmbedDocumentFieldHistoryRedoType,
} from './actionTypes';

export const updateDocumentFieldLocally = createAction(
  DocumentFieldUpdateLocallyType,
  (payload: DocumentFieldUpdatePayload) => payload,
)();

export const createDocumentField = {
  request: createAction(
    DocumentFieldCreateActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentField>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentField>) => meta,
  )(),
  success: createAction(
    DocumentFieldCreateActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentField>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentField>) => meta,
  )(),
};

export const updateDocumentField = {
  request: createAction(
    DocumentFieldUpdateActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => meta,
  )(),
  success: createAction(
    DocumentFieldUpdateActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => meta,
  )(),
};

export const deleteDocumentField = {
  request: createAction(
    DocumentFieldDeleteActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => meta,
  )(),
  success: createAction(
    DocumentFieldDeleteActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => meta,
  )(),
};

export const setDocumentFields = createAction(
  DocumentFieldsSetType,
  (payload: NormalizedEntity<DocumentField>) => payload,
)();

export const changeDocumentFieldsMeta = {
  set: createAction(
    DocumentFieldMetaActionTypes.set,
    (payload: Partial<DocumentFieldsState['meta']>) => payload,
  )(),
  clear: createAction(DocumentFieldMetaActionTypes.clear)(),
};

export const pushToDocumentFieldsHistory = createAction(
  DocumentFieldHistoryPushType,
  (payload: DocumentFieldHistoryActionItem) => payload,
)();

export const undoDocumentFieldsHistory = {
  request: createAction(
    DocumentFieldHistoryUndoType.request,
    (payload: DocumentFieldHistoryActionItem) => payload,
  )(),
  success: createAction(
    DocumentFieldHistoryUndoType.success,
    (payload: DocumentFieldHistory) => payload,
  )(),
};

export const redoDocumentFieldsHistory = {
  request: createAction(
    DocumentFieldHistoryRedoType.request,
    (payload: DocumentFieldHistoryActionItem) => payload,
  )(),
  success: createAction(
    DocumentFieldHistoryRedoType.success,
    (payload: DocumentFieldHistory) => payload,
  )(),
};

export const CRUDRequestActionCreatorsByTypes = {
  [DocumentFieldCreateActionTypes.request]: createDocumentField.request,
  [DocumentFieldUpdateActionTypes.request]: updateDocumentField.request,
  [DocumentFieldDeleteActionTypes.request]: deleteDocumentField.request,
};

export const CRUDSuccessCreatorsByRequests = {
  [DocumentFieldCreateActionTypes.request]: createDocumentField.success,
  [DocumentFieldUpdateActionTypes.request]: updateDocumentField.success,
  [DocumentFieldDeleteActionTypes.request]: deleteDocumentField.success,
};

export const changeEmbedDocumentFieldsMeta = {
  set: createAction(
    DocumentFieldMetaActionTypes.set,
    (payload: Partial<DocumentFieldsState['meta']>) => payload,
  )(),
  clear: createAction(EmbedDocumentFieldMetaActionTypes.clear)(),
};

export const pushToEmbedDocumentFieldsHistory = createAction(
  EmbedDocumentFieldHistoryPushType,
  (payload: EmbedDocumentFieldHistoryActionItem) => payload,
)();

export const undoEmbedDocumentFieldsHistory = {
  request: createAction(
    EmbedDocumentFieldHistoryUndoType.request,
    (payload: EmbedDocumentFieldHistoryActionItem) => payload,
  )(),
  success: createAction(
    EmbedDocumentFieldHistoryUndoType.success,
    (payload: DocumentFieldHistory) => payload,
  )(),
};

export const redoEmbedDocumentFieldsHistory = {
  request: createAction(
    EmbedDocumentFieldHistoryRedoType.request,
    (payload: EmbedDocumentFieldHistoryActionItem) => payload,
  )(),
  success: createAction(
    EmbedDocumentFieldHistoryRedoType.success,
    (payload: DocumentFieldHistory) => payload,
  )(),
};

export const createEmbedDocumentField = {
  request: createAction(
    EmbedDocumentFieldCreateActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentField>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentField>) => meta,
  )(),
  success: createAction(
    EmbedDocumentFieldCreateActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentField>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentField>) => meta,
  )(),
};

export const updateEmbedDocumentField = {
  request: createAction(
    EmbedDocumentFieldUpdateActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => meta,
  )(),
  success: createAction(
    EmbedDocumentFieldUpdateActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldUpdatePayload>) => meta,
  )(),
};

export const deleteEmbedDocumentField = {
  request: createAction(
    EmbedDocumentFieldDeleteActionTypes.request,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => meta,
  )(),
  success: createAction(
    EmbedDocumentFieldDeleteActionTypes.success,
    ({ payload }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => payload,
    ({ meta }: DocumentFieldsCRUDPayload<DocumentFieldDeletePayload>) => meta,
  )(),
};

export const CRUDEmbedRequestActionCreatorsByTypes = {
  [EmbedDocumentFieldCreateActionTypes.request]: createEmbedDocumentField.request,
  [EmbedDocumentFieldUpdateActionTypes.request]: updateEmbedDocumentField.request,
  [EmbedDocumentFieldDeleteActionTypes.request]: deleteEmbedDocumentField.request,
};

export const CRUDEmbedSuccessCreatorsByRequests = {
  [EmbedDocumentFieldCreateActionTypes.request]: createEmbedDocumentField.success,
  [EmbedDocumentFieldUpdateActionTypes.request]: updateEmbedDocumentField.success,
  [EmbedDocumentFieldDeleteActionTypes.request]: deleteEmbedDocumentField.success,
};
