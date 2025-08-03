import { NormalizedEntity, PaginationData } from './Common';
import { Document, DocumentTypes, FormRequestsGetPayload } from './Document';
import { Folder } from './Folder';
import { SignatureRequest, SignatureRequestStatuses } from './SignatureRequest';

export enum GridEntityType {
  DOCUMENT = 'document',
  FOLDER = 'folder',
  SIGNATURE_REQUEST = 'signature_request',
}

export interface GridItem {
  id: string;
  entityId: string;
  entityType: GridEntityType;
  createdAt: string;
  folders?: Folder;
  documents?: Document;
  permissions: Permission[];
  signatureRequests?: SignatureRequest;
  chunkIndex?: number;
}

export interface Permission {
  id: string;
  userId: string;
  gridId: string;
}

export interface GridGetPayload extends FormRequestsGetPayload {
  type?: DocumentTypes[];
  folderId?: Folder['id'] | undefined;
  deleted?: boolean;
}

export interface GridGetForSignatureRequestsPayload extends FormRequestsGetPayload {
  type?: DocumentTypes[];
  folderId?: Folder['id'] | undefined;
  signatureRequestStatus?: SignatureRequestStatuses[];
}

export interface GridData {
  grid: NormalizedEntity<GridItem>;
  paginationData: PaginationData;
}

export interface SelectableGridItems extends GridItem {
  isSelected: boolean;
}

export interface GridUpdatePayload {
  entityIds: string[] | undefined[];
  parentId?: Folder['id'];
}

export interface GridItemsDeletePayload {
  entityIds: string[];
}
