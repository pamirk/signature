import React, { useCallback, useMemo } from 'react';
import { orderBy } from 'lodash';
import { useModal, useSelectableItem } from 'Hooks/Common';
import { useRemindersSend } from 'Hooks/DocumentSign';
import Toast from 'Services/Toast';
import { Signer, Document } from 'Interfaces/Document';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import UIButton from 'Components/UIComponents/UIButton';
import { useSignerAvatars } from 'Hooks/User';
import SignerItemLabel from '../../SignerItemLabel';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import UpgradeModal from '../../../../../Components/UpgradeModal';
import { RequestErrorTypes } from '../../../../../Interfaces/Common';

interface ReminderModalProps {
  signersOptions: Signer[];
  documentId: Document['id'];
  onClose: () => void;
  isSignersOrdered?: boolean;
}

const ReminderModal = ({
  signersOptions,
  onClose,
  documentId,
  isSignersOrdered = false,
}: ReminderModalProps) => {
  const [sendReminders, isLoading] = useRemindersSend();
  const [userAvatars] = useSignerAvatars(documentId);
  const isMobile = useIsMobile();
  const orderedSigners = useMemo(() => orderBy(signersOptions, 'order', 'asc'), [
    signersOptions,
  ]);
  const firstUnfinishedSigner = useMemo(() => {
    if (!isSignersOrdered) return null;

    return orderedSigners.find(signer => !signer.isFinished && !signer.isDeclined);
  }, [orderedSigners, isSignersOrdered]);
  const [selectableSigners, toggleSignerSelection, selectedSigners] = useSelectableItem(
    orderedSigners,
    'id',
  );

  const [showUpgradeModal, hideUpgradeModal] = useModal(() => {
    return (
      <UpgradeModal
        title="Please upgrade your plan"
        onClose={hideUpgradeModal}
        cancelComponent={() => (
          <div className="upgradeModal__button--cancel" onClick={hideUpgradeModal}>
            Nevermind
          </div>
        )}
      >
        Free Users can only send 2 reminders per document. <br />
        Please upgrade your plan if you need to send more reminders.
      </UpgradeModal>
    );
  });

  const handleRemindersSend = useCallback(async () => {
    try {
      const selectedSignersIds = selectedSigners.map(signer => signer.id);

      await sendReminders({ signersIds: selectedSignersIds, documentId });
      onClose();
      Toast.success('Reminder(s) has been sent');
    } catch (error) {
      console.log(error);
      if (
        error.type === RequestErrorTypes.QUOTA_EXCEEDED &&
        error.message === 'Upgrade to Personal plan'
      ) {
        return showUpgradeModal();
      }

      Toast.handleErrors(error);
    }
  }, [selectedSigners, sendReminders, documentId, onClose, showUpgradeModal]);

  return (
    <div className="reminderModal__wrapper">
      <div className="modal__header">
        <h4 className="modal__title">Send Reminder</h4>
        <p className="modal__subTitle">
          Choose the signers to send an email reminder to complete the document signature.
        </p>
      </div>
      <div className={classNames('reminderModal__options', { mobile: isMobile })}>
        {selectableSigners.map(selectableSigner => (
          <button
            disabled={
              selectableSigner.isFinished ||
              (isSignersOrdered && selectableSigner.id !== firstUnfinishedSigner?.id)
            }
            onClick={() => toggleSignerSelection(selectableSigner.id)}
            key={selectableSigner.id}
            className="reminderModal__optionItem"
            type="button"
          >
            <SignerItemLabel
              avatarUrl={userAvatars[selectableSigner.userId]?.avatarUrl}
              name={selectableSigner.name}
              email={selectableSigner.email}
              isSelected={selectableSigner.isSelected}
            />
            <UICheckbox check={selectableSigner.isSelected} />
          </button>
        ))}
      </div>
      <UIButton
        priority="primary"
        disabled={!selectedSigners.length}
        handleClick={handleRemindersSend}
        isLoading={isLoading}
        title="Send Reminder"
      />
    </div>
  );
};

export default ReminderModal;
