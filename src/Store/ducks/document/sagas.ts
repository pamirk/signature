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
import lodash, { isEmpty } from 'lodash';
import { getType } from 'typesafe-actions';
import Axios from 'axios';
import { UserReducerState } from 'Store/ducks/user/reducer';
import DocumentApiService from 'Services/Api/Document';
import DocumentSignApi from 'Services/Api/DocumentSign';
import {
  NormalizedEntity,
  SignedPartDocumentActivityUrlResponse,
  SignedPartDocumentUrlResponse,
  SignedUrlResponse,
} from 'Interfaces/Common';
import {
  Document,
  DocumentTypes,
  DocumentConvertionData,
  DocumentActivity,
  DocumentFileUploadResponse,
  DocumentFileUploadRequest,
} from 'Interfaces/Document';
import { selectEmbedToken, selectSignToken } from 'Utils/selectors';
import {
  createDocument,
  getFormRequests,
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
  getAllTemplates,
  createDocumentByExistTemplate,
  updateDocumentByExistTemplate,
  getDocumentActivitiesDownloadUrl,
  signSeparateDocument,
  getSeparateDocumentDownloadUrl,
  signSeparateDocumentActivities,
  deleteDocument,
  getEmbedDocument,
  updateEmbedDocument,
  getDocumentByHash,
  getReportByEmail,
} from './actionCreators';

