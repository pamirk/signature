export enum IntegrationTypes {
  GOOGLE_DRIVE = 'google_drive',
  BOX = 'box',
  ONE_DRIVE = 'one_drive',
  DROPBOX = 'dropbox',
}

export interface Integration {
  id: string;
  type: IntegrationTypes;
}

export interface IntegrationActionPayload {
  type: IntegrationTypes;
}

export interface IntegrationUrlPayload {
  url: string;
}

export type IntegrationDeactivatePayload = IntegrationActionPayload &
  IntegrationUrlPayload;

export interface IntegrationAuthTokenPayload {
  token: string;
}
