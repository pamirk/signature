export enum ApiKeyCreateActionTypes {
  request = 'apiKey/CREATE/REQUEST',
  success = 'apiKey/CREATE/SUCCESS',
  failure = 'apiKey/CREATE/FAILURE',
  cancel = 'apiKey/CREATE/CANCEL',
}

export enum ApiKeysGetActionTypes {
  request = 'apiKey/GET_API_KEYS/REQUEST',
  success = 'apiKey/GET_API_KEYS/SUCCESS',
  failure = 'apiKey/GET_API_KEYS/FAILURE',
  cancel = 'apiKey/GET_API_KEYS/CANCEL',
}

export enum ApiKeysDeleteActionTypes {
  request = 'apiKey/DELETE_API_KEYS/REQUEST',
  success = 'apiKey/DELETE_API_KEYS/SUCCESS',
  failure = 'apiKey/DELETE_API_KEYS/FAILURE',
  cancel = 'apiKey/DELETE_API_KEYS/CANCEL',
}

export enum ApiKeyDeleteActionTypes {
  request = 'apiKey/DELETE_API_KEY/REQUEST',
  success = 'apiKey/DELETE_API_KEY/SUCCESS',
  failure = 'apiKey/DELETE_API_KEY/FAILURE',
  cancel = 'apiKey/DELETE_API_KEY/CANCEL',
}

export enum ApiKeyRevokeActionTypes {
  request = 'apiKey/REVOKE_API_KEY/REQUEST',
  success = 'apiKey/REVOKE_API_KEY/SUCCESS',
  failure = 'apiKey/REVOKE_API_KEY/FAILURE',
  cancel = 'apiKey/REVOKE_API_KEY/CANCEL',
}

export enum ApiKeyRecoverActionTypes {
  request = 'apiKey/RECOVER_API_KEY/REQUEST',
  success = 'apiKey/RECOVER_API_KEY/SUCCESS',
  failure = 'apiKey/RECOVER_API_KEY/FAILURE',
  cancel = 'apiKey/RECOVER_API_KEY/CANCEL',
}

export enum ApiKeyGetActionTypes {
  request = 'apiKey/GET_API_KEY/REQUEST',
  success = 'apiKey/GET_API_KEY/SUCCESS',
  failure = 'apiKey/GET_API_KEY/FAILURE',
  cancel = 'apiKey/GET_API_KEY/CANCEL',
}
