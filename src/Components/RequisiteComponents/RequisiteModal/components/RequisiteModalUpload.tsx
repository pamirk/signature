import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { RequisiteType } from 'Interfaces/Requisite';

import UploadIcon from 'Assets/images/icons/upload-icon.svg';
import CloseIcon from 'Assets/images/icons/close-icon.svg';

interface RequisiteModalUploadProps {
  imageSignFile?: File;
  imageInitialFile?: File;
  handleOnClearFile: (requisiteType: RequisiteType) => void;
  handleChangeFile: (
    requisiteType: RequisiteType,
  ) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<string | number | undefined>;
}

export const RequisiteModalUpload = ({
  imageSignFile,
  imageInitialFile,
  handleOnClearFile,
  handleChangeFile,
}: RequisiteModalUploadProps) => {
  const handleOnClearFiles = useCallback(() => {
    handleOnClearFile(RequisiteType.SIGN);
    handleOnClearFile(RequisiteType.INITIAL);
  }, [handleOnClearFile]);

  return (
    <div>
      <div className="requisiteModal__type-select-container">
        <p className="requisiteModal__type-select-title">Signature Preview:</p>
        <ReactSVG
          src={CloseIcon}
          onClick={handleOnClearFiles}
          className="requisiteModal__type-select-clear"
        />
      </div>
      <p className="requisiteModal__file-input-label">
        Maximum file size: 40MB <br /> Acceptable file formats: png, jpg, jpeg, bmp, gif
      </p>
      <div className="requisiteModal__area-wrapper">
        <div className="requisiteModal__area-container">
          <div className="requisiteModal__area-actions">
            <p className="requisiteModal__area-subtitle">Full Name</p>
          </div>
          <div className="requisiteModal__area requisiteModal__area--file">
            <div
              className={classNames('requisiteModal__file-img-wrapper', {
                'requisiteModal__file-img-wrapper--marginBottom': imageSignFile,
              })}
            >
              <div
                className={classNames('requisiteModal__file-input-container', {
                  'requisiteModal__file-input-container--exist': imageSignFile,
                })}
              >
                {!imageSignFile ? (
                  <p className="requisiteModal__type-select-title">Upload Signature</p>
                ) : (
                  <img
                    src={URL.createObjectURL(imageSignFile)}
                    className="requisiteModal__file-img"
                    alt="signature"
                  />
                )}
                <label
                  htmlFor="signFile-upload"
                  className="requisiteModal__file-input-button"
                >
                  <input
                    id="signFile-upload"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    onChange={handleChangeFile(RequisiteType.SIGN)}
                  />
                  <div className="button button--secondary">
                    <ReactSVG src={UploadIcon} className="button__ico" />
                    <p className="button__text">Upload {imageSignFile && 'New'}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="requisiteModal__area-container">
          <div className="requisiteModal__area-actions">
            <p className="requisiteModal__area-subtitle">Initials</p>
          </div>
          <div className="requisiteModal__area requisiteModal__area--file">
            <div
              className={classNames('requisiteModal__file-img-wrapper', {
                'requisiteModal__file-img-wrapper--marginBottom': imageInitialFile,
              })}
            >
              <div
                className={classNames('requisiteModal__file-input-container', {
                  'requisiteModal__file-input-container--exist': imageInitialFile,
                })}
              >
                {!imageInitialFile ? (
                  <p className="requisiteModal__type-select-title">Upload Initials</p>
                ) : (
                  <img
                    src={URL.createObjectURL(imageInitialFile)}
                    className="requisiteModal__file-img"
                    alt="initials"
                  />
                )}
                <label
                  htmlFor="initialFile-upload"
                  className="requisiteModal__file-input-button"
                >
                  <input
                    id="initialFile-upload"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    onChange={handleChangeFile(RequisiteType.INITIAL)}
                  />
                  <div className="button button--secondary">
                    <ReactSVG src={UploadIcon} className="button__ico" />
                    <p className="button__text">Upload {imageInitialFile && 'New'}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisiteModalUpload;
