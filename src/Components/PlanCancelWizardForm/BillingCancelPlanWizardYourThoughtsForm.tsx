import React, { PropsWithChildren } from 'react';
import { Field } from 'react-final-form';
import { FieldTextArea } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';

interface BillingCancelPlanWizardYourThoughtsFormProps {
  onCancel?: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const BillingCancelPlanWizardYourThoughtsForm = ({
  children,
  isSubmitting,
  onCancel,
  onSubmit,
}: PropsWithChildren<BillingCancelPlanWizardYourThoughtsFormProps>) => {
  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">Last question</h1>
      <div className="billing__plan-cancel-modal-form-content">
        <p className="billing__plan-cancel-modal-paragraph">
          If you don&apos;t mind, we would love to know how to improve Signaturely.
        </p>
        <label className="form__label" htmlFor="billingCancelPlanYourThoughts">
          Your Thoughts
        </label>
        <Field
          id="billingCancelPlanYourThoughts"
          name="comment"
          component={FieldTextArea}
        />
      </div>
      {children}
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Nevermind"
          className="billing__plan-cancel-modal-button--primary"
          handleClick={onCancel}
        />
        <UIButton
          priority="white"
          title="Next"
          className="billing__plan-cancel-modal-button--white"
          handleClick={onSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardYourThoughtsForm;
