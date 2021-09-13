import React, { useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import History from 'Services/History';
import { TablePaginationProps, SelectableItem } from 'Interfaces/Common';
import EmptyTable from 'Components/EmptyTable/EmptyTable';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconSort from 'Assets/images/icons/sort.svg';
import TeamMemberItem from './TeamMemberItem';
import UISpinner from 'Components/UIComponents/UISpinner';
import { TeamMember } from 'Interfaces/Team';
import TeamIcon from 'Assets/images/icons/team-empty-icon.svg';
import { User, UserRoles } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';
import { TeamMemberListMobileView } from './TeamMemberListMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface TeamMembersListProps {
  user: User;
  teamMembers: SelectableItem<TeamMember>[];
  paginationProps?: TablePaginationProps;
  toggleItemSelection?: (teamMemberId: string) => void;
  isLoading: boolean;
  requestOrdering?: (key: keyof TeamMember) => void;
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
}

function TeamMembersList({
  teamMembers,
  toggleItemSelection,
  isLoading,
  requestOrdering,
  isDeleteModalOpen,
  openDeleteModal,
  user,
}: TeamMembersListProps) {
  const isMobile = useIsMobile();

  const isBusinessPlan = useMemo(() => {
    return !!user.plan.type && user.plan.type === PlanTypes.BUSINESS;
  }, [user.plan.type]);

  const isTableEmpty = useMemo(() => {
    return (!isBusinessPlan && !user.teamId) || teamMembers.length === 0;
  }, [isBusinessPlan, user.teamId, teamMembers.length]);

  const isOwnerOrAdmin = useMemo(() => {
    return user.role === UserRoles.OWNER || user.role === UserRoles.ADMIN;
  }, [user.role]);

  const emptyTableProps = useMemo(() => {
    return !isBusinessPlan
      ? {
          buttonText: 'Upgrade to Business',
          headerText: 'Start adding team members!',
          description: 'Upgrade to business to add team members to your account',
        }
      : {
          buttonClassName: 'team__button--hide',
          headerText: 'Start adding team members!',
        };
  }, [isBusinessPlan]);

  if (isTableEmpty)
    return (
      <div className="documents__empty-table">
        <EmptyTable
          {...emptyTableProps}
          onClick={() => {
            History.push('/settings/billing/plan');
          }}
          icon={TeamIcon}
          iconClassName="empty-table__icon--team"
        />
      </div>
    );

  return isMobile ? (
    <TeamMemberListMobileView
      isLoading={false}
      teamMembers={teamMembers}
      isEditEnabled={isOwnerOrAdmin}
      isChangingRoleEnabled={user.role === UserRoles.OWNER}
    />
  ) : (
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
          <div className="table__row table__header">
            <div className="table__column table__column--check" />
            <div className="table__column table__column--text team__column-member">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering && requestOrdering('name')}
              >
                <span>MEMBER</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--team-email">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering && requestOrdering('email')}
              >
                <span>EMAIL</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--status">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering && requestOrdering('role')}
              >
                <span>ROLE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            {isOwnerOrAdmin && (
              <div className="table__column table__column--action team__column-actions">
                ACTIONS
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="documents__spinner">
              <UISpinner width={50} height={50} className="spinner--main__wrapper" />
            </div>
          ) : (
            teamMembers.map(teamMember => {
              return (
                <TeamMemberItem
                  key={teamMember.id}
                  teamMember={teamMember}
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
                  isEditEnabled={isOwnerOrAdmin}
                  isChangingRoleEnabled={user.role === UserRoles.OWNER}
                  className={classNames({
                    'table__dataRow--delete': isDeleteModalOpen && teamMember.isSelected,
                    'table__dataRow--inactive':
                      isDeleteModalOpen && !teamMember.isSelected,
                  })}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamMembersList;
