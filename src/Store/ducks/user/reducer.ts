import { createReducer } from 'typesafe-actions';
import uuid from 'uuid/v4';
import { User } from 'Interfaces/User';
import {
  signIn,
  logout,
  getCurrentUser,
  updateProfileInfo,
  setUnauthorized,
  verifyPhone,
  disableTwillio2fa,
  verifyGoogleCode,
  updateCompanyInfo,
  setTwoFactor,
  applyAppSumoLink,
  enableGoogleAuthenticator,
  disableGoogleAuthenticator,
  setPasswordToken,
  clearPasswordToken,
  subscribeOnAPIUpdates,
  unsubscribeFromAPIUpdates,
  setEmailToken,
  clearEmailToken,
  setEmailConfirmationData,
  setIntegration,
} from './actionCreators';
import { AuthStatuses, TwoFactorTypes } from 'Interfaces/Auth';
import { changeApiPlan, changePLan, upgradeAppSumo } from '../billing/actionCreators';
import {
  initDocumentSigning,
  finishDocumentSigning,
  sendDocumentOut,
} from '../documentSign/actionCreators';
import { initInviteAccepting, finishInviteAccepting } from '../team/actionCreators';
import { deactivate as deactivateIntegration } from '../integration/actionCreators';

export interface UserReducerState extends User {
  authStatus: AuthStatuses;
  signToken?: string;
  twoFactorToken?: string;
  twoFactorType?: TwoFactorTypes;
  passwordToken?: string;
  emailToken?: string;
  isAppSumoLinkUsed?: boolean;
}

export default createReducer({} as UserReducerState)
  .handleAction(
    [
      signIn,
      changePLan.success,
      getCurrentUser.success,
      updateProfileInfo.success,
      upgradeAppSumo.success,
      updateCompanyInfo.success,
      verifyPhone.success,
      verifyGoogleCode.success,
      disableTwillio2fa.success,
      enableGoogleAuthenticator.success,
      disableGoogleAuthenticator.success,
      subscribeOnAPIUpdates.success,
      unsubscribeFromAPIUpdates.success,
    ],
    (state, action) => ({
      ...state,
      ...action.payload,
      authStatus: AuthStatuses.AUTHOREZED,
    }),
  )
  .handleAction(applyAppSumoLink, state => ({
    ...state,
    isAppSumoLinkUsed: true,
  }))
  .handleAction(setTwoFactor, (state, action) => ({
    ...state,
    twoFactorToken: action.payload.twoFactorToken,
    twoFactorType: action.payload.twoFactorType,
  }))
  .handleAction(setEmailConfirmationData, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction([logout, getCurrentUser.failure, setUnauthorized], state => ({
    ...state,
    twoFactorToken: undefined,
    twoFactorType: undefined,
    passwordToken: undefined,
    authStatus: AuthStatuses.UNATHORIZED,
  }))
  .handleAction([initDocumentSigning, initInviteAccepting], (state, action) => ({
    ...state,
    signToken: action.payload.token,
  }))
  .handleAction([finishDocumentSigning, finishInviteAccepting], state => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signToken, ...nestState } = state;

    return nestState;
  })
  .handleAction([deactivateIntegration.success], (state, action) => {
    return {
      ...state,
      integrations: state.integrations.filter(
        integration => integration.type !== action.payload.type,
      ),
    };
  })
  .handleAction([setIntegration], (state, action) => ({
    ...state,
    integrations: [...state.integrations, { id: uuid(), type: action.payload.type }],
  }))
  .handleAction([setPasswordToken], (state, action) => ({
    ...state,
    passwordToken: action.payload.token,
  }))
  .handleAction([clearPasswordToken], state => ({
    ...state,
    passwordToken: undefined,
  }))
  .handleAction([setEmailToken], (state, action) => ({
    ...state,
    emailToken: action.payload.token,
  }))
  .handleAction([clearEmailToken], state => ({
    ...state,
    emailToken: undefined,
  }))
  .handleAction([sendDocumentOut.success], state => ({
    ...state,
    freeDocumentsUsed: (state?.freeDocumentsUsed ?? 0) + 1,
  }));
