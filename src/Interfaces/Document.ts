import {
  PaginationData,
  PaginationParams,
  NormalizedEntity,
  EntityDates,
  PDFMetadata,
  RecursivePartial,
  OrderingParams,
} from './Common';
import { AxiosRequestConfig } from 'axios';
import { DocumentField } from './DocumentFields';

export enum DocumentStatuses {
  API = 'api',
  DRAFT = 'draft',
  AWAITING = 'awaiting',
  COMPLETED = 'completed',
  ACTIVE = 'active',
  REPLICA = 'replica',
  PREPARING = 'preparing',
}

export enum DocumentTypes {
  ME = 'me',
  ME_AND_OTHER = 'me_and_other',
  OTHERS = 'others',
  TEMPLATE = 'template',
  FORM_REQUEST = 'form_request',
}

export interface EmailRecipient {
  email: string;
}

export interface Signer extends EmailRecipient {
  id: string;
  name: string;
  role?: string;
  userId: string;
  isPreparer: boolean;
  isFinished: boolean;
  order: number;
}

export interface BulkSendSigner extends EmailRecipient {
  name: string;
}

export interface SignerColumnIndexes {
  name?: number;
  email?: number;
}

export interface Role {
  id: string;
  name: string;
  userId: string;
  isPreparer: boolean;
  order: number;
}

export interface DocumentPageFile {
  id: string;
  fileKey: string;
  order: string;
}

export interface DocumentPart {
  id: string;
  name: string;
  order: number;
  files: DocumentPageFile[] | null;
  pdfMetadata: PDFMetadata | null;
  filesUploaded: boolean;
  originalFileName: string;
  originalFileUrl: string;
  errorText?: string;
}

export interface Document extends Partial<EntityDates> {
  userId?: string;
  id: string;
  title: string;
  templateId: string | null;
  message: string | null;
  fileUrl: string | null;
  shareLink: string | null;
  pdfMetadata: PDFMetadata | null;
  type: DocumentTypes;
  status: DocumentStatuses;
  pdfFileKey: string | null;
  resultPdfFileKey: string | null;
  recipients: EmailRecipient[] | null;
  signers: Signer[];
  fields: DocumentField[];
  isOrdered: boolean;
  codeAccess?: string;
  parts: DocumentPart[];
  files: DocumentPageFile[] | null;
  isFromFormRequest: boolean | null;
  deletedAt: Date | null;
  testMode?: boolean;
}

export interface DocumentForSigners extends Document {
  redirectionPage: string;
  isNeedCodeAccess?: boolean;
}

export interface DocumentsData {
  documents: NormalizedEntity<Document>;
  paginationData: PaginationData;
}

type SlicedDocument<K extends keyof Document> = Pick<Document, K>;

export type PartialSlicedDocument<K extends keyof Document> = Partial<SlicedDocument<K>>;

type DeepPartialSlicedDocument<K extends keyof Document> = RecursivePartial<
  SlicedDocument<K>
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocumentValuesBase
  extends PartialSlicedDocument<
    'id' | 'title' | 'message' | 'isOrdered' | 'status' | 'isFromFormRequest'
  > {}

export interface DocumentSignValues
  extends DocumentValuesBase,
    SlicedDocument<'type'>,
    PartialSlicedDocument<'templateId'> {}

export interface DocumentBulkSendValues
  extends SlicedDocument<'templateId' | 'title'>,
    PartialSlicedDocument<'message'>,
    DeepPartialSlicedDocument<'signers'> {}

export interface CsvEmailError {
  email?: string;
  message?: string;
  index: number;
}
export interface BulkSendValidation {
  errors: CsvEmailError[];
}

export interface OnlyMeDocumentValues
  extends DocumentSignValues,
    DeepPartialSlicedDocument<'recipients'> {}

export type DocumentValues = OnlyMeDocumentValues &
  DocumentSignValues &
  DeepPartialSlicedDocument<'signers'>;

export interface DocumentValuesPayload {
  values: DocumentValues;
}

export interface DateFilter {
  dateFrom?: string;
  dateTo?: string;
}

