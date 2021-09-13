export const DocumentFieldsSetType = 'fields/SET_DOCUMENT_FIELDS';

export const DocumentFieldUpdateLocallyType = 'fields/UPDATE_DOCUMENT_FIELD_LOCALLY';

export enum DocumentFieldCreateActionTypes {
  request = 'fields/CREATE_DOCUMENT_FIELD/REQUEST',
  success = 'fields/CREATE_DOCUMENT_FIELD/SUCCESS',
}

export enum DocumentFieldUpdateActionTypes {
  request = 'fields/UPDATE_DOCUMENT_FIELD/REQUEST',
  success = 'fields/UPDATE_DOCUMENT_FIELD/SUCCESS',
}

export enum DocumentFieldDeleteActionTypes {
  request = 'fields/DELETE_DOCUMENT_FIELD/REQUEST',
  success = 'fields/DELETE_DOCUMENT_FIELD/SUCCESS',
}

export const DocumentFieldHistoryPushType = 'fields/DOCUMENT_FIELD_HISTORY/PUSH';

export enum DocumentFieldHistoryRedoType {
  request = 'fields/DOCUMENT_FIELD_HISTORY_REDO/REQUEST',
  success = 'fields/DOCUMENT_FIELD_HISTORY_REDO/SUCCESS',
}

export enum DocumentFieldHistoryUndoType {
  request = 'fields/DOCUMENT_FIELD_HISTORY_UNDO/REQUEST',
  success = 'fields/DOCUMENT_FIELD_HISTORY_UNDO/SUCCESS',
}

export enum DocumentFieldMetaActionTypes {
  set = 'fields/SET_DOCUMENT_FIELDS_META',
  clear = 'fields/CLEAR_DOCUMENT_FIELDS_META',
}
