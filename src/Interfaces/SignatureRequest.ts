import { Document, Signer } from './Document';

export enum SignatureRequestStatuses {
  AWAITING_OTHERS = 'awaiting_others',
  AWAITING_YOU = 'awaiting_you',
  SIGNED = 'signed',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export const SignatureRequestStatuseLabels = {
  awaiting_others: 'AWAITING OTHERS',
  awaiting_you: 'AWAITING YOU',
  signed: 'SIGNED',
  completed: 'COMPLETED',
  declined: 'DECLINED',
  expired: 'EXPIRED',
};

export interface SignatureRequest {
  id: string;
  documentId: Document['id'];
  signerId: Signer['id'];
  status: SignatureRequestStatuses;
  documents?: Document;
}

export interface SigntureRequestsDeletePayload {
  signatureRequestIds: string[];
}
