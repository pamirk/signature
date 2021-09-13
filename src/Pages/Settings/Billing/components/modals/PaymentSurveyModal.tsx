import React, { useState } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import { Field, Form } from 'react-final-form';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';
import { maxLength100 } from 'Utils/validation';
import { FieldTextInput } from 'Components/FormFields';
import RadioButton from '../RadioButton';

interface SigningLinkModalProps {
  onClose: () => void;
  onSubmit: (paymentSurveyAnswer: string | undefined) => OnSubmitReturnType;
  isLoading: boolean;
}

const answerOptions = [
  { label: 'Google Search' },
  { label: 'Google Ad' },
  { label: 'Facebook' },
  { label: 'LinkedIn' },
  { label: 'Bing' },
  { label: 'Yahoo' },
  { label: 'Quora' },
  { label: 'Referral (From Friend or collegue)' },
];
const PaymentSurveyModal = ({ onClose, onSubmit, isLoading }: SigningLinkModalProps) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  const handleFormSubmit = async (values: { answerInput: string }) => {
    await onSubmit(selectedOption === 'Other' ? values.answerInput : selectedOption);
  };

  const handleCloseModal = () => {
    onClose();
  };
  return (
    <UIModal onClose={handleCloseModal} hideCloseIcon>
      <div className="paymentSurveyModal__wrapper">
        <div className="paymentSurveyModal__header">
          <div className="paymentSurveyModal__title">You just planted a tree!</div>
          <p className="paymentSurveyModal__subtitle">
            As part of our partnership with Eden Reforestation Projects you just planted 1
            tree!
          </p>
          <p className="paymentSurveyModal__subtitle">
            Can you please let us know how you heard about Signaturely?
          </p>
        </div>
        <div className="paymentSurveyModal__content">
          <Form
            onSubmit={handleFormSubmit}
            render={({ hasValidationErrors, submitting, handleSubmit, form }) => {
              if (selectedOption !== 'Other') {
                form.change('answerInput', undefined);
              }
              return (
                <form onSubmit={handleSubmit} className="paymentSurveyModal__form">
                  {answerOptions.map(option => (
                    <div
                      className="paymentSurveyModal__optionsWrapper"
                      key={option.label}
                    >
                      <RadioButton
                        label={option.label}
                        onClick={() => {
                          setSelectedOption(option.label);
                        }}
                        isActive={selectedOption === option.label}
                      />
                    </div>
                  ))}
                  <div className="paymentSurveyModal__optionsWrapper">
                    <div className="paymentSurveyModal__optionsWrapper paymentSurveyModal__optionsWrapper--other">
                      <RadioButton
                        label="Other"
                        onClick={() => {
                          setSelectedOption('Other');
                        }}
                        isActive={selectedOption === 'Other'}
                      />
                    </div>
                    <Field
                      name="answerInput"
                      placeholder="Where?"
                      component={FieldTextInput}
                      validate={maxLength100}
                      disabled={selectedOption !== 'Other'}
                    />
                  </div>
                  <div className="paymentSurveyModal__actions">
                    <UIButton
                      type="submit"
                      priority="primary"
                      isLoading={isLoading}
                      disabled={hasValidationErrors || submitting}
                      title="Continue"
                    />
                    <div
                      className="paymentSurveyModal__actions paymentSurveyModal__actions--skip"
                      onClick={handleCloseModal}
                    >
                      Skip
                    </div>
                  </div>
                </form>
              );
            }}
          />
        </div>
      </div>
    </UIModal>
  );
};

export default PaymentSurveyModal;
