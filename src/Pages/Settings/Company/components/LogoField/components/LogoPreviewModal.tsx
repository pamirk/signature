import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UIModal from 'Components/UIComponents/UIModal';
import { selectUser } from 'Utils/selectors';

interface LogoPreviewModalProps {
  onCloseModal: () => void;
  logoUrl: string;
  logoFile?: File | null;
}

export const getFirstCapital = (string?: string) => {
  return capitalize(string)?.charAt(0);
};

export const getInitials = (name?: string) => {
  const [firstName, lastName] = name?.split(' ') || [];

  return [firstName, lastName].map(namePart => getFirstCapital(namePart)).join('');
};

const LogoPreviewModal = ({ onCloseModal, logoUrl, logoFile }: LogoPreviewModalProps) => {
  const [fileDataUrl, setFileDataUrl] = useState<string>();
  const {
    avatarUrl: companyOwnerAvatar,
    email: companyOwnerEmail,
    name: companyOwnerName,
  } = useSelector(selectUser);

  const companyOwnerInitials =
    getInitials(companyOwnerName) || getFirstCapital(companyOwnerName);

  const loadImage = useCallback(() => {
    if (logoFile) {
      const fr = new FileReader();
      fr.onloadend = () => {
        setFileDataUrl(fr.result as string);
      };
      fr.readAsDataURL(logoFile as Blob);
    } else {
      setFileDataUrl(logoUrl);
    }
  }, [logoFile, logoUrl]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return (
    <UIModal className="company__uploader_uploaded-modal" onClose={onCloseModal}>
      <div className="company__uploader_uploaded-modal-body">
        <a
          href=""
          className="company__uploader_uploaded-modal-body-logo-a"
          style={{
            backgroundImage: `url(${fileDataUrl})`,
          }}
        />
        <div className="company__uploader_uploaded-modal-body-container">
          <div className="company__uploader_uploaded-modal-body-title-container">
            {companyOwnerAvatar ? (
              <img
                className="company__uploader_uploaded-modal-body-avatar"
                src={companyOwnerAvatar}
                alt="Avatar example"
              />
            ) : (
              <div className="company__uploader_uploaded-modal-body-initials">
                <div>{companyOwnerInitials}</div>
              </div>
            )}
            <div className="company__uploader_uploaded-modal-body-header">
              {companyOwnerName} (
              <a href={`mailto:${companyOwnerEmail}`} style={{ color: '#00A3FA' }}>
                {companyOwnerEmail}
              </a>
              ) <br /> has requested your signature
            </div>
            <div className="company__uploader_uploaded-modal-body-button-container">
              <a href="#" className="company__uploader_uploaded-modal-body-view-button">
                Review & Sign
              </a>
            </div>
            <div className="company__uploader_uploaded-modal-body-document-title">
              Standard NDA
            </div>
            <div className="company__uploader_uploaded-modal-body-document-message-header">
              Message:
            </div>
            <div className="company__uploader_uploaded-modal-body-document-message-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Montes, tincidunt
              duis sit convallis egestas cum. Consectetur lorem porttitor turpis ipsum
              nulla tortor netus. Vulputate vitae pellentesque orci tortor.
            </div>
            <a
              href="#"
              className="company__uploader_uploaded-modal-body-view-document-link"
            >
              View document
            </a>
            <div className="company__uploader_uploaded-modal-body-warning-container">
              <div className="company__uploader_uploaded-modal-body-warning-icon" />
              <div className="company__uploader_uploaded-modal-body-warning-text">
                <b>Warning:</b>&nbsp; To prevent others from accessing your document,
                please do not forward this email.
              </div>
            </div>
          </div>
          <div className="company__uploader_uploaded-modal-body-powered-container">
            <a
              href="https://signaturely.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
              }}
            >
              <span className="company__uploader_uploaded-modal-body-powered-span">
                Powered by{' '}
                <span
                  style={{
                    color: '#66778e',
                  }}
                >
                  Signaturely
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default LogoPreviewModal;
