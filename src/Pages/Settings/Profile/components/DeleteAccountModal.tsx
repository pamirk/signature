import React, { useCallback, useEffect } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectSubscriptionInfo, selectUser, selectUserPlan } from 'Utils/selectors';
import { isNotEmpty } from 'Utils/functions';
import { usePlanChange, useSubscriptionDataGet } from 'Hooks/Billing';
import { Plan, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { UserRoles, User } from 'Interfaces/User';
import Toast from 'Services/Toast';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

function getDeleteAccountModalTitle(plan: Plan, isTeammate) {
  const deletePlanTypes = {
    [PlanTypes.FREE]: 'Free',
    [PlanTypes.PERSONAL]: 'Personal',
    [PlanTypes.BUSINESS]: 'Business',
  };

  if (isTeammate) {
    return 'Are you sure you want to delete your Signaturely account?';
  }

  return `Are you sure you want to delete your Signaturely ${
    deletePlanTypes[plan.type]
  } account?`;
}

interface GetDeleteAccountModalTextParams {
  planType: PlanTypes;
  isCanceled: boolean;
  endPeriodDate: Date;
  isTeammate: boolean;
  isAppSumo: boolean;
}

function getDeleteAccountModalText(params: GetDeleteAccountModalTextParams) {
  if (params.isTeammate) {
    return (
      <div>
        We cannot complete your documents if you delete your account. We will transfer all
        your completed documents and Live templates to your team owner, and your team will
        lose access to all your other documents. We will change your live templates to
        drafts before transferring them to your team owner.
      </div>
    );
  }

  if (params.planType === PlanTypes.FREE) {
    return (
      <div>
        Your documents cannot be completed if you delete your account. Once you delete
        your account, your billing information will be deleted. We will not renew
        your&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_API}>API plan</a> if you have one.
      </div>
    );
  }

  if (params.planType === PlanTypes.PERSONAL && params.isCanceled) {
    return (
      <div>
        Your Signaturely Personal account is valid until&nbsp;
        {params.endPeriodDate.toDateString()}. We cannot complete your documents if you
        delete your account. We suggest you downgrade to a&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_BILLING}>Signaturely Free</a> account. Once
        you delete your account, your billing information will be deleted. We will not
        renew your&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_API}>API plan</a> if you have one.
      </div>
    );
  }

  if (params.planType === PlanTypes.PERSONAL && !params.isCanceled) {
    return (
      <div>
        Your Signaturely Personal account is valid until&nbsp;
        {params.endPeriodDate.toDateString()}. We cannot complete your documents if you
        delete your account. We suggest you downgrade to a&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_BILLING}>Signaturely Free</a> account. Once
        you delete your account, your billing information will be deleted. If you have
        one, we will not renew your subscription and your&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_API}>API plan</a>.
      </div>
    );
  }

  if (params.planType === PlanTypes.BUSINESS && params.isCanceled) {
    return (
      <div>
        Your Signaturely Business account is valid until&nbsp;
        {params.endPeriodDate.toDateString()}. We cannot complete awaiting documents if
        you delete your account. Once you delete your account, we will delete your billing
        information. We will not renew your subscription and your&nbsp;
        <a href={AuthorizedRoutePaths.SETTINGS_API}>API plan</a> if you have one.&nbsp;
        <span>The deletion of your team is irreversible</span>, and you will only get
        access to completed documents and templates of your teammates if you sign up with
        the same email you use now. We will transfer to you from your teammates only Live
        templates, and we will change them to drafts.
        {!params.isAppSumo && (
          <>
            {' '}
            You can keep your access to the completed documents and transferred templates
            of your team and your documents if you downgrade to a&nbsp;
            <a href={AuthorizedRoutePaths.SETTINGS_BILLING}>Free or Personal account</a>.
          </>
        )}
      </div>
    );
  }

  if (params.planType === PlanTypes.BUSINESS && !params.isCanceled) {
    return (
      <div>
        Your Signaturely Business account is valid until&nbsp;
        {params.endPeriodDate.toDateString()}. We cannot complete your documents if you
        delete your account. Once you delete your account, we will delete your billing
        information. We will not renew your{' '}
        <a href={AuthorizedRoutePaths.SETTINGS_API}>API plan</a> if you have one.{' '}
        <span>The deletion of your team is irreversible</span>, and you will only get
        access to completed documents and templates of your teammates if you sign up with
        the same email you use now. We will transfer to you from your teammates only Live
        templates, and we will change them to drafts.
        {!params.isAppSumo && (
          <>
            {' '}
            You can keep your access to the completed documents and transferred templates
            of your team and your documents if you downgrade to a&nbsp;
            <a href={AuthorizedRoutePaths.SETTINGS_BILLING}>Free or Personal account</a>.
          </>
        )}
      </div>
    );
  }
}

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleteAccount: () => void;
  isLoading?: boolean;
}

const DeleteAccountModal = ({
  onClose,
  onDeleteAccount,
  isLoading,
}: DeleteAccountModalProps) => {
  const isMobile = useIsMobile();
  const userPlan = useSelector(selectUserPlan);
  const user: User = useSelector(selectUser);
  const [getSubscriptionData] = useSubscriptionDataGet();
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const [changePlan, isChangePlanLoading] = usePlanChange();

  const handleDowngradeToFreePlan = useCallback(async () => {
    if (userPlan.type === PlanTypes.FREE || !subscriptionInfo?.neverExpires) {
      return;
    }

    await changePlan({ type: PlanTypes.FREE, duration: PlanDurations.MONTHLY });

    Toast.success(
      `Your account will be downgraded on ${new Date(
        subscriptionInfo?.nextBillingDate,
      ).toDateString()}`,
    );

    onClose();
  }, [changePlan, onClose, subscriptionInfo, userPlan.type]);

  const handleDeleteAccount = useCallback(() => {
    onClose();
    onDeleteAccount();
  }, [onClose, onDeleteAccount]);

  useEffect(() => {
    !isNotEmpty(subscriptionInfo) && getSubscriptionData(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UIModal onClose={onClose}>
      <div className={classNames('profile__modal', { mobile: isMobile })}>
        <div className="profile__modal-title">
          {getDeleteAccountModalTitle(
            userPlan,
            user.teamId && user.role !== UserRoles.OWNER,
          )}
        </div>
        <div className="profile__modal-description settings__text">
          {getDeleteAccountModalText({
            planType: userPlan.type,
            isCanceled: !subscriptionInfo?.neverExpires,
            isTeammate: !!user?.teamId && user?.role !== UserRoles.OWNER,
            endPeriodDate: new Date(subscriptionInfo?.nextBillingDate),
            isAppSumo: !!user?.appSumoStatus,
          })}
        </div>
        <div className="profile__modal-button-wrapper delete">
          <UIButton
            title="Don't delete my account"
            priority="primary"
            handleClick={onClose}
            disabled={isLoading || isChangePlanLoading}
            isLoading={isLoading || isChangePlanLoading}
          />
        </div>
        {subscriptionInfo?.neverExpires && (
          <UIButton
            title="Downgrade my account to Signaturely Free"
            priority="secondary"
            handleClick={handleDowngradeToFreePlan}
            disabled={isLoading || isChangePlanLoading}
            isLoading={isLoading || isChangePlanLoading}
          />
        )}
        <div className="profile__modal-button--delete" onClick={handleDeleteAccount}>
          Delete my account
        </div>
      </div>
    </UIModal>
  );
};

export default DeleteAccountModal;
