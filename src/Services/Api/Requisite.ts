import Api from './Api';
import {
  Requisite,
  RequisitesPayload,
  RequisiteSiblings,
  RequisiteDeletePayload,
} from 'Interfaces/Requisite';
import { TokenizedPayload } from 'Interfaces/User';

class RequisiteApi extends Api {
  getRequisites = (payload?: TokenizedPayload<{ withDeleted?: boolean }>) => {
    const { token, payload: params } = payload || {};

    return this.request.get(token)<Requisite[]>('requisites', { params });
  };

  createRequisites = async ({ token, payload }: TokenizedPayload<RequisitesPayload>) => {
    return this.request.post(token)<RequisiteSiblings>('requisites', {
      requisites: payload,
    });
  };

  updateRequisites = async ({ token, payload }: TokenizedPayload<RequisitesPayload>) => {
    return this.request.patch(token)<RequisiteSiblings>(`requisites`, {
      requisites: payload,
    });
  };

  deleteRequisite = async ({
    token,
    payload,
  }: TokenizedPayload<RequisiteDeletePayload>) =>
    this.request.delete(token)<RequisiteSiblings>(`requisites/${payload.id}`);
}

export default new RequisiteApi();
