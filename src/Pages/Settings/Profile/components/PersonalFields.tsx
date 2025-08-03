import React, { useCallback, useState } from 'react';
import uuid from 'uuid/v4';
import parsePath from 'path-parse';
import { Field } from 'react-final-form';
import { SignedUrlResponse, UploadStatuses } from 'Interfaces/Common';
import { composeValidators, resizeFile } from 'Utils/functions';
import { required, password, confirmPassword, name } from 'Utils/validation';
import { FieldTextInput } from 'Components/FormFields';
import { AvatarField } from './AvatarField';
import { useAvatarPut, useSignedPutAssetUrl } from 'Hooks/User';
import Toast from 'Services/Toast';
import { ProfileInfoPayload } from 'Interfaces/Profile';
import { useModal } from 'Hooks/Common';
import CropModal from 'Components/CropModal';
import ChangeEmailForm from './ChangeEmailForm';
import useIsMobile from 'Hooks/Common/useIsMobile';
import PersonalFieldsMobileView from './PersonalFieldsMobileView';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import LockIcon from 'Assets/images/icons/lock.svg';

interface PersonalFieldsProps {
  isUser: boolean;
  userId: string;
  avatarUrl: string | null;
  updateProfileInfo: (entry: ProfileInfoPayload) => void;
}

const PersonalFields = ({
  isUser,
  avatarUrl,
  userId,
  updateProfileInfo,
}: PersonalFieldsProps) => {
  const isMobile = useIsMobile();
  const { appSumoStatus } = useSelector(selectUser);
  const [getSignedPutAssetUrl] = useSignedPutAssetUrl();
  const [putAvatar, cancelUpload, isAvatarUploading] = useAvatarPut();
  const [avatar, setAvatar] = useState<File | null>(null);
  const isAppSumo = !!appSumoStatus;

  const [isReadOnlyField, setReadOnlyField] = useState<boolean>(true);

  const handleAvatarUploadCancel = useCallback(async () => {
    try {
      if (avatarUrl) {
        await updateProfileInfo({ avatarUrl: null });
      }
    } catch (error) {
      Toast.handleErrors(error);
    } finally {
      cancelUpload();
    }
  }, [avatarUrl, cancelUpload, updateProfileInfo]);

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      handleAvatarUploadCancel();

      const fileExt = parsePath(file.name).ext;
      const avatarId = uuid();
      const key = `users/${userId}/profile/${avatarId}${fileExt}`;

      const { result: putUrl } = (await getSignedPutAssetUrl({
        key,
      })) as SignedUrlResponse;

      const resizedFile = await resizeFile(file, 128, 128, 'File format is not correct');

      const uploadStatus = await putAvatar({ file: resizedFile, url: putUrl });

      if (uploadStatus === UploadStatuses.UPLOADED) {
        await updateProfileInfo({ avatarUrl: key });
        Toast.success('New picture has been uploaded');
      }
    },
    [
      getSignedPutAssetUrl,
      handleAvatarUploadCancel,
      putAvatar,
      updateProfileInfo,
      userId,
    ],
  );

  const handleAvatarDelete = useCallback(async () => {
    try {
      await updateProfileInfo({ avatarUrl: null });
    } catch (err) {
      Toast.success('Picture has been removed');
    }
  }, [updateProfileInfo]);

  const [openCropModal, closeCropModal] = useModal(
    () => (
      <CropModal
        file={avatar}
        onSubmit={handleAvatarUpload}
        onClose={closeCropModal}
        onCancel={closeCropModal}
        aspectRatio={1}
      />
    ),
    [avatar],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      setAvatar(file);
      openCropModal();
    },
    [openCropModal],
  );

  return isMobile ? (
    <PersonalFieldsMobileView
      isUser={isUser}
      isReadOnlyField={isReadOnlyField}
      setReadOnlyField={setReadOnlyField}
      handleFileUpload={handleFileUpload}
      handleAvatarDelete={handleAvatarDelete}
      isAvatarUploading={isAvatarUploading}
      avatarUrl={avatarUrl}
      isAppSumo={isAppSumo}
    />
  ) : (
    <div className="settings__block">
      <h1 className="settings__title">Personal Information</h1>
      <div className="settings__form-group settings__block--small">
        <div
          className={classNames('settings__field settings__form-group-item', {
            lock: isAppSumo,
          })}
        >
          <Field
            name="name"
            label="Full Name"
            placeholder="Full Name"
            component={FieldTextInput}
            validate={composeValidators<string>(required, name)}
            format={value => value && value.trim()}
            disabled={isAppSumo}
            formatOnBlur
          />
          {isAppSumo && <ReactSVG src={LockIcon} className="profile__email-lock-icon" />}
        </div>
      </div>
      <ChangeEmailForm isUser={isUser} isAppSumo={isAppSumo} />
      <div className="settings__form-group">
        <div className="settings__field settings__form-group-item">
          <Field
            name="password"
            label="New Password"
            placeholder="Password"
            type="password"
            component={FieldTextInput}
            validate={composeValidators<string>(password)}
            readOnly={isReadOnlyField}
            onFocus={() => setReadOnlyField(false)}
          />
        </div>
        <div className="settings__field settings__form-group-item">
          <Field
            name="passwordConfirmation"
            label="Repeat new Password"
            placeholder="Repeat Password"
            type="password"
            component={FieldTextInput}
            validate={composeValidators<string>(confirmPassword)}
          />
        </div>
      </div>
      <div className="settings__form-group">
        <div className="settings__field settings__form-group-item">
          <AvatarField
            onUpload={handleFileUpload}
            onDelete={handleAvatarDelete}
            disabled={isAvatarUploading}
            isHasAvatarUrl={!!avatarUrl}
          />
          <div className="avatar-field__uploader-description">
            <p className="settings__text settings__text--grey">
              We recommend uploading an avatar image with a resolution of 128x128 px.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalFields;
