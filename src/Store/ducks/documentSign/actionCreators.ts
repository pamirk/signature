import { createAsyncAction, createAction } from 'typesafe-actions';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  SignerOption,
  DocumentIdPayload,
  SignerDocumentIdPayload,
  Document,
  DocumentForSigners,
  DocumentSubmitPayload,
  RemindersSendPayload,
  DocumentPreviewPagesPayload,
  DocumentSharePayload,
  SignerIdPayload,
  CodeAccessPayload,
  SigningUrlGetPayload,
  SigningUrlPayload,
} from 'Interfaces/Document';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import {
  AvailableSignersOptionsGetTypes,
  SignerDocumentGetTypes,
  DocumentSigningInitType,
  DocumentSigningFinishType,
  SubmitSignedDocumentTypes,
  DocumentSendOutActionTypes,
  RemindersSendActionTypes,
  SignatoryOpenedSendActionTypes,
  DocumentPreviewPagesGetActionTypes,
  DocumentShareUrlGetActionTypes,
  DocumentShareActionTypes,
  DocumentConvertionStatusActionTypes,
  DocumentSendCodeAccessActionTypes,
  SigningUrlGetActionTypes,
} from './actionTypes';
import { TokenPayload } from 'Interfaces/User';
import { SignedUrlResponse } from 'Interfaces/Common';

export const sendDocumentOut = createAsyncAction(
  DocumentSendOutActionTypes.request,
  DocumentSendOutActionTypes.success,
  DocumentSendOutActionTypes.failure,
  DocumentSendOutActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [Document, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendDocumentOut = promisifyAsyncAction(sendDocumentOut);

export const initDocumentSigning = createAction(
  DocumentSigningInitType,
  (payload: TokenPayload) => payload,
)();

export const finishDocumentSigning = createAction(DocumentSigningFinishType)();

export const getSignerDocument = createAsyncAction(
  SignerDocumentGetTypes.request,
  SignerDocumentGetTypes.success,
  SignerDocumentGetTypes.failure,
  SignerDocumentGetTypes.cancel,
)<
  [SignerDocumentIdPayload, PromisifiedActionMeta],
  [DocumentForSigners, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignerDocument = promisifyAsyncAction(getSignerDocument);

export const getAvailableSignersOptions = createAsyncAction(
  AvailableSignersOptionsGetTypes.request,
  AvailableSignersOptionsGetTypes.success,
  AvailableSignersOptionsGetTypes.failure,
  AvailableSignersOptionsGetTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [SignerOption[], PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getAvailableSignersOptions = promisifyAsyncAction(
  getAvailableSignersOptions,
);

export const submitSignedDocument = createAsyncAction(
  SubmitSignedDocumentTypes.request,
  SubmitSignedDocumentTypes.success,
  SubmitSignedDocumentTypes.failure,
  SubmitSignedDocumentTypes.cancel,
)<
  [DocumentSubmitPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $submitSignedDocument = promisifyAsyncAction(submitSignedDocument);

export const sendReminders = createAsyncAction(
  RemindersSendActionTypes.request,
  RemindersSendActionTypes.success,
  RemindersSendActionTypes.failure,
  RemindersSendActionTypes.cancel,
)<
  [RemindersSendPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendReminders = promisifyAsyncAction(sendReminders);

export const sendSignatoryOpened = createAsyncAction(
  SignatoryOpenedSendActionTypes.request,
  SignatoryOpenedSendActionTypes.success,
  SignatoryOpenedSendActionTypes.failure,
  SignatoryOpenedSendActionTypes.cancel,
)<
  [SignerDocumentIdPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendSignatoryOpened = promisifyAsyncAction(sendSignatoryOpened);

export const getDocumentPreviewPages = createAsyncAction(
  DocumentPreviewPagesGetActionTypes.request,
  DocumentPreviewPagesGetActionTypes.success,
  DocumentPreviewPagesGetActionTypes.failure,
  DocumentPreviewPagesGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [DocumentPreviewPagesPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentPreviewPages = promisifyAsyncAction(getDocumentPreviewPages);

export const getDocumentShareUrl = createAsyncAction(
  DocumentShareUrlGetActionTypes.request,
  DocumentShareUrlGetActionTypes.success,
  DocumentShareUrlGetActionTypes.failure,
  DocumentShareUrlGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentShareUrl = promisifyAsyncAction(getDocumentShareUrl);

export const shareDocument = createAsyncAction(
  DocumentShareActionTypes.request,
  DocumentShareActionTypes.success,
  DocumentShareActionTypes.failure,
  DocumentShareActionTypes.cancel,
)<
  [DocumentSharePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $shareDocument = promisifyAsyncAction(shareDocument);

export const getDocumentConvertionStatus = createAsyncAction(
  DocumentConvertionStatusActionTypes.request,
  DocumentConvertionStatusActionTypes.success,
  DocumentConvertionStatusActionTypes.failure,
  DocumentConvertionStatusActionTypes.cancel,
)<
  [SignerIdPayload, PromisifiedActionMeta],
  [boolean, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getDocumentConvertionStatus = promisifyAsyncAction(
  getDocumentConvertionStatus,
);

export const sendCodeAccess = createAsyncAction(
  DocumentSendCodeAccessActionTypes.request,
  DocumentSendCodeAccessActionTypes.success,
  DocumentSendCodeAccessActionTypes.failure,
  DocumentSendCodeAccessActionTypes.cancel,
)<
  [CodeAccessPayload, PromisifiedActionMeta],
  [DocumentForSigners, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendCodeAccess = promisifyAsyncAction(sendCodeAccess);

export const getSigningUrl = createAsyncAction(
  SigningUrlGetActionTypes.request,
  SigningUrlGetActionTypes.success,
  SigningUrlGetActionTypes.failure,
  SigningUrlGetActionTypes.cancel,
)<
  [SigningUrlGetPayload, PromisifiedActionMeta],
  [SigningUrlPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSigningUrl = promisifyAsyncAction(getSigningUrl);
