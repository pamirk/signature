// import { User } from '@sentry/react';
import classNames from 'classnames';
import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableItem } from 'Interfaces/Common';
import { TeamMember } from 'Interfaces/Team';
import React from 'react';
import TeamMemberItemMobile from './TeamMemberItemMobile';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import { ReactSVG } from 'react-svg';
import { UserRoles } from 'Interfaces/User';

interface TeamMemberListMobileViewProps {
  isLoading: boolean;
  teamMembers: SelectableItem<TeamMember>[];
  isEditEnabled: boolean;
  isChangingRoleEnabled: boolean;
  toggleItemSelection?: (teamMemberId: string) => void;
  user: any;
  isOwnerOrAdmin?: boolean;
  openDeleteModal: () => void;
}

export const TeamMemberListMobileView = ({
  isLoading,
  teamMembers,
  isEditEnabled,
  isChangingRoleEnabled,
  toggleItemSelection,
  user,
  isOwnerOrAdmin,
  openDeleteModal,
}: TeamMemberListMobileViewProps) => {
  return (
    <div className="table documents__table">
      <div className={classNames('table__tableControls team__controlsGroup')}>
        {isOwnerOrAdmin && (
          <button
            onClick={openDeleteModal}
            className="tableControls__control tableControls__control--red"
          >
            <ReactSVG src={IconRemove} className="tableControls__control-icon" />
            Delete
          </button>
        )}
      </div>
      <div className="table__container">
        <div className="table__innerContainer">
          <div className="table__row table__header mobile">
            <div className="table__column team__column-member">MEMBERS</div>
          </div>
          {isLoading ? (
            <div className="documents__spinner">
              <UISpinner width={50} height={50} className="spinner--main__wrapper" />
            </div>
          ) : (
            teamMembers.map(teamMember => {
              return (
                <TeamMemberItemMobile
                  key={teamMember.id}
                  teamMember={teamMember}
                  isChangingRoleEnabled={isChangingRoleEnabled}
                  isEditEnabled={isEditEnabled}
                  toggleSelect={() =>
                    toggleItemSelection && toggleItemSelection(teamMember.id)
                  }
                  isSelected={teamMember.isSelected}
                  isSelectable={
                    teamMember.id !== user.id &&
                    teamMember.role !== UserRoles.OWNER &&
                    (user.role === UserRoles.OWNER ||
                      (teamMember.role === UserRoles.USER && isOwnerOrAdmin))
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
