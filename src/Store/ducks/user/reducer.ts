import { AuthStatuses, TwoFactorTypes } from 'Interfaces/Auth';
import { User, UserStatuses } from 'Interfaces/User';
import { createReducer } from 'typesafe-actions';
import uuid from 'uuid/v4';
import {
  cancelPlan,
  changePLan,
  redeemLtdCode,
  retryCharge,
  upgradeAppSumo,
  upsellPlan,
} from '../billing/actionCreators';
import {
  initEmbedDocumentToken,
  removeEmbedDocumenToken,
} from '../document/actionCreators';
import {
  finishDocumentSigning,
  initDocumentSigning,
  sendDocumentOut,
} from '../documentSign/actionCreators';
import { deactivate as deactivateIntegration } from '../integration/actionCreators';
import { finishInviteAccepting, initInviteAccepting } from '../team/actionCreators';
import {
  applyAppSumoLink,
  clearEmailToken,
  clearIntegrationData,
  clearPasswordToken,
  disableGoogleAuthenticator,
  disableTwillio2fa,
  enableGoogleAuthenticator,
  finishInitAccessToken,
  getCurrentUser,
  initAccessToken,
  logout,
  setEmailConfirmationData,
  setEmailToken,
  setIntegration,
  setPasswordToken,
  setTwoFactor,
  setUnauthorized,
  signIn,
  signOut,
  signUpTemporary,
  confirmTemporary,
  subscribeOnAPIUpdates,
  unsubscribeFromAPIUpdates,
  updateCompanyInfo,
  updateGoogleClientId,
  updateProfileInfo,
  verifyGoogleCode,
  verifyPhone,
  clearShowTrialSuccessPage,
} from './actionCreators';
import { isNewTrialUser } from 'Utils/functions';
import { PlanIds, PlanTypes, signatureLimitedPlans } from 'Interfaces/Billing';

export interface UserReducerState extends User {
  authStatus: AuthStatuses;
  signToken?: string;
  twoFactorToken?: string;
  twoFactorType?: TwoFactorTypes;
  passwordToken?: string;
  emailToken?: string;
  isAppSumoLinkUsed?: boolean;
  embedToken?: string;
  isSecondStepCompleted?: boolean;
  showTrialSuccessPage: boolean;
}

export default createReducer({} as UserReducerState)
  .handleAction(
    [signIn, getCurrentUser.success, redeemLtdCode.success],
    (state, action) => ({
      ...state,
      ...action.payload,
      authStatus: isNewTrialUser(action.payload)
        ? AuthStatuses.TRIAL
        : AuthStatuses.AUTHORIZED,
    }),
  )
  .handleAction([signUpTemporary.success], (state, action) => ({
    ...state,
    ...action.payload.user,
  }))
  .handleAction(
    [
      changePLan.success,
      cancelPlan.success,
      upsellPlan.success,
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
      updateGoogleClientId.success,
    ],
    (state, action) => ({
      ...state,
      ...action.payload,
      authStatus: AuthStatuses.AUTHORIZED,
      showTrialSuccessPage:
        state.showTrialStep && !(action.payload as User).showTrialStep,
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
  .handleAction(
    [setEmailConfirmationData, confirmTemporary.success],
    (state, action) => ({
      ...state,
      ...action.payload,
    }),
  )
  .handleAction(
    [logout, getCurrentUser.failure, setUnauthorized, signOut.success],
    state => ({
      ...state,
      twoFactorToken: undefined,
      twoFactorType: undefined,
      passwordToken: undefined,
      authStatus: AuthStatuses.UNAUTHORIZED,
    }),
  )
  .handleAction(
    [initDocumentSigning, initInviteAccepting, initAccessToken],
    (state, action) => ({
      ...state,
      signToken: action.payload.token,
    }),
  )
  .handleAction(
    [finishDocumentSigning, finishInviteAccepting, finishInitAccessToken],
    state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { signToken, ...nestState } = state;

      return nestState;
    },
  )
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
  .handleAction([sendDocumentOut.success], state => {
    const isSignaturesLimited = signatureLimitedPlans.includes(state.plan.id as PlanIds);

    const signatureCounterIncrement = isSignaturesLimited
      ? state.plan.type === PlanTypes.PERSONAL
        ? { personalDocumentsUsed: (state?.personalDocumentsUsed ?? 0) + 1 }
        : { freeDocumentsUsed: (state?.freeDocumentsUsed ?? 0) + 1 }
      : undefined;

    return {
      ...state,
      ...signatureCounterIncrement,
    };
  })
  .handleAction(initEmbedDocumentToken, (state, action) => ({
    ...state,
    embedToken: action.payload.token,
  }))
  .handleAction(removeEmbedDocumenToken, state => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { embedToken, ...nestState } = state;

    return nestState;
  })
  .handleAction(clearIntegrationData, (state, action) => {
    return {
      ...state,
      integrations: state.integrations.filter(
        integration => integration.type !== action.payload.type,
      ),
    };
  })
  .handleAction(retryCharge.success, state => {
    return {
      ...state,
      status: UserStatuses.ACTIVE,
    };
  })
  .handleAction([clearShowTrialSuccessPage], state => ({
    ...state,
    showTrialSuccessPage: false,
  }));
