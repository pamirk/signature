import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectTeamMembers,
  selectUser,
  selectSubscriptionInfo,
  selectLtdTier,
} from 'Utils/selectors';
import { useSelectableItem, useModal, useDataOrdering } from 'Hooks/Common';
import useTeamMembersGet from 'Hooks/Team/useTeamMembersGet';
import useTeamMembersDelete from 'Hooks/Team/useTeamMembersDelete';
import useTeamMembersAdd from 'Hooks/Team/useTeamMembersAdd';
import { useCardGet, useLtdTierGet, useSubscriptionDataGet } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import { UserRoles, User } from 'Interfaces/User';
import { AppSumoStatus, LtdTypes, PlanTypes } from 'Interfaces/Billing';
import { OrderingDirection } from 'Interfaces/Common';

import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import { DeleteTeammateModal, TeamMembersAddModal, TeamMembersList } from './components';
import AdditionalTeamMembersAddModal from './components/AdditionalTeamMembersAddModal';
import { Billet } from 'Pages/Settings/Company/components';
import { TeamScreenMobileView } from './TeamScreenMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import LtdUpgradePlanModal from 'Pages/Settings/Billing/components/modals/LtdUpgradePlanModal';
import { isNotEmpty } from 'Utils/functions';
import { useCurrentUserGet } from 'Hooks/User';
import { APPSUMO_STANDARD_TEAM_LIMIT } from 'Utils/constants';

const TeamScreen = () => {
  const user: User = useSelector(selectUser);
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const ltdTier = useSelector(selectLtdTier);
  const [getSubscriptionData, isSubscriptionDataLoading] = useSubscriptionDataGet();
  const [getTeamMembers, isFetchLoading] = useTeamMembersGet();
  const [deleteTeamMembers, isDeleteLoading] = useTeamMembersDelete();
  const [addTeamMembers] = useTeamMembersAdd();
  const [getLtdTier] = useLtdTierGet();
  const teamMembers = useSelector(selectTeamMembers);
  const [selectableTeamMembers, toggleItemSelection, selectedItems] = useSelectableItem(
    teamMembers,
    'id',
  );
  const [getCard, isGettingCard] = useCardGet();
  const [getCurrentUser] = useCurrentUserGet();

  const isMobile = useIsMobile();
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

  const { requestOrdering, orderingConfig } = useDataOrdering(teamMembers, {
    key: 'role',
    direction: OrderingDirection.DESC,
  });

  const handleSubscriptionInfoGet = useCallback(async () => {
    try {
      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getSubscriptionData]);

  const handleTeamMembersGet = useCallback(async () => {
    try {
      const { key, direction } = orderingConfig;

      await getTeamMembers({
        orderingKey: key,
        orderingDirection: direction.toUpperCase(),
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderingConfig]);

  const handleDeleteTeamMembers = useCallback(async () => {
    const teamMembersIds = selectedItems.map(item => item.id);
    try {
      await deleteTeamMembers(teamMembersIds);

      Toast.success('Team member deleted successfully');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [selectedItems, deleteTeamMembers]);

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteTeammateModal
        onClose={hideDeleteModal}
        onDeleteTeammate={handleDeleteTeamMembers}
        isLoading={isDeleteLoading}
      />
    ),
    [handleDeleteTeamMembers],
  );

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

  const handleGetLtdTier = useCallback(async () => {
    await getLtdTier({ ltdId: user.ltdTierId });
  }, [getLtdTier, user.ltdTierId]);

  useEffect(() => {
    handleTeamMembersGet();
    handleSubscriptionInfoGet();
    handleGetLtdTier();
    getCard(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTeamMembersGet]);

  const openDeleteModal = useCallback(() => {
    if (selectedItems.length) {
      showDeleteModal();
    }
  }, [selectedItems.length, showDeleteModal]);

  return isMobile ? (
    <TeamScreenMobileView
      user={user}
      teamMembers={selectableTeamMembers}
      isLoading={isFetchLoading || isDeleteLoading}
      isBusiness
      isSubscriptionDataLoading={isSubscriptionDataLoading}
      isDeleteModalOpen={isDeleteModalOpen}
      onAddTeamMember={handleTeamMembersAdd}
      openDeleteModal={openDeleteModal}
      toggleItemSelection={toggleItemSelection}
    />
  ) : (
    <div className="team">
      <div className="team__header-container">
        <div className="team__header-title-group">
          <div className="company__billet-container">
            <p className="team__header-title">Team</p>
            {user.plan.type !== PlanTypes.BUSINESS && !user.teamId && (
              <Billet title="Business Feature" />
            )}
          </div>
          <div className="team__header-description">
            Add your team members to your Signaturely account to allow them to request
            signatures, create documents, and much more.
          </div>
        </div>
        <div className="team__button">
          <UIButton
            priority="primary"
            title="Add Team Member"
            handleClick={handleTeamMembersAdd}
            disabled={
              (user.role === UserRoles.OWNER && user.plan.type !== PlanTypes.BUSINESS) ||
              user.role === UserRoles.USER ||
              isSubscriptionDataLoading
            }
            isLoading={isGettingCard || isSubscriptionDataLoading}
          />
        </div>
      </div>
      <TeamMembersList
        user={user}
        isDeleteModalOpen={isDeleteModalOpen}
        isLoading={isFetchLoading || isDeleteLoading}
        toggleItemSelection={toggleItemSelection}
        openDeleteModal={openDeleteModal}
        requestOrdering={requestOrdering}
        teamMembers={selectableTeamMembers}
      />
      {[LtdTypes.APPSUMO, LtdTypes.TIER].includes(ltdType) && (
        <div className="team__header-description">
          Your current lifetime deal includes {teamLimit} users. If you require more
          seats, they can be added through our subscription plans.
        </div>
      )}
    </div>
  );
};

export default TeamScreen;
