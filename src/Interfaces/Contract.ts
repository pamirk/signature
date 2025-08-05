import {Document} from "./Document";

export interface Contract {
  email: string;
  id: string;
  name: string;
  document: Document;
}
export interface ContractsPayload {
  formRequestId?: string;
  status?: string;
  documentId?: string;
}