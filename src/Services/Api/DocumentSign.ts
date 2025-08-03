import Api from './Api';
import {
  Document,
  SignerDocumentIdPayload,
  SignerOption,
  DocumentIdPayload,
  DocumentSubmitPayload,
  DocumentBulkSendValues,
  DocumentDownloadPayload,
  RemindersSendPayload,
  DocumentPreviewPagesPayload,
  DocumentSharePayload,
  SignerIdPayload,
  DocumentConvertionStatusPayload,
  CodeAccessPayload,
  SigningUrlGetPayload,
  SigningUrlPayload,
  SigningRemindersUnlinkPayload,
  DocumentActivitiesDownloadPayload,
  DocumentDisableRemindersRequest,
  DocumentSeparateSignPayload,
  DocumentForSigning,
} from 'Interfaces/Document';
import { TokenizedPayload } from 'Interfaces/User';
import {
  SignedPartDocumentActivityUrlResponse,
  SignedPartDocumentUrlResponse,
  SignedUrlResponse,
} from 'Interfaces/Common';

export class DocumentSignApi extends Api {
  sendOutDocument = (documentId: Document['id']) =>
    this.request.patch()<Document>(`document_sign/documents/${documentId}/send_out`);

  getAvailableSignersOptions = ({
    token,
    payload,
  }: TokenizedPayload<DocumentIdPayload>) => {
    return this.request.get(token)<SignerOption[]>(
      `document_sign/documents/${payload.documentId}/signers`,
    );
  };

  sendDocumentBulk = (values: DocumentBulkSendValues) =>
    this.request.post()('document_sign/bulk_send', values);

  getSignerDocument = ({ token, payload }: TokenizedPayload<SignerDocumentIdPayload>) => {
    const { signerId, documentId } = payload;

    return this.request.get(token)<Document>(
      `document_sign/signers/${signerId}/document/${documentId}`,
    );
  };

  getSigningDocument = ({ token, payload }: TokenizedPayload<DocumentIdPayload>) => {
    return this.request.get(token)<DocumentForSigning>(
      `document_sign/documents/${payload.documentId}`,
    );
  };

  submitSignedDocument = ({
    token,
    payload,
  }: TokenizedPayload<SignerDocumentIdPayload>) => {
    const { signerId, documentId } = payload;

    return this.request.patch(token)(
      `document_sign/documents/${documentId}/signers/${signerId}/sign`,
      {},
    );
  };

  declineSigningRequest = ({
    token,
    payload,
  }: TokenizedPayload<SignerDocumentIdPayload>) => {
    const { signerId, documentId } = payload;

    return this.request.patch(token)(
      `document_sign/documents/${documentId}/signers/${signerId}/decline`,
      {},
    );
  };

  updateFields = ({ token, payload }: TokenizedPayload<DocumentSubmitPayload>) => {
    const { signerId, documentId, fields } = payload;

    return this.request.patch(
      token,
    )(`document_sign/documents/${documentId}/signers/${signerId}/fields`, { fields });
  };

  getDownloadUrlByHash = ({ documentId, ...params }: DocumentDownloadPayload) =>
    this.request.get()<SignedUrlResponse>(
      `document_sign/documents/${documentId}/signed_download_url/hash`,
      {
        params,
      },
    );

  getActivitiesDownloadUrlByHash = ({ documentId, ...params }: DocumentDownloadPayload) =>
    this.request.get()<SignedUrlResponse>(
      `document_sign/documents/${documentId}/activities/signed_download_url/hash`,
      {
        params,
      },
    );

  getDownloadUrlByJWT = ({
    payload: { signerId, documentId },
    token,
  }: TokenizedPayload<DocumentDownloadPayload>) =>
    this.request.get(token)<SignedUrlResponse>(
      `document_sign/documents/${documentId}/signed_download_url/jwt`,
      {
        params: { signerId },
      },
    );

  getActivitiesDownloadUrlByJWT = ({
    payload: { documentId },
    token,
  }: TokenizedPayload<DocumentActivitiesDownloadPayload>) =>
    this.request.get(token)<SignedUrlResponse>(
      `document_sign/documents/${documentId}/activities/signed_download_url/jwt`,
    );

