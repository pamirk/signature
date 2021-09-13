import React, { useCallback } from 'react';
import { useModal } from 'react-modal-hook';
import classNames from 'classnames';
import { Requisite } from 'Interfaces/Requisite';

import {
  RequisiteDeleteModal,
  RequisiteActionsDropdown,
  RequisiteItem,
} from 'Components/RequisiteComponents';
import { RequisiteActionTypes } from 'Components/RequisiteComponents/RequisiteActionsDropdown/RequisiteActionsDropdown';

interface RequisiteListItemProps {
  requisite: Requisite;
  isSelected?: boolean;
  onItemClick?: (requisite: Requisite) => void;
  onItemEdit?: (requisite: Requisite) => void;
  onItemDoubleClick?: (requisite: Requisite) => void;
}

export const RequisiteListItem = ({
  requisite,
  isSelected,
  onItemClick,
  onItemDoubleClick,
  onItemEdit,
}: RequisiteListItemProps) => {
  const handleItemClick = useCallback(() => {
    onItemClick && onItemClick(requisite);
  }, [onItemClick, requisite]);
  const handleItemDoubleClick = useCallback(() => {
    onItemDoubleClick && onItemDoubleClick(requisite);
  }, [onItemDoubleClick, requisite]);
  const handleItemEdit = useCallback(() => {
    onItemEdit && onItemEdit(requisite);
  }, [onItemEdit, requisite]);

  const [showDeleteModal, closeDeleteModal] = useModal(
    () => (
      <RequisiteDeleteModal closeModal={closeDeleteModal} requisiteItem={requisite} />
    ),
    [requisite],
  );

  return (
    <li
      key={requisite.id}
      className={classNames('settingsSignature__item', {
        'settingsSignature__item--selected': isSelected,
      })}
      onClick={handleItemClick}
      onDoubleClick={handleItemDoubleClick}
    >
      <RequisiteActionsDropdown
        options={[
          {
            type: RequisiteActionTypes.EDIT,
            title: 'Edit',
            onClick: handleItemEdit,
          },
          {
            type: RequisiteActionTypes.DELETE,
            title: 'Delete',
            onClick: showDeleteModal,
          },
        ]}
      />
      <RequisiteItem requisiteItem={requisite} />
    </li>
  );
};

export default RequisiteListItem;
