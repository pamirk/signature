import React, { useCallback } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { BillingDetailsUpdatePayload } from 'Interfaces/Billing';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FieldTextArea, FieldTextInput } from 'Components/FormFields';
import Toast from 'Services/Toast';
import { useProfileInfoUpdate } from 'Hooks/User';
import { selectUser } from 'Utils/selectors';
import { useSelector } from 'react-redux';
import { User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const BillingDetails = () => {
  const { billingDetails, taxId }: User = useSelector(selectUser);
  const [updateBillingDetails, isLoading] = useProfileInfoUpdate();
  const isMobile = useIsMobile();

  const handleUpdateDetails = useCallback(
    async (values: BillingDetailsUpdatePayload) => {
      try {
        await updateBillingDetails(values);
        Toast.success('Billing details has been changed');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [updateBillingDetails],
  );

  return (
    <Form
      onSubmit={handleUpdateDetails}
      initialValues={{ billingDetails, taxId }}
      render={({
        handleSubmit,
        pristine,
        hasValidationErrors,
        submitting,
      }: FormRenderProps<BillingDetailsUpdatePayload>) => (
        <div className="billing__details">
          <form onSubmit={handleSubmit}>
            <h1 className="billing__header billing__details-header">Billing Details</h1>
            <div
              className={classNames('billing__details-description', { mobile: isMobile })}
            >
              <p className="settings__text settings__text--grey">
                If you want to add a custom Billing Address or Tax ID to your invoice from
                Signaturely, please do it here.
              </p>
            </div>
            <div className="settings__subtitle settings__subtitle--small">
              Billing Details
            </div>
            <div className={classNames('billing__details-field', { mobile: isMobile })}>
              <Field
                height={125}
                name="billingDetails"
                placeholder="Enter billing details here"
                parse={value => value || null}
                component={FieldTextArea}
              />
            </div>
            <div className="settings__subtitle settings__subtitle--small">Tax ID</div>
            <div className={classNames('billing__details-field', { mobile: isMobile })}>
              <Field
                name="taxId"
                parse={value => value || null}
                component={FieldTextInput}
              />
            </div>
            <div className="billing__details-button">
              <UIButton
                priority="secondary"
                title="Update Billing Details"
                type="submit"
                isLoading={isLoading}
                disabled={pristine || submitting || hasValidationErrors}
              />
            </div>
          </form>
        </div>
      )}
    />
  );
};

export default BillingDetails;
