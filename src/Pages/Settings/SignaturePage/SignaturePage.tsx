import React, { useCallback, useEffect } from 'react';
import { useModal } from 'Hooks/Common';
import { RequisiteModal } from 'Components/RequisiteComponents';
import UIButton from 'Components/UIComponents/UIButton';
import SignatureItem from './SignatureItem/SignatureItem';
import Toast from 'Services/Toast';
import { useRequisitesGet } from 'Hooks/Requisite';
import { useSelector } from 'react-redux';
import { selectSignatures } from 'Utils/selectors';
import UIModal from 'Components/UIComponents/UIModal';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const SignaturePage = () => {
  const [getRequisites] = useRequisitesGet();
  const signatures:any = useSelector(selectSignatures);
  const isMobile = useIsMobile();

  const handleGetRequisites = useCallback(async () => {
    try {
      await getRequisites(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getRequisites]);

  useEffect(() => {
    handleGetRequisites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showRequisiteModal, closeRequisiteModal] = useModal(() => (
    <UIModal
      className={classNames('requisiteModal__wrapper', { mobile: isMobile })}
      onClose={closeRequisiteModal}
      hideCloseIcon
    >
      <RequisiteModal
        onClose={closeRequisiteModal}
        title="Create New Signature"
        buttonText="Create Signature"
      />
    </UIModal>
  ));

  return (
    <div className="settingsSignature__wrapper">
      <p className="settingsSignature__title">Saved Signatures</p>
      <ul className="settingsSignature__list">
        {signatures.map((signature:any) => (
          <SignatureItem key={signature.id} signatureItem={signature} />
        ))}
      </ul>
      <div className="settingsSignature__createButton">
        <UIButton
          priority="primary"
          title="Create Signature"
          handleClick={showRequisiteModal}
        />
      </div>
    </div>
  );
};

export default SignaturePage;
