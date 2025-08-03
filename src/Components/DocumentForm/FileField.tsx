import React, { useCallback, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { IntegrationTypes } from 'Interfaces/Integration';
import UIButton from 'Components/UIComponents/UIButton';
import Arrow from 'Assets/images/icons/angle-arrow.svg';
import { UIMultiUploader } from 'Components/UIComponents/UIUploader';
import { DocumentItem, FileItem } from 'Interfaces/Common';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface FileFieldProps extends FieldRenderProps<string> {
  submitButtonTitle: string;
  disabled?: boolean;
  files?: DocumentItem[];
  onSubmit: () => Promise<void>;
  onEditTemplate: () => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  onUploadCancel: (fileItem: FileItem) => Promise<void>;
  onUploadSuccess?: () => void;
  onUploadFailure?: (error: string) => void;
  isFileProcessed: boolean;
  submitting: boolean;
  isBasedOnTemplate?: boolean;
  onFileReorder: (orders: FileItem[]) => void;
  disableReorder?: boolean;
  isCleanFileData?: boolean;
  isShowWarning?: boolean;
}

function FileField({
  input,
  disabled,
  submitButtonTitle = 'Prepare Doc for Signing',
  editButtonTitle = 'Edit template',
  onUploadCancel,
  onFileUpload,
  files,
  onSubmit,
  onEditTemplate,
  isFileProcessed,
  submitting,
  onUploadSuccess = () => {},
  onUploadFailure = () => {},
  isBasedOnTemplate,
  onFileReorder,
  disableReorder,
  isCleanFileData,
  isShowWarning,
}: FileFieldProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { value, onChange } = input;
  const isMobile = useIsMobile();

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        onChange(undefined);

        await onFileUpload(file);

        setUploadError(null);
        onUploadSuccess();
      } catch (error) {
        setUploadError('Failed to upload');
        onUploadFailure(error);
      }
    },
    [onChange, onFileUpload, onUploadFailure, onUploadSuccess],
  );

  return (
    <div className="signTemplate__templateField-select-wrapper">
      <div className="signTemplate__templateField-upload-wrapper">
        <p className="signTemplate__templateField-upload-title">Upload File</p>
        <UIMultiUploader
          importServices={[
            IntegrationTypes.GOOGLE_DRIVE,
            IntegrationTypes.ONE_DRIVE,
            IntegrationTypes.DROPBOX,
            IntegrationTypes.BOX,
          ]}
          disabled={disabled || isBasedOnTemplate}
          onUpload={handleFileUpload}
          onCancel={onUploadCancel}
          isError={!!uploadError}
          error={uploadError}
          isCancelled={!!value}
          buttonText="Upload File"
          isFinished={isFileProcessed}
          files={files}
          isLoading={submitting}
          onFileReorder={onFileReorder}
          disableReorder={disableReorder}
          isCleanFileData={isCleanFileData}
        />

        {isShowWarning && (
          <div className="signTemplate__upload-notice">
            <p className="signTemplate__upload-notice symbol">*</p>
            <p className="signTemplate__upload-notice text">
              To keep your email box tidy, Signaturely only attaches documents under 10Mb
              as PDF files to the email sent when they get signed. You will still be able
              to download larger files from the Download link.
            </p>
          </div>
        )}
      </div>
      <div
        className={classNames('signTemplate__templateField-upload-createButton', {
          mobile: isMobile,
        })}
      >
        <UIButton
          priority="primary"
          title={submitButtonTitle}
          disabled={
            (!isBasedOnTemplate && (!isFileProcessed || submitting)) ||
            isCleanFileData ||
            disabled
          }
          isLoading={submitting}
          rightIcon={Arrow}
          handleClick={onSubmit}
        />
        {isBasedOnTemplate && (
          <UIButton
            priority="primary"
            title={editButtonTitle}
            disabled={!isBasedOnTemplate && (!isFileProcessed || submitting)}
            isLoading={submitting}
            rightIcon={Arrow}
            handleClick={onEditTemplate}
          />
        )}
      </div>
    </div>
  );
}

export default FileField;
