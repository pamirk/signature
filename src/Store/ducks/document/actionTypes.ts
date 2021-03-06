export enum DocumentCreateActionTypes {
  request = 'document/CREATE/REQUEST',
  success = 'document/CREATE/SUCCESS',
  failure = 'document/CREATE/FAILURE',
  cancel = 'document/CREATE/CANCEL',
}

export enum DocumentsGetActionTypes {
  request = 'document/GET_DOCUMENTS/REQUEST',
  success = 'document/GET_DOCUMENTS/SUCCESS',
  failure = 'document/GET_DOCUMENTS/FAILURE',
  cancel = 'document/GET_DOCUMENTS/CANCEL',
}

export enum DocumentsDeleteActionTypes {
  request = 'document/DELETE_DOCUMENTS/REQUEST',
  success = 'document/DELETE_DOCUMENTS/SUCCESS',
  failure = 'document/DELETE_DOCUMENTS/FAILURE',
  cancel = 'document/DELETE_DOCUMENTS/CANCEL',
}

export enum DocumentGetActionTypes {
  request = 'document/GET_DOCUMENT/REQUEST',
  success = 'document/GET_DOCUMENT/SUCCESS',
  failure = 'document/GET_DOCUMENT/FAILURE',
  cancel = 'document/GET_DOCUMENT/CANCEL',
}

export enum DocumentUploadActionTypes {
  request = 'document/UPLOAD/REQUEST',
  success = 'document/UPLOAD/SUCCESS',
  failure = 'document/UPLOAD/FAILURE',
  cancel = 'document/UPLOAD/CANCEL',
}

export enum DocumentFileCleanActionTypes {
  request = 'document/FILE_DATA_CLEAN/REQUEST',
  success = 'document/FILE_DATA_CLEAN/SUCCESS',
  failure = 'document/FILE_DATA_CLEAN/FAILURE',
  cancel = 'document/FILE_DATA_CLEAN/CANCEL',
}

export enum DocumentUpdateActionTypes {
  request = 'document/UPDATE_DOCUMENT/REQUEST',
  success = 'document/UPDATE_DOCUMENT/SUCCESS',
  failure = 'document/UPDATE_DOCUMENT/FAILURE',
  cancel = 'document/UPDATE_DOCUMENT/CANCEL',
}

export enum SendReminderActionTypes {
  request = 'document/SEND_REMINDER/REQUEST',
  success = 'document/SEND_REMINDER/SUCCESS',
  failure = 'document/SEND_REMINDER/FAILURE',
  cancel = 'document/SEND_REMINDER/CANCEL',
}

export enum DocumentConvertionActionTypes {
  start = 'document/DOCUMENT_CONVERTION/START',
  stop = 'document/DOCUMENT_CONVERTION/STOP',
  failure = 'document/DOCUMENT_CONVERTION/FAILURE',
}

export enum DocumentsAllGetActionTypes {
  request = 'document/GET_ALL_DOCUMENTS/REQUEST',
  success = 'document/GET_ALL_DOCUMENTS/SUCCESS',
  failure = 'document/GET_ALL_DOCUMENTS/FAILURE',
  cancel = 'document/GET_ALL_DOCUMENTS/CANCEL',
}

export enum DocumentCopyActionTypes {
  request = 'document/COPY_DOCUMENT/REQUEST',
  success = 'document/COPY_DOCUMENT/SUCCESS',
  failure = 'document/COPY_DOCUMENT/FAILURE',
  cancel = 'document/COPY_DOCUMENT/CANCEL',
}

export enum DocumentDownloadUrlGetActionTypes {
  request = 'document/GET_DOCUMENT_DOWNLOAD_URL/REQUEST',
  success = 'document/GET_DOCUMENT_DOWNLOAD_URL/SUCCESS',
  failure = 'document/GET_DOCUMENT_DOWNLOAD_URL/FAILURE',
  cancel = 'document/GET_DOCUMENT_DOWNLOAD_URLT/CANCEL',
}

export enum TemplateActivateActionTypes {
  request = 'document/TEMPLATE_ACTIVATE/REQUEST',
  success = 'document/TEMPLATE_ACTIVATE/SUCCESS',
  failure = 'document/TEMPLATE_ACTIVATE/FAILURE',
  cancel = 'document/TEMPLATE_ACTIVATE/CANCEL',
}
export enum TemplateReplicateActionTypes {
  request = 'document/TEMPLATE_REPLICATE/REQUEST',
  success = 'document/TEMPLATE_REPLICATE/SUCCESS',
  failure = 'document/TEMPLATE_REPLICATE/FAILURE',
  cancel = 'document/TEMPLATE_REPLICATE/CANCEL',
}

