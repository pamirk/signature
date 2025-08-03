import Api from './Api';
import { ApiKey, ApiKeyCreatePayload, ApiKeyIdPayload } from 'Interfaces/ApiKey';
import { AxiosRequestConfig } from 'axios';

export class ApiKeyApi extends Api {
  getApiKeys = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('api_keys', { params, ...config });

  getApiKey = (payload: ApiKeyIdPayload) =>
    this.request.get()<ApiKey>(`api_keys/${payload.apiKeyId}`);

  createApiKey = (payload: ApiKeyCreatePayload) =>
    this.request.post()<ApiKey>('api_keys/create', payload);

  deleteApiKeys = (apiKeyIds: string[]) => {
    return this.request.delete()(`api_keys`, {
      data: { ids: apiKeyIds },
    });
  };

  deleteApiKey = (id: string) => {
    return this.request.delete()(`api_keys/${id}`);
  };

  revokeApiKey = (id: string) => {
    return this.request.delete()(`api_keys/revoke/${id}`);
  };

  recoverApiKey = (id: string) => {
    return this.request.post()(`api_keys/recover/${id}`);
  };
}

export default new ApiKeyApi();
