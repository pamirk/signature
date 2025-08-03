import { AxiosRequestConfig } from 'axios';
import {
  Folder,
  FolderChangePermissionsPayload,
  FolderCreatePayload,
  FolderInfo,
  FolderUpdatePayload,
} from 'Interfaces/Folder';
import Api from './Api';

export class FolderApi extends Api {
  createFolder = (values: FolderCreatePayload) =>
    this.request.post()<Folder>('folders/create', values);

  changePermissions = (values: FolderChangePermissionsPayload) => {
    const { gridId, ...payload } = values;
    return this.request.patch()<Folder>(`grids/${gridId}/permissions`, payload);
  };

  updateFolder = (values: FolderUpdatePayload) => {
    const { folderId, ...payload } = values;

    return this.request.patch()<Folder>(`folders/${folderId}`, payload);
  };

  deleteFolders = (folderIds: string[]) => {
    return this.request.delete()(`folders/delete`, {
      data: { folderIds },
    });
  };

  getFolderInfo = (payload: Folder['id']) =>
    this.request.get()<FolderInfo>(`folders/info/${payload}`);

  getFolder = (params: AxiosRequestConfig['params']) =>
    this.request.get()<Folder[]>(`folders`, { params });
}

export default new FolderApi();