  signSeparateDocumentActivitiesByJWT = ({
    payload: { documentId },
    token,
  }: TokenizedPayload<DocumentActivitiesDownloadPayload>) =>
    this.request.patch(token)<SignedPartDocumentActivityUrlResponse>(
      `document_sign/documents/${documentId}/activities/sign_activities/jwt`,
    );

  signSeparateDocumentByJWT = ({
    payload: { documentId },
    token,
  }: TokenizedPayload<DocumentSeparateSignPayload>) =>
    this.request.patch(token)<SignedPartDocumentUrlResponse>(
      `document_sign/documents/${documentId}/document/sign_document_without_activities/jwt`,
    );

  getSeparateDocumentDownloadUrlByJWT = ({
    payload: { documentId },
    token,
  }: TokenizedPayload<DocumentSeparateSignPayload>) =>
    this.request.get(token)<SignedUrlResponse>(
      `document_sign/documents/${documentId}/document/signed_download_url/jwt`,
    );

  sendReminders = ({ documentId, signersIds }: RemindersSendPayload) =>
    this.request.post()<void>(`document_sign/documents/${documentId}/send_reminders`, {
      signersIds,
    });

  disableSigningReminders = (values: DocumentDisableRemindersRequest) => {
    const { documentId, disableReminders } = values;

    return this.request.patch()<Document>(
      `document_sign/${documentId}/disable-reminders`,
      { disableReminders },
    );
  };

  sendSignatoryOpened = ({
    token,
    payload,
  }: TokenizedPayload<SignerDocumentIdPayload>) => {
    const { documentId, signerId } = payload;

    return this.request.post(token)<void>(
      `document_sign/documents/${documentId}/signers/${signerId}/signatory_opened`,
    );
  };

  getDocumentPreviewPages = (payload: DocumentIdPayload) => {
    return this.request.get()<DocumentPreviewPagesPayload>(
      `document_sign/documents/${payload.documentId}/preview_pages`,
    );
  };

  getDocumentShareUrl = (payload: DocumentIdPayload) =>
    this.request.get()<SignedUrlResponse>(
      `document_sign/documents/${payload.documentId}/share_url`,
    );

  shareDocument = ({ documentId, recipients }: DocumentSharePayload) =>
    this.request.post()<void>(`document_sign/documents/${documentId}/share`, {
      recipients,
    });

  getDocumentConvertionStatus = ({
    payload: { signerId },
    token,
  }: TokenizedPayload<SignerIdPayload>) =>
    this.request.get(token)<DocumentConvertionStatusPayload>(
      `document_sign/signers/${signerId}/convertion_status`,
    );

  sendCodeAccess = ({ payload, token }: TokenizedPayload<CodeAccessPayload>) => {
    const { signerId, documentId, codeAccess } = payload;

    return this.request.post(token)<void>(
      `document_sign/signers/${signerId}/document/${documentId}/confirm_code`,
      {
        codeAccess,
      },
    );
  };

  getSignigUrl = ({ documentId, userId }: SigningUrlGetPayload) => {
    return this.request.get()<SigningUrlPayload>(
      `document_sign/documents/${documentId}/signing_url`,
      {
        params: {
          userId,
        },
      },
    );
  };

  unlinkSigningReminders = ({
    token,
    payload,
  }: TokenizedPayload<SigningRemindersUnlinkPayload>) => {
    return this.request.patch(token)<SigningRemindersUnlinkPayload>(
      `document_sign/${payload.signerId}/unlink-reminder`,
    );
  };

  sendOutEmbedDocument = ({ token, payload }: TokenizedPayload<DocumentIdPayload>) =>
    this.request.patch(token)<Document>(
      `document_sign/documents/embed/${payload.documentId}/send_out`,
    );

  getEmbedDocumentPreviewPages = ({
    token,
    payload,
  }: TokenizedPayload<DocumentIdPayload>) => {
    return this.request.get(token)<DocumentPreviewPagesPayload>(
      `document_sign/documents/embed/${payload.documentId}/preview_pages`,
    );
  };
}

export default new DocumentSignApi();
