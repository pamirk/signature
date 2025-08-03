import Avatar from 'Components/Avatar';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import { TeamMember } from 'Interfaces/Team';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';

interface FolderPermissionsMemberItem {
  member: TeamMember;
  renderProps: FieldRenderProps<boolean, HTMLElement>;
  disabled: boolean;
}

const FolderPermissionsMemberItem = ({
  member,
  renderProps,
  disabled,
}: FolderPermissionsMemberItem) => {
  return (
    <div className="changePermissionsModal__list--item">
      <div className="changePermissionsModal__list--item-innerWrapper">
        <UICheckbox
          handleClick={() => renderProps.input.onChange(!renderProps.input.checked)}
          check={renderProps.input.checked || false}
          disabled={disabled}
        />
        <Avatar name={member.name} email={member.email} avatarUrl={member.avatarUrl} />
        <div className="changePermissionsModal__member-name">{member.name}</div>
      </div>
    </div>
  );
};

export default FolderPermissionsMemberItem;
