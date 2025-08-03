import { CSSProperties } from 'react';
import {
  DocumentFieldCreateActionTypes,
  DocumentFieldUpdateActionTypes,
  DocumentFieldDeleteActionTypes,
  EmbedDocumentFieldCreateActionTypes,
  EmbedDocumentFieldUpdateActionTypes,
  EmbedDocumentFieldDeleteActionTypes,
} from 'Store/ducks/documentField/actionTypes';
import { EntityDates, NormalizedEntity } from './Common';
import { Document, Signer } from './Document';
import { DateFormats } from './User';
import { RequisiteValueType } from './Requisite';

export enum DocumentFieldTypes {
  Name = 'name',
  Signature = 'sign',
  Initials = 'initial',
  Date = 'date',
  Text = 'text',
  Checkbox = 'checkbox',
}

export enum DocumentFieldLabels {
  NAME = 'Name',
  SIGNATURE = 'Signature',
  INITIALS = 'Initial',
  DATE = 'Date',
  TEXT = 'Text',
  CHECKBOX = 'Checkbox',
}

export interface DocumentFieldShape {
  label: DocumentFieldLabels;
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
  fixedFontSize?: boolean;
  fontFamily?: string | null;
  requisiteId?: string | null;
  style?: CSSProperties;
  checked?: boolean | null;
  minimizeWidth?: boolean | null;
  createType: FieldCreateType;
  tag?: string;
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

export enum FieldCreateType {
  ADD = 'add',
  COPY = 'copy',
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
  stopFontAutoSize?: boolean;
}

export interface DocumentFieldsCRUDPayload<TPayload> {
  payload: TPayload;
  meta: DocumentFieldsCRUDMeta;
}

export interface EmbedDocumentFieldHistoryActionItem {
  actionType:
    | typeof EmbedDocumentFieldCreateActionTypes.request
    | typeof EmbedDocumentFieldUpdateActionTypes.request
    | typeof EmbedDocumentFieldDeleteActionTypes.request;
  actionPayload: DocumentField;
}

export interface EmbedDocumentFieldHistoryItem {
  next: EmbedDocumentFieldHistoryActionItem;
  prev: EmbedDocumentFieldHistoryActionItem;
}
