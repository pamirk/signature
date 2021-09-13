import React, { useState, useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import UIUploader from 'Components/UIComponents/UIUploader';

interface LogoFieldProps extends FieldRenderProps<string> {
  onUpload: (file: File) => void;
  onUploadFailure: (error: any) => void;
  onUploadCancel: () => void;
  isFinished: boolean;
  isCropCancelled?: boolean;
  companyLogoName?: string | null;
  disabled?: boolean;
}

const acceptableFormats = ['.jpg', '.png', '.bmp', '.jpeg'].join(',');

function LogoField({
  onUpload,
  onUploadFailure,
  onUploadCancel,
  companyLogoName,
  isFinished,
  isCropCancelled,
  disabled = false,
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

  const handleCancel = () => {
    if (!isCropCancelled) onUploadCancel();
  };

  return (
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
