import Api from './Api';
import { AxiosRequestConfig } from 'axios';
import {
  Document,
  DocumentValues,
  DocumentUpdate,
  TemplateMergePayload,
  DocumentIdPayload,
  DocumentConvertionData,
  DocumentActivity,
  DocumentUpdateQuery,
  DocumentPartIdPayload,
  FormRequestDocumentValues,
  DocumentTypes,
  DocumentStatuses,
  DocumentFileUploadRequest,
  DocumentFileUploadResponse,
  DocumentUpdatePayload,
  GetReportByEmailPayload,
} from 'Interfaces/Document';
import { getWorkflowVersion, sleep } from 'Utils/functions';
import { TokenizedPayload } from 'Interfaces/User';
import ApiService from 'Services/Api/Api';

export class DocumentApi extends Api {
  getFormRequests = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('documents/form_requests', { params, ...config });

  getDocument = (payload: DocumentIdPayload) =>
    this.request.get()<Document>(`documents/${payload.documentId}`);

  createDocument = (values: DocumentValues) =>
    this.request.post()<Document>('documents', {
      ...values,
      workflowVersion: getWorkflowVersion(),
    });

  createDocumentByExistTemplate = (values: DocumentValues) =>
    this.request.post()<Document>('documents/document_by_exist_template', {
      ...values,
      workflowVersion: getWorkflowVersion(),
    });

  updateDocumentByExistTemplate = (values: DocumentValues) =>
    this.request.patch()<Document>('documents/update_document_by_exist_template', {
      ...values,
      workflowVersion: getWorkflowVersion(),
    });

  createTemplate = (values: DocumentValues) =>
    this.request.post()<Document>('documents/templates', {
      ...values,
      workflowVersion: getWorkflowVersion(),
    });

  createForm = (values: DocumentValues) =>
    this.request.post()<Document>('documents/form-requests', {
      ...values,
      workflowVersion: getWorkflowVersion(),
    });

  getUploadDocumentSignedLink = (id: Document['id'], values: DocumentFileUploadRequest) =>
    this.request.post()<DocumentFileUploadResponse>(
      `documents/${id}/file_upload`,
      values,
    );

  uploadFile = (signedUrl: string, file: File) =>
    ApiService.uploadFile(signedUrl, file, {
      headers: {
        'Content-type': file.type,
      },
    });

  uploadDocument = (id: Document['id'], file: File, config?: AxiosRequestConfig) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const formData = new FormData();
    formData.append('upload', file, file.name);

    return this.request.post()<Document>(`documents/${id}/file_upload`, formData, {
      ...config,
      headers,
    });
  };

  cleanFileData = (payload: DocumentPartIdPayload) =>
    this.request.post()<Document>(`documents/${payload.documentId}/file_clean`, payload);

  updateDocument = (values: DocumentUpdate, params?: DocumentUpdateQuery) => {
    const { documentId, ...payload } = values;

    return this.request.patch()<Document>(`documents/${documentId}`, payload, { params });
  };

  activateTemplate = (documentId: Document['id'], status = DocumentStatuses.ACTIVE) =>
    this.request.patch()<Document>(`documents/templates/${documentId}/activate`, {
      status,
    });

  addTemplateToApi = (documentId: Document['id']) =>
    this.request.post()<Document>(`documents/templates/${documentId}/to-api`);

  removeTemplateFromApi = (documentId: Document['id']) =>
    this.request.delete()<Document>(`documents/templates/${documentId}/to-api`);

  revertDocument = (documentId: Document['id']) =>
    this.request.patch()<Document>(`documents/${documentId}/revert`);

  updateTemplate = (values: DocumentUpdate, params) => {
    const { documentId, ...payload } = values;

    return this.request.patch()<Document>(`documents/templates/${documentId}`, payload, {
      params,
    });
  };

  updateForm = (values: DocumentUpdate, params) => {
    const { documentId, ...payload } = values;

    return this.request.patch()<Document>(
      `documents/form-requests/${documentId}`,
      payload,
      {
        params,
      },
    );
  };

  deleteDocuments = (documentIds: string[]) => {
    return this.request.delete()(`documents/bulk`, {
      data: { ids: documentIds },
    });
  };

  deleteDocument = (payload: DocumentIdPayload) => {
    return this.request.delete()(`documents`, {
      data: payload,
    });
  };

  sendReminder = async (userIds: string[]) => {
    await sleep(5000);
    return userIds;
  };

  getAllDocuments = payload =>
    this.request.get()<Document[]>('documents/all', {
      params: payload,
    });

  copyDocument = (payload: DocumentIdPayload) =>
    this.request.post()<Document[]>(`documents/templates/${payload.documentId}/copy`);

  replicateTemplate = (payload: DocumentIdPayload) =>
    this.request.get()<Document>(`documents/templates/${payload.documentId}/replica`);

  mergeTemplate = (payload: TemplateMergePayload) =>
    this.request.post()<Document>(
      `documents/templates/${payload.sourceTemplateId}/replica/${payload.templateId}/merge`,
    );

  getDocumentConvertionData = (payload: DocumentIdPayload) =>
    this.request.get()<DocumentConvertionData>(
      `documents/${payload.documentId}/convertion_data`,
    );

  getDocumentActivities = (payload: DocumentIdPayload) =>
    this.request.get()<DocumentActivity[]>(`documents/${payload.documentId}/activities`);

  createFormRequestDocument = (values: FormRequestDocumentValues) =>
    this.request.post()<Document>(
      `document_sign/form-requests/${values.templateId}/create-document`,
      { ...values, type: DocumentTypes.FORM_REQUEST },
    );

  getFormRequestContracts = (payload: { documentId: string }) =>
    this.request.get()(`documents/form-requests/${payload.documentId}/contracts`);

  disableFormRequest = (payload: { documentId: string }) =>
    this.request.post()(`documents/form-requests/${payload.documentId}/disable`);

  enableFormRequest = (payload: { documentId: string }) =>
    this.request.post()(`documents/form-requests/${payload.documentId}/enable`);

  getFormRequest = (payload: { documentId: string }) =>
    this.request.get()(`document_sign/form-requests/${payload.documentId}`);

  getAllTemplates = payload =>
    this.request.get()<Document[]>('documents/all/templates', {
      params: payload,
    });

  getEmbedDocument = ({ token, payload }: TokenizedPayload<DocumentIdPayload>) =>
    this.request.get(token)<Document>(`documents/embed/${payload.documentId}`);

  updateEmbedDocument = (
    { token, payload }: TokenizedPayload<DocumentUpdatePayload>,
    params?: DocumentUpdateQuery,
  ) => {
    const { documentId, ...updatePayload } = payload.values;

    return this.request.patch(token)<Document>(
      `documents/embed/${documentId}`,
      updatePayload,
      {
        params,
      },
    );
  };

  getDocumentByHash = ({ documentId, ...params }: { documentId: string; hash: string }) =>
    this.request.get()<Document>(`documents/${documentId}/hash`, { params });

  getReportByEmail = async (payload: GetReportByEmailPayload) =>
    this.request.get()(`documents/report/${payload.year}`);
}

export default new DocumentApi();
