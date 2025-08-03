import {
  put,
  call,
  cancelled,
  takeLeading,
  select,
  takeEvery,
  takeLatest,
  delay,
  race,
  take,
} from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import DocumentSignApiService from 'Services/Api/DocumentSign';
import {
  Document,
  DocumentForSigners,
  DocumentForSigning,
  SignerOption,
  DocumentPreviewPagesPayload,
  SigningUrlPayload,
  SigningRemindersUnlinkPayload,
} from 'Interfaces/Document';
import { SignedUrlResponse } from 'Interfaces/Common';
import {
  getSignerDocument,
  getSigningDocument,
  getAvailableSignersOptions,
  submitSignedDocument,
  sendDocumentOut,
  sendReminders,
  sendSignatoryOpened,
  getDocumentPreviewPages,
  getDocumentShareUrl,
  shareDocument,
  getDocumentConvertionStatus,
  sendCodeAccess,
  getSigningUrl,
  unlinkSigningReminders,
  sendOutEmbedDocument,
  getEmbedDocumentPreviewPages,
  declineSigningRequest,
} from './actionCreators';
import { selectEmbedToken, selectSignToken } from 'Utils/selectors';
import { UserReducerState } from '../user/reducer';
import { toggleEmailNotification } from '../document/actionCreators';

function* handleAvailableSignersOptionsGet({
  payload,
  meta,
}: ReturnType<typeof getAvailableSignersOptions.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const options: SignerOption[] = yield call(
      DocumentSignApiService.getAvailableSignersOptions,
      { token, payload },
    );

    yield put(getAvailableSignersOptions.success(options, meta));
  } catch (error) {
    yield put(getAvailableSignersOptions.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getAvailableSignersOptions.cancel(undefined, meta));
    }
  }
}

function* handleSignerDocumentGet({
  payload,
  meta,
}: ReturnType<typeof getSignerDocument.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const document: DocumentForSigners = yield call(
      DocumentSignApiService.getSignerDocument,
      {
        payload,
        token,
      },
    );

    yield put(getSignerDocument.success(document, meta));
  } catch (error) {
    yield put(getSignerDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignerDocument.cancel(undefined, meta));
    }
  }
}

function* handleSigningDocumentGet({
  payload,
  meta,
}: ReturnType<typeof getSigningDocument.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const document: DocumentForSigning = yield call(
      DocumentSignApiService.getSigningDocument,
      { payload, token },
    );

    yield put(getSigningDocument.success(document, meta));
  } catch (error) {
    yield put(getSigningDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSigningDocument.cancel(undefined, meta));
    }
  }
}

function* handleSubmitSignedDocument({
  payload,
  meta,
}: ReturnType<typeof submitSignedDocument.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    yield call(DocumentSignApiService.updateFields, {
      payload,
      token,
    });

    yield call(DocumentSignApiService.submitSignedDocument, {
      payload,
      token,
    });

    yield put(submitSignedDocument.success(undefined, meta));
  } catch (error) {
    yield put(submitSignedDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(submitSignedDocument.cancel(undefined, meta));
    }
  }
}

function* handleDeclineSigningRequest({
  payload,
  meta,
}: ReturnType<typeof declineSigningRequest.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    yield call(DocumentSignApiService.declineSigningRequest, {
      payload,
      token,
    });

    yield put(declineSigningRequest.success(undefined, meta));
  } catch (error) {
    yield put(declineSigningRequest.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(declineSigningRequest.cancel(undefined, meta));
    }
  }
}

function* handleDocumentSendOut({
  payload,
  meta,
}: ReturnType<typeof sendDocumentOut.request>) {
  try {
    const document: Document = yield call(
      DocumentSignApiService.sendOutDocument,
      payload.documentId,
    );

    yield put(sendDocumentOut.success(document, meta));
  } catch (error) {
    yield put(sendDocumentOut.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(sendDocumentOut.cancel(undefined, meta));
    }
  }
}

function* handleRemindersSend({
  payload,
  meta,
}: ReturnType<typeof sendReminders.request>) {
  try {
    yield call(DocumentSignApiService.sendReminders, payload);

    yield put(sendReminders.success(undefined, meta));
  } catch (error) {
    yield put(sendReminders.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(sendReminders.cancel(undefined, meta));
    }
  }
}

function* handleSignatoryOpenedSend({
  payload,
  meta,
}: ReturnType<typeof sendSignatoryOpened.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    yield call(DocumentSignApiService.sendSignatoryOpened, {
      payload,
      token,
    });

    yield put(sendSignatoryOpened.success(undefined, meta));
  } catch (error) {
    yield put(sendSignatoryOpened.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(sendSignatoryOpened.cancel(undefined, meta));
    }
  }
}

function* handleDocumentPreviewPagesGet({
  payload,
  meta,
}: ReturnType<typeof getDocumentPreviewPages.request>) {
  try {
    const res: DocumentPreviewPagesPayload = yield call(
      DocumentSignApiService.getDocumentPreviewPages,
      payload,
    );

    yield put(getDocumentPreviewPages.success(res, meta));
  } catch (error) {
    yield put(getDocumentPreviewPages.failure(error, meta));
  }
}

function* handleDocumentShareUrlGet({
  payload,
  meta,
}: ReturnType<typeof getDocumentShareUrl.request>) {
  try {
    const result: SignedUrlResponse = yield call(
      DocumentSignApiService.getDocumentShareUrl,
      payload,
    );

    yield put(getDocumentShareUrl.success(result, meta));
  } catch (error) {
    yield put(getDocumentShareUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocumentShareUrl.cancel(undefined, meta));
    }
  }
}

