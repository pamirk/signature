import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';
import { TeamMember } from 'Interfaces/Team';
import { UserRoles } from 'Interfaces/User';

import UICheckbox from 'Components/UIComponents/UICheckbox';
import DropDownOptions from 'Components/DropDownOptions';

import KeyIcon from 'Assets/images/icons/key-icon.svg';
import { useToAdminUpgrade, useToUserDowngrade } from 'Hooks/Team';
import Toast from 'Services/Toast';
import { Avatar } from 'Components/Avatar/Avatar';

interface TeamMemberItemProps {
  teamMember: TeamMember;
  toggleSelect: (teamMemberId: TeamMember['id']) => void;
  className?: string;
  isSelected?: boolean;
  isSelectable?: boolean;
  isEditEnabled?: boolean;
  isChangingRoleEnabled?: boolean;
}

const TeamMemberItem = ({
  teamMember,
  className,
  isSelected = false,
  isSelectable,
  isChangingRoleEnabled = true,
  isEditEnabled = true,
  toggleSelect = () => {},
}: TeamMemberItemProps) => {
  const [upgradeToAdmin, isUpgradingToAdmin] = useToAdminUpgrade();
  const [downgradeToUser, isDowngradeToUser] = useToUserDowngrade();

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

  const handleSelectionToggle = useCallback(() => {
    toggleSelect(teamMember.id);
  }, [toggleSelect, teamMember.id]);

  const options = useMemo(() => {
    return [
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
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpgradingToAdmin, isDowngradeToUser, teamMember.role]);

  const hasActions = useMemo(() => !!options.filter(option => !option.hidden).length, [
    options,
  ]);

  return (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="table__column table__column--check">
        {isSelectable && (
          <UICheckbox handleClick={handleSelectionToggle} check={isSelected} />
        )}
      </div>
      <div className="table__column table__column--text team__column-member">
        <div className="team__member">
          <Avatar
            name={teamMember.name}
            email={teamMember.email}
            avatarUrl={teamMember.avatarUrl}
          />
          <p className="team__member-name">{teamMember.name}</p>
        </div>
      </div>
      <div className="table__column table__column--team-email">{teamMember.email}</div>
      <div className="table__column table__column--status">
        {_.capitalize(teamMember.role)}
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
          <DropDownOptions options={options} anchorClassName="table__container" />
        </div>
      )}
    </div>
  );
};

export default TeamMemberItem;
