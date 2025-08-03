import UIButton from 'Components/UIComponents/UIButton';
import { AppSumoStatus, PlanTypes } from 'Interfaces/Billing';
import { SelectableItem } from 'Interfaces/Common';
import { TeamMember } from 'Interfaces/Team';
import { User, UserRoles } from 'Interfaces/User';
import { Billet } from 'Pages/Settings/Company/components';
import React from 'react';
import { TeamMembersList } from './components';

interface TeamScreenMobileViewProps {
  user: User;
  teamMembers: SelectableItem<TeamMember>[];
  isLoading: boolean;
  isBusiness: boolean;
  isSubscriptionDataLoading: boolean;
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
  onAddTeamMember: () => void;
  toggleItemSelection?: (teamMemberId: string) => void;
}

export const TeamScreenMobileView = ({
  user,
  teamMembers,
  isLoading,
  isBusiness,
  isSubscriptionDataLoading,
  isDeleteModalOpen,
  onAddTeamMember,
  openDeleteModal,
  toggleItemSelection,
}: TeamScreenMobileViewProps) => {
  return (
    <div className="team">
      <div className="team__header-container">
        <div className="team__header-title-group">
          <div className="company__billet-container">
            <p className="team__header-title">Team</p>
            {!isBusiness && <Billet title="Business Feature" />}
          </div>
          <div className="team__header-description mobile">
            Add your team members to your Signaturely account to allow them to request
            signatures, create documents, and much more.
          </div>
        </div>
      </div>
      <div className="team__button mobile">
        <UIButton
          priority="primary"
          title="Add Team Member"
          handleClick={onAddTeamMember}
          disabled={
            (user.role === UserRoles.OWNER && user.plan.type !== PlanTypes.BUSINESS) ||
            user.role === UserRoles.USER ||
            isSubscriptionDataLoading
          }
        />
      </div>
      <TeamMembersList
        user={user}
        isDeleteModalOpen={isDeleteModalOpen}
        isLoading={isLoading}
        openDeleteModal={openDeleteModal}
        teamMembers={teamMembers}
        toggleItemSelection={toggleItemSelection}
      />
      {user.appSumoStatus === AppSumoStatus.STANDARD && (
        <div className="team__header-description mobile">
          Your current lifetime deal includes 3 users. If you require more seats, they can
          be added through our subscription plans.
        </div>
      )}
    </div>
  );
};
