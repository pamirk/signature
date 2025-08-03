import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import UIButton from 'Components/UIComponents/UIButton';
import { FolderChangePermissionsPayload } from 'Interfaces/Folder';
import { useSelector } from 'react-redux';
import { selectTeamMembers, selectUser } from 'Utils/selectors';
import { UserRoles, User } from 'Interfaces/User';
import FolderPermissionsMemberItem from 'Components/FolderPermissionsMemberItem/FolderPermissionsMemberItem';
import { GridItem } from 'Interfaces/Grid';
import { TeamMember } from 'Interfaces/Team';

interface ChangePermissionsModalProps {
  grid?: GridItem;
  parentPermissions: any[];
  onClose: () => void;
  onSubmit: (values: FolderChangePermissionsPayload) => void;
  isLoading: boolean;
}

const ChangePermissionsModal = ({
  grid,
  onClose,
  parentPermissions,
  onSubmit,
  isLoading,
}: ChangePermissionsModalProps) => {
  const teamMembers = useSelector(selectTeamMembers);
  const user: User = useSelector(selectUser);

  const handleChangePermissions = (values: any) => {
    const memberIds = [] as TeamMember['id'][];
    for (const key in values) {
      if (values[key]) {
        memberIds.push(key);
      }
    }
    onSubmit({ gridId: grid?.id || '', memberIds: memberIds });
  };

  const isCheckboxDisabled = useCallback(
    (member: TeamMember) => {
      if (
        member.role === UserRoles.OWNER ||
        (parentPermissions.length && !parentPermissions.includes(member.id))
      ) {
        return true;
      }

      return (
        user.role !== UserRoles.OWNER &&
        (member.role === UserRoles.ADMIN || user.id === member.id)
      );
    },
    [parentPermissions, user.id, user.role],
  );

  return (
    <div className="changePermissionsModal__wrapper">
      <div className="changePermissionsModal__header">
        <h4 className="modal__title">Folder permissions</h4>
        <p className="modal__subTitle"></p>
      </div>

      <Form
        onSubmit={handleChangePermissions}
        render={({ hasValidationErrors, submitting, handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              {teamMembers.length ? (
                teamMembers.map(member => (
                  <Field
                    key={`member-${member.id}-item`}
                    initialValue={
                      !!grid?.permissions.find(
                        permission => permission.userId === member.id,
                      )
                    }
                    type="checkbox"
                    name={`${member.id}`}
                    placeholder="New Folder Name"
                  >
                    {props => (
                      <FolderPermissionsMemberItem
                        member={member}
                        renderProps={props}
                        disabled={isCheckboxDisabled(member)}
                      />
                    )}
                  </Field>
                ))
              ) : (
                <div className="changePermissionsModal__info">
                  You do not have any teammates yet.
                </div>
              )}
              <div className="changePermissionsModal__actions">
                <UIButton
                  type="submit"
                  priority="primary"
                  disabled={hasValidationErrors || submitting || isLoading}
                  isLoading={false}
                  title="Update permissions"
                />
                <div className="changePermissionsModal__cancel" onClick={onClose}>
                  Cancel
                </div>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default ChangePermissionsModal;
