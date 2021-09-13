import {
  PaginationParams,
  OrderingParams,
  NormalizedEntity,
  PaginationData,
} from './Common';

export enum RequestTypes {
  SIGN_REQUEST = 'sign_request',
  GET_RECENT_DOCUMENT = 'get_recent_document',
  WEBHOOK_SUBSCRIBE = 'webhook_subscribe',
  WEBHOOK_UNSUBSCRIBE = 'webhook_unsubscribe',
  GET_DOCUMENTS = 'get_documents',
  GET_DOCUMENT_SIGNERS = 'get_document_signers',
  GET_USER = 'get_user',
}

export const requestTypeDescription = {
  [RequestTypes.SIGN_REQUEST]: 'Signature Request',
  [RequestTypes.GET_RECENT_DOCUMENT]: 'Get Recent Document',
  [RequestTypes.WEBHOOK_SUBSCRIBE]: 'Webhook Subscribe',
  [RequestTypes.WEBHOOK_UNSUBSCRIBE]: 'Webhook Unsubscribe',
  [RequestTypes.GET_DOCUMENTS]: 'Get Documents',
  [RequestTypes.GET_DOCUMENT_SIGNERS]: 'Get Document Signers',
  [RequestTypes.GET_USER]: 'Get User',
};

export interface RequestHistoryItem {
  id: string;
  createdAt: string;
  origin: string;
  apiKeyId: string;
  type: RequestTypes;
}

export interface RequestHistoryGetPayload extends PaginationParams, OrderingParams {
  apiKeyId: string;
}

export interface RequestHistoryData {
  requestHistory: NormalizedEntity<RequestHistoryItem>;
  paginationData: PaginationData;
}
