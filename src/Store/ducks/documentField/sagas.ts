import {
  put,
  takeLatest,
  delay,
  select,
  race,
  take,
  fork,
  takeLeading,
} from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import * as _ from 'lodash';
import { DocumentField, DocumentFieldsState } from 'Interfaces/DocumentFields';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  selectDocumentFields,
  selectDocumentFieldsMeta,
  selectDocument,
} from 'Utils/selectors';
import {
  createDocumentField,
  updateDocumentField,
  deleteDocumentField,
  changeDocumentFieldsMeta,
  setDocumentFields,
  pushToDocumentFieldsHistory,
  undoDocumentFieldsHistory,
  redoDocumentFieldsHistory,
  CRUDRequestActionCreatorsByTypes,
  CRUDSuccessCreatorsByRequests,
} from './actionCreators';
import { Document } from 'Interfaces/Document';
import { updateDocument } from '../document/actionCreators';

function* handleDocumentFieldsUpdate() {
  try {
    const documentFieldsMeta: DocumentFieldsState['meta'] = yield select(
      selectDocumentFieldsMeta,
    );
    const document: Document = yield select(state =>
      selectDocument(state, { documentId: documentFieldsMeta.currentDocumentId }),
    );
    const changedDocumentFields: DocumentField[] = yield select(selectDocumentFields);
    const documentUpdateValues = {
      type: document.type,
      documentId: documentFieldsMeta.currentDocumentId as string,
      fields: changedDocumentFields,
    };

    if (!_.isEqual(document.fields, changedDocumentFields)) {
      yield put(updateDocument.request({ values: documentUpdateValues }, {}));
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleDocumentFieldsChanges() {
  try {
    const { throttle } = yield race({
      throttle: delay(3000, true),
      saveAction: take(updateDocument.request),
      cancel: take(updateDocument.cancel),
    });

    if (throttle) {
      yield fork(handleDocumentFieldsUpdate);
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleDocumentFieldsMetaSet({
  payload,
}: ReturnType<typeof changeDocumentFieldsMeta.set>) {
  try {
    const document: Document = yield select(state =>
      selectDocument(state, { documentId: payload.currentDocumentId }),
    );
    const normalizedDocumentFields: NormalizedEntity<DocumentField> = _.keyBy(
      document.fields,
      'id',
    );

    yield put(setDocumentFields(normalizedDocumentFields));
  } catch (error) {
    console.log(error);
  }
}

function* handleDocumentFieldsActionRequests({
  type,
  payload,
  meta,
}: ReturnType<
  | typeof createDocumentField.request
  | typeof updateDocumentField.request
  | typeof deleteDocumentField.request
>) {
  try {
    if (meta.pushToHistory) {
      yield put(
        pushToDocumentFieldsHistory({
          actionType: type,
          actionPayload: payload as DocumentField,
        }),
      );
    }

    const successActionCreator = CRUDSuccessCreatorsByRequests[type];

    yield put(
      successActionCreator({
        payload: payload as DocumentField,
        meta,
      }),
    );
  } catch (err) {
    console.log(err);
  }
}

function* handleDocumentFieldHistoryUndo() {
  try {
    const meta: ReturnType<typeof selectDocumentFieldsMeta> = yield select(
      selectDocumentFieldsMeta,
    );
    const { actions: historyActions, cursor: historyCursor } = meta.history;

    if (historyCursor === historyActions.length) return;

    const { prev: currentAction } = historyActions[historyCursor];
    const currentActionCreator =
      CRUDRequestActionCreatorsByTypes[currentAction.actionType];

    yield put(
      undoDocumentFieldsHistory.success({
        ...meta.history,
        cursor: meta.history.cursor + 1,
      }),
    );
    yield put(
      currentActionCreator({
        payload: currentAction.actionPayload,
        meta: { pushToHistory: false },
      }),
    );
  } catch (err) {
    console.log(err);
  }
}

function* handleDocumentFieldHistoryRedo() {
  try {
    const meta: ReturnType<typeof selectDocumentFieldsMeta> = yield select(
      selectDocumentFieldsMeta,
    );
    const { actions: historyActions, cursor: historyCursor } = meta.history;

    if (historyCursor === 0) return;

    const { next: currentAction } = historyActions[historyCursor - 1];
    const currentActionCreator =
      CRUDRequestActionCreatorsByTypes[currentAction.actionType];

    yield put(
      redoDocumentFieldsHistory.success({
        ...meta.history,
        cursor: meta.history.cursor - 1,
      }),
    );
    yield put(
      currentActionCreator({
        payload: currentAction.actionPayload,
        meta: { pushToHistory: false },
      }),
    );
  } catch (err) {
    console.log(err);
  }
}

export default [
  takeLatest(changeDocumentFieldsMeta.set, handleDocumentFieldsMetaSet),
  takeLatest(
    action =>
      [
        getType(createDocumentField.success),
        getType(updateDocumentField.success),
        getType(deleteDocumentField.success),
      ].includes(action.type),
    handleDocumentFieldsChanges,
  ),
  takeLatest(
    action =>
      [
        getType(createDocumentField.request),
        getType(updateDocumentField.request),
        getType(deleteDocumentField.request),
      ].includes(action.type),
    handleDocumentFieldsActionRequests,
  ),
  takeLeading(undoDocumentFieldsHistory.request, handleDocumentFieldHistoryUndo),
  takeLeading(redoDocumentFieldsHistory.request, handleDocumentFieldHistoryRedo),
];
