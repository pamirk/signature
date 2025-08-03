import { AxiosRequestConfig } from 'axios';
import {
  EntityDates,
  NormalizedEntity,
  OrderingParams,
  PDFMetadata,
  PaginationData,
  PaginationParams,
  RecursivePartial,
} from './Common';
import { DocumentField } from './DocumentFields';
import { GridItem } from './Grid';
import { TeamOwner } from './Team';
import { User, UserRoles } from './User';

export enum SignAction {
  SignDocument = 'signDocument',
  SignAndSend = 'signAndSend',
  Send = 'send',
}

export enum SignActionLabel {
  SIGN_DOCUMENT = 'Sign a Document',
  SIGN_AND_SEND = 'Sign & Send for Signature',
  SEND = 'Send for Signature',
}

export enum FinalStepButtonTitle {
  SIGN_DOCUMENT = 'Sign Document',
  SIGN_AND_SEND = 'Sign Document and Send for Signature',
  SEND = 'Send for Signature',
}

export enum DocumentActions {
  SEND = 'Send',
  SAVE = 'Save',
  CREATE = 'Create',
  UPDATE = 'Update',
}

export enum DocumentStatuses {
  API = 'api',
  DRAFT = 'draft',
  AWAITING = 'awaiting',
  COMPLETED = 'completed',
  ACTIVE = 'active',
  REPLICA = 'replica',
  PREPARING = 'preparing',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  VOIDED = 'voided',
}

export enum DocumentTypes {
  ME = 'me',
  ME_AND_OTHER = 'me_and_other',
  OTHERS = 'others',
  TEMPLATE = 'template',
  FORM_REQUEST = 'form_request',
}

export enum DocumentDownloadTypes {
  MERGED = 'merged',
  SEPARATED = 'separated',
}

export interface EmailRecipient {
  email: string;
}

export interface TeammateField {
  email: string;
  name: string;
  role: UserRoles;
}

export interface Signer extends EmailRecipient {
  id: string;
  name: string;
  role?: string;
  userId: string;
  isPreparer: boolean;
  isFinished: boolean;
  isDeclined: boolean;
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
  pdfFileKey: string;
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
  resultDocumentPdfFileKey: string | null;
  resultPdfFileKey: string | null;
  resultActivitiesPdfFileKey: string;
  recipients: EmailRecipient[] | null;
  signers: Signer[];
  fields: DocumentField[];
  isOrdered?: boolean;
  codeAccess?: string;
  errorText?: string;
  entityType: string;
  entityId: string;
  documents: Document;
  folders: any;
  parts: DocumentPart[];
  files: DocumentPageFile[] | null;
  isFromFormRequest: boolean | null;
  deletedAt: string | null;
  testMode?: boolean;
  disableReminders: boolean;
  user: User;
  downloadType: DocumentDownloadTypes;
  expirationDate?: Date;
}

export interface DocumentForSigners extends Omit<Document, 'user'> {
  user: Document['user'] & {
    team: { id: string; owner: TeamOwner };
  };
  redirectionPage: string;
  isNeedCodeAccess?: boolean;
}

export interface DocumentForSigning extends Omit<Document, 'signers' | 'user'> {
  signers: SignerOption[];
  user: Document['user'] & {
    team: { id: string; owner: TeamOwner };
  };
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
    | 'id'
    | 'title'
    | 'message'
    | 'isOrdered'
    | 'status'
    | 'isFromFormRequest'
    | 'expirationDate'
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
  DeepPartialSlicedDocument<'signers' | 'parts'> & { isApiTemplate?: boolean };

export interface DocumentValuesPayload {
  values: DocumentValues;
}

export interface DocumentFileUploadRequest {
  filename: string;
}

export interface DocumentFileUploadResponse {
  signed_url: string;
  document: Pick<Document, 'title' | 'id'>;
  documentPart: DocumentPart;
}

export interface DateFilter {
  dateFrom?: string;
  dateTo?: string;
}

export enum SearchTypeEnum {
  DOCUMENTS = 'documents',
  SIGNERS = 'signers',
  CREATORS = 'creators',
}
export interface FormRequestsGetPayload
  extends PaginationParams,
    DateFilter,
    OrderingParams {
  status?: DocumentStatuses[];
  searchTerm?: string | string[];
  searchType?: SearchTypeEnum;
  showType?: string;
}

export interface DocumentIdPayload {
  documentId: Document['id'];
}

export interface DocumentDeletePayload {
  documentId: Document['id'];
  isLocalDelete?: boolean;
}
export interface DocumentIdHashPayload extends DocumentIdPayload {
  hash: string;
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

export interface DocumentActivitiesDownloadPayload {
  documentId: Document['id'];
}

export interface DocumentUpdate
  extends Pick<Document, 'isOrdered'>,
    PartialSlicedDocument<
      'title' | 'message' | 'templateId' | 'fields' | 'expirationDate'
    >,
    DeepPartialSlicedDocument<'signers' | 'recipients' | 'parts'> {
  documentId: Document['id'];
  type?: DocumentTypes;
}

export interface DocumentUpdateQuery {
  log: boolean;
}

export interface DocumentUpdatePayload {
  values: DocumentUpdate;
  query?: DocumentUpdateQuery;
}

export interface DocumentDisableRemindersPayload {
  grid: GridItem;
  disableReminders: boolean;
}

export interface DocumentDisableRemindersRequest {
  documentId: Document['id'];
  disableReminders: boolean;
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

export type SignerOption = Pick<
  Signer,
  'id' | 'name' | 'order' | 'role' | 'isFinished' | 'isPreparer' | 'isDeclined'
> & {
  user:
    | (Pick<User, 'id' | 'isAuthorized' | 'isEmailConfirmed'> & {
        plan: Pick<User['plan'], 'id' | 'type' | 'duration'>;
      })
    | null;
};

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
  DECLINE = 'decline',
  EXPIRE = 'expire',
  NOT_SIGN = 'not_sign',
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

export interface SigningRemindersUnlinkPayload {
  signerId: Signer['id'];
}

export interface DocumentSeparateSignPayload {
  documentId: Document['id'];
  hash?: string;
}

export interface InteractExtraValues {
  signers?: Signer[];
  isOrdered?: boolean;
  recipients?: EmailRecipient[];
}

export interface GetReportByEmailPayload {
  year: number;
}

export type DocumentStatusOption = 'awaiting' | 'unavailable' | 'completed';
