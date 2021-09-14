import {
    put,
    call,
    race,
    takeLeading,
    takeLatest,
    takeEvery,
    cancelled,
    cancel,
    take,
    delay,
    select,
} from 'redux-saga/effects';
import lodash, {isEmpty} from 'lodash';
import {getType} from 'typesafe-actions';
import Axios from 'axios';
import {UserReducerState} from 'Store/ducks/user/reducer';
import DocumentApiService from 'Services/Api/Document';
import DocumentSignApi from 'Services/Api/DocumentSign';
import {NormalizedEntity, SignedUrlResponse} from 'Interfaces/Common';
import {
    Document,
    DocumentTypes,
    DocumentConvertionData,
    DocumentActivity,
} from 'Interfaces/Document';
import {selectSignToken} from 'Utils/selectors';
import {
    createDocument,
    getDocuments,
    getDocument,
    uploadDocument,
    deleteDocuments,
    updateDocument,
    sendReminder,
    getAllDocuments,
    cleanFileData,
    copyDocument,
    getDocumentDownloadUrl,
    activateTemplate,
    revertDocument,
    mergeTemplate,
    replicateTemplate,
    sendDocumentBulk,
    watchDocumentConvertionProgress,
    getDocumentConvertionStatus,
    getDocumentActivities,
    createDocumentFromFormRequest,
    removeTemplateFromApi,
    addTemplateToApi,
    getFormRequest,
    disableForm,
    enableForm,
    toggleEmailNotification,
    getAllTemplates,
} from './actionCreators';

function* handleDocumentCreate({
                                   payload,
                                   meta,
                               }: ReturnType<typeof createDocument.request>) {
    const {values} = payload;

    try {
        let createEndpoint;

        switch (values.type) {
            case DocumentTypes.TEMPLATE:
                createEndpoint = DocumentApiService.createTemplate;
                break;
            case DocumentTypes.FORM_REQUEST:
                createEndpoint = DocumentApiService.createForm;
                break;
            default:
                createEndpoint = DocumentApiService.createDocument;
        }

        const document = yield call(createEndpoint, values);
        const withConvertedDate: Document = {
            ... document,
        };
        yield put(createDocument.success(withConvertedDate, {... meta, isLeading: true}));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(createDocument.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(createDocument.cancel(undefined, {... meta, isLeading: true}));
        }
    }
}

function* handleDocumentsGet({payload, meta}: ReturnType<typeof getDocuments.request>) {
    const cancelToken = Axios.CancelToken.source();

    try {
        const {items, totalItems, pageCount, itemCount} = yield call(
            DocumentApiService.getDocuments,
            payload,
            {
                cancelToken: cancelToken.token,
            },
        );
        const normalizedDocuments: NormalizedEntity<Document> = lodash.keyBy(items, 'id');
        yield put(
            getDocuments.success(
                {
                    documents: normalizedDocuments,
                    paginationData: {totalItems, pageCount, itemsCount: itemCount},
                },
                meta,
            ),
        );
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getDocuments.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getDocuments.cancel(undefined, meta));
            cancelToken.cancel();
        }
    }
}

function* handleDocumentGet({payload, meta}: ReturnType<typeof getDocument.request>) {
    try {
        const document: Document = yield call(DocumentApiService.getDocument, payload);
        yield put(getDocument.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getDocument.cancel(undefined, meta));
        }
    }
}

