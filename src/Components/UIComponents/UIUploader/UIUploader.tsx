import React, { useState, useCallback, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { values, uniq } from 'lodash';
import { IntegrationTypes } from 'Interfaces/Integration';
import { lessThan40MB } from 'Utils/validation';
import Toast from 'Services/Toast';
import { MIME_TYPES } from 'Utils/constants';

import UIImportButton from './UIImportButton';
import UIProgressBar from '../UIProgressBar';
import UIButton from '../UIButton';

import FileSVG from 'Assets/images/icons/documents-icon.svg';
import Cancel from 'Assets/images/icons/cancel.svg';
import { useSelector } from 'react-redux';
import { selectUserIntegrations } from 'Utils/selectors';

const defaultFormats = uniq(values(MIME_TYPES)).join(',');

interface UIUploaderProps {
  importServices?: Array<IntegrationTypes>;
  onUpload?: (file: File) => void;
  onCancel: () => void;
  progress?: number;
  error?: string | null;
  acceptableFormats?: string;
  buttonText?: string;
  isError?: boolean;
  isCancelled?: boolean;
  headerTitle?: string;
  uploadTitle?: string;
  isFinished?: boolean;
  initialFileName?: string | null;
  disabled?: boolean;
  isLoading?: boolean;
}

function UIUploader({
  importServices,
  onUpload,
  progress = 0,
  onCancel,
  error,
  isError,
  disabled,
  acceptableFormats = defaultFormats,
  buttonText = 'Add file',
  headerTitle = 'File Uploader',
  uploadTitle = 'Drop files here',
  isCancelled,
  initialFileName = null,
  isFinished = false,
  isLoading = false,
}: UIUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const userIntegrations = useSelector(selectUserIntegrations);
  const [filename, setFilename] = useState<string | null>(initialFileName);
  const onDrop = useCallback(
    acceptedFiles => {
      const fileMeta = acceptedFiles[0];

      if (disabled || !fileMeta) return;

      const sizeError = lessThan40MB(fileMeta.size);

      if (sizeError) {
        return Toast.error(sizeError);
      }

      setFilename(fileMeta.name);
      onUpload && onUpload(fileMeta);
    },
    [disabled, onUpload],
  );
  useEffect(() => {
    if (!uploadProgress && progress > 25) {
      setUploadProgress(1);
    }
    const timer = setTimeout(() => setUploadProgress(progress), 200);

    return () => clearTimeout(timer);
  }, [progress, uploadProgress]);

  const handleCloudFilePick = useCallback(
    (file: File) => {
      setFilename(file.name);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onUpload && onUpload(file);
    },
    [onUpload],
  );

  const handleCancel = useCallback(() => {
    setFilename(null);
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (isCancelled) {
      setFilename(null);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelled]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptableFormats,
  });

  return (
    <div className="upload">
      <div className="upload__body">
        <div
          className={classNames('upload__block', 'upload__block--fill', {
            'upload__block--with-external': importServices,
          })}
        >
          <div className="upload__title upload__title-header">{headerTitle}</div>
          <div
            {...getRootProps()}
            className={classNames('upload__dropzone', {
              'upload__dropzone--error': isError || isDragReject,
              'upload__dropzone--success': isFinished && !isError,
              'upload--disabled': disabled,
            })}
          >
            <input {...getInputProps()} disabled={disabled} />
            <div className="upload__content">
              <div className="upload__title upload__content-item">{uploadTitle}</div>
              <div className="upload__content-item upload__text upload__text--gray">
                Or
              </div>
              <div className="upload__content-button">
                <UIButton
                  priority="secondary"
                  className={classNames({ 'upload--disabled': disabled })}
                  title={buttonText}
                  disabled={disabled}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          {isError && <div className="upload__error">{error}</div>}
        </div>
        {importServices && (
          <div className="upload__block">
            <div className="upload__title upload__title-header">Import files from:</div>
            <div className="upload__block-items">
              {importServices.map(serviceType => (
                <UIImportButton
                  disabled={disabled}
                  integrated={
                    !!userIntegrations.find(
                      integration => integration.type === serviceType,
                    ) || serviceType === IntegrationTypes.DROPBOX
                  }
                  key={serviceType}
                  type={serviceType}
                  onPick={handleCloudFilePick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {filename && (
        <div className="upload__status">
          <div className="upload__status-header">
            <div className="upload__status-item upload__status-file">
              <ReactSVG src={FileSVG} />
            </div>
            <div className="upload__status-text upload__status-item">{filename}</div>
            <button
              disabled={disabled}
              className={classNames('upload__status-cancel', {
                'upload--disabled': disabled,
              })}
              onClick={handleCancel}
              type="button"
            >
              <ReactSVG src={Cancel} />
            </button>
          </div>
          {uploadProgress !== 0 && !isFinished && (
            <div className="upload__progress-bar">
              <UIProgressBar percent={uploadProgress} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UIUploader;
