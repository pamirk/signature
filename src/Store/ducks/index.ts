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
import companyDuck from './company';
import integration from './integration';
import contractsDuck, { $actions as $contractsActions } from './contracts';
import contracts from './contracts';

export const rootReducer = combineReducers({
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
});

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
};

export const $actions = {
  requestHistory: $requestHistoryActions,
  apiKey: $apiKeyActions,
  user: $userActions,
  document: $documentActions,
  documentField: $documentFieldActions,
  billing: $billingActions,
  team: $teamActions,
  integration: $integrationActions,
  requisite: $requisiteActions,
  documentSign: $documentSignAction,
  contracts: $contractsActions,
};

export function* rootSagas() {
  yield all([
    ...requestHistoryDuck.sagas,
    ...apiKeyDuck.sagas,
    ...userDuck.sagas,
    ...documentDuck.sagas,
    ...documentFieldDuck.sagas,
    ...billingDuck.sagas,
    ...teamDuck.sagas,
    ...integration.sagas,
    ...requisiteDuck.sagas,
    ...documentSign.sagas,
    ...contracts.sagas,
  ]);
}
