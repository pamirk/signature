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
} from 'Interfaces/Document';
import { sleep } from 'Utils/functions';

export class DocumentApi extends Api {
  getDocuments = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('documents', { params, ...config });

  getDocument = (payload: DocumentIdPayload) =>
    this.request.get()<Document>(`documents/${payload.documentId}`);

  createDocument = (values: DocumentValues) =>
    this.request.post()<Document>('documents', values);

  createTemplate = (values: DocumentValues) =>
    this.request.post()<Document>('documents/templates', values);

  createForm = (values: DocumentValues) =>
    this.request.post()<Document>('documents/form-requests', values);

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

  updateTemplate = (values: DocumentUpdate, params:any) => {
    const { documentId, ...payload } = values;

    return this.request.patch()<Document>(`documents/templates/${documentId}`, payload, {
      params,
    });
  };

  updateForm = (values: DocumentUpdate, params:any) => {
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
    return this.request.delete()(`documents`, {
      data: { ids: documentIds },
    });
  };

  sendReminder = async (userIds: string[]) => {
    await sleep(5000);
    return userIds;
  };

  getAllDocuments = (payload:any) =>
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

  getFormRequestContracts:any = (payload: { documentId: string }) =>
    this.request.get()(`documents/form-requests/${payload.documentId}/contracts`);

  disableFormRequest = (payload: { documentId: string }) =>
    this.request.post()(`documents/form-requests/${payload.documentId}/disable`);

  enableFormRequest = (payload: { documentId: string }) =>
    this.request.post()(`documents/form-requests/${payload.documentId}/enable`);

  getFormRequest = (payload: { documentId: string }) =>
    this.request.get()(`document_sign/form-requests/${payload.documentId}`);

  getAllTemplates = (payload:any) =>
    this.request.get()<Document[]>('documents/all/templates', {
      params: payload,
    });
}

export default new DocumentApi();
