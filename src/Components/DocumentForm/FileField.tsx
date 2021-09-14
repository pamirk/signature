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
  onFileUpload: (file: File) => Promise<void>;
  onUploadCancel: (fileItem: FileItem) => Promise<void>;
  onUploadSuccess?: () => void;
  onUploadFailure?: (error: string) => void;
  isFileProcessed: boolean;
  submitting: boolean;
  isBasedOnTemplate?: boolean;
  onFileReorder: (orders: FileItem[]) => void;
  disableReorder?: boolean;
}

function FileField({
  input,
  disabled,
  submitButtonTitle = 'Prepare Doc for Signing',
  onUploadCancel,
  onFileUpload,
  files,
  onSubmit,
  isFileProcessed,
  submitting,
  onUploadSuccess = () => {},
  onUploadFailure = () => {},
  isBasedOnTemplate,
  onFileReorder,
  disableReorder,
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
      }
      //@ts-ignore
      catch (error:any) {
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
          disabled={disabled}
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
        />
      </div>
      <div
        className={classNames('signTemplate__templateField-upload-createButton', {
          mobile: isMobile,
        })}
      >
        <UIButton
          priority="primary"
          title={submitButtonTitle}
          disabled={!isBasedOnTemplate && (!isFileProcessed || submitting)}
          isLoading={submitting}
          rightIcon={Arrow}
          handleClick={onSubmit}
        />
      </div>
    </div>
  );
}

export default FileField;
