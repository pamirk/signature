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
import {getType} from 'typesafe-actions';
import DocumentSignApiService from 'Services/Api/DocumentSign';
import {
    Document,
    DocumentForSigners,
    SignerOption,
    DocumentPreviewPagesPayload,
    SigningUrlPayload,
} from 'Interfaces/Document';
import {SignedUrlResponse} from 'Interfaces/Common';
import {
    getSignerDocument,
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
} from './actionCreators';
import {selectSignToken} from 'Utils/selectors';
import {UserReducerState} from '../user/reducer';
import {toggleEmailNotification} from '../document/actionCreators';

function* handleAvailableSignersOptionsGet({
                                               payload,
                                               meta,
                                           }: ReturnType<typeof getAvailableSignersOptions.request>) {
    try {
        const token: UserReducerState['signToken'] = yield select(selectSignToken);

        const options: SignerOption[] = yield call(
            DocumentSignApiService.getAvailableSignersOptions,
            {token, payload},
        );

        yield put(getAvailableSignersOptions.success(options, meta));
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getSignerDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getSignerDocument.cancel(undefined, meta));
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
    }
        //@ts-ignore
    catch (error: any) {
        yield put(submitSignedDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(submitSignedDocument.cancel(undefined, meta));
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
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
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
            {payload, token},
        );

        yield put(sendCodeAccess.success(response, meta));
    }
        //@ts-ignore
    catch (error: any) {
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
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getSigningUrl.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getSigningUrl.cancel(undefined, meta));
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
            const {cancel} = yield race({
                cancel: take(getType(getDocumentConvertionStatus.cancel)),
                throttle: delay(3000, true),
            });

            if (cancel) {
                break;
            }

            const {isFinished}: { isFinished: boolean } = yield call(
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
    }
    //@ts-ignore
    catch (error: any) {
        yield put(getDocumentConvertionStatus.failure(error, meta));
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
        const document = yield call(DocumentSignApiService.disableSigningReminders, payload);
        yield put(toggleEmailNotification.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(toggleEmailNotification.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(toggleEmailNotification.cancel(undefined, meta));
        }
    }
}

export default [
    takeLeading(getAvailableSignersOptions.request, handleAvailableSignersOptionsGet),
    takeLeading(getSignerDocument.request, handleSignerDocumentGet),
    takeLeading(submitSignedDocument.request, handleSubmitSignedDocument),
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
];
