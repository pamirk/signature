import React, { useCallback, useState } from 'react';
import uuid from 'uuid/v4';
import { FormApi } from 'final-form';
import parsePath from 'path-parse';
import { Company, User } from 'Interfaces/User';
import Toast from 'Services/Toast';
import classNames from 'classnames';
import UpgradeDropdown from './UpgradeDropdown';
import { composeValidators, resizeFile } from 'Utils/functions';
import { notOnlySpaces, urlProtocol } from 'Utils/validation';
import { FieldTextInput, FieldTextArea } from 'Components/FormFields';
import { Field } from 'react-final-form';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import Billet from './Billet';
import { LogoField } from './LogoField';
import { useSelector } from 'react-redux';
import { selectUser, selectUserPlan } from 'Utils/selectors';

import { PlanTypes } from 'Interfaces/Billing';
import CropModal from 'Components/CropModal';
import { useModal } from 'Hooks/Common';
import useIsMobile from 'Hooks/Common/useIsMobile';
import BrandingFieldsMobileView from './BrandingFieldsMobileView';

interface BrandingFieldsProps {
  isDropdownOpen: boolean;
  form: FormApi<Company>;
  setIsDropdownOpen: (value: boolean) => void;
  handleUpgradeClick: () => void;
  disabled?: boolean;
  logoFile?: File | null;
  setLogoFile: (file: File | null) => void;
  openUpgradeModal: () => void;
  initialRedirectionPage?: string | null;
}

const LOGO_ASPECT_RATIO = 5.6;

const BrandingFields = ({
  isDropdownOpen,
  form,
  setIsDropdownOpen,
  logoFile,
  setLogoFile,
  handleUpgradeClick,
  openUpgradeModal,
  initialRedirectionPage,
  disabled = false,
}: BrandingFieldsProps) => {
  const isMobile = useIsMobile();
  const [isPageFieldEnabled, setIsPageFieldEnabled] = useState<boolean>(
    !!initialRedirectionPage,
  );
  const userPlan = useSelector(selectUserPlan);
  const [isLogoProcessed, setIsLogoProcessed] = useState<boolean>(false);
  const { id: userId, companyLogoKey, teamId }: User = useSelector(selectUser);

  const [logo, setLogo] = useState<File | null>(null);
  const [isCropCancelled, setIsCropCancelled] = useState<boolean>(false);

  const companyLogoFormValue = form.getFieldState('companyLogoKey')?.value;
  const companyLogoName = companyLogoKey && parsePath(companyLogoKey).name;

  const handleBusinessPlanCheck = useCallback(() => {
    if (userPlan.type !== PlanTypes.BUSINESS && !teamId) {
      openUpgradeModal();
      return false;
    }

    return true;
  }, [openUpgradeModal, userPlan.type, teamId]);

  const handleCloseDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, [setIsDropdownOpen]);

  const handleCheckboxClick = useCallback(() => {
    const isBusiness = handleBusinessPlanCheck();

    if (!isBusiness) return;

    if (isPageFieldEnabled) {
      form.change('redirectionPage', null);
    }

    setIsPageFieldEnabled(!isPageFieldEnabled);
  }, [form, handleBusinessPlanCheck, isPageFieldEnabled]);

  const handleUploadCancel = useCallback(async () => {
    try {
      form.change('companyLogoKey', null);
      setLogoFile(null);
    } catch (error) {
      Toast.handleErrors(error);
    }
    setIsLogoProcessed(false);
  }, [form, setLogoFile]);

  const handleUploadLogo = useCallback(
    async (file: File) => {
      try {
        if (disabled) {
          return setIsDropdownOpen(true);
        }

        const fileExt = file.name && parsePath(file.name).ext;

        const logoId = uuid();
        const key = `users/${userId}/profile/${logoId}${fileExt}`;
        form.change('companyLogoKey', key);

        const resizedFile = await resizeFile(file, 280, 50, 'File format is not correct');

        setLogoFile(resizedFile);
      } catch (error) {
        Toast.handleErrors(error);
      }
      setIsLogoProcessed(false);
    },
    [disabled, form, setIsDropdownOpen, setLogoFile, userId],
  );

  const handleFileUploadFailure = useCallback(
    error => {
      setLogoFile(null);
      Toast.handleErrors(error);
    },
    [setLogoFile],
  );

  const [openCropModal, closeCropModal] = useModal(
    () => (
      <CropModal
        file={logo}
        onSubmit={handleUploadLogo}
        onClose={closeCropModal}
        onCancel={() => {
          closeCropModal();
          setIsCropCancelled(true);
        }}
        aspectRatio={LOGO_ASPECT_RATIO}
      />
    ),
    [logo],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      setIsCropCancelled(false);
      setLogo(file);
      openCropModal();
    },
    [openCropModal],
  );

  return isMobile ? (
    <BrandingFieldsMobileView
      disabled={disabled}
      handleBusinessPlanCheck={handleBusinessPlanCheck}
      handleFileUpload={handleFileUpload}
      handleUploadCancel={handleUploadCancel}
      logoFile={logoFile}
      handleFileUploadFailure={handleFileUploadFailure}
      companyLogoName={companyLogoName}
      isLogoProcessed={isLogoProcessed}
      companyLogoFormValue={companyLogoFormValue}
      isCropCancelled={isCropCancelled}
      isPageFieldEnabled={isPageFieldEnabled}
      handleCheckboxClick={handleCheckboxClick}
    />
  ) : (
    <div>
      <div className="company__upgrade-wrapper">
        <div className="company__billet-container">
          <p className="settings__title company__header-billet">Branding</p>
          {disabled && <Billet title="Business Feature" />}
        </div>
        {isDropdownOpen && (
          <UpgradeDropdown onClick={handleUpgradeClick} onClose={handleCloseDropdown} />
        )}
      </div>
      <div
        className={classNames('company__branding', {
          'company__branding--blur': isDropdownOpen,
        })}
      >
        <div
          className="company__uploader settings__field settings__field--half"
          onClick={handleBusinessPlanCheck}
        >
          <Field
            name="companyLogoKey"
            component={LogoField}
            companyLogoKey={companyLogoFormValue}
            logoFile={logoFile}
            onUpload={handleFileUpload}
            onUploadFailure={handleFileUploadFailure}
            onUploadCancel={handleUploadCancel}
            companyLogoName={companyLogoName}
            disabled={disabled}
            isFinished={isLogoProcessed || !!companyLogoFormValue}
            isCropCancelled={isCropCancelled}
          />
        </div>
        <p className="company__uploader-description settings__text settings__text--grey">
          We recommend using a transparent PNG image, with a resolution of 280 x 50px.
        </p>
        <div>
          <div className="settings__form-group">
            <div className="settings__field settings__form-group-item">
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
            <div className="settings__field settings__form-group-item">
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
          </div>
          <div className="settings__form-group">
            <div className="settings__field settings__form-group-item">
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

export default BrandingFields;
