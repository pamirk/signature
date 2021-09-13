import UISpinner from 'Components/UIComponents/UISpinner';
import { SelectableItem } from 'Interfaces/Common';
import { TeamMember } from 'Interfaces/Team';
import React from 'react';
import TeamMemberItemMobile from './TeamMemberItemMobile';

interface TeamMemberListMobileViewProps {
  isLoading: boolean;
  teamMembers: SelectableItem<TeamMember>[];
  isEditEnabled: boolean;
  isChangingRoleEnabled: boolean;
}

export const TeamMemberListMobileView = ({
  isLoading,
  teamMembers,
  isEditEnabled,
  isChangingRoleEnabled,
}: TeamMemberListMobileViewProps) => {
  return (
    <div className="table documents__table">
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
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