export enum SearchTypeEnum {
  DOCUMENTS = 'documents',
  SIGNERS = 'signers',
}
export interface DocumentsGetPayload
  extends PaginationParams,
    DateFilter,
    OrderingParams {
  type?: DocumentTypes[];
  status?: DocumentStatuses[];
  searchTerm?: string;
  searchType?: SearchTypeEnum;
}

export interface DocumentIdPayload {
  documentId: Document['id'];
}

export interface DocumentPartIdPayload {
  documentPartId?: DocumentPart['id'];
  documentId: Document['id'];
}

export interface SignerIdPayload {
  signerId: Signer['id'];
}

export interface TemplateMergePayload {
  templateId: Document['id'];
  sourceTemplateId: Document['id'];
}

export interface DocumentDownloadPayload {
  documentId: Document['id'];
  signerId?: Signer['id'];
  hash?: string;
}

export interface DocumentUpdate
  extends Pick<Document, 'type'>,
    PartialSlicedDocument<'title' | 'message' | 'templateId' | 'fields'>,
    DeepPartialSlicedDocument<'signers' | 'recipients' | 'parts'> {
  documentId: Document['id'];
}

export interface DocumentUpdateQuery {
  log: boolean;
}

export interface DocumentUpdatePayload {
  values: DocumentUpdate;
  query?: DocumentUpdateQuery;
}

export interface DocumentDisableRemindersPayload {
  documentId: Document['id'];
}

export interface SelectableDocument extends Document {
  isSelected: boolean;
}

export interface DocumentUploadPayload {
  documentId: Document['id'];
  file: File;
  options?: AxiosRequestConfig;
}

export type DocumentsAllGetPayload =
  | {
      status?: DocumentStatuses;
      type?: DocumentTypes;
      withTeammateTemplates?: boolean;
    }
  | undefined;

export type TemplatesAllGetPayload =
  | {
      withTeammateTemplates?: boolean;
    }
  | undefined;

export interface SignerDocumentIdPayload extends DocumentIdPayload {
  signerId: Signer['id'];
}

export interface DocumentSubmitPayload extends SignerDocumentIdPayload {
  fields: DocumentField[];
}

export interface CodeAccessPayload {
  codeAccess: string;
  documentId: Document['id'];
  signerId: Signer['id'];
}

export interface SigningUrlGetPayload {
  documentId: Document['id'];
  userId: Signer['id'];
}

export interface SigningUrlPayload {
  signingUrl: string;
}

export type SignerOption = Pick<Signer, 'id' | 'name'>;

export interface DocumentSendPayload extends DocumentIdPayload {
  isTemplate?: boolean;
}

export type DocumentConvertionData = SlicedDocument<'id' | 'pdfMetadata' | 'parts'>;

export interface RemindersSendPayload extends DocumentIdPayload {
  signersIds: Signer['id'][];
}

export interface DocumentConvertionStatusPayload {
  isFinished: boolean;
}

export type DocumentPreviewPagesPayload = SlicedDocument<
  'id' | 'pdfMetadata' | 'files' | 'status'
>;

export enum DocumentActivityTypes {
  CREATE = 'create',
  UPDATE = 'update',
  SEND = 'send',
  VIEW = 'view',
  SIGN = 'sign',
  COMPLETE = 'complete',
  REVERT = 'revert',
}

export interface DocumentActivity {
  id: string;
  type: DocumentActivityTypes;
  sourceIP: string | null;
  signers: Pick<Signer, 'name' | 'email'>[] | null;
  documentId: Document['id'];
  createdAt: string;
}

export type DocumentSharePayload = NonNullable<Pick<Document, 'recipients'>> &
  DocumentIdPayload;

export interface FormRequestDocumentValues {
  templateId: Document['id'];
  signer: Pick<Signer, 'name' | 'email'> | null;
}
export interface FormRequestDocumentValuesPayload {
  values: FormRequestDocumentValues;
}

export interface DocumentWithCompany extends Document {
  company: {
    name: string | null;
    logo: string;
  };
}

export interface TemplateActivatePayload {
  documentId: Document['id'];
  status?: DocumentStatuses;
}
