import React, { useCallback, useMemo, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { IntegrationTypes } from 'Interfaces/Integration';
import { UIMultiUploader } from 'Components/UIComponents/UIUploader';
import { DocumentItem, FileItem } from 'Interfaces/Common';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface SingleFileFieldProps extends FieldRenderProps<string> {
  disabled?: boolean;
  files?: DocumentItem[];
  onFileUpload: (file: File) => Promise<void>;
  onUploadCancel?: (fileItem: FileItem) => Promise<void>;
  onUploadSuccess?: () => void;
  onUploadFailure?: (error: string) => void;
  isFileProcessed: boolean;
  submitting: boolean;
  onFileReorder: (orders: FileItem[]) => void;
  disableReorder?: boolean;
  isCleanFileData?: boolean;
  isShowWarning?: boolean;
  disableImportServices?: boolean;
  filesLimit?: number;
}

function SingleFileField({
  input,
  disabled,
  onUploadCancel,
  onFileUpload,
  files,
  isFileProcessed,
  submitting,
  onUploadSuccess = () => {},
  onUploadFailure = () => {},
  onFileReorder,
  disableReorder,
  isCleanFileData,
  isShowWarning,
  disableImportServices,
  filesLimit,
}: SingleFileFieldProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { value, onChange } = input;
  const isMobile = useIsMobile();

  const isSomeErrorFile = useMemo(() => files && files.some(file => !!file.errorText), [
    files,
  ]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        onChange(undefined);

        await onFileUpload(file);

        setUploadError(null);
        onUploadSuccess();
      } catch (error) {
        setUploadError('Failed to upload');
        const e = error as Error;
        onUploadFailure(e.message);
      }
    },
    [onChange, onFileUpload, onUploadFailure, onUploadSuccess],
  );

  return (
    <div className="signTemplate__templateField-select-wrapper">
      <div className="signTemplate__templateField-upload-wrapper">
        <UIMultiUploader
          importServices={
            disableImportServices
              ? undefined
              : [
                  IntegrationTypes.GOOGLE_DRIVE,
                  IntegrationTypes.ONE_DRIVE,
                  IntegrationTypes.DROPBOX,
                  IntegrationTypes.BOX,
                ]
          }
          disabled={disabled}
          onUpload={handleFileUpload}
          onCancel={onUploadCancel}
          isError={!!uploadError || isSomeErrorFile}
          error={uploadError}
          isCancelled={!!value}
          buttonText="Upload File"
          isFinished={isFileProcessed}
          files={files}
          isLoading={submitting}
          onFileReorder={onFileReorder}
          disableReorder={disableReorder}
          isCleanFileData={isCleanFileData}
          filesLimit={filesLimit}
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
      />
    </div>
  );
}

export default SingleFileField;
