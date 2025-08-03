export interface Contract {
  email: string;
  id: string;
  name: string;
  document: {
    id: string;
    status: string;
    codeAccess?: string;
  };
}
export interface ContractsPayload {
  formRequestId: string;
  status?: string;
}