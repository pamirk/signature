import React, { useCallback } from 'react';
import Tooltip from 'Components/Tooltip';
import { Field } from 'react-final-form';
import { FieldCheckbox } from 'Components/FormFields';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import FormError from 'Components/UIComponents/FormError';
import { signatureTypesPreferences } from 'Utils/validation';
import Billet from './Billet';
import { selectUserPlan } from 'Utils/selectors';
import { useSelector } from 'react-redux';
import { PlanTypes } from 'Interfaces/Billing';

type onPlanTypeCheckSuccess = (...args: any) => void;

interface PreferencesFieldsProps {
  disabled?: boolean;
  openUpgradeModal: () => void;
}

const PreferencesFields = ({
  disabled = false,
  openUpgradeModal,
}: PreferencesFieldsProps) => {
  const userPlan = useSelector(selectUserPlan);

  const handleBusinessPlanCheck = useCallback(
    (onSuccess: onPlanTypeCheckSuccess) => (...args) => {
      if (userPlan.type !== PlanTypes.BUSINESS) {
        return openUpgradeModal();
      }

      onSuccess && onSuccess(...args);
    },
    [openUpgradeModal, userPlan.type],
  );

  return (
    <div>
      <div className="company__upgrade-wrapper">
        <div className="company__billet-container">
          <p className="settings__title company__header-billet">Document Preferences</p>
          {disabled && <Billet title="Business Feature" />}
        </div>
      </div>
      <div className="settings__field-wrapper">
        <div className="settings__subtitle settings__subtitle--small company__title-container">
          <p className="company__title ">Available signature types</p>
          <Tooltip>
            Signature types that will be accepted on the signature requests you send.
          </Tooltip>
        </div>
        <div className="settings__form-group">
          <Field
            name="signatureTypesPreferences"
            render={({ input, meta }) => {
              const isError =
                meta.error || (meta.submitError && !meta.dirtySinceLastSubmit);

              return (
                <div>
                  <div className="company__checkbox-group">
                    <div className="settings__form-checkbox settings__form-group-item">
                      <UICheckbox
                        label="Drawn"
                        check={!disabled && input.value.isDrawnSignaturesAvailable}
                        handleClick={handleBusinessPlanCheck(() =>
                          input.onChange({
                            ...input.value,
                            isDrawnSignaturesAvailable: !input.value
                              .isDrawnSignaturesAvailable,
                          }),
                        )}
                      />
                    </div>
                    <div className="settings__form-checkbox settings__form-group-item">
                      <UICheckbox
                        label="Uploaded"
                        check={!disabled && input.value.isUploadedSignaturesAvailable}
                        handleClick={handleBusinessPlanCheck(() =>
                          input.onChange({
                            ...input.value,
                            isUploadedSignaturesAvailable: !input.value
                              .isUploadedSignaturesAvailable,
                          }),
                        )}
                      />
                    </div>
                    <div className="settings__form-checkbox settings__form-group-item">
                      <UICheckbox
                        label="Typed"
                        check={!disabled && input.value.isTypedSignaturesAvailable}
                        handleClick={handleBusinessPlanCheck(() =>
                          input.onChange({
                            ...input.value,
                            isTypedSignaturesAvailable: !input.value
                              .isTypedSignaturesAvailable,
                          }),
                        )}
                      />
                    </div>
                  </div>
                  {isError && <FormError meta={meta} />}
                </div>
              );
            }}
            validate={signatureTypesPreferences}
          />
        </div>
      </div>
      {/* <div className="settings__field-wrapper">
        <h2 className="settings__subtitle settings__subtitle--small">
          <div className="company__title-container">
            <p className="company__title">Don&apos;t merge documents after signing</p>
            <Tooltip>Don&apos;t merge documents after signing</Tooltip>
          </div>
        </h2>
        <Field
          name="preferences.merge"
          label="Enable"
          className="settings__form-checkbox"
          render={({ input, ...restProps }) => (
            <FieldCheckbox
              {...restProps}
              input={{
                ...input,
                onChange: handleBusinessPlanCheck(input.onChange),
              }}
            />
          )}
        />
      </div> */}
      <div className="settings__field-wrapper">
        <h2 className="settings__subtitle settings__subtitle--small">
          <div className="company__title-container">
            <p className="company__title">Enable Signer Security Access</p>
            <Tooltip>
              Enable this option to require signers to enter a custom access code before
              being able to view and sign the document.
            </Tooltip>
          </div>
        </h2>
        <Field
          name="enableSignerAccessCodes"
          label="Enable"
          className="settings__form-checkbox"
          render={({ input, ...restProps }) => (
            <FieldCheckbox
              {...restProps}
              input={{
                ...input,
                onChange: handleBusinessPlanCheck(input.onChange),
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PreferencesFields;
