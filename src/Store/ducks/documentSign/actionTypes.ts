export const DocumentSigningInitType = 'document_sign/INIT_DOCUMENT_SIGN';

export const DocumentSigningFinishType = 'document_sign/FINISH_DOCUMENT_SIGNING';

export enum SignerDocumentGetTypes {
  request = 'document_sign/GET_SIGNER_DOCUMENT/REQUEST',
  success = 'document_sign/GET_SIGNER_DOCUMENT/SUCCESS',
  failure = 'document_sign/GET_SIGNER_DOCUMENT/FAILURE',
  cancel = 'document_sign/GET_SIGNER_DOCUMENT/CANCEL',
}

export enum AvailableSignersOptionsGetTypes {
  request = 'document_sign/GET_AVAILABLE_SIGNERS_OPTIONS/REQUEST',
  success = 'document_sign/GET_AVAILABLE_SIGNERS_OPTIONS/SUCCESS',
  failure = 'document_sign/GET_AVAILABLE_SIGNERS_OPTIONS/FAILURE',
  cancel = 'document_sign/GET_AVAILABLE_SIGNERS_OPTIONS/CANCEL',
}

export enum SubmitSignedDocumentTypes {
  request = 'document_sign/SEND_SIGNED_DOCUMENT/REQUEST',
  success = 'document_sign/SEND_SIGNED_DOCUMENT/SUCCESS',
  failure = 'document_sign/SEND_SIGNED_DOCUMENT/FAILURE',
  cancel = 'document_sign/SEND_SIGNED_DOCUMENT/CANCEL',
}

export enum DocumentSendOutActionTypes {
  request = 'document_sign/SEND_DOCUMENT_OUT/REQUEST',
  success = 'document_sign/SEND_DOCUMENT_OUT/SUCCESS',
  failure = 'document_sign/SEND_DOCUMENT_OUT/FAILURE',
  cancel = 'document_sign/SEND_DOCUMENT_OUT/CANCEL',
}

export enum RemindersSendActionTypes {
  request = 'document_sign/SEND_REMINDERS/REQUEST',
  success = 'document_sign/SEND_REMINDERS/SUCCESS',
  failure = 'document_sign/SEND_REMINDERS/FAILURE',
  cancel = 'document_sign/SEND_REMINDERS/CANCEL',
}

export enum SignatoryOpenedSendActionTypes {
  request = 'document_sign/SEND_SIGNATORY_OPENED/REQUEST',
  success = 'document_sign/SEND_SIGNATORY_OPENED/SUCCESS',
  failure = 'document_sign/SEND_SIGNATORY_OPENED/FAILURE',
  cancel = 'document_sign/SEND_SIGNATORY_OPENED/CANCEL',
}

export enum DocumentPreviewPagesGetActionTypes {
  request = 'document_sign/GET_DOCUMENT_PREVIEW_PAGES/REQUEST',
  success = 'document_sign/GET_DOCUMENT_PREVIEW_PAGES/SUCCESS',
  failure = 'document_sign/GET_DOCUMENT_PREVIEW_PAGES/FAILURE',
  cancel = 'document_sign/GET_DOCUMENT_PREVIEW_PAGES/CANCEL',
}

export enum DocumentConvertionStatusActionTypes {
  request = 'document_sign/GET_CONVERTION_STATUS/REQUEST',
  success = 'document_sign/GET_CONVERTION_STATUS/SUCCESS',
  failure = 'document_sign/GET_CONVERTION_STATUS/FAILURE',
  cancel = 'document_sign/GET_CONVERTION_STATUS/CANCEL',
}

export enum DocumentShareUrlGetActionTypes {
  request = 'document/GET_SHARE_URL/REQUEST',
  success = 'document/GET_SHARE_URL/SUCCESS',
  failure = 'document/GET_SHARE_URL/FAILURE',
  cancel = 'document/GET_SHARE_URL/CANCEL',
}

export enum DocumentShareActionTypes {
  request = 'document/SHARE/REQUEST',
  success = 'document/SHARE/SUCCESS',
  failure = 'document/SHARE/FAILURE',
  cancel = 'document/SHARE/CANCEL',
}

export enum DocumentSendCodeAccessActionTypes {
  request = 'document/SEND_CODE_ACCESS/REQUEST',
  success = 'document/SEND_CODE_ACCESS/SUCCESS',
  failure = 'document/SEND_CODE_ACCESS/FAILURE',
  cancel = 'document/SEND_CODE_ACCESS/CANCEL',
}

export enum SigningUrlGetActionTypes {
  request = 'document/GET_SIGNING_URL/REQUEST',
  success = 'document/GET_SIGNING_URL/SUCCESS',
  failure = 'document/GET_SIGNING_URL/FAILURE',
  cancel = 'document/GET_SIGNING_URL/CANCEL',
}
