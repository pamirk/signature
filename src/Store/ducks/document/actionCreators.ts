import { createAsyncAction, createAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';
import {
  Document,
  DocumentValuesPayload,
  DocumentsData,
  FormRequestsGetPayload,
  DocumentUpdatePayload,
  DocumentIdPayload,
  DocumentUploadPayload,
  DocumentsAllGetPayload,
  TemplateMergePayload,
  DocumentBulkSendValues,
  DocumentDownloadPayload,
  DocumentConvertionData,
  DocumentActivity,
  DocumentPartIdPayload,
  FormRequestDocumentValues,
  TemplateActivatePayload,
  DocumentDisableRemindersPayload,
  TemplatesAllGetPayload,
  DocumentActivitiesDownloadPayload,
  DocumentSeparateSignPayload,
  DocumentIdHashPayload,
  DocumentFileUploadResponse,
  DocumentDeletePayload,
  GetReportByEmailPayload,
} from 'Interfaces/Document';
import {
  NormalizedEntity,
  SignedPartDocumentActivityUrlResponse,
  SignedPartDocumentUrlResponse,
  SignedUrlResponse,
} from 'Interfaces/Common';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  DocumentCreateActionTypes,
  DocumentGetActionTypes,
  FormRequestsGetActionTypes,
  DocumentUploadActionTypes,
  DocumentsDeleteActionTypes,
  DocumentBulkSendActionTypes,
  DocumentUpdateActionTypes,
  SendReminderActionTypes,
  DocumentsAllGetActionTypes,
  DocumentFileCleanActionTypes,
  DocumentCopyActionTypes,
  DocumentDownloadUrlGetActionTypes,
  TemplateActivateActionTypes,
  DocumentRevertActionTypes,
  TemplateReplicateActionTypes,
  TemplateMergeActionTypes,
  DocumentConvertionActionTypes,
  DocumentConvertionStatusGetActionTypes,
  DocumentActivitiesGetActionTypes,
  DocumentCreateFromFormRequestActionTypes,
  TemplateAddToApiActionTypes,
  TemplateRemoveFromApiActionTypes,
  FormRequestGetActionTypes,
  FormRequestDisableActionTypes,
  FormRequestEnableActionTypes,
  ToggleEmailNotificationActionTypes,
  GetAllTemplatesActionTypes,
  DocumentCreateByExistTemplateTypes,
  DocumentActivitiesUrlGetActionTypes,
  DocumentSeparateSignActionTypes,
  DocumentSeparateDownloadUrlGetActionTypes,
  DocumentActivitiesSeparateSignActionTypes,
  DocumentDeleteActionTypes,
  DocumentGetByHashActionTypes,
  EmbedDocumentGetActionTypes,
  EmbedDocumentUpdateActionTypes,
  EmbedDocumentTokenInitType,
  EmbedDocumentTokenRemoveType,
  DocumentUpdateByExistTemplateTypes,
  GetReportByEmailActionTypes,
} from './actionTypes';
import { GridItem } from 'Interfaces/Grid';
import { TokenPayload } from 'Interfaces/User';

