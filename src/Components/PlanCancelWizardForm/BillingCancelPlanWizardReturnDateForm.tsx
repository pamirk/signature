import React, { PropsWithChildren } from 'react';
import { Field } from 'react-final-form';
import FieldDatePicker from 'Components/FormFields/FieldDatePicker';
import UIButton from 'Components/UIComponents/UIButton';
import { DateFormats } from 'Interfaces/User';
import { required } from 'Utils/validation';

interface BillingCancelPlanWizardReturnDateFormProps {
  pristine?: boolean;
  isSubmitting?: boolean;
  hasValidationErrors?: boolean;
  onCancel?: () => void;
}

const BillingCancelPlanWizardReturnDateForm = ({
  children,
  pristine,
  isSubmitting,
  hasValidationErrors,
  onCancel,
}: PropsWithChildren<BillingCancelPlanWizardReturnDateFormProps>) => {
  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">Last question</h1>
      <div className="billing__plan-cancel-modal-form-content">
        <p className="billing__plan-cancel-modal-paragraph">
          If you don&apos;t mind, we would love to know when you plan to return to
          Signaturely so we can reach out with future offers.
        </p>
        <div className="billing__plan-cancel-modal-date-picker-container">
          <Field
            name="plannedReturnDate"
            className="billing__plan-cancel-modal-date-picker"
            component={FieldDatePicker}
            validate={required}
            placeholder={DateFormats.MM_DD_YYYY}
            fromMonth={new Date()}
            disabledDays={[{ from: new Date(0), to: new Date() }]}
          />
        </div>
      </div>
      {children}
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Keep me updated"
          className="billing__plan-cancel-modal-button--primary"
          type="submit"
          disabled={pristine || hasValidationErrors}
          isLoading={isSubmitting}
        />
        <UIButton
          priority="white"
          title="No, thank you"
          className="billing__plan-cancel-modal-button--white"
          handleClick={onCancel}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardReturnDateForm;
