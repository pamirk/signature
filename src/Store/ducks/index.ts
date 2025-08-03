import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import userDuck, { $actions as $userActions } from './user';
import documentDuck, { $actions as $documentActions } from './document';
import documentFieldDuck, { $actions as $documentFieldActions } from './documentField';
import billingDuck, { $actions as $billingActions } from './billing';
import teamDuck, { $actions as $teamActions } from './team';
import intergrationDuck, { $actions as $integrationActions } from './integration';
import requisiteDuck, { $actions as $requisiteActions } from './requisite';
import documentSign, { $actions as $documentSignAction } from './documentSign';
import requestHistoryDuck, { $actions as $requestHistoryActions } from './requestHistory';
import apiKeyDuck, { $actions as $apiKeyActions } from './apiKey';
import metaDuck from './meta';
import companyDuck, { $actions as $companyActions } from './company';
import integration from './integration';
import contractsDuck, { $actions as $contractsActions } from './contracts';
import contracts from './contracts';
import folderDuck, { $actions as $folderActions } from './folders';
import gridDuck, { $actions as $gridActions } from './grid';
import signatureRequestDuck, {
  $actions as $signatureRequestActions,
} from './signatureRequest';
import { setUnauthorizedActionType } from './user/actionTypes';

const appReducer = combineReducers({
  apiKey: apiKeyDuck.reducer,
  requestHistory: requestHistoryDuck.reducer,
  user: userDuck.reducer,
  document: documentDuck.reducer,
  documentField: documentFieldDuck.reducer,
  company: companyDuck.reducer,
  billing: billingDuck.reducer,
  team: teamDuck.reducer,
  requisite: requisiteDuck.reducer,
  meta: metaDuck.reducer,
  contracts: contractsDuck.reducer,
  folder: folderDuck.reducer,
  grid: gridDuck.reducer,
  signatureRequest: signatureRequestDuck.reducer,
});

export const rootReducer = (state, action) => {
  if (action.type === setUnauthorizedActionType) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const rootActions = {
  requestHistory: requestHistoryDuck.actions,
  apiKey: apiKeyDuck.actions,
  user: userDuck.actions,
  document: documentDuck.actions,
  documentField: documentFieldDuck.actions,
  company: companyDuck.actions,
  billing: billingDuck.actions,
  team: teamDuck.actions,
  integration: intergrationDuck.actions,
  requisite: requisiteDuck.actions,
  documentSign: documentSign.actions,
  contracts: contracts.actions,
  folder: folderDuck.actions,
  grid: gridDuck.actions,
  signatureRequest: signatureRequestDuck.actions,
};

export const $actions = {
  requestHistory: $requestHistoryActions,
  apiKey: $apiKeyActions,
  user: $userActions,
  document: $documentActions,
  documentField: $documentFieldActions,
  company: $companyActions,
  billing: $billingActions,
  team: $teamActions,
  integration: $integrationActions,
  requisite: $requisiteActions,
  documentSign: $documentSignAction,
  contracts: $contractsActions,
  folder: $folderActions,
  grid: $gridActions,
  signatureRequest: $signatureRequestActions,
};

export function* rootSagas() {
  yield all([
    ...requestHistoryDuck.sagas,
    ...apiKeyDuck.sagas,
    ...userDuck.sagas,
    ...documentDuck.sagas,
    ...documentFieldDuck.sagas,
    ...companyDuck.sagas,
    ...billingDuck.sagas,
    ...teamDuck.sagas,
    ...integration.sagas,
    ...requisiteDuck.sagas,
    ...documentSign.sagas,
    ...contracts.sagas,
    ...folderDuck.sagas,
    ...gridDuck.sagas,
    ...signatureRequestDuck.sagas,
  ]);
}