function* handleDocumentUpload({
                                   payload,
                                   meta,
                               }: ReturnType<typeof uploadDocument.request>) {
    try {
        const {documentId, file, options} = payload;

        const Document = yield call(
            DocumentApiService.uploadDocument,
            documentId,
            file,
            options,
        );

        if (isEmpty(Document)) {
            yield cancel();
        }

        yield put(uploadDocument.success(Document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(uploadDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(uploadDocument.cancel(undefined, meta));
        }
    }
}

function* handleDocumentUpdate({
                                   payload,
                                   meta,
                               }: ReturnType<typeof updateDocument.request>) {
    const {values} = payload;
    try {
        let updateEndpoint;
        switch (values.type) {
            case DocumentTypes.TEMPLATE:
                updateEndpoint = DocumentApiService.updateTemplate;
                break;
            case DocumentTypes.FORM_REQUEST:
                updateEndpoint = DocumentApiService.updateForm;
                break;
            default:
                updateEndpoint = DocumentApiService.updateDocument;
        }

        const document = yield call(updateEndpoint, values);
        yield put(updateDocument.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(updateDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(updateDocument.cancel(undefined, meta));
        }
    }
}

function* handleDocumentsDelete({
                                    payload,
                                    meta,
                                }: ReturnType<typeof deleteDocuments.request>) {
    try {
        yield call(DocumentApiService.deleteDocuments, payload.documentIds);
        yield put(deleteDocuments.success(undefined, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(deleteDocuments.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(deleteDocuments.cancel(undefined, meta));
        }
    }
}

function* handleReminderSend({payload, meta}: ReturnType<typeof sendReminder.request>) {
    const {userIds} = payload;
    try {
        yield call(DocumentApiService.sendReminder, userIds);
        yield put(sendReminder.success(undefined, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(sendReminder.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(sendReminder.cancel(undefined, meta));
        }
    }
}

function* handleAllDocumentsGet({
                                    meta,
                                    payload,
                                }: ReturnType<typeof getAllDocuments.request>) {
    try {
        const documents: Document[] = yield call(DocumentApiService.getAllDocuments, payload);
        const normalizedDocuments: NormalizedEntity<Document> = lodash.keyBy(documents, 'id');

        yield put(getAllDocuments.success(normalizedDocuments, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getAllDocuments.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getAllDocuments.cancel(undefined, meta));
        }
    }
}

function* handleAllTemplatesGet({
                                    meta,
                                    payload,
                                }: ReturnType<typeof getAllTemplates.request>) {
    try {
        const documents: Document[] = yield call(DocumentApiService.getAllTemplates, payload);
        const normalizedDocuments: NormalizedEntity<Document> = lodash.keyBy(documents, 'id');

        yield put(getAllTemplates.success(normalizedDocuments, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getAllTemplates.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getAllTemplates.cancel(undefined, meta));
        }
    }
}

function* handleFileDataClean({
                                  payload,
                                  meta,
                              }: ReturnType<typeof cleanFileData.request>) {
    try {
        const document: Document = yield call(DocumentApiService.cleanFileData, payload);

        yield put(cleanFileData.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(cleanFileData.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(cleanFileData.cancel(undefined, meta));
        }
    }
}

function* handleDocumentCopy({payload, meta}: ReturnType<typeof copyDocument.request>) {
    try {
        const document: Document = yield call(DocumentApiService.copyDocument, payload);

        yield put(copyDocument.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(copyDocument.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(copyDocument.cancel(undefined, meta));
        }
    }
}

function* handleDocumentDownloadUrlGet({
                                           payload,
                                           meta,
                                       }: ReturnType<typeof getDocumentDownloadUrl.request>) {
    try {
        const isHash = !!payload.hash;
        const token: UserReducerState['signToken'] = yield select(selectSignToken);

        const res: SignedUrlResponse = isHash
            ? yield call(DocumentSignApi.getDownloadUrlByHash, payload)
            : yield call(DocumentSignApi.getDownloadUrlByJWT, {payload, token});

        yield put(getDocumentDownloadUrl.success(res, meta));
    }
     //@ts-ignore
    catch (error: any) {
        yield put(getDocumentDownloadUrl.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getDocumentDownloadUrl.cancel(undefined, meta));
        }
    }
}

function* handleTemplateActivate({
                                     payload,
                                     meta,
                                 }: ReturnType<typeof activateTemplate.request>) {
    try {
        const document: Document = yield call(
            DocumentApiService.activateTemplate,
            payload.documentId,
            payload.status,
        );

        yield put(activateTemplate.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(activateTemplate.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(activateTemplate.cancel(undefined, meta));
        }
    }
}

function* handleTemplateRemoveFromApi({
                                          payload,
                                          meta,
                                      }: ReturnType<typeof removeTemplateFromApi.request>) {
    try {
        const document: Document = yield call(
            DocumentApiService.removeTemplateFromApi,
            payload.documentId,
        );

        yield put(removeTemplateFromApi.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(removeTemplateFromApi.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(removeTemplateFromApi.cancel(undefined, meta));
        }
    }
}

function* handleTemplateAddToApi({
                                     payload,
                                     meta,
                                 }: ReturnType<typeof addTemplateToApi.request>) {
    try {
        const document: Document = yield call(
            DocumentApiService.addTemplateToApi,
            payload.documentId,
        );

        yield put(addTemplateToApi.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(addTemplateToApi.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(addTemplateToApi.cancel(undefined, meta));
        }
    }
}

function* handleDocumentRevert({
                                   payload,
                                   meta,
                               }: ReturnType<typeof revertDocument.request>) {
    try {
        const document: Document = yield call(
            DocumentApiService.revertDocument,
            payload.documentId,
        );

        yield put(revertDocument.success(document, {... meta, isLeading: true}));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(revertDocument.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(revertDocument.cancel(undefined, {... meta, isLeading: true}));
        }
    }
}

function* handleTemplateReplicate({
                                      payload,
                                      meta,
                                  }: ReturnType<typeof replicateTemplate.request>) {
    try {
        const document: Document = yield call(DocumentApiService.replicateTemplate, payload);

        yield put(replicateTemplate.success(document, {... meta, isLeading: true}));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(replicateTemplate.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(replicateTemplate.cancel(undefined, {... meta, isLeading: true}));
        }
    }
}

function* handleTemplateMerge({
                                  payload,
                                  meta,
                              }: ReturnType<typeof mergeTemplate.request>) {
    try {
        const document: Document = yield call(DocumentApiService.mergeTemplate, payload);

        yield put(mergeTemplate.success(document, {... meta, isLeading: true}));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(mergeTemplate.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(mergeTemplate.cancel(undefined, {... meta, isLeading: true}));
        }
    }
}

function* handleDocumentsBulkSend({
                                      payload,
                                      meta,
                                  }: ReturnType<typeof sendDocumentBulk.request>) {
    try {
        yield call(DocumentSignApi.sendDocumentBulk, payload);
        yield put(sendDocumentBulk.success(undefined, {... meta, isLeading: true}));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(sendDocumentBulk.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(sendDocumentBulk.cancel(undefined, {... meta, isLeading: true}));
        }
    }
}

function* handleDocumentConvertionStatusGet({
                                                payload,
                                                meta,
                                            }: ReturnType<typeof getDocumentConvertionStatus.request>) {
    try {
        const convertionData: DocumentConvertionData = yield call(
            DocumentApiService.getDocumentConvertionData,
            payload,
        );

        yield put(getDocumentConvertionStatus.success(convertionData, meta));
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

function* watchDocumentConvertion({
                                      payload,
                                  }: ReturnType<typeof watchDocumentConvertionProgress.start>) {
    try {
        while (true) {
            const {cancel} = yield race({
                cancel: take(getType(watchDocumentConvertionProgress.stop)),
                throttle: delay(3000, true),
            });

            if (cancel) {
                break;
            }

            yield put(getDocumentConvertionStatus.request(payload, {}));
        }
    }
     //@ts-ignore
    catch (error: any) {
        yield put(watchDocumentConvertionProgress.failure(error));
    }
}

function* handleDocumentActivitiesGet({
                                          payload,
                                          meta,
                                      }: ReturnType<typeof getDocumentActivities.request>) {
    try {
        const documentActivities: DocumentActivity[] = yield call(
            DocumentApiService.getDocumentActivities,
            payload,
        );

        yield put(getDocumentActivities.success(documentActivities, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getDocumentActivities.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getDocumentActivities.cancel(undefined, meta));
        }
    }
}

function* handleDocumentCreateFromFormRequest({
                                                  payload,
                                                  meta,
                                              }: ReturnType<typeof createDocumentFromFormRequest.request>) {
    try {
        const createEndpoint = DocumentApiService.createFormRequestDocument;

        const document = yield call(createEndpoint, payload);
        const withConvertedDate: Document = {
            ... document,
        };
        yield put(
            createDocumentFromFormRequest.success(withConvertedDate, {
                ... meta,
                isLeading: true,
            }),
        );
    }
        //@ts-ignore
    catch (error: any) {
        yield put(createDocumentFromFormRequest.failure(error, {... meta, isLeading: true}));
    } finally {
        if (yield cancelled()) {
            yield put(
                createDocumentFromFormRequest.cancel(undefined, {... meta, isLeading: true}),
            );
        }
    }
}

function* handleFormRequestGet({
                                   payload,
                                   meta,
                               }: ReturnType<typeof getFormRequest.request>) {
    try {
        const document: Document = yield call(DocumentApiService.getFormRequest, payload);
        yield put(getFormRequest.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(getFormRequest.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(getFormRequest.cancel(undefined, meta));
        }
    }
}

function* handleFormRequestDisable({
                                       payload,
                                       meta,
                                   }: ReturnType<typeof disableForm.request>) {
    try {
        const document: Document = yield call(DocumentApiService.disableFormRequest, payload);
        yield put(disableForm.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(disableForm.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(disableForm.cancel(undefined, meta));
        }
    }
}

function* handleFormRequestEnable({
                                      payload,
                                      meta,
                                  }: ReturnType<typeof enableForm.request>) {
    try {
        const document: Document = yield call(DocumentApiService.enableFormRequest, payload);
        yield put(enableForm.success(document, meta));
    }
        //@ts-ignore
    catch (error: any) {
        yield put(enableForm.failure(error, meta));
    } finally {
        if (yield cancelled()) {
            yield put(enableForm.cancel(undefined, meta));
        }
    }
}

export default [
    takeLatest(getDocuments.request, handleDocumentsGet),
    takeLeading(revertDocument.request, handleDocumentRevert),
    takeLatest(getAllDocuments.request, handleAllDocumentsGet),
    takeEvery(getDocument.request, handleDocumentGet),
    takeEvery(uploadDocument.request, handleDocumentUpload),
    takeEvery(copyDocument.request, handleDocumentCopy),
    takeLeading(createDocument.request, handleDocumentCreate),
    takeEvery(updateDocument.request, handleDocumentUpdate),
    takeLeading(deleteDocuments.request, handleDocumentsDelete),
    takeLeading(replicateTemplate.request, handleTemplateReplicate),
    takeLeading(mergeTemplate.request, handleTemplateMerge),
    takeLeading(activateTemplate.request, handleTemplateActivate),
    takeLeading(removeTemplateFromApi.request, handleTemplateRemoveFromApi),
    takeLeading(addTemplateToApi.request, handleTemplateAddToApi),
    takeLeading(sendDocumentBulk.request, handleDocumentsBulkSend),
    takeEvery(sendReminder.request, handleReminderSend),
    takeEvery(cleanFileData.request, handleFileDataClean),
    takeLatest(watchDocumentConvertionProgress.start, watchDocumentConvertion),
    takeEvery(getDocumentDownloadUrl.request, handleDocumentDownloadUrlGet),
    takeLatest(getDocumentConvertionStatus.request, handleDocumentConvertionStatusGet),
    takeLatest(getDocumentActivities.request, handleDocumentActivitiesGet),
    takeLeading(createDocumentFromFormRequest.request, handleDocumentCreateFromFormRequest),
    takeEvery(getFormRequest.request, handleFormRequestGet),
    takeEvery(disableForm.request, handleFormRequestDisable),
    takeEvery(enableForm.request, handleFormRequestEnable),
    takeLatest(getAllTemplates.request, handleAllTemplatesGet),
];