function* handleDocumentShare({
  payload,
  meta,
}: ReturnType<typeof shareDocument.request>) {
  try {
    yield call(DocumentSignApiService.shareDocument, payload);

    yield put(shareDocument.success(undefined, meta));
  } catch (error) {
    yield put(shareDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(shareDocument.cancel(undefined, meta));
    }
  }
}

function* handleCodeAccessSend({
  payload,
  meta,
}: ReturnType<typeof sendCodeAccess.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const response: DocumentForSigners = yield call(
      DocumentSignApiService.sendCodeAccess,
      { payload, token },
    );

    yield put(sendCodeAccess.success(response, meta));
  } catch (error) {
    yield put(sendCodeAccess.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(sendCodeAccess.cancel(undefined, meta));
    }
  }
}

function* handleSigningUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSigningUrl.request>) {
  try {
    const response: SigningUrlPayload = yield call(
      DocumentSignApiService.getSignigUrl,
      payload,
    );

    yield put(getSigningUrl.success(response, meta));
  } catch (error) {
    yield put(getSigningUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSigningUrl.cancel(undefined, meta));
    }
  }
}

function* handleSigningRemindersUnlink({
  payload,
  meta,
}: ReturnType<typeof unlinkSigningReminders.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);
    const response: SigningRemindersUnlinkPayload = yield call(
      DocumentSignApiService.unlinkSigningReminders,
      { token, payload },
    );

    yield put(unlinkSigningReminders.success(response, meta));
  } catch (error) {
    yield put(unlinkSigningReminders.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(unlinkSigningReminders.cancel(undefined, meta));
    }
  }
}

function* watchDocumentConvertionStatus({
  payload,
  meta,
}: ReturnType<typeof getDocumentConvertionStatus.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);
    while (true) {
      const { cancel } = yield race({
        cancel: take(getType(getDocumentConvertionStatus.cancel)),
        throttle: delay(3000, true),
      });

      if (cancel) {
        break;
      }

      const { isFinished }: { isFinished: boolean } = yield call(
        DocumentSignApiService.getDocumentConvertionStatus,
        {
          payload,
          token,
        },
      );

      if (isFinished) {
        yield put(getDocumentConvertionStatus.success(isFinished, meta));
        break;
      }
    }
  } catch (err) {
    yield put(getDocumentConvertionStatus.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocumentConvertionStatus.cancel(undefined, meta));
    }
  }
}

function* handleDisableSiginigReminders({
  payload,
  meta,
}: ReturnType<typeof toggleEmailNotification.request>) {
  try {
    const document = yield call(DocumentSignApiService.disableSigningReminders, {
      documentId: payload.grid.entityId,
      disableReminders: payload.disableReminders,
    });
    yield put(
      toggleEmailNotification.success({ ...payload.grid, documents: document }, meta),
    );
  } catch (error) {
    yield put(toggleEmailNotification.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(toggleEmailNotification.cancel(undefined, meta));
    }
  }
}

function* handleEmbedDocumentSendOut({
  payload,
  meta,
}: ReturnType<typeof sendOutEmbedDocument.request>) {
  try {
    const token: UserReducerState['embedToken'] = yield select(selectEmbedToken);
    const document: Document = yield call(DocumentSignApiService.sendOutEmbedDocument, {
      token,
      payload,
    });

    yield put(sendOutEmbedDocument.success(document, meta));
  } catch (error) {
    yield put(sendOutEmbedDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(sendOutEmbedDocument.cancel(undefined, meta));
    }
  }
}

function* handleEmbedDocumentPreviewPagesGet({
  payload,
  meta,
}: ReturnType<typeof getEmbedDocumentPreviewPages.request>) {
  try {
    const token: UserReducerState['embedToken'] = yield select(selectEmbedToken);
    const res: DocumentPreviewPagesPayload = yield call(
      DocumentSignApiService.getEmbedDocumentPreviewPages,
      { token, payload },
    );

    yield put(getEmbedDocumentPreviewPages.success(res, meta));
  } catch (error) {
    yield put(getEmbedDocumentPreviewPages.failure(error, meta));
  }
}

export default [
  takeLeading(getAvailableSignersOptions.request, handleAvailableSignersOptionsGet),
  takeLeading(getSignerDocument.request, handleSignerDocumentGet),
  takeLeading(getSigningDocument.request, handleSigningDocumentGet),
  takeLeading(submitSignedDocument.request, handleSubmitSignedDocument),
  takeLeading(declineSigningRequest.request, handleDeclineSigningRequest),
  takeLeading(getSigningUrl.request, handleSigningUrlGet),
  takeEvery(sendDocumentOut.request, handleDocumentSendOut),
  takeEvery(sendCodeAccess.request, handleCodeAccessSend),
  takeEvery(sendReminders.request, handleRemindersSend),
  takeLeading(sendSignatoryOpened.request, handleSignatoryOpenedSend),
  takeLeading(getDocumentPreviewPages.request, handleDocumentPreviewPagesGet),
  takeLatest(getDocumentShareUrl.request, handleDocumentShareUrlGet),
  takeLatest(shareDocument.request, handleDocumentShare),
  takeLatest(getDocumentConvertionStatus.request, watchDocumentConvertionStatus),
  takeEvery(toggleEmailNotification.request, handleDisableSiginigReminders),
  takeLatest(unlinkSigningReminders.request, handleSigningRemindersUnlink),
  takeEvery(sendOutEmbedDocument.request, handleEmbedDocumentSendOut),
  takeLeading(getEmbedDocumentPreviewPages.request, handleEmbedDocumentPreviewPagesGet),
];
