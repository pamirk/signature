import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useModal } from 'react-modal-hook';
import {
  RequisiteActionsDropdown,
  RequisiteItem,
  RequisiteDeleteModal,
  RequisiteModal,
} from 'Components/RequisiteComponents';
import {
  RequisiteActionOption,
  RequisiteActionTypes,
} from 'Components/RequisiteComponents/RequisiteActionsDropdown';
import { Requisite } from 'Interfaces/Requisite';
import { selectRequisite } from 'Utils/selectors';
import UIModal from 'Components/UIComponents/UIModal';

interface SignatureItemProps {
  signatureItem: Requisite;
}

export const SignatureItem = ({ signatureItem }: SignatureItemProps) => {
  const siblingRequisite = useSelector(state =>
    selectRequisite(state, { requisiteId: signatureItem.siblingId }),
  );

  const [showDeleteModal, closeDeleteModal] = useModal(
    () => (
      <RequisiteDeleteModal closeModal={closeDeleteModal} requisiteItem={signatureItem} />
    ),
    [signatureItem],
  );

  const [showEditModal, closeRequisiteModal] = useModal(
    () => (
      <UIModal
        className="requisiteModal__wrapper"
        onClose={closeRequisiteModal}
        hideCloseIcon
      >
        <RequisiteModal
          title="Edit Signature"
          buttonText="Update signature"
          requisiteItem={signatureItem}
          siblingRequisiteItem={siblingRequisite}
          onClose={closeRequisiteModal}
        />
      </UIModal>
    ),
    [signatureItem],
  );

  const dropdownOptions = useMemo(
    () =>
      [
        {
          type: RequisiteActionTypes.EDIT,
          title: 'Edit',
          onClick: showEditModal,
        },
        {
          type: RequisiteActionTypes.DELETE,
          title: 'Delete',
          onClick: showDeleteModal,
        },
      ] as RequisiteActionOption[],
    [showEditModal, showDeleteModal],
  );

  return (
    <li className="settingsSignature__item">
      <RequisiteActionsDropdown options={dropdownOptions} />
      <RequisiteItem requisiteItem={signatureItem} />
    </li>
  );
};

export default SignatureItem;
