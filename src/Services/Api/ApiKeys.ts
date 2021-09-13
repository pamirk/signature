import Api from './Api';
import { ApiKey, ApiKeyCreatePayload, ApiKeyIdPayload } from 'Interfaces/ApiKey';
import { AxiosRequestConfig } from 'axios';

export class ApiKeyApi extends Api {
  getApiKeys:any = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('api_keys', { params, ...config });

  getApiKey:any = (payload: ApiKeyIdPayload) =>
    this.request.get()<ApiKey>(`api_keys/${payload.apiKeyId}`);

  createApiKey:any = (payload: ApiKeyCreatePayload) =>
    this.request.post()<ApiKey>('api_keys/create', payload);

  deleteApiKeys:any = (apiKeyIds: string[]) => {
    return this.request.delete()(`api_keys`, {
      data: { ids: apiKeyIds },
    });
  };

  deleteApiKey:any = (id: string) => {
    return this.request.delete()(`api_keys/${id}`);
  };

  revokeApiKey:any = (id: string) => {
    return this.request.delete()(`api_keys/revoke/${id}`);
  };

  recoverApiKey:any = (id: string) => {
    return this.request.post()(`api_keys/recover/${id}`);
  };
}

export default new ApiKeyApi();
