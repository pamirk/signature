import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTeamMembers, selectUser, selectSubsciptionInfo } from 'Utils/selectors';
import { useSelectableItem, useModal, useDataOrdering } from 'Hooks/Common';
import useTeamMembersGet from 'Hooks/Team/useTeamMembersGet';
import useTeamMembersDelete from 'Hooks/Team/useTeamMembersDelete';
import useTeamMembersAdd from 'Hooks/Team/useTeamMembersAdd';
import { useSubscriptionDataGet } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import { UserRoles, User } from 'Interfaces/User';
import { AppSumoStatus, PlanTypes } from 'Interfaces/Billing';
import { OrderingDirection } from 'Interfaces/Common';

import UIButton from 'Components/UIComponents/UIButton';
import DeleteModal from 'Components/DeleteModal';
import UIModal from 'Components/UIComponents/UIModal';
import { TeamMembersAddModal, TeamMembersList } from './components';
import UpgradePlanModal from './components/UpgradePlanModal';
import { Billet } from 'Pages/Settings/Company/components';
import { TeamScreenMobileView } from './TeamScreenMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';

const TeamScreen = () => {
  const user: User = useSelector(selectUser);
  const subscriptionInfo = useSelector(selectSubsciptionInfo);
  const [getSubscriptionData, isSubscriptionDataLoading] = useSubscriptionDataGet();
  const [getTeamMembers, isFetchLoading] = useTeamMembersGet();
  const [deleteTeamMembers, isDeleteLoading] = useTeamMembersDelete();
  const [addTeamMembers] = useTeamMembersAdd();
  const teamMembers = useSelector(selectTeamMembers);
  const [selectableTeamMembers, toggleItemSelection, selectedItems] = useSelectableItem(
    teamMembers,
    'id',
  );
  const isMobile = useIsMobile();

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

  const handleAddTeamMembersSubmit = useCallback(
    async (values: TeamMembersAddPayload) => {
      try {
        await addTeamMembers(values);
        Toast.success('Invites sent successfully');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [addTeamMembers],
  );

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
        //@ts-ignore
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDeleteTeamMembers();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
        deleteTitle="Delete User"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure you want to delete this team member?
          </h5>
          <p className="modal__subTitle">
            If you want to remove the user so they can&apos;t access Signaturely anymore,
            please continue.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDeleteTeamMembers],
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
        />
      </UIModal>
    ),
    [subscriptionInfo, user.plan],
  );

  const [showPlanUpgradeModal, hidePlanUpgradeModal] = useModal(
    () => (
      <UpgradePlanModal
        onClose={hidePlanUpgradeModal}
        onSuccessUpgrade={showAddMemberModal}
      />
    ),
    [subscriptionInfo, user.plan],
  );
  const handleTeamMembersAdd = useCallback(() => {
    if (
      teamMembers.length >= 3 &&
      user.appSumoStatus === AppSumoStatus.STANDARD &&
      !user.subscriptionId
    ) {
      showPlanUpgradeModal();
    } else {
      showAddMemberModal();
    }
  }, [
    showAddMemberModal,
    showPlanUpgradeModal,
    teamMembers,
    user.appSumoStatus,
    user.subscriptionId,
  ]);

  useEffect(() => {
    handleTeamMembersGet();
    handleSubscriptionInfoGet();
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
    />
  ) : (
    <div className="team">
      <div className="team__header-container">
        <div className="team__header-title-group">
          <div className="company__billet-container">
            <p className="team__header-title">Team</p>
            {user.plan.type !== PlanTypes.BUSINESS && <Billet title="Business Feature" />}
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
    </div>
  );
};

export default TeamScreen;
