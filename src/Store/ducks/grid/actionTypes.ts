export enum GridGetActionTypes {
  request = 'grid/GET/REQUEST',
  success = 'grid/GET/SUCCESS',
  failure = 'grid/GET/FAILURE',
  cancel = 'grid/GET/CANCEL',
}

export enum GridGetForSignatureRequestsActionTypes {
  request = 'grid/GET_GRIDS_FOR_SIGNATURE_REQUESTS/REQUEST',
  success = 'grid/GET_GRIDS_FOR_SIGNATURE_REQUESTS/SUCCESS',
  failure = 'grid/GET_GRIDS_FOR_SIGNATURE_REQUESTS/FAILURE',
  cancel = 'grid/GET_GRIDS_FOR_SIGNATURE_REQUESTS/CANCEL',
}

export enum GridUpdateActionTypes {
  request = 'grid/UPDATE/REQUEST',
  success = 'grid/UPDATE/SUCCESS',
  failure = 'grid/UPDATE/FAILURE',
  cancel = 'grid/UPDATE/CANCEL',
}

export enum GridItemsDeleteActionTypes {
  request = 'grid/DELETE/REQUEST',
  success = 'grid/DELETE/SUCCESS',
  failure = 'grid/DELETE/FAILURE',
  cancel = 'grid/DELETE/CANCEL',
}

export enum GridItemsMoveToTrashActionTypes {
  request = 'grid/MOVE_TO_TRASH/REQUEST',
  success = 'grid/MOVE_TO_TRASH/SUCCESS',
  failure = 'grid/MOVE_TO_TRASH/FAILURE',
  cancel = 'grid/MOVE_TO_TRASH/CANCEL',
}

export enum EmptyTrashActionTypes {
  request = 'grid/EMPTY_TRASH/REQUEST',
  success = 'grid/EMPTY_TRASH/SUCCESS',
  failure = 'grid/EMPTY_TRASH/FAILURE',
  cancel = 'grid/EMPTY_TRASH/CANCEL',
}
