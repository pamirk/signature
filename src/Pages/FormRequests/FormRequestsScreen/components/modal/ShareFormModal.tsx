import React, { useMemo, useState, useCallback, useEffect } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import { Signer, Document } from 'Interfaces/Document';
import * as _ from 'lodash';
import { ReactSVG } from 'react-svg';
import UITextInput from 'Components/UIComponents/UITextInput';
import Toast from 'Services/Toast';
import IconCopy from 'Assets/images/icons/copy-icon.svg';

interface SigningLinkModalProps {
  onClose: () => void;
  link: string;
  title: string;
  subtitle: string;
}

const ShareFormModal = ({ onClose, link, title, subtitle }: SigningLinkModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareUrlCopy = useCallback(async () => {
    try {
      if (!link) return;

      await navigator.clipboard.writeText(link);

      setIsCopied(true);
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [link]);

  return (
    <UIModal onClose={onClose} className="signingLinkModal">
      <div className="shareModal__wrapper">
        <div className="modal__header">
          <h4 className="modal__title reminerModal__header">{title}</h4>
          <p className="modal__subtitle">{subtitle}</p>
        </div>

        <form className="shareModal__form">
          <button
            className="shareModal__copy"
            onClick={handleShareUrlCopy}
            disabled={!link}
            type="button"
          >
            <UITextInput value={link} disabled />
            <div className="shareModal__copyInner">
              <ReactSVG src={IconCopy} className="shareModal__copyIcon" />
              <span className="shareModal__copyText">
                {!isCopied ? 'COPY' : 'COPIED'}
              </span>
            </div>
          </button>
        </form>
      </div>
    </UIModal>
  );
};

export default ShareFormModal;
