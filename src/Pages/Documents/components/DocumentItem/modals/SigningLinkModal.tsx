import React, { useMemo } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import { useSigningUrl } from 'Hooks/DocumentSign';
import { useSignerAvatars } from 'Hooks/User';
import { Signer, Document } from 'Interfaces/Document';
import SignerItemLabel from '../../SignerItemLabel';
import * as _ from 'lodash';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import CopyClipboardIcon from 'Assets/images/icons/download-icon.svg';

interface SigningLinkModalProps {
  documentId: Document['id'];
  signers: Signer[];
  onClose: () => void;
  isSignersOrdered?: boolean;
}

const SigningLinkModal = ({
  onClose,
  signers,
  documentId,
  isSignersOrdered = false,
}: SigningLinkModalProps) => {
  const [userAvatars] = useSignerAvatars(documentId);
  const [getSigningUrl, isLoading] = useSigningUrl();
  const isMobile = useIsMobile();

  const orderedSigners = useMemo(() => _.orderBy(signers, 'order', 'asc'), [signers]);

  const firstUnfinishedSigner = useMemo(() => {
    if (!isSignersOrdered) return null;

    return orderedSigners.find(signer => !signer.isFinished);
  }, [isSignersOrdered, orderedSigners]);

  return (
    <UIModal onClose={onClose} className="signingLinkModal">
      <div className={classNames('signingLinkModal__wrapper', { mobile: isMobile })}>
        <div className="modal__header">
          <h4 className="modal__title signingModal__header">Generate signing link</h4>
          <p className="modal__subtitle">
            Generate signing links for this document and send it to signers to allow them
            sign the document.
          </p>
        </div>
        <div className="modal__content">
          <div className={classNames('signer__list', { mobile: isMobile })}>
            {signers.map(signer => (
              <div className="signer__list-item" key={signer.id}>
                <SignerItemLabel
                  avatarUrl={userAvatars[signer.userId]?.avatarUrl}
                  name={signer.name}
                  email={signer.email}
                />
                <div className="signer__item-button">
                  <UIButton
                    handleClick={() => getSigningUrl(documentId, signer.userId)}
                    title={!isMobile ? 'Get signing link' : ''}
                    rightIcon={isMobile ? CopyClipboardIcon : undefined}
                    priority="secondary"
                    isLoading={isLoading}
                    disabled={
                      isLoading ||
                      (isSignersOrdered && firstUnfinishedSigner?.id !== signer.id)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default SigningLinkModal;