export enum TemplateMergeActionTypes {
  request = 'document/MERGE_TEMPLATE/REQUEST',
  success = 'document/MERGE_TEMPLATE/SUCCESS',
  failure = 'document/MERGE_TEMPLATE/FAILURE',
  cancel = 'document/MERGE_TEMPLATE/CANCEL',
}

export enum TemplateAddToApiActionTypes {
  request = 'document/ADD_TO_API_TEMPLATE/REQUEST',
  success = 'document/ADD_TO_API_TEMPLATE/SUCCESS',
  failure = 'document/ADD_TO_API_TEMPLATE/FAILURE',
  cancel = 'document/ADD_TO_API_TEMPLATE/CANCEL',
}

export enum TemplateRemoveFromApiActionTypes {
  request = 'document/REMOVE_FROM_API_TEMPLATE/REQUEST',
  success = 'document/REMOVE_FROM_API_TEMPLATE/SUCCESS',
  failure = 'document/REMOVE_FROM_API_TEMPLATE/FAILURE',
  cancel = 'document/REMOVE_FROM_API_TEMPLATE/CANCEL',
}

export enum DocumentRevertActionTypes {
  request = 'document/REVERT_DOCUMENT/REQUEST',
  success = 'document/REVERT_DOCUMENT/SUCCESS',
  failure = 'document/REVERT_DOCUMENT/FAILURE',
  cancel = 'document/REVERT_DOCUMENT/CANCEL',
}

export enum DocumentBulkSendActionTypes {
  request = 'document/BULK_SEND/REQUEST',
  success = 'document/BULK_SEND/SUCCESS',
  failure = 'document/BULK_SEND/FAILURE',
  cancel = 'document/BULK_SEND/CANCEL',
}

export enum DocumentConvertionStatusGetActionTypes {
  request = 'document/GET_CONVERTION_STATUS/REQUEST',
  success = 'document/GET_CONVERTION_STATUS/SUCCESS',
  failure = 'document/GET_CONVERTION_STATUS/FAILURE',
  cancel = 'document/GET_CONVERTION_STATUS/CANCEL',
}

export enum DocumentActivitiesGetActionTypes {
  request = 'document/GET_ACTIVITIES/REQUEST',
  success = 'document/GET_ACTIVITIES/SUCCESS',
  failure = 'document/GET_ACTIVITIES/FAILURE',
  cancel = 'document/GET_ACTIVITIES/CANCEL',
}
export enum DocumentCreateFromFormRequestActionTypes {
  request = 'document/form-request/CREATE/REQUEST',
  success = 'document/form-request/CREATE/SUCCESS',
  failure = 'document/form-request/CREATE/FAILURE',
  cancel = 'document/form-request/CREATE/CANCEL',
}

export enum FormRequestGetActionTypes {
  request = 'document/GET_FORM_REQUEST/REQUEST',
  success = 'document/GET_FORM_REQUEST/SUCCESS',
  failure = 'document/GET_FORM_REQUEST/FAILURE',
  cancel = 'document/GET_FORM_REQUEST/CANCEL',
}

export enum FormRequestDisableActionTypes {
  request = 'document/DISABLE_FORM_REQUEST/REQUEST',
  success = 'document/DISABLE_FORM_REQUEST/SUCCESS',
  failure = 'document/DISABLE_FORM_REQUEST/FAILURE',
  cancel = 'document/DISABLE_FORM_REQUEST/CANCEL',
}

export enum FormRequestEnableActionTypes {
  request = 'document/ENABLE_FORM_REQUEST/REQUEST',
  success = 'document/ENABLE_FORM_REQUEST/SUCCESS',
  failure = 'document/ENABLE_FORM_REQUEST/FAILURE',
  cancel = 'document/ENABLE_FORM_REQUEST/CANCEL',
}

export enum ToggleEmailNotificationActionTypes {
  request = 'document/TOGGLE_EMAIL_NOTIFICATION/REQUEST',
  success = 'document/TOGGLE_EMAIL_NOTIFICATION/SUCCESS',
  failure = 'document/TOGGLE_EMAIL_NOTIFICATION/FAILURE',
  cancel = 'document/TOGGLE_EMAIL_NOTIFICATION/CANCEL',
}

export enum GetAllTemplatesActionTypes {
  request = 'document/GET_ALL_TAMPLTES/REQUEST',
  success = 'document/GET_ALL_TAMPLTES/SUCCESS',
  failure = 'document/GET_ALL_TAMPLTES/FAILURE',
  cancel = 'document/GET_ALL_TAMPLTES/CANCEL',
}
