import classNames from 'classnames';
import AccountAvatar from 'Components/AccountAvatar';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import React, { useRef } from 'react';
import Toast from 'Services/Toast';
import { lessThan40MB } from 'Utils/validation';

interface AvatarFieldProps {
  disabled: boolean;
  isHasAvatarUrl: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const acceptableFormats = ['.jpg', '.png', '.bmp', '.jpeg'].join(',');

export const AvatarField = ({
  onUpload,
  onDelete,
  disabled,
  isHasAvatarUrl,
}: AvatarFieldProps) => {
  const fileUploader = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleOpenUploadWindow = () => {
    fileUploader.current && fileUploader.current.click();
  };

  const handleFileUpload = event => {
    const fileMeta = event.target.files[0];

    if (!fileMeta) return;

    const sizeError = lessThan40MB(fileMeta.size);

    if (sizeError) {
      return Toast.error(sizeError);
    }
    try {
      onUpload(fileMeta);
    } catch (err) {
      return Toast.error(err);
    } finally {
      if (fileUploader.current) {
        fileUploader.current.value = '';
      }
    }
  };

  return (
    <div className="avatar-field">
      <AccountAvatar className={classNames('avatar--large', { mobile: isMobile })} />
      <div className="avatar-field__content">
        <div className="avatar-field__content-title">Update your profile picture</div>
        <div className="avatar-field__content-buttons mobile">
          <UIButton
            priority="secondary"
            title="Upload"
            handleClick={handleOpenUploadWindow}
            disabled={disabled}
          />
          <UIButton
            priority="secondary"
            title="Delete"
            handleClick={onDelete}
            disabled={disabled || !isHasAvatarUrl}
          />
        </div>
      </div>
      <input
        accept={acceptableFormats}
        ref={fileUploader}
        type="file"
        className="avatar-field__upload"
        onChange={handleFileUpload}
      />
    </div>
  );
};
