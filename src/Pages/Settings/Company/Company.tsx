import React, { useState, useCallback, useMemo } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import History from 'Services/History';
import { redirectToBilling } from 'Store/ducks/company/actionCreators';
import { PlanTypes, PlanDetails } from 'Interfaces/Billing';
import { selectCompanyData, selectUserPlan } from 'Utils/selectors';
import UIButton from 'Components/UIComponents/UIButton';
import { PreferencesFields } from './components';
import BrandingFields from './components/BrandingFields';
import Toast from 'Services/Toast';
import { Company } from 'Interfaces/User';
import useCompanyInfoUpdate from 'Hooks/User/useCompanyInfoUpdate';
import { useModal } from 'Hooks/Common';
import UpgradeModal from 'Components/UpgradeModal';
import { useCompanyLogoPut, useSignedPutAssetUrl } from 'Hooks/User';
import { SignedUrlResponse, UploadStatuses } from 'Interfaces/Common';
import { resizeFile } from 'Utils/functions';

const CompanyPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const initialCompanyData = useSelector(selectCompanyData);
  const [updateCompanyInfo, isUpdateLoading] = useCompanyInfoUpdate();
  const [logoFile, setLogoFile] = useState<File | null>();
  const userPlan: PlanDetails = useSelector(selectUserPlan);
  const dispatch = useDispatch();

  const [getSignedPutAssetUrl] = useSignedPutAssetUrl();
  const [putCompanyLogo] = useCompanyLogoPut();

  const isBusinessPlan = useMemo(() => userPlan.type === PlanTypes.BUSINESS, [
    userPlan.type,
  ]);

  const [showUpgradeModal, hideUpgradeModal] = useModal(() => {
    return (
      <UpgradeModal
        title="Please upgrade your account to enable business branding."
        onClose={hideUpgradeModal}
      >
        Please upgrade to the Business plan to enable business branding and company
        settings.
      </UpgradeModal>
    );
  });

  const handleFileUpload = useCallback(
    async (file: File, key: string) => {
      const { result: putUrl } = (await getSignedPutAssetUrl({
        key,
      })) as SignedUrlResponse;
      const resizedFile = await resizeFile(file, 280, 50, 'File format is not correct');
      const uploadStatus = await putCompanyLogo({ file: resizedFile, url: putUrl });

      if (uploadStatus === UploadStatuses.UPLOADED) {
        return true;
      } else {
        throw new Error('Uploading has been unsuccessful');
      }
    },
    [getSignedPutAssetUrl, putCompanyLogo],
  );

  const handleSubmitForm = useCallback(
    async (values: Company) => {
      try {
        if (userPlan.type === PlanTypes.FREE) {
          return setIsDropdownOpen(true);
        }
        if (logoFile && values.companyLogoKey) {
          await handleFileUpload(logoFile, values.companyLogoKey);
        }

        await updateCompanyInfo(values);

        Toast.success('Company information successfully saved');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [handleFileUpload, logoFile, updateCompanyInfo, userPlan.type],
  );

  const handleUpgradeClick = useCallback(() => {
    dispatch(redirectToBilling(true));
    History.push('/settings/billing/plan');
  }, [dispatch]);

  return (
    <div className="company">
      <Form
        initialValues={initialCompanyData}
        onSubmit={handleSubmitForm}
        keepDirtyOnReinitialize
        render={({
          handleSubmit,
          hasValidationErrors,
          submitting,
          pristine,
          form,
        }: FormRenderProps<Company>) => (
          <form onSubmit={handleSubmit} className="settings__form">
            <div className="settings__block">
              <BrandingFields
                form={form}
                initialRedirectionPage={initialCompanyData.redirectionPage}
                openUpgradeModal={showUpgradeModal}
                setLogoFile={setLogoFile}
                handleUpgradeClick={handleUpgradeClick}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                disabled={!isBusinessPlan}
              />
            </div>
            <div className="settings__block">
              <PreferencesFields
                openUpgradeModal={showUpgradeModal}
                disabled={!isBusinessPlan}
              />
            </div>
            <div className="profile__button profile__button--save company__branding-button">
              <UIButton
                type="submit"
                title="Save"
                priority="primary"
                isLoading={isUpdateLoading}
                disabled={
                  !isBusinessPlan ||
                  isUpdateLoading ||
                  pristine ||
                  submitting ||
                  hasValidationErrors
                }
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default CompanyPage;
