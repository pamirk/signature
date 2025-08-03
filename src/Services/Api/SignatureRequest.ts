import Api from './Api';

export class SignatureRequestApi extends Api {
  deleteSignatureRequests = (signatureRequestIds: string[]) => {
    return this.request.delete()(`signature-requests`, {
      data: { ids: signatureRequestIds },
    });
  };
}

export default new SignatureRequestApi();
