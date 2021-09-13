import { createReducer, getType } from 'typesafe-actions';
import * as _ from 'lodash';
import {
  DocumentFieldsState,
  DocumentField,
  DocumentFieldTypes,
  DocumentFieldHistoryActionItem,
  DocumentFieldDeletePayload,
  DocumentFieldHistoryItem,
} from 'Interfaces/DocumentFields';
import {
  createDocumentField,
  deleteDocumentField,
  updateDocumentField,
  updateDocumentFieldLocally,
  changeDocumentFieldsMeta,
  setDocumentFields,
  pushToDocumentFieldsHistory,
  undoDocumentFieldsHistory,
  redoDocumentFieldsHistory,
} from './actionCreators';

const getFieldValueKeyByType = (fieldType: DocumentFieldTypes) => {
  switch (fieldType) {
    case DocumentFieldTypes.Initials:
    case DocumentFieldTypes.Signature: {
      return 'requisiteId';
    }
    case DocumentFieldTypes.Date:
    case DocumentFieldTypes.Text: {
      return 'text';
    }
    case DocumentFieldTypes.Checkbox: {
      return 'checked';
    }
  }
};

const initialState = {
  fields: {},
  meta: {
    history: { cursor: 0, actions: [] },
  },
} as DocumentFieldsState;

export default createReducer(initialState)
  .handleAction(changeDocumentFieldsMeta.set, (state, action) => ({
    ...state,
    meta: {
      ...state.meta,
      ...action.payload,
    },
  }))
  .handleAction(
    [undoDocumentFieldsHistory.success, redoDocumentFieldsHistory.success],
    (state, action) => {
      return {
        ...state,
        meta: {
          ...state.meta,
          history: action.payload,
        },
      };
    },
  )
  .handleAction(changeDocumentFieldsMeta.clear, state => ({
    ...state,
    meta: initialState.meta,
  }))
  .handleAction(setDocumentFields, (state, action) => ({
    ...state,
    fields: action.payload,
  }))
  .handleAction(
    [
      createDocumentField.success,
      updateDocumentField.success,
      updateDocumentFieldLocally,
    ],
    (state, action) => {
      const { payload } = action;
      const stateField = state.fields[payload.id];
      const documentField = { ...stateField, ...payload } as DocumentField;
      const valueKey = getFieldValueKeyByType(documentField.type);
      const isFieldSigned = !!documentField[valueKey];

      return {
        ...state,
        fields: {
          ...state.fields,
          [payload.id]: {
            ...stateField,
            ...payload,
            signed: isFieldSigned,
            style: {
              ...stateField?.style,
              ...payload?.style,
            },
          },
        },
      };
    },
  )
  .handleAction(deleteDocumentField.success, (state, action) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [action.payload.id]: deletedField, ...newState } = state.fields;

    return {
      ...state,
      fields: newState,
    };
  })
  .handleAction(pushToDocumentFieldsHistory, (state, action) => {
    const { payload } = action;
    const { history } = state.meta;
    const next = payload;
    let prev: DocumentFieldHistoryActionItem;

    switch (payload.actionType) {
      case getType(createDocumentField.request): {
        prev = {
          actionType: getType(deleteDocumentField.request),
          actionPayload: { id: payload.actionPayload.id } as DocumentFieldDeletePayload,
        } as DocumentFieldHistoryActionItem;

        break;
      }
      case getType(updateDocumentField.request): {
        prev = {
          actionType: getType(updateDocumentField.request),
          actionPayload: state.fields[payload.actionPayload.id],
        } as DocumentFieldHistoryActionItem;

        break;
      }
      case getType(deleteDocumentField.request): {
        prev = {
          actionType: getType(createDocumentField.request),
          actionPayload: state.fields[payload.actionPayload.id],
        } as DocumentFieldHistoryActionItem;

        break;
      }
    }

    // @ts-ignore
    const historyItem = {next, prev,} as DocumentFieldHistoryItem;

    return {
      ...state,
      meta: {
        ...state.meta,
        history: {
          cursor: 0,
          actions: [
            historyItem,
            ...(history.cursor === 0
              ? history.actions
              : history.actions.slice(history.cursor)),
          ],
        },
      },
    };
  });
