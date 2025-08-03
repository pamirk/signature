import { AxiosRequestConfig } from 'axios';
import { GridItem, GridUpdatePayload } from 'Interfaces/Grid';
import Api from './Api';

export class GridApi extends Api {
  getGrid = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('grids', { params, ...config });

  getGridForSignatureRequests = (
    params: AxiosRequestConfig['params'],
    config?: AxiosRequestConfig,
  ) => this.request.get()('grids/signature_request', { params, ...config });

  updateGrid = (payload: GridUpdatePayload) => {
    if (payload.entityIds.length) {
      return this.request.patch()<GridItem>(`grids`, payload);
    }
  };

  deleteGridItems = (entityIds: string[]) => {
    return this.request.delete()(`grids`, {
      data: { entityIds },
    });
  };

  moveToTrashGridItems = (entityIds: string[]) => {
    return this.request.delete()(`grids/trash`, {
      data: { entityIds },
    });
  };

  emptyTrash = () => {
    return this.request.delete()(`grids/trash/empty`, {});
  };
}

export default new GridApi();
