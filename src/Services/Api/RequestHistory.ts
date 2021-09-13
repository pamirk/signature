import Api from './Api';
import { AxiosRequestConfig } from 'axios';
import { ApiKey } from 'Interfaces/ApiKey';

class RequestHistoryApi extends Api {
  getRequestHistory = (
    params: AxiosRequestConfig['params'],
    apiKeyId: ApiKey['id'],
    config?: AxiosRequestConfig,
  ) => this.request.get()(`api_keys/${apiKeyId}/request_history`, { params, ...config });
}

export default new RequestHistoryApi();
