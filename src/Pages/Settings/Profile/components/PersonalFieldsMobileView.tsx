import React from 'react';
import { Field } from 'react-final-form';
import { composeValidators } from 'Utils/functions';
import { required, email, password, confirmPassword, name } from 'Utils/validation';
import { toLowerCase } from 'Utils/formatters';
import { FieldTextInput } from 'Components/FormFields';
import { AvatarField } from './AvatarField';
import ChangeEmailForm from './ChangeEmailForm';

interface PersonalFieldsMobileViewProps {
  isUser: boolean;
  isReadOnlyField: boolean;
  setReadOnlyField;
  handleFileUpload;
  handleAvatarDelete;
  isAvatarUploading: boolean;
  avatarUrl;
}

const PersonalFieldsMobileView = ({
  isUser,
  isReadOnlyField,
  setReadOnlyField,
  handleFileUpload,
  handleAvatarDelete,
  isAvatarUploading,
  avatarUrl,
}: PersonalFieldsMobileViewProps) => {
  return (
    <div className="settings__block">
      <h1 className="settings__title">Personal Information</h1>
      <div className="settings__form-group mobile">
        <div className="settings__field settings__form-group-item mobile">
          <Field
            name="name"
            label="Full Name"
            placeholder="Full Name"
            component={FieldTextInput}
            validate={composeValidators<string>(required, name)}
            format={value => value && value.trim()}
            formatOnBlur
          />
        </div>
        <ChangeEmailForm isUser={isUser} />
        <div className="settings__field settings__form-group-item mobile">
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
        <div className="settings__field settings__form-group-item mobile">
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

export default PersonalFieldsMobileView;
