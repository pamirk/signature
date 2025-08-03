import Api from './Api';
import {
  IntegrationActionPayload,
  IntegrationUrlPayload,
  IntegrationAuthTokenPayload,
} from 'Interfaces/Integration';
import { getWorkflowVersion } from 'Utils/functions';

class IntegrationsApi extends Api {
  baseUrl = 'integrations';

  getAuthUrl = (params: IntegrationActionPayload) => {
    return this.request.get()<IntegrationUrlPayload>('integrations/auth_url', {
      params: {
        ...params,
        workflowVersion: getWorkflowVersion(),
      },
    });
  };

  getAuthToken = (params: IntegrationActionPayload) => {
    return this.request.get()<IntegrationAuthTokenPayload>('integrations/auth_token', {
      params,
    });
  };

  deactivate = (params: IntegrationActionPayload) => {
    return this.request.post()<IntegrationUrlPayload>(
      'integrations/deactivate',
      {},
      {
        params,
      },
    );
  };
}

export default new IntegrationsApi();
