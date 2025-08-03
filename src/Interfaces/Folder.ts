import { NormalizedEntity } from './Common';
import { GridItem } from './Grid';
import { User } from './User';

export enum FolderTypes {
  TEMPLATE = 'template',
  DOCUMENT = 'document',
  SIGNATURE_REQUEST = 'signature_request',
}

export interface Folder {
  id: string;
  title: string;
  parentId: Folder['id'];
  userId: User['id'];
  createdAt: string;
  permissions: User['id'][];
  user: User;
  type?: FolderTypes;
  deletedAt?: string;
}

export interface FolderCreatePayload {
  title: string;
  parentId?: Folder['id'];
  type?: FolderTypes;
}

export interface FolderUpdatePayload {
  folderId: string;
  title?: string;
  parentId?: Folder['id'];
}

export interface FolderChangePermissionsPayload {
  gridId: string;
  memberIds: User['id'][];
}
export interface FoldersDeletePayload {
  folderIds: Folder['id'][];
}

export interface FolderInfo {
  id: Folder['id'];
  documentsCount: number;
  foldersCount: number;
}

export interface FolderIdPayload {
  id: Folder['id'] | undefined;
}

export interface FoldersData {
  folders: NormalizedEntity<Folder>;
}

export interface OpenedFolder
  extends Pick<Folder, 'title'>,
    Pick<GridItem, 'permissions'> {
  id: string | undefined;
}
