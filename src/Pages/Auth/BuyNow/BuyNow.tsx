import CardFields from 'Components/CardFields/CardFields';
import { FieldTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import UIRadioBtn from 'Components/UIComponents/UIRadioBtn';
import React, { useCallback, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { ReactSVG } from 'react-svg';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { required, name, email, password } from 'Utils/validation';
import Leaf from 'Assets/images/icons/leaf.svg';
import Check from 'Assets/images/icons/check.svg';
import classNames from 'classnames';
import { testimonials } from '../SignUp/SignUp';
import TestimonialItem, {
  TestimonialsViewMode,
} from '../SignUp/components/TestimonialItem';
import Slider from 'Components/Slider';
import {
  usePrimarySignIn,
  useSignUpWithConfrimCode,
  useSignUpWithPlanPrepare,
} from 'Hooks/Auth';
import { PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { isCodeSend } from 'Utils/typeGuards';
import Toast from 'Services/Toast';
import {
  PlanFieldTypes,
  planInformationItems,
} from 'Pages/Settings/Billing/screens/BillingDefaultPlanScreen/planTableItems';
import { useModal } from 'Hooks/Common';
import { ConfirmCodeModal } from 'Pages/DocumentSign/components';
import { useCreateCard, usePlanChange } from 'Hooks/Billing';
import Storage from 'Services/Storage';
import History from 'Services/History';
import { CONFIRMATION_CODE_LENGTH } from 'Utils/constants';
interface BuyNowProps {
  currentPlan?: PlanTypes.PERSONAL | PlanTypes.BUSINESS;
}

const planPrices = {
  business: {
    [PlanDurations.MONTHLY]: 30,
    [PlanDurations.ANNUALLY]: 288,
  },
  personal: {
    [PlanDurations.MONTHLY]: 20,
    [PlanDurations.ANNUALLY]: 192,
  },
};

interface CardForm {
  number: string;
  cardholderName: string;
  cvv: string;
  expirationDate: string;
  postalCode: string;
}

interface UserForm {
  id: string;
  name: string;
  email: string;
  password: string;
}

const BuyNow = ({ currentPlan = PlanTypes.PERSONAL }: BuyNowProps) => {
  const [prepareSignUp, isPreparing] = useSignUpWithPlanPrepare();
  const [sendConfrimCode, isCodeSending] = useSignUpWithConfrimCode();
  const [createCard, isCardCreating] = useCreateCard();
  const [changePlan, isPlanChanging] = usePlanChange();
  const [cardFormValue, setCardFormValue] = useState<CardForm | null>(null);
  const [user, setUser] = useState<UserForm | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<
    PlanDurations.MONTHLY | PlanDurations.ANNUALLY
  >(PlanDurations.MONTHLY);
  const [callSignIn, isLoading] = usePrimarySignIn();

  const [openCodeConfirmationModal, closeCodeConfirmationModal] = useModal(
    () => (
      <ConfirmCodeModal
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendCode={handleConfirmCodeSend}
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        resendCode={handleResendCode}
        isSending={isCodeSending || isCardCreating || isPlanChanging || isPreparing}
        title="Please enter confirmation code"
        subtitle="We have sent you an email with a confirmation code. Please check the specified email."
        onClose={closeCodeConfirmationModal}
        codeLength={CONFIRMATION_CODE_LENGTH}
      />
    ),
    [cardFormValue, user, isPreparing, isCodeSending, isCardCreating, isPlanChanging],
  );

  const handleSignUp = useCallback(
    async values => {
      try {
        const { name, email, password, ...creditCard } = values;

        const response:any = await prepareSignUp({
          name,
          email,
          password,
        });

        if (!isNotEmpty(response)) {
          return Toast.error('Something went wrong. Please try again.');
        }
        setCardFormValue(creditCard);
        setUser({ id: response.id, name, email, password });

        if (isCodeSend(response)) {
          openCodeConfirmationModal();
        } else {
          return Toast.error('Something went wrong, please try again.');
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [openCodeConfirmationModal, prepareSignUp],
  );

  const handleResendCode = useCallback(async () => {
    try {
      if (user) {
        const response:any = await prepareSignUp({ ...user });

        if (!isNotEmpty(response)) {
          return Toast.error('Something went wrong. Please try again.');
        }

        if (isCodeSend(response)) {
          openCodeConfirmationModal();
        } else {
          return Toast.error('Something went wrong, please try again.');
        }
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [openCodeConfirmationModal, prepareSignUp, user]);

  const sendConfirmCode = useCallback(
    async confirmCode => {
      try {
        if (user) {
          const response:any = await sendConfrimCode({ userId: user.id, confirmCode });

          if (!isNotEmpty(response)) {
            return Toast.error('Something went wrong. Please try again.');
          }

          await Storage.setAccessToken(response.accessToken);
          Toast.success('User created');

          return response;
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [sendConfrimCode, user],
  );

  const updatePlan = useCallback(async () => {
    try {
      if (cardFormValue) {
        await createCard(cardFormValue);
        Toast.success('Credit card is added');

        await changePlan({
          type: currentPlan,
          duration: selectedDuration,
        });
        Toast.success('Plan is updated');
      }
    } catch (err) {
      Toast.handleErrors(err);
    } finally {
      closeCodeConfirmationModal();
      user && (await callSignIn(user));
      History.push('/settings/billing');
    }
  }, [
    callSignIn,
    cardFormValue,
    changePlan,
    closeCodeConfirmationModal,
    createCard,
    currentPlan,
    selectedDuration,
    user,
  ]);

  const handleConfirmCodeSend = useCallback(
    async confirmCode => {
      const response = await sendConfirmCode(confirmCode);

      if (!response) {
        return;
      }
      await updatePlan();
    },
    [sendConfirmCode, updatePlan],
  );

  return (
    <div className="buynow">
      <div className="buynow__wrapper">
        <div className="buynow__content">
          <div className="buynow__content-left">
            <div className="label">
              <div className="label-title">
                Subscribe to <span>{currentPlan}</span> Plan
              </div>
              <div className="label-description">
                Fill in the details below to create your Signaturely account today.
              </div>
            </div>
            <Form
              onSubmit={handleSignUp}
              render={({ handleSubmit, submitting }) => (
                <form className="credentials">
                  <div className="credentials__container">
                    <div className="credentials-personal">
                      <div className="credentials__label">Your information</div>
                      <div className="credentials-personal__items">
                        <div className="credentials-personal-item">
                          <Field
                            name="name"
                            label="Name"
                            placeholder="Full Name"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, name)}
                            format={value => value && value.trim()}
                            formatOnBlur
                          />
                        </div>
                        <div className="credentials-personal-item">
                          <Field
                            name="email"
                            label="Email Address"
                            placeholder="username@gmail.com"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, email)}
                          />
                        </div>
                        <div className="credentials-personal-item">
                          <Field
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="Your password"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, password)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="credentials-subscription">
                      <div className="credentials__label">
                        Customize your subscription
                      </div>
                      <div className="credentials-subscription__items">
                        <div
                          className={classNames('credentials-subscription-item', {
                            active: selectedDuration === PlanDurations.MONTHLY,
                          })}
                        >
                          <div className="label">
                            <div className="credentials-subscription--name">
                              <UIRadioBtn
                                handleCheck={() =>
                                  setSelectedDuration(PlanDurations.MONTHLY)
                                }
                                label="Monthly"
                                isChecked={selectedDuration === PlanDurations.MONTHLY}
                              />
                            </div>
                            <div className="credentials-subscription--price">
                              Pay ${planPrices[currentPlan]['monthly']}/month, billed
                              monthly.
                            </div>
                          </div>
                        </div>
                        <div
                          className={classNames('credentials-subscription-item', {
                            active: selectedDuration === PlanDurations.ANNUALLY,
                          })}
                        >
                          <div className="save">Save 20%</div>
                          <div className="label">
                            <div className="credentials-subscription--name">
                              <UIRadioBtn
                                handleCheck={() =>
                                  setSelectedDuration(PlanDurations.ANNUALLY)
                                }
                                label="Annually"
                                isChecked={selectedDuration === PlanDurations.ANNUALLY}
                              />
                            </div>
                            <div className="credentials-subscription--price">
                              Pay ${planPrices[currentPlan]['annually'] / 12}/month,
                              billed annually.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="credentials-card">
                      <div className="credentials__label">Card details</div>
                      <div className="credentials-card__container">
                        <CardFields />
                      </div>
                    </div>
                    <div className="buynow__footer">
                      <UIButton
                        handleClick={handleSubmit}
                        priority="primary"
                        title="Purchase now"
                        className="buynow__button"
                        disabled={submitting || isPreparing}
                        isLoading={isPreparing}
                      />
                      <div className="buynow__footer-policy">
                        By clicking the &quot;Purchase now&quot; button, I agree to
                        the&nbsp;
                        <a
                          className="buynow__footer-link"
                          href="https://signaturely.com/terms/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Terms of Use</span>,&nbsp;
                        </a>
                        <a
                          className="buynow__footer-link"
                          href="https://signaturely.com/electronic-signature-disclosure-and-consent"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Electronic Signature Disclosure and Consent</span>
                        </a>
                        &nbsp;and&nbsp;
                        <a
                          className="buynow__footer-link"
                          href="https://signaturely.com/privacy/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Privacy Policy</span>.
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
          <div className="buynow__content-right">
            <div
              className={classNames('plan-badge', {
                business: currentPlan === PlanTypes.BUSINESS,
              })}
            >
              {currentPlan === PlanTypes.BUSINESS && (
                <div className="plan-badge__suffix">POPULAR</div>
              )}
              <div>
                <div className="plan-badge__label">
                  <div className="plan-badge__name">{currentPlan}</div>
                  <div className="plan-badge__price">
                    ${planPrices[currentPlan][selectedDuration]}
                    &nbsp;
                    <span>
                      /{selectedDuration === PlanDurations.MONTHLY ? 'month' : 'annually'}
                    </span>
                  </div>
                  {currentPlan === PlanTypes.BUSINESS && (
                    <div className="plan-badge__price-suffix">Per user</div>
                  )}
                </div>
                <div className="plan-badge__options">
                  <ul>
                    {planInformationItems
                      .filter(option => option[`${currentPlan}Value`])
                      .map(option => (
                        <li className="plan-badge__options-item" key={option.name}>
                          {option.name}
                          {option.type === PlanFieldTypes.TEXT ? (
                            <span
                              className={classNames('option_value', {
                                business: currentPlan === PlanTypes.BUSINESS,
                              })}
                            >
                              {option[`${currentPlan}Value`]}
                            </span>
                          ) : (
                            <span
                              className={classNames('option_check', {
                                business: currentPlan === PlanTypes.BUSINESS,
                              })}
                            >
                              <ReactSVG src={Check} />
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="eco-badge">
              <div className="eco-badge__content">
                <ReactSVG src={Leaf} />
                <div>
                  <div className="eco-badge__math">1 Subscription = 1 Tree Planted</div>
                  <div className="eco-badge__promise">
                    We’ll plant a tree with your purchase
                  </div>
                </div>
              </div>
            </div>
            <div className="buynow__slider">
              <Slider hideArrows>
                {testimonials.map(testimonial => (
                  <TestimonialItem
                    key={testimonial.name}
                    {...testimonial}
                    viewMode={TestimonialsViewMode.BUYNOW}
                  />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
