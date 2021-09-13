import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import * as _ from 'lodash';
import { IntegrationTypes } from 'Interfaces/Integration';
import { lessThan40MB, maxLength100 } from 'Utils/validation';
import Toast from 'Services/Toast';
import { MIME_TYPES } from 'Utils/constants';
import UIImportButton from './UIImportButton';
import UIProgressBar from '../UIProgressBar';
import UIButton from '../UIButton';
import FileSVG from 'Assets/images/icons/documents-icon.svg';
import Cancel from 'Assets/images/icons/cancel.svg';
import { useSelector } from 'react-redux';
import { selectUserIntegrations } from 'Utils/selectors';
import { DocumentItem, FileItem } from 'Interfaces/Common';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { moveArrayItem } from 'Utils/functions';
import useIsMobile from 'Hooks/Common/useIsMobile';

const defaultFormats = _.uniq(_.values(MIME_TYPES)).join(',');

interface UIUploaderProps {
  importServices?: Array<IntegrationTypes>;
  onUpload?: (file: File) => void;
  onCancel: (fileItem: FileItem) => void;
  progress?: number;
  error?: string | null;
  acceptableFormats?: string;
  buttonText?: string;
  isError?: boolean;
  isCancelled?: boolean;
  headerTitle?: string;
  uploadTitle?: string;
  isFinished?: boolean;
  files?: DocumentItem[];
  disabled?: boolean;
  isLoading?: boolean;
  onFileReorder: (newOrders: FileItem[]) => void;
  disableReorder?: boolean;
}

function UIMultiUploader({
  importServices,
  onUpload,
  onCancel,
  error,
  isError,
  disabled,
  acceptableFormats = defaultFormats,
  buttonText = 'Add file',
  headerTitle = 'File Uploader',
  uploadTitle = 'Drop files here',
  files = [],
  isFinished = false,
  isLoading = false,
  onFileReorder,
  disableReorder = true,
}: UIUploaderProps) {
  const userIntegrations = useSelector(selectUserIntegrations);
  const isMobile = useIsMobile();

  const onDrop = useCallback(
    acceptedFiles => {
      const fileMeta = acceptedFiles[0];

      if (disabled || !fileMeta) return;

      const error = lessThan40MB(fileMeta.size) || maxLength100(fileMeta.name);

      if (error) {
        return Toast.error(error);
      }
      onUpload && onUpload(fileMeta);
    },
    [disabled, onUpload],
  );

  const handleCloudFilePick = useCallback(
    (file: File) => {
      onUpload && onUpload(file);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptableFormats,
  });

  const handleDragEnd = useCallback(
    ({ source, destination }) => {
      if (destination) {
        const newOrders = moveArrayItem(files, source.index, destination.index).map(
          (value, index) => {
            return { ...value, order: index + 1 };
          },
        );

        onFileReorder(newOrders);
      }
    },
    [files, onFileReorder],
  );

  return (
    <div className="upload">
      <div className={classNames('upload__body', { mobile: isMobile })}>
        <div
          className={classNames('upload__block', 'upload__block--fill', {
            'upload__block--with-external': importServices,
            mobile: isMobile,
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
          <div className={classNames('upload__block', { mobile: isMobile })}>
            <div className="upload__title upload__title-header">Import files from:</div>
            <div className={classNames('upload__block-items', { mobile: isMobile })}>
              {importServices.map(serviceType => (
                <UIImportButton
                  disabled={disabled}
                  integrated={
                    !!userIntegrations.find(
                      (integration:any) => integration.type === serviceType,
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fileItems">
          {droppableProvided => (
            <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
              {files.map((fileItem, index) => (
                <Draggable
                  draggableId={`fileItem_${fileItem.token}`}
                  index={index}
                  key={fileItem.token}
                  isDragDisabled={disableReorder}
                >
                  {draggableProvided => (
                    <div
                      className="upload__status"
                      key={fileItem.token}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div className="upload__status-header">
                        <div className="upload__status-item upload__status-file">
                          <ReactSVG src={FileSVG} />
                        </div>
                        <div className="upload__status-text upload__status-item">
                          {fileItem.filename}
                        </div>
                        <button
                          disabled={disabled}
                          className={classNames('upload__status-cancel', {
                            'upload--disabled': disabled,
                          })}
                          onClick={() => onCancel(fileItem)}
                          type="button"
                        >
                          <ReactSVG src={Cancel} />
                        </button>
                      </div>
                      {!!fileItem.progress && !fileItem.isFinished && (
                        <div className="upload__progress-bar">
                          <UIProgressBar percentage={fileItem.progress} />
                        </div>
                      )}
                      {fileItem.errorText && (
                        <div className="upload__error-text">{fileItem.errorText}</div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default UIMultiUploader;
