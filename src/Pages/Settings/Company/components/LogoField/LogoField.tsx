import React, { useState, useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { UIUploader } from 'Components/UIComponents/UIUploader';
import CircleSuccessIcon from 'Assets/images/icons/circle-success.svg';
import { ReactSVG } from 'react-svg';
import useModal from 'Hooks/Common/useModal';
import LogoPreviewModal from './components/LogoPreviewModal';
import { BASE_ASSETS_URL } from 'Utils/constants';

interface LogoFieldProps extends FieldRenderProps<string> {
  onUpload: (file: File) => void;
  onUploadFailure: (error: any) => void;
  onUploadCancel: () => void;
  isFinished: boolean;
  isCropCancelled?: boolean;
  companyLogoName?: string | null;
  companyLogoKey?: string | null;
  disabled?: boolean;
  logoFile?: File | null;
}

const acceptableFormats = ['.jpg', '.png', '.bmp', '.jpeg'].join(',');
function LogoField({
  onUpload,
  onUploadFailure,
  onUploadCancel,
  companyLogoName,
  companyLogoKey,
  isFinished,
  isCropCancelled,
  disabled = false,
  logoFile,
}: LogoFieldProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setUploadError(null);
        await onUpload(file);
      } catch (error) {
        setUploadError('Failed to upload');
        onUploadFailure(error);
      }
    },
    [onUpload, onUploadFailure],
  );

  const [showPreviewModal, hidePreviewModal] = useModal(() => {
    const logoUrl = `${BASE_ASSETS_URL}${companyLogoKey}`;
    return (
      <LogoPreviewModal
        onCloseModal={hidePreviewModal}
        logoUrl={logoUrl}
        logoFile={logoFile}
      />
    );
  }, [companyLogoKey, logoFile]);

  const handlePreviewClick = useCallback(
    e => {
      e.preventDefault();
      showPreviewModal();
    },
    [showPreviewModal],
  );

  const handleCancel = (e?) => {
    if (e) e.preventDefault();
    if (!isCropCancelled) onUploadCancel();
  };

  return isFinished ? (
    <>
      <div className="upload__title upload__title-header">Company logo</div>
      <div className="company__uploader_uploaded-container">
        <ReactSVG
          src={CircleSuccessIcon}
          className="company__uploader_uploaded-icon"
          beforeInjection={svg => {
            svg.setAttribute('width', '24px');
            svg.setAttribute('height', '24px');
          }}
        />
        <p className="company__uploader_uploaded-text">
          Your logo has been uploaded successfully
        </p>
        <div className="company__uploader_uploaded-links">
          <a
            href="#"
            onClick={handlePreviewClick}
            className="company__uploader_uploaded-links-link"
          >
            Preview logo
          </a>
          <a
            href="#"
            onClick={handleCancel}
            className="company__uploader_uploaded-links-link"
          >
            Replace logo
          </a>
        </div>
      </div>
    </>
  ) : (
    <UIUploader
      uploadTitle="Upload logo, or drop file here"
      onUpload={handleFileUpload}
      isCancelled={isCropCancelled}
      onCancel={handleCancel}
      isFinished={isFinished}
      isError={!!uploadError}
      error={uploadError}
      headerTitle="Company Logo"
      buttonText="Upload File"
      initialFileName={companyLogoName}
      disabled={disabled}
      acceptableFormats={acceptableFormats}
    />
  );
}

export default LogoField;
