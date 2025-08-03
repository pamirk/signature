import React, { useCallback, useState } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { LandingSignUpData, SignUpData } from 'Interfaces/Auth';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required, email, password, postalCode, name } from 'Utils/validation';
import { composeValidators } from 'Utils/functions';
import FieldPasswordInput from 'Components/FormFields/FieldPasswordInput';
import UISpinner from 'Components/UIComponents/UISpinner';
import { postalCodeMask, toLowerCaseAndRemoveEmptyCharacters } from 'Utils/formatters';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { MaskedTextInput } from 'Components/FormFields';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
import CouponDropDown from 'Pages/Auth/SignUp/components/SecondStepInfo/components/CouponDropDown';
import { Coupon, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { useCardAttach, useCreateCard, useTemporaryPlanChange } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import { useConfirmTemporary, useSignUpFromTemporary } from 'Hooks/Auth';
import { useModal } from 'react-modal-hook';
import { ConfirmCodeModal } from 'Pages/DocumentSign/components';
import { Document } from 'Interfaces/Document';
import { useDocumentSendOut } from 'Hooks/DocumentSign';
import { useDocumentUpdate } from 'Hooks/Document';
import History from 'Services/History';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface LandingSignUpFormProps {
  document?: Document;
  isLoading?: boolean;
  fieldClassName?: string;
  formClassName?: string;
  initialValues?: Partial<SignUpData>;
}

function LandingSignUpForm({
  document,
  isLoading,
  formClassName,
  fieldClassName,
}: LandingSignUpFormProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const [isOpenCouponDropDown, setOpenCouponDropDown] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<LandingSignUpData | undefined>(undefined);

  const createCard = useCreateCard();
  const [attachCard, isAttachingCard] = useCardAttach();
  const [changePlan, isChangingPlan] = useTemporaryPlanChange();
  const [updateDocument] = useDocumentUpdate();
  const [signUpFromTemporary, isPreparing] = useSignUpFromTemporary();
  const [confirmTemporary, isConfirmingTemporary] = useConfirmTemporary();
  const [sendDocument, isSendingDocument] = useDocumentSendOut();

  const handleSetOpenCouponDropDown = useCallback((state: boolean) => {
    setOpenCouponDropDown(state);
  }, []);

  const navigateToConfirmPage = useCallback(() => {
    History.push(UnauthorizedRoutePaths.LANDING_SIGNUP_CONFIRM, {
      documentId: document?.id,
    });
  }, [document]);

  const handleStartTrial = useCallback(async () => {
    try {
      if (formValues) {
        const token = await createCard({
          number: formValues.number,
          expirationDate: formValues.expirationDate,
          cvv: formValues.cvv,
          cardholderName: formValues.cardholderName,
          postalCode: formValues.postalCode,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        token && (await attachCard(token));

        await changePlan({
          type: PlanTypes.BUSINESS,
          duration: PlanDurations.MONTHLY,
          couponId: appliedCoupon && appliedCoupon.id,
          trial: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document && (await sendDocument({ documentId: document.id }));
        navigateToConfirmPage();
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formValues,
    createCard,
    attachCard,
    changePlan,
    appliedCoupon,
    document,
    sendDocument,
  ]);

  const [openCodeConfirmationModal, closeCodeConfirmationModal] = useModal(() => {
    const confirmCodeSend = async (code: string) => {
      try {
        await confirmTemporary({ confirmCode: code });
        closeCodeConfirmationModal();
        await handleStartTrial();
      } catch (error) {
        Toast.handleErrors(error);
      }
    };

    return (
      <ConfirmCodeModal
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendCode={confirmCodeSend}
        isSending={
          isConfirmingTemporary || isPreparing || isAttachingCard || isChangingPlan
        }
        title="Confirm your Signaturely Account"
        subtitle="We just sent you an email with your confirmation code.
        Please go to your email to confirm and share your account to verify your account.
        You'll get your signed file once you confirm your email address."
        placeholder="####-####"
        onClose={closeCodeConfirmationModal}
      />
    );
  }, [isPreparing, isConfirmingTemporary, isAttachingCard, isChangingPlan]);

  const onSubmit = useCallback(
    async (values: LandingSignUpData) => {
      try {
        if (document) {
          setFormValues(values);

          await signUpFromTemporary({
            name: values.name,
            email: values.email,
            password: values.password,
          });

          await updateDocument({
            values: {
              documentId: document?.id,
              signers: document?.signers.map(signer => {
                return {
                  ...signer,
                  email: signer.isPreparer ? values.email : signer.email,
                };
              }),
            },
          });

          openCodeConfirmationModal();
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [document, signUpFromTemporary, updateDocument, openCodeConfirmationModal],
  );

  return (
    <Form
      onSubmit={() => {}}
      mutators={{ ...arrayMutators }}
      render={({
        values,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<LandingSignUpData>) => (
        <form className={classNames('auth__form auth__form--signup', formClassName)}>
          <Field
            name="name"
            label="Name"
            className={fieldClassName}
            labelClassName="sign-up-landing__signUp-content-label"
            component={FieldTextInput}
            placeholder="Full Name"
            validate={required}
          />
          <Field
            name="email"
            label="Email Address"
            className={fieldClassName}
            labelClassName="sign-up-landing__signUp-content-label"
            component={FieldTextInput}
            placeholder="username@gmail.com"
            parse={toLowerCaseAndRemoveEmptyCharacters}
            validate={composeValidators<string>(required, email)}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            className={fieldClassName}
            labelClassName="sign-up-landing__signUp-content-label"
            component={FieldPasswordInput}
            placeholder="Your password"
            validate={composeValidators<string>(required, password)}
          />
          <div className="card-form__field card-form__field--noMargin card-form__field--flex sign-up-second-step__field">
            <Field
              name="cardholderName"
              placeholder="Your Name"
              label="Full Name on Card"
              component={FieldTextInput}
              validate={composeValidators<string>(required, name)}
              className="form__field--m24"
              labelClassName="sign-up-landing__signUp-content-label"
            />
          </div>
          <div className="card-form__field card-form__field--noMargin card-form__field--flex card-form__field--cardNumber sign-up-second-step__field">
            <label className="form__label sign-up-landing__signUp-content-label">
              Card Number
            </label>
            <div className="form__input-wrapper form__field--m24">
              <div className="form__input form__input--fsBig">
                <CardNumberElement
                  options={{
                    showIcon: true,
                    placeholder: '1234 5678 9101 3333',
                    style: {
                      base: {
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#596a78',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className={`card-form__group`}>
            <div className={`card-form__sub-group-grid`}>
              <div
                id="r1c1"
                className="card-form__field card-form__field--noMargin sign-up-second-step__field"
              >
                <label className="form__label sign-up-landing__signUp-content-label">
                  Expiration Date
                </label>
                <div className="form__input-wrapper">
                  <div className="form__input form__input--fsBig">
                    <CardExpiryElement
                      options={{
                        placeholder: '01 / 29',
                        style: {
                          base: {
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#596a78',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                id="r1c2"
                className="card-form__field card-form__field--noMargin sign-up-second-step__field"
              >
                <label className="form__label sign-up-landing__signUp-content-label">
                  CVV
                </label>
                <div className="form__input-wrapper">
                  <div className="form__input form__input--fsBig">
                    <CardCvcElement
                      options={{
                        placeholder: '123',
                        style: {
                          base: {
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#596a78',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div id="r2c1" className="sign-up-second-step__field">
                <Field
                  name="postalCode"
                  placeholder="00000"
                  label="Billing Zip Code"
                  mask={postalCodeMask}
                  labelClassName="sign-up-landing__signUp-content-label"
                  inputComponent={MaskedTextInput}
                  component={ClearableTextInput}
                  validate={composeValidators<string>(required, postalCode)}
                />
              </div>
            </div>
          </div>
          <div
            className={classNames('sign-up-landing__signUp-content-coupon-container', {
              open: isOpenCouponDropDown,
            })}
          >
            <CouponDropDown
              onUpdateCoupon={coupon => setAppliedCoupon(coupon)}
              placeholder={'Coupon (Optional)'}
              isOpen={isOpenCouponDropDown}
              onSetOpen={handleSetOpenCouponDropDown}
              buttonTitle={
                appliedCoupon ? `-${appliedCoupon.percentOff}% added` : 'Apply now'
              }
            />
          </div>
          <div className="auth__submitButton">
            {isLoading ? (
              <UISpinner
                wrapperClassName="spinner--main__wrapper"
                width={40}
                height={40}
              />
            ) : (
              <UIButton
                priority="primary"
                title="Start My 7-day Free Trial"
                handleClick={async () => await onSubmit(values)}
                disabled={
                  pristine ||
                  submitting ||
                  hasValidationErrors ||
                  isConfirmingTemporary ||
                  isPreparing ||
                  isAttachingCard ||
                  isChangingPlan ||
                  isSendingDocument
                }
                isLoading={
                  submitting ||
                  isConfirmingTemporary ||
                  isPreparing ||
                  isAttachingCard ||
                  isChangingPlan ||
                  isSendingDocument
                }
                className="centered-text sign-up-second-step__button"
              />
            )}
          </div>
        </form>
      )}
    />
  );
}

export default LandingSignUpForm;
