import React from 'react';
import classNames from 'classnames';
import { composeValidators } from 'Utils/functions';
import { notOnlySpaces, urlProtocol } from 'Utils/validation';
import { FieldTextInput, FieldTextArea } from 'Components/FormFields';
import { Field } from 'react-final-form';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import Billet from './Billet';
import { LogoField } from './LogoField';

interface BrandingFieldsMobileViewProps {
  disabled: boolean;
  handleBusinessPlanCheck;
  handleFileUpload;
  handleUploadCancel;
  handleFileUploadFailure;
  companyLogoName;
  isLogoProcessed;
  companyLogoFormValue;
  isCropCancelled;
  isPageFieldEnabled;
  handleCheckboxClick;
  logoFile;
}

const BrandingFieldsMobileView = ({
  disabled,
  handleBusinessPlanCheck,
  handleFileUpload,
  handleUploadCancel,
  handleFileUploadFailure,
  companyLogoName,
  isLogoProcessed,
  companyLogoFormValue,
  isCropCancelled,
  isPageFieldEnabled,
  handleCheckboxClick,
  logoFile,
}: BrandingFieldsMobileViewProps) => {
  return (
    <div>
      <div className="company__upgrade-wrapper">
        <div className="company__billet-container">
          <p className="settings__title company__header-billet">Branding</p>
          {disabled && <Billet title="Business Feature" />}
        </div>
      </div>
      <div className="company__branding">
        <div
          className="company__uploader settings__field settings__field"
          onClick={handleBusinessPlanCheck}
        >
          <Field
            name="companyLogoKey"
            component={LogoField}
            onUpload={handleFileUpload}
            onUploadFailure={handleFileUploadFailure}
            onUploadCancel={handleUploadCancel}
            companyLogoName={companyLogoName}
            logoFile={logoFile}
            companyLogoKey={companyLogoFormValue}
            disabled={disabled}
            isFinished={isLogoProcessed || !!companyLogoFormValue}
            isCropCancelled={isCropCancelled}
          />
        </div>
        <p className="company__uploader-description settings__text settings__text--grey">
          We recommend using a transparent PNG image, with a resolution of 280 x 50px.
        </p>
        <div>
          <div className="settings__form-group mobile">
            <div className="settings__field settings__form-group-item mobile">
              <Field
                name="companyName"
                label="Company Name"
                placeholder="Company Name"
                component={FieldTextInput}
                parse={value => value || null}
                onFocus={handleBusinessPlanCheck}
                validate={composeValidators<string>(notOnlySpaces)}
              />
            </div>
            <div className="settings__field settings__form-group-item mobile">
              <Field
                name="companyEmail"
                label="'From' Email Name"
                placeholder="'From' Email Name"
                parse={value => value || null}
                component={FieldTextInput}
                onFocus={handleBusinessPlanCheck}
                validate={notOnlySpaces}
                format={value => value && value.trim()}
                formatOnBlur
              />
            </div>
            <div className="settings__field settings__form-group-item mobile">
              <Field
                name="emailTemplate"
                label="Email Closing Signature"
                placeholder="A brief closing signature for signature request emails."
                parse={value => value || null}
                onFocus={handleBusinessPlanCheck}
                component={FieldTextArea}
              />
            </div>
            <div className="settings__field settings__form-group-item">
              <div className="company__redirection-wrapper">
                <h2
                  className={classNames(
                    'settings__subtitle settings__subtitle--small company__redirection-subtitle',
                    { 'company__redirection--disabled': disabled },
                  )}
                >
                  Redirection Page
                </h2>
              </div>
              <p
                className={classNames('settings__text', {
                  'company__redirection--disabled': disabled,
                })}
              >
                Redirect users to this custom thank you page.
              </p>
              <Field
                name="redirectionPage"
                className="settings__text--grey"
                placeholder="https://yourcompany.com"
                parse={value => value || null}
                component={FieldTextInput}
                onFocus={handleBusinessPlanCheck}
                disabled={!isPageFieldEnabled}
                validate={urlProtocol}
              />
              <div className="company__redirection-enable">
                <UICheckbox
                  label="Activate custom redirection page"
                  check={isPageFieldEnabled}
                  handleClick={handleCheckboxClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingFieldsMobileView;