function* handleDocumentCreate({
  payload,
  meta,
}: ReturnType<typeof createDocument.request>) {
  const { values } = payload;

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
      ...document,
    };
    yield put(createDocument.success(withConvertedDate, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(createDocument.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createDocument.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleDocumentCreateByExistTemplate({
  payload,
  meta,
}: ReturnType<typeof createDocumentByExistTemplate.request>) {
  const { values } = payload;
  try {
    const createEndpoint = DocumentApiService.createDocumentByExistTemplate;
    const document = yield call(createEndpoint, values);
    const withConvertedDate: Document = {
      ...document,
    };
    yield put(
      createDocumentByExistTemplate.success(withConvertedDate, {
        ...meta,
        isLeading: true,
      }),
    );
  } catch (error) {
    yield put(createDocumentByExistTemplate.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        createDocumentByExistTemplate.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleDocumentUpdateByExistTemplate({
  payload,
  meta,
}: ReturnType<typeof updateDocumentByExistTemplate.request>) {
  const { values } = payload;
  try {
    const document = yield call(DocumentApiService.updateDocumentByExistTemplate, values);
    yield put(
      updateDocumentByExistTemplate.success(document, { ...meta, isLeading: true }),
    );
  } catch (error) {
    yield put(updateDocumentByExistTemplate.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        updateDocumentByExistTemplate.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleFormRequestsGet({
  payload,
  meta,
}: ReturnType<typeof getFormRequests.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const { items, totalItems, totalPages, itemCount } = yield call(
      DocumentApiService.getFormRequests,
      payload,
      {
        cancelToken: cancelToken.token,
      },
    );
    const normalizedDocuments: NormalizedEntity<Document> = lodash.keyBy(items, 'id');
    yield put(
      getFormRequests.success(
        {
          documents: normalizedDocuments,
          paginationData: { totalItems, pageCount: totalPages, itemsCount: itemCount },
        },
        meta,
      ),
    );
  } catch (error) {
    yield put(getFormRequests.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getFormRequests.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleDocumentGet({ payload, meta }: ReturnType<typeof getDocument.request>) {
  try {
    const document: Document = yield call(DocumentApiService.getDocument, payload);
    yield put(getDocument.success(document, meta));
  } catch (error) {
    yield put(getDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocument.cancel(undefined, meta));
    }
  }
}

function* handleDocumentByHash({
  payload,
  meta,
}: ReturnType<typeof getDocumentByHash.request>) {
  try {
    const document: Document = yield call(DocumentApiService.getDocumentByHash, payload);
    yield put(getDocumentByHash.success(document, meta));
  } catch (e) {
    yield put(getDocumentByHash.failure(e, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocumentByHash.cancel(undefined, meta));
    }
  }
}

function* handleDocumentUpload({
  payload,
  meta,
}: ReturnType<typeof uploadDocument.request>) {
  try {
    const { documentId, file } = payload;

    const body: DocumentFileUploadRequest = {
      filename: file.name,
    };

    const fileUploadLinkResponse: DocumentFileUploadResponse = yield call(
      DocumentApiService.getUploadDocumentSignedLink,
      documentId,
      body,
    );

    if (isEmpty(fileUploadLinkResponse)) {
      yield cancel();
    }

    yield call(DocumentApiService.uploadFile, fileUploadLinkResponse.signed_url, file);

    yield put(uploadDocument.success(fileUploadLinkResponse, meta));
  } catch (error) {
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
  const { values } = payload;
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
  } catch (error) {
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
  } catch (error) {
    yield put(deleteDocuments.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteDocuments.cancel(undefined, meta));
    }
  }
}

function* handleReminderSend({ payload, meta }: ReturnType<typeof sendReminder.request>) {
  const { userIds } = payload;
  try {
    yield call(DocumentApiService.sendReminder, userIds);
    yield put(sendReminder.success(undefined, meta));
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    yield put(cleanFileData.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(cleanFileData.cancel(undefined, meta));
    }
  }
}

function* handleDocumentCopy({ payload, meta }: ReturnType<typeof copyDocument.request>) {
  try {
    const document: Document = yield call(DocumentApiService.copyDocument, payload);

    yield put(copyDocument.success(document, meta));
  } catch (error) {
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
      : yield call(DocumentSignApi.getDownloadUrlByJWT, { payload, token });

    yield put(getDocumentDownloadUrl.success(res, meta));
  } catch (err) {
    yield put(getDocumentDownloadUrl.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocumentDownloadUrl.cancel(undefined, meta));
    }
  }
}

function* handleDocumentActivitiesDownloadUrlGet({ payload, meta }) {
  try {
    const isHash = !!payload.hash;
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const res: SignedUrlResponse = isHash
      ? yield call(DocumentSignApi.getActivitiesDownloadUrlByHash, payload)
      : yield call(DocumentSignApi.getActivitiesDownloadUrlByJWT, { payload, token });

    yield put(getDocumentActivitiesDownloadUrl.success(res, meta));
  } catch (err) {
    yield put(getDocumentActivitiesDownloadUrl.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getDocumentActivitiesDownloadUrl.cancel(undefined, meta));
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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

    yield put(revertDocument.success(document, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(revertDocument.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(revertDocument.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleTemplateReplicate({
  payload,
  meta,
}: ReturnType<typeof replicateTemplate.request>) {
  try {
    const document: Document = yield call(DocumentApiService.replicateTemplate, payload);

    yield put(replicateTemplate.success(document, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(replicateTemplate.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(replicateTemplate.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleTemplateMerge({
  payload,
  meta,
}: ReturnType<typeof mergeTemplate.request>) {
  try {
    const document: Document = yield call(DocumentApiService.mergeTemplate, payload);

    yield put(mergeTemplate.success(document, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(mergeTemplate.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(mergeTemplate.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleDocumentsBulkSend({
  payload,
  meta,
}: ReturnType<typeof sendDocumentBulk.request>) {
  try {
    yield call(DocumentSignApi.sendDocumentBulk, payload);
    yield put(sendDocumentBulk.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(sendDocumentBulk.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(sendDocumentBulk.cancel(undefined, { ...meta, isLeading: true }));
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
  } catch (err) {
    yield put(getDocumentConvertionStatus.failure(err, meta));
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
      const { cancel } = yield race({
        cancel: take(getType(watchDocumentConvertionProgress.stop)),
        throttle: delay(3000, true),
      });

      if (cancel) {
        break;
      }

      yield put(getDocumentConvertionStatus.request(payload, {}));
    }
  } catch (err) {
    yield put(watchDocumentConvertionProgress.failure(err));
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
  } catch (error) {
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
      ...document,
    };
    yield put(
      createDocumentFromFormRequest.success(withConvertedDate, {
        ...meta,
        isLeading: true,
      }),
    );
  } catch (error) {
    yield put(createDocumentFromFormRequest.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        createDocumentFromFormRequest.cancel(undefined, { ...meta, isLeading: true }),
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    yield put(enableForm.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(enableForm.cancel(undefined, meta));
    }
  }
}

function* handleDocumentSeparateSign({
  payload,
  meta,
}: ReturnType<typeof signSeparateDocument.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);
    const res: SignedPartDocumentUrlResponse = yield call(
      DocumentSignApi.signSeparateDocumentByJWT,
      { payload, token },
    );
    yield put(signSeparateDocument.success({ ...res, id: payload.documentId }, meta));
  } catch (error) {
    yield put(signSeparateDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(signSeparateDocument.cancel(undefined, meta));
    }
  }
}

function* handleSeparateDocumentDownloadUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSeparateDocumentDownloadUrl.request>) {
  try {
    const isHash = !!payload.hash;
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const res: SignedUrlResponse = isHash
      ? yield call(DocumentSignApi.getDownloadUrlByHash, payload)
      : yield call(DocumentSignApi.getSeparateDocumentDownloadUrlByJWT, {
          payload,
          token,
        });
    yield put(getSeparateDocumentDownloadUrl.success(res, meta));
  } catch (error) {
    yield put(getSeparateDocumentDownloadUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSeparateDocumentDownloadUrl.cancel(undefined, meta));
    }
  }
}

function* handleDocumentActivitiesSeparateSign({
  payload,
  meta,
}: ReturnType<typeof signSeparateDocumentActivities.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);
    const res: SignedPartDocumentActivityUrlResponse = yield call(
      DocumentSignApi.signSeparateDocumentActivitiesByJWT,
      { payload, token },
    );
    yield put(
      signSeparateDocumentActivities.success({ ...res, id: payload.documentId }, meta),
    );
  } catch (error) {
    yield put(signSeparateDocumentActivities.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(signSeparateDocumentActivities.cancel(undefined, meta));
    }
  }
}

function* handleDocumentDelete({
  payload,
  meta,
}: ReturnType<typeof deleteDocument.request>) {
  try {
    const { documentId, isLocalDelete } = payload;

    if (!isLocalDelete) {
      yield call(DocumentApiService.deleteDocument, { documentId });
    }

    yield put(deleteDocument.success({ documentId }, meta));
  } catch (error) {
    yield put(deleteDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteDocument.cancel(undefined, meta));
    }
  }
}

function* handleEmbedDocumentGet({
  payload,
  meta,
}: ReturnType<typeof getEmbedDocument.request>) {
  try {
    const token: UserReducerState['embedToken'] = yield select(selectEmbedToken);
    const document: Document = yield call(DocumentApiService.getEmbedDocument, {
      token,
      payload,
    });
    yield put(getEmbedDocument.success(document, meta));
  } catch (error) {
    yield put(getEmbedDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getEmbedDocument.cancel(undefined, meta));
    }
  }
}

function* handleEmbedDocumentUpdate({
  payload,
  meta,
}: ReturnType<typeof updateEmbedDocument.request>) {
  try {
    const token: UserReducerState['embedToken'] = yield select(selectEmbedToken);
    const document = yield call(DocumentApiService.updateEmbedDocument, {
      token,
      payload,
    });
    yield put(updateEmbedDocument.success(document, meta));
  } catch (error) {
    yield put(updateEmbedDocument.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(updateEmbedDocument.cancel(undefined, meta));
    }
  }
}

function* handleReportByEmailGet({
  meta,
  payload,
}: ReturnType<typeof getReportByEmail.request>) {
  try {
    yield call(DocumentApiService.getReportByEmail, payload);

    yield put(getReportByEmail.success(undefined, meta));
  } catch (error) {
    yield put(getReportByEmail.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getReportByEmail.cancel(undefined, meta));
    }
  }
}

export default [
  takeLatest(getFormRequests.request, handleFormRequestsGet),
  takeLeading(revertDocument.request, handleDocumentRevert),
  takeLatest(getAllDocuments.request, handleAllDocumentsGet),
  takeEvery(getDocument.request, handleDocumentGet),
  takeEvery(getDocumentByHash.request, handleDocumentByHash),
  takeEvery(uploadDocument.request, handleDocumentUpload),
  takeEvery(copyDocument.request, handleDocumentCopy),
  takeLeading(createDocument.request, handleDocumentCreate),
  takeLeading(createDocumentByExistTemplate.request, handleDocumentCreateByExistTemplate),
  takeLeading(updateDocumentByExistTemplate.request, handleDocumentUpdateByExistTemplate),
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
  takeEvery(
    getDocumentActivitiesDownloadUrl.request,
    handleDocumentActivitiesDownloadUrlGet,
  ),
  takeLatest(getDocumentConvertionStatus.request, handleDocumentConvertionStatusGet),
  takeLatest(getDocumentActivities.request, handleDocumentActivitiesGet),
  takeLeading(createDocumentFromFormRequest.request, handleDocumentCreateFromFormRequest),
  takeEvery(getFormRequest.request, handleFormRequestGet),
  takeEvery(disableForm.request, handleFormRequestDisable),
  takeEvery(enableForm.request, handleFormRequestEnable),
  takeLatest(getAllTemplates.request, handleAllTemplatesGet),
  takeLeading(signSeparateDocument.request, handleDocumentSeparateSign),
  takeLeading(
    getSeparateDocumentDownloadUrl.request,
    handleSeparateDocumentDownloadUrlGet,
  ),
  takeLeading(
    signSeparateDocumentActivities.request,
    handleDocumentActivitiesSeparateSign,
  ),
  takeLeading(deleteDocument.request, handleDocumentDelete),
  takeEvery(getEmbedDocument.request, handleEmbedDocumentGet),
  takeEvery(updateEmbedDocument.request, handleEmbedDocumentUpdate),
  takeEvery(getReportByEmail.request, handleReportByEmailGet),
];