export const createDocument = createAsyncAction(
  DocumentCreateActionTypes.request,
  DocumentCreateActionTypes.success,
  DocumentCreateActionTypes.failure,
  DocumentCreateActionTypes.cancel,
)<
  [DocumentValuesPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createDocument = promisifyAsyncAction(createDocument);

export const createDocumentByExistTemplate = createAsyncAction(
  DocumentCreateByExistTemplateTypes.request,
  DocumentCreateByExistTemplateTypes.success,
  DocumentCreateByExistTemplateTypes.failure,
  DocumentCreateByExistTemplateTypes.cancel,
)<
  [DocumentValuesPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createDocumentByExistTemplate = promisifyAsyncAction(
  createDocumentByExistTemplate,
);

export const updateDocumentByExistTemplate = createAsyncAction(
  DocumentUpdateByExistTemplateTypes.request,
  DocumentUpdateByExistTemplateTypes.success,
  DocumentUpdateByExistTemplateTypes.failure,
  DocumentUpdateByExistTemplateTypes.cancel,
)<
  [DocumentValuesPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateDocumentByExistTemplate = promisifyAsyncAction(
  updateDocumentByExistTemplate,
);

export const getFormRequests = createAsyncAction(
  FormRequestsGetActionTypes.request,
  FormRequestsGetActionTypes.success,
  FormRequestsGetActionTypes.failure,
  FormRequestsGetActionTypes.cancel,
)<
  [FormRequestsGetPayload, PromisifiedActionMeta],
  [DocumentsData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getFormRequests = promisifyAsyncAction(getFormRequests);

export const getDocument = createAsyncAction(
  DocumentGetActionTypes.request,
  DocumentGetActionTypes.success,
  DocumentGetActionTypes.failure,
  DocumentGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocument = promisifyAsyncAction(getDocument);

export const getDocumentByHash = createAsyncAction(
  DocumentGetByHashActionTypes.request,
  DocumentGetByHashActionTypes.success,
  DocumentGetByHashActionTypes.failure,
  DocumentGetByHashActionTypes.cancel,
)<
  [DocumentIdHashPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentByHash = promisifyAsyncAction(getDocumentByHash);

export const uploadDocument = createAsyncAction(
  DocumentUploadActionTypes.request,
  DocumentUploadActionTypes.success,
  DocumentUploadActionTypes.failure,
  DocumentUploadActionTypes.cancel,
)<
  [DocumentUploadPayload, PromisifiedActionMeta],
  [DocumentFileUploadResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $uploadDocument = promisifyAsyncAction(uploadDocument);

export const updateDocument = createAsyncAction(
  DocumentUpdateActionTypes.request,
  DocumentUpdateActionTypes.success,
  DocumentUpdateActionTypes.failure,
  DocumentUpdateActionTypes.cancel,
)<
  [DocumentUpdatePayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateDocument = promisifyAsyncAction(updateDocument);

interface DocumentsDeletePayload {
  documentIds: string[];
}

export const deleteDocuments = createAsyncAction(
  DocumentsDeleteActionTypes.request,
  DocumentsDeleteActionTypes.success,
  DocumentsDeleteActionTypes.failure,
  DocumentsDeleteActionTypes.cancel,
)<
  [DocumentsDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteDocuments = promisifyAsyncAction(deleteDocuments);

interface SendReminderPayload {
  userIds: string[];
}

export const sendReminder = createAsyncAction(
  SendReminderActionTypes.request,
  SendReminderActionTypes.success,
  SendReminderActionTypes.failure,
  SendReminderActionTypes.cancel,
)<
  [SendReminderPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendReminder = promisifyAsyncAction(sendReminder);

export const watchDocumentConvertionProgress = {
  start: createAction(
    DocumentConvertionActionTypes.start,
    (payload: DocumentIdPayload) => payload,
  )(),
  stop: createAction(DocumentConvertionActionTypes.stop)(),
  failure: createAction(DocumentConvertionActionTypes.failure, error => error)(),
};

export const getAllDocuments = createAsyncAction(
  DocumentsAllGetActionTypes.request,
  DocumentsAllGetActionTypes.success,
  DocumentsAllGetActionTypes.failure,
  DocumentsAllGetActionTypes.cancel,
)<
  [DocumentsAllGetPayload, PromisifiedActionMeta],
  [NormalizedEntity<Document>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getAllDocuments = promisifyAsyncAction(getAllDocuments);

export const cleanFileData = createAsyncAction(
  DocumentFileCleanActionTypes.request,
  DocumentFileCleanActionTypes.success,
  DocumentFileCleanActionTypes.failure,
  DocumentFileCleanActionTypes.cancel,
)<
  [DocumentPartIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $cleanFileData = promisifyAsyncAction(cleanFileData);

export const copyDocument = createAsyncAction(
  DocumentCopyActionTypes.request,
  DocumentCopyActionTypes.success,
  DocumentCopyActionTypes.failure,
  DocumentCopyActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $copyDocument = promisifyAsyncAction(copyDocument);

export const getDocumentDownloadUrl = createAsyncAction(
  DocumentDownloadUrlGetActionTypes.request,
  DocumentDownloadUrlGetActionTypes.success,
  DocumentDownloadUrlGetActionTypes.failure,
  DocumentDownloadUrlGetActionTypes.cancel,
)<
  [DocumentDownloadPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentDownloadUrl = promisifyAsyncAction(getDocumentDownloadUrl);

export const getDocumentActivitiesDownloadUrl = createAsyncAction(
  DocumentActivitiesUrlGetActionTypes.request,
  DocumentActivitiesUrlGetActionTypes.success,
  DocumentActivitiesUrlGetActionTypes.failure,
  DocumentActivitiesUrlGetActionTypes.cancel,
)<
  [DocumentActivitiesDownloadPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentActivitiesDownloadUrl = promisifyAsyncAction(
  getDocumentActivitiesDownloadUrl,
);

export const activateTemplate = createAsyncAction(
  TemplateActivateActionTypes.request,
  TemplateActivateActionTypes.success,
  TemplateActivateActionTypes.failure,
  TemplateActivateActionTypes.cancel,
)<
  [TemplateActivatePayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $activateTemplate = promisifyAsyncAction(activateTemplate);

export const addTemplateToApi = createAsyncAction(
  TemplateAddToApiActionTypes.request,
  TemplateAddToApiActionTypes.success,
  TemplateAddToApiActionTypes.failure,
  TemplateAddToApiActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $addTemplateToApi = promisifyAsyncAction(addTemplateToApi);

export const removeTemplateFromApi = createAsyncAction(
  TemplateRemoveFromApiActionTypes.request,
  TemplateRemoveFromApiActionTypes.success,
  TemplateRemoveFromApiActionTypes.failure,
  TemplateRemoveFromApiActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $removeTemplateFromApi = promisifyAsyncAction(removeTemplateFromApi);

export const replicateTemplate = createAsyncAction(
  TemplateReplicateActionTypes.request,
  TemplateReplicateActionTypes.success,
  TemplateReplicateActionTypes.failure,
  TemplateReplicateActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $replicateTemplate = promisifyAsyncAction(replicateTemplate);

export const mergeTemplate = createAsyncAction(
  TemplateMergeActionTypes.request,
  TemplateMergeActionTypes.success,
  TemplateMergeActionTypes.failure,
  TemplateMergeActionTypes.cancel,
)<
  [TemplateMergePayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $mergeTemplate = promisifyAsyncAction(mergeTemplate);

export const revertDocument = createAsyncAction(
  DocumentRevertActionTypes.request,
  DocumentRevertActionTypes.success,
  DocumentRevertActionTypes.failure,
  DocumentRevertActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $revertDocument = promisifyAsyncAction(revertDocument);

export const sendDocumentBulk = createAsyncAction(
  DocumentBulkSendActionTypes.request,
  DocumentBulkSendActionTypes.success,
  DocumentBulkSendActionTypes.failure,
  DocumentBulkSendActionTypes.cancel,
)<
  [DocumentBulkSendValues, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendDocumentBulk = promisifyAsyncAction(sendDocumentBulk);

export const getDocumentConvertionStatus = createAsyncAction(
  DocumentConvertionStatusGetActionTypes.request,
  DocumentConvertionStatusGetActionTypes.success,
  DocumentConvertionStatusGetActionTypes.failure,
  DocumentConvertionStatusGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [DocumentConvertionData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const getDocumentActivities = createAsyncAction(
  DocumentActivitiesGetActionTypes.request,
  DocumentActivitiesGetActionTypes.success,
  DocumentActivitiesGetActionTypes.failure,
  DocumentActivitiesGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [DocumentActivity[], PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentActivities = promisifyAsyncAction(getDocumentActivities);

export const createDocumentFromFormRequest = createAsyncAction(
  DocumentCreateFromFormRequestActionTypes.request,
  DocumentCreateFromFormRequestActionTypes.success,
  DocumentCreateFromFormRequestActionTypes.failure,
  DocumentCreateFromFormRequestActionTypes.cancel,
)<
  [FormRequestDocumentValues, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createDocumentFromFormRequest = promisifyAsyncAction(
  createDocumentFromFormRequest,
);

export const getFormRequest = createAsyncAction(
  FormRequestGetActionTypes.request,
  FormRequestGetActionTypes.success,
  FormRequestGetActionTypes.failure,
  FormRequestGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getFormRequest = promisifyAsyncAction(getFormRequest);

export const disableForm = createAsyncAction(
  FormRequestDisableActionTypes.request,
  FormRequestDisableActionTypes.success,
  FormRequestDisableActionTypes.failure,
  FormRequestDisableActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $disableForm = promisifyAsyncAction(disableForm);

export const enableForm = createAsyncAction(
  FormRequestEnableActionTypes.request,
  FormRequestEnableActionTypes.success,
  FormRequestEnableActionTypes.failure,
  FormRequestEnableActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $enableForm = promisifyAsyncAction(enableForm);

export const toggleEmailNotification = createAsyncAction(
  ToggleEmailNotificationActionTypes.request,
  ToggleEmailNotificationActionTypes.success,
  ToggleEmailNotificationActionTypes.failure,
  ToggleEmailNotificationActionTypes.cancel,
)<
  [DocumentDisableRemindersPayload, PromisifiedActionMeta],
  [GridItem, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $toggleEmailNotification = promisifyAsyncAction(toggleEmailNotification);

export const getAllTemplates = createAsyncAction(
  GetAllTemplatesActionTypes.request,
  GetAllTemplatesActionTypes.success,
  GetAllTemplatesActionTypes.failure,
  GetAllTemplatesActionTypes.cancel,
)<
  [TemplatesAllGetPayload, PromisifiedActionMeta],
  [NormalizedEntity<Document>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getAllTemplates = promisifyAsyncAction(getAllTemplates);

export const signSeparateDocument = createAsyncAction(
  DocumentSeparateSignActionTypes.request,
  DocumentSeparateSignActionTypes.success,
  DocumentSeparateSignActionTypes.failure,
  DocumentSeparateSignActionTypes.cancel,
)<
  [DocumentSeparateSignPayload, PromisifiedActionMeta],
  [SignedPartDocumentUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signSeparateDocument = promisifyAsyncAction(signSeparateDocument);

export const getSeparateDocumentDownloadUrl = createAsyncAction(
  DocumentSeparateDownloadUrlGetActionTypes.request,
  DocumentSeparateDownloadUrlGetActionTypes.success,
  DocumentSeparateDownloadUrlGetActionTypes.failure,
  DocumentSeparateDownloadUrlGetActionTypes.cancel,
)<
  [DocumentSeparateSignPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSeparateDocumentDownloadUrl = promisifyAsyncAction(
  getSeparateDocumentDownloadUrl,
);

export const signSeparateDocumentActivities = createAsyncAction(
  DocumentActivitiesSeparateSignActionTypes.request,
  DocumentActivitiesSeparateSignActionTypes.success,
  DocumentActivitiesSeparateSignActionTypes.failure,
  DocumentActivitiesSeparateSignActionTypes.cancel,
)<
  [DocumentSeparateSignPayload, PromisifiedActionMeta],
  [SignedPartDocumentActivityUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signSeparateDocumentActivities = promisifyAsyncAction(
  signSeparateDocumentActivities,
);

export const deleteDocument = createAsyncAction(
  DocumentDeleteActionTypes.request,
  DocumentDeleteActionTypes.success,
  DocumentDeleteActionTypes.failure,
  DocumentDeleteActionTypes.cancel,
)<
  [DocumentDeletePayload, PromisifiedActionMeta],
  [DocumentDeletePayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteDocument = promisifyAsyncAction(deleteDocument);

export const getEmbedDocument = createAsyncAction(
  EmbedDocumentGetActionTypes.request,
  EmbedDocumentGetActionTypes.success,
  EmbedDocumentGetActionTypes.failure,
  EmbedDocumentGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getEmbedDocument = promisifyAsyncAction(getEmbedDocument);

export const updateEmbedDocument = createAsyncAction(
  EmbedDocumentUpdateActionTypes.request,
  EmbedDocumentUpdateActionTypes.success,
  EmbedDocumentUpdateActionTypes.failure,
  EmbedDocumentUpdateActionTypes.cancel,
)<
  [DocumentUpdatePayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateEmbedDocument = promisifyAsyncAction(updateEmbedDocument);

export const initEmbedDocumentToken = createAction(
  EmbedDocumentTokenInitType,
  (payload: TokenPayload) => payload,
)();

export const removeEmbedDocumenToken = createAction(EmbedDocumentTokenRemoveType)();

export const getReportByEmail = createAsyncAction(
  GetReportByEmailActionTypes.request,
  GetReportByEmailActionTypes.success,
  GetReportByEmailActionTypes.failure,
  GetReportByEmailActionTypes.cancel,
)<
  [GetReportByEmailPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getReportByEmail = promisifyAsyncAction(getReportByEmail);
