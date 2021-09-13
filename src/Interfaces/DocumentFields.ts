import { CSSProperties } from 'react';
import {
  DocumentFieldCreateActionTypes,
  DocumentFieldUpdateActionTypes,
  DocumentFieldDeleteActionTypes,
} from 'Store/ducks/documentField/actionTypes';
import { EntityDates, NormalizedEntity } from './Common';
import { Document, Signer } from './Document';
import { DateFormats } from './User';
import { RequisiteValueType } from './Requisite';

export enum DocumentFieldTypes {
  Signature = 'sign',
  Initials = 'initial',
  Date = 'date',
  Text = 'text',
  Checkbox = 'checkbox',
}

export interface DocumentFieldShape {
  type: DocumentFieldTypes;
  icon: string;
  iconType: string;
}

export interface DocumentField extends EntityDates {
  readonly id: string;
  readonly document?: Document;
  dateFormat?: DateFormats | null;
  availableSignatureTypes?: RequisiteValueType[] | null;
  documentId: Document['id'];
  type: DocumentFieldTypes;
  required: boolean;
  signerId: Required<Signer>['id'] | null;
  coordinateX: number;
  coordinateY: number;
  pageNumber: number;
  fileKey?: string;
  text?: string | null;
  placeholder?: string;
  signed?: boolean;
  width?: number;
  height?: number;
  value?: string | null;
  signerName?: string;
  fontSize?: number | null;
  fontFamily?: string | null;
  requisiteId?: string | null;
  style?: CSSProperties;
  checked?: boolean | null;
}

export interface DocumentFieldsGetPayload {
  documentId: Document['id'];
}

export interface DocumentFieldsGetResult {
  fields: NormalizedEntity<DocumentField>;
  documentId: Document['id'];
}

export interface DocumentFieldDeletePayload {
  id: DocumentField['id'];
}

export type DocumentFieldAddType = Omit<DocumentField, 'id' | 'document' | 'documentId'>;

export type DocumentFieldUpdatePayload = Pick<DocumentField, 'id'> &
  Partial<DocumentField>;

export interface DocumentFieldHistoryActionItem {
  actionType:
    | typeof DocumentFieldCreateActionTypes.request
    | typeof DocumentFieldUpdateActionTypes.request
    | typeof DocumentFieldDeleteActionTypes.request;
  actionPayload: DocumentField;
}

export interface DocumentFieldHistoryItem {
  next: DocumentFieldHistoryActionItem;
  prev: DocumentFieldHistoryActionItem;
}

export interface DocumentFieldHistory {
  cursor: number;
  actions: DocumentFieldHistoryItem[];
}

export interface DocumentFieldsState {
  meta: {
    currentDocumentId?: Document['id'];
    history: DocumentFieldHistory;
  };
  fields: NormalizedEntity<DocumentField>;
}

export interface DocumentFieldsCRUDMeta {
  pushToHistory: boolean;
}

export interface DocumentFieldsCRUDPayload<TPayload> {
  payload: TPayload;
  meta: DocumentFieldsCRUDMeta;
}
