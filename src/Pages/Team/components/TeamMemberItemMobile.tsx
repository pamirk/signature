import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { capitalize } from 'lodash';
import { TeamMember } from 'Interfaces/Team';
import { Avatar } from 'Components/Avatar/Avatar';
import KeyIcon from 'Assets/images/icons/key-icon.svg';
import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import { UserRoles } from 'Interfaces/User';
import DropDownOptionsMobile from 'Pages/Documents/components/DocumentItem/DropDownOptionsMobile';
import { useTeamMembersDelete, useToAdminUpgrade, useToUserDowngrade } from 'Hooks/Team';
import Toast from 'Services/Toast';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useModal } from 'Hooks/Common';
import DeleteModal from 'Components/DeleteModal';
import UICheckbox from 'Components/UIComponents/UICheckbox';

interface TeamMemberItemMobileProps {
  teamMember: TeamMember;
  isChangingRoleEnabled: boolean;
  isEditEnabled: boolean;
  toggleSelect?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
}

const TeamMemberItemMobile = ({
  teamMember,
  isChangingRoleEnabled,
  isEditEnabled,
  isSelected,
  toggleSelect = () => {},
  isSelectable,
}: TeamMemberItemMobileProps) => {
  const [upgradeToAdmin, isUpgradingToAdmin] = useToAdminUpgrade();
  const [downgradeToUser, isDowngradeToUser] = useToUserDowngrade();
  const [deleteTeamMembers, isTeamMemberDeleting] = useTeamMembersDelete();

  const handleDeleteTeamMember = useCallback(async () => {
    const teamMembersIds = [teamMember.id];
    try {
      await deleteTeamMembers(teamMembersIds);

      Toast.success('Team member deleted successfully');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [deleteTeamMembers, teamMember]);

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDeleteTeamMember();
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
    [handleDeleteTeamMember],
  );

  const handleToAdminUpgrade = useCallback(async () => {
    try {
      await upgradeToAdmin({ userId: teamMember.id });

      Toast.success('Team member successfully upgraded to admin.');
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToUserDowngrade = useCallback(async () => {
    try {
      await downgradeToUser({ userId: teamMember.id });

      Toast.success('Team member successfully downgraded to user.');
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () => [
      {
        name: 'Upgrade to Admin',
        icon: KeyIcon,
        hidden: teamMember.role !== UserRoles.USER || !isChangingRoleEnabled,
        disabled: isUpgradingToAdmin,
        onClick: handleToAdminUpgrade,
      },
      {
        name: 'Downgrade to User',
        icon: KeyIcon,
        hidden: teamMember.role !== UserRoles.ADMIN || !isChangingRoleEnabled,
        disabled: isDowngradeToUser,
        onClick: handleToUserDowngrade,
      },
      {
        name: 'Remove from team',
        icon: RemoveIcon,
        hidden: teamMember.role === UserRoles.OWNER || !isChangingRoleEnabled,
        disabled: false,
        onClick: showDeleteModal,
        className: 'red',
      },
    ],
    [
      handleToAdminUpgrade,
      handleToUserDowngrade,
      isChangingRoleEnabled,
      isDowngradeToUser,
      isUpgradingToAdmin,
      showDeleteModal,
      teamMember.role,
    ],
  );

  const hasActions = useMemo(() => !!options.filter(option => !option.hidden).length, [
    options,
  ]);

  return (
    <div className="table__row table__dataRow--teammateItem mobile">
      <div className="table__column table__column--check">
        {isSelectable && (
          <UICheckbox handleClick={() => toggleSelect()} check={isSelected} />
        )}
      </div>
      <div className="team__member mobile">
        <Avatar
          name={teamMember.name}
          email={teamMember.email}
          avatarUrl={teamMember.avatarUrl}
        />
      </div>
      <div className="table__column table__column--text mobileTeamPage">
        <div className="team__member-name mobile">{teamMember.name}</div>
        <div className="table__column table__column--status">
          {capitalize(teamMember.role)}
        </div>
        <div className="table__column table__column--team-email mobile">
          {teamMember.email}
        </div>
      </div>
      {(isEditEnabled || isChangingRoleEnabled) && (
        <div
          className={classNames(
            'team__column-actions',
            'table__column',
            'table__column--action',
            {
              'table__column--hidden': !hasActions,
            },
          )}
        >
          {isTeamMemberDeleting ? (
            <UISpinner wrapperClassName="spinner--main__wrapper" width={20} height={20} />
          ) : (
            <DropDownOptionsMobile options={options} anchorClassName="table__container" />
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberItemMobile;
