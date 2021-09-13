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
  DocumentDisableRemindersPayload,
} from 'Interfaces/Document';
import { TokenizedPayload } from 'Interfaces/User';
import { SignedUrlResponse } from 'Interfaces/Common';

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

  sendReminders = ({ documentId, signersIds }: RemindersSendPayload) =>
    this.request.post()<void>(`document_sign/documents/${documentId}/send_reminders`, {
      signersIds,
    });

  disableSigningReminders = (values: DocumentDisableRemindersPayload) => {
    const { documentId } = values;

    return this.request.patch()<Document>(
      `document_sign/${documentId}/disable-reminders`,
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
}

export default new DocumentSignApi();
