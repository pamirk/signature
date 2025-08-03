import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import History from 'Services/History';

import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';

import IconDeclined from 'Assets/images/icons/circle-declined.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface DocumentDeclineModalProps {
  onClose?: () => void;
  onConfirm?: () => void;
}

const DocumentDeclineModal = ({ onClose, onConfirm }: DocumentDeclineModalProps) => {
  const isMobile = useIsMobile();

  const navigateToDocuments = useCallback(() => {
    History.push(AuthorizedRoutePaths.DOCUMENTS);
  }, []);

  return (
    <UIModal
      onClose={onClose || navigateToDocuments}
      className={classNames('successSendModal', {
        mobile: isMobile,
      })}
      hideCloseIcon
      shouldCloseOnOverlayClick={false}
    >
      <div
        className={classNames(
          'successSendModal__main',
          'successSendModal__main--banBorderBottom',
        )}
      >
        <ReactSVG src={IconDeclined} className="successSendModal__main-icon" />
        <div className="successSendModal__text-wrapper">
          <p className="successSendModal__title">Document Declined</p>
          <p className="successSendModal__text">
            Your decision to decline signing this document has been noted.
            <br />
            The sender will receive a notification regarding your decline.
          </p>
        </div>
        <UIButton
          priority="primary"
          className="successSendModal__button"
          handleClick={onConfirm || navigateToDocuments}
          title={`Return to Documents`}
        />
      </div>
    </UIModal>
  );
};

export default DocumentDeclineModal;
