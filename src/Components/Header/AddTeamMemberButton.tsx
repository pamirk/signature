import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import {
  selectTeamMembers,
  selectUser,
  selectSubscriptionInfo,
  selectLtdTier,
} from 'Utils/selectors';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { AppSumoStatus, LtdTypes, PlanTypes } from 'Interfaces/Billing';
import { useModal } from 'react-modal-hook';
import UIModal from 'Components/UIComponents/UIModal';
import { TeamMembersAddModal } from 'Pages/Team/components';
import { User, UserRoles } from 'Interfaces/User';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import { useTeamMembersAdd } from 'Hooks/Team';
import { useLtdTierGet, useSubscriptionDataGet } from 'Hooks/Billing';
import LtdUpgradePlanModal from 'Pages/Settings/Billing/components/modals/LtdUpgradePlanModal';
import { isNotEmpty } from 'Utils/functions';
import { useCurrentUserGet } from 'Hooks/User';
import AdditionalTeamMembersAddModal from 'Pages/Team/components/AdditionalTeamMembersAddModal';
import { APPSUMO_STANDARD_TEAM_LIMIT } from 'Utils/constants';

const AddTeamMemberButton = () => {
  const [getSubscriptionData, isSubscriptionDataLoading] = useSubscriptionDataGet();
  const [addTeamMembers] = useTeamMembersAdd();
  const [getCurrentUser] = useCurrentUserGet();
  const [getLtdTier] = useLtdTierGet();
  const user: User = useSelector(selectUser);
  const teamMembers = useSelector(selectTeamMembers);
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const ltdTier = useSelector(selectLtdTier);
  const [futureTeamMembers, setFutureTeamMembers] = useState<TeamMembersAddPayload>();
  const [teamLimit, ltdType] = useMemo(() => {
    if (isNotEmpty(ltdTier)) {
      const teamLimit =
        ltdTier.teammatesLimit === -1 ? undefined : ltdTier.teammatesLimit;
      return [teamLimit, LtdTypes.TIER];
    }

    if (user.appSumoStatus === AppSumoStatus.STANDARD) {
      return [APPSUMO_STANDARD_TEAM_LIMIT, LtdTypes.APPSUMO];
    }

    return [undefined, LtdTypes.NONE];
  }, [ltdTier, user.appSumoStatus]);

  const handleSubscriptionInfoGet = useCallback(async () => {
    try {
      await getSubscriptionData(undefined);
      await getLtdTier({ ltdId: user.ltdTierId });
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getLtdTier, getSubscriptionData, user.ltdTierId]);

  const handleAddAppSumoTeamMembersSubmit = useCallback(async () => {
    try {
      if (futureTeamMembers) {
        await addTeamMembers(futureTeamMembers);
        Toast.success('Invites sent successfully');
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [addTeamMembers, futureTeamMembers]);

  const [showLtdUpgradePlanModal, hideLtdUpgradePlanModal] = useModal(
    () => (
      <LtdUpgradePlanModal
        onClose={hideLtdUpgradePlanModal}
        addTeamMembers={handleAddAppSumoTeamMembersSubmit}
        quantity={futureTeamMembers?.members.length}
      />
    ),
    [handleAddAppSumoTeamMembersSubmit],
  );

  const [showPlanUpgradeModal, hidePlanUpgradeModal] = useModal(
    () => (
      <AdditionalTeamMembersAddModal
        onClose={hidePlanUpgradeModal}
        onSetFutureTeamMembers={(values: TeamMembersAddPayload) =>
          setFutureTeamMembers(values)
        }
        showBillingModal={showLtdUpgradePlanModal}
        teamLimit={teamLimit}
        ltdType={ltdType}
      />
    ),
    [subscriptionInfo, user.plan],
  );

  const handleAddTeamMembersSubmit = useCallback(
    async (values: TeamMembersAddPayload) => {
      try {
        if (
          teamLimit &&
          ltdType !== LtdTypes.NONE &&
          !isNotEmpty(subscriptionInfo) &&
          values.members.length > teamLimit
        ) {
          await addTeamMembers({ members: values.members.slice(0, teamLimit) });
          Toast.success(`Invites sent successfully for ${teamLimit} first team members`);
          setFutureTeamMembers({ members: values.members.slice(teamLimit) });
          showLtdUpgradePlanModal();
        } else {
          await addTeamMembers(values);
          Toast.success('Invites sent successfully');
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [addTeamMembers, ltdType, showLtdUpgradePlanModal, subscriptionInfo, teamLimit],
  );

  const [showAddMemberModal, hideAddMemberModal] = useModal(
    () => (
      <UIModal className="teamModal" onClose={hideAddMemberModal}>
        <TeamMembersAddModal
          onClose={hideAddMemberModal}
          appSumoStatus={user.appSumoStatus}
          userRole={user.role}
          sendDocument={handleAddTeamMembersSubmit}
          subscriptionInfo={subscriptionInfo}
          plan={user.plan}
          ltdTier={ltdTier}
          teamSize={teamMembers.length}
        />
      </UIModal>
    ),
    [subscriptionInfo, user.plan],
  );

  const handleTeamMembersAdd = useCallback(async () => {
    const currentUser = (await getCurrentUser(undefined)) as User;

    if (
      ltdType !== LtdTypes.NONE &&
      teamLimit &&
      teamMembers.length >= teamLimit &&
      !currentUser.subscriptionId
    ) {
      showPlanUpgradeModal();
    } else {
      showAddMemberModal();
    }
  }, [
    getCurrentUser,
    ltdType,
    showAddMemberModal,
    showPlanUpgradeModal,
    teamLimit,
    teamMembers.length,
  ]);

  useEffect(() => {
    handleSubscriptionInfoGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    (user.role === UserRoles.OWNER && user.plan.type !== PlanTypes.BUSINESS) ||
    user.role === UserRoles.USER
  ) {
    return null;
  }

  return (
    <div className="header__team-button-wrapper">
      <UIButton
        priority="primary"
        title="Add Team Member"
        handleClick={handleTeamMembersAdd}
        disabled={isSubscriptionDataLoading}
      />
    </div>
  );
};

export default AddTeamMemberButton;
