import {
  CONFIRMATION_CODE_LENGTH,
  IS_BLACK_FRIDAY,
  IS_END_OF_YEAR,
} from 'Utils/constants';
import { FieldTextInput, MaskedTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import UIRadioBtn from 'Components/UIComponents/UIRadioBtn';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { ReactSVG } from 'react-svg';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { required, name, email, password, postalCode } from 'Utils/validation';
import Leaf from 'Assets/images/icons/leaf.svg';
import Check from 'Assets/images/icons/check.svg';
import classNames from 'classnames';
import { testimonials } from '../SignUp/SignUpFirstStep';
import TestimonialItem, {
  TestimonialsViewMode,
} from '../SignUp/components/TestimonialItem';
import Slider from 'Components/Slider';
import { useSignUpWithConfrimCode, useSignUpWithPlanPrepare } from 'Hooks/Auth';
import {
  AnnuallyDiscount,
  Coupon,
  PlanDurations,
  PlanTypes,
  defaultPlanPrices,
  discountByDuration,
  discountPlanPrices,
} from 'Interfaces/Billing';
import { isCodeSend } from 'Utils/typeGuards';
import Toast from 'Services/Toast';
import {
  PlanFieldTypes,
  planInformationItems,
} from 'Pages/Settings/Billing/screens/BillingDefaultPlanScreen/planTableItems';
import { useModal } from 'Hooks/Common';
import { ConfirmCodeModal } from 'Pages/DocumentSign/components';
import { useCardAttach, useCreateCard, usePlanChange } from 'Hooks/Billing';
import History from 'Services/History';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { postalCodeMask, removeEmptyCharacters } from 'Utils/formatters';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
import { PromoCodeField } from 'Pages/Settings/Billing/components';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface BuyNowProps {
  currentPlan?: PlanTypes.PERSONAL | PlanTypes.BUSINESS;
}

const planTitles = {
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: 'Business',
    [PlanDurations.ANNUALLY]: 'Business Annually',
  },
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: 'Personal',
    [PlanDurations.ANNUALLY]: 'Personal Annually',
  },
};

const buynowPathRegEx = /\/signup\/(business|personal)(-annually)?$/g;

interface UserForm {
  id: string;
  name: string;
  email: string;
  password: string;
}

const BuyNow = ({ currentPlan = PlanTypes.PERSONAL }: BuyNowProps) => {
  const [prepareSignUp, isPreparing] = useSignUpWithPlanPrepare();
  const [sendConfrimCode, isCodeSending] = useSignUpWithConfrimCode();
  const [user, setUser] = useState<UserForm | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<
    PlanDurations.MONTHLY | PlanDurations.ANNUALLY
  >(PlanDurations.MONTHLY);
  const [changePlan, isChangingPlan] = usePlanChange();
  const createCard = useCreateCard();
  const [attachCard, isAttachingCard] = useCardAttach();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const isMobile = useIsMobile();
  const isSomeSale = IS_BLACK_FRIDAY || IS_END_OF_YEAR;

  const planPaths = useMemo(
    () => ['business', 'personal', 'business-annually', 'personal-annually'],
    [],
  );

  useEffect(() => {
    if (!buynowPathRegEx.test(History.location.pathname)) {
      return History.push(`${UnauthorizedRoutePaths.SIGN_UP}/${currentPlan}`);
    }

    if (History.location.pathname.indexOf('-annually') > 0) {
      return setSelectedDuration(PlanDurations.ANNUALLY);
    }
  }, [currentPlan, planPaths]);

  const [openCodeConfirmationModal, closeCodeConfirmationModal] = useModal(
    () => (
      <ConfirmCodeModal
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendCode={handleConfirmCodeSend}
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        resendCode={handleResendCode}
        isSending={isCodeSending || isPreparing || isAttachingCard || isChangingPlan}
        title="Please enter confirmation code"
        subtitle="We have sent you an email with a confirmation code. Please check the specified email."
        onClose={closeCodeConfirmationModal}
        codeLength={CONFIRMATION_CODE_LENGTH}
      />
    ),
    [user, isPreparing, isCodeSending, isAttachingCard, isChangingPlan],
  );

  const handleSignUp = useCallback(
    async values => {
      try {
        const { name, email, password } = values;

        const response = await prepareSignUp({
          name,
          email,
          password,
        });

        if (!isNotEmpty(response)) {
          return Toast.error('Something went wrong. Please try again.');
        }

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
        const response = await prepareSignUp({ ...user });

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
          const response = await sendConfrimCode({ userId: user.id, confirmCode });

          if (!isNotEmpty(response)) {
            return Toast.error('Something went wrong. Please try again.');
          }

          Toast.success('User created');

          return response;
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [sendConfrimCode, user],
  );

  const openCheckoutSession = useCallback(async () => {
    try {
      const token = await createCard();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      token && (await attachCard(token));

      Toast.success('Card attached');

      await changePlan({
        type: currentPlan,
        duration: selectedDuration,
        couponId: appliedCoupon && appliedCoupon.id,
      });

      Toast.success('Plan upgraded');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [appliedCoupon, attachCard, changePlan, createCard, currentPlan, selectedDuration]);

  const handleConfirmCodeSend = useCallback(
    async confirmCode => {
      const response = await sendConfirmCode(confirmCode);

      if (!response) {
        return;
      }

      await openCheckoutSession();
    },
    [openCheckoutSession, sendConfirmCode],
  );

  return (
    <div className="buynow">
      <div className={classNames('buynow__wrapper', { mobile: isMobile })}>
        <div className={classNames('buynow__content', { mobile: isMobile })}>
          <div className={classNames('buynow__content-left', { mobile: isMobile })}>
            <div className={classNames('label', { mobile: isMobile })}>
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
                <form className={classNames('credentials', { mobile: isMobile })}>
                  <div className="credentials__container">
                    <div className="credentials-personal">
                      <div className="credentials__label">Your information</div>
                      <div className="credentials-personal__items">
                        <div
                          className={classNames('credentials-personal-item', {
                            mobile: isMobile,
                          })}
                        >
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
                        <div
                          className={classNames('credentials-personal-item', {
                            mobile: isMobile,
                          })}
                        >
                          <Field
                            name="email"
                            label="Email Address"
                            placeholder="username@gmail.com"
                            component={FieldTextInput}
                            parse={removeEmptyCharacters}
                            validate={composeValidators<string>(required, email)}
                          />
                        </div>
                        <div
                          className={classNames('credentials-personal-item', {
                            mobile: isMobile,
                          })}
                        >
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
                      <div
                        className={classNames('credentials-subscription__items', {
                          mobile: isMobile,
                        })}
                      >
                        <div
                          className={classNames('credentials-subscription-item', {
                            active: selectedDuration === PlanDurations.MONTHLY,
                            mobile: isMobile,
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
                              Pay $
                              {discountPlanPrices[currentPlan][PlanDurations.MONTHLY]}
                              /month, billed monthly.
                            </div>
                          </div>
                        </div>
                        <div
                          className={classNames('credentials-subscription-item', {
                            active: selectedDuration === PlanDurations.ANNUALLY,
                            mobile: isMobile,
                          })}
                        >
                          <div className="save">Save {AnnuallyDiscount}%</div>
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
                              Pay $
                              {discountPlanPrices[currentPlan][PlanDurations.ANNUALLY]}
                              /month, billed annually.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="credentials-card">
                      <div className="credentials__label">Card details</div>
                      <div
                        className={classNames('credentials-card__container', {
                          mobile: isMobile,
                        })}
                      >
                        <div className="card-form">
                          <div className={`card-form__group${isMobile ? '-mobile' : ''}`}>
                            <div
                              className={classNames(
                                'card-form__field',
                                'card-form__field--flex',
                                'card-form__field--cardNumber',
                                { 'credentials-card__form': isMobile },
                              )}
                            >
                              <label className="form__label">Card Number</label>
                              <div className="form__input-wrapper">
                                <div className="form__input">
                                  <CardNumberElement
                                    options={{
                                      placeholder: '1234 5678 9101 1129',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              className={`card-form__sub-group${
                                isMobile ? '-mobile' : ''
                              }`}
                            >
                              <div className="card-form__field card-form__field--expiration">
                                <label className="form__label">Expiration</label>
                                <div className="form__input-wrapper">
                                  <div className="form__input">
                                    <CardExpiryElement
                                      options={{
                                        placeholder: '01 / 2000',
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="card-form__field card-form__field--cvv">
                                <label className="form__label">CVV</label>
                                <div className="form__input-wrapper">
                                  <div className="form__input">
                                    <CardCvcElement
                                      options={{
                                        placeholder: '123',
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`card-form__group${isMobile ? '-mobile' : ''}`}>
                            <div
                              className={classNames(
                                'card-form__field',
                                'card-form__field--flex',
                                { 'credentials-card__form': isMobile },
                              )}
                            >
                              <Field
                                name="cardholderName"
                                placeholder="Your Name"
                                label="Cardholder Name"
                                component={FieldTextInput}
                                validate={composeValidators<string>(required, name)}
                              />
                            </div>
                            <div className="card-form__field card-form__field--postal">
                              <Field
                                name="postalCode"
                                placeholder="00000"
                                label="Billing ZIP Code"
                                mask={postalCodeMask}
                                inputComponent={MaskedTextInput}
                                component={ClearableTextInput}
                                validate={composeValidators<string>(required, postalCode)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <PromoCodeField
                      plan={{
                        duration: selectedDuration,
                        type: currentPlan,
                        title: planTitles[currentPlan][selectedDuration],
                      }}
                      onUpdateCoupon={coupon => setAppliedCoupon(coupon)}
                      className={classNames('buynow__promocode', { mobile: isMobile })}
                    />
                    <div className="buynow__footer">
                      <UIButton
                        className={classNames('buynow__button', { mobile: isMobile })}
                        handleClick={handleSubmit}
                        priority="primary"
                        title="Purchase now"
                        disabled={submitting || isPreparing}
                        isLoading={isPreparing}
                      />
                      <div
                        className={classNames('buynow__footer-policy', {
                          mobile: isMobile,
                        })}
                      >
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
          <div className="buynow__divisor" />
          <div className="buynow__content-right">
            <div
              className={classNames('plan-badge', {
                business: currentPlan === PlanTypes.BUSINESS,
                mobile: isMobile,
              })}
            >
              {currentPlan === PlanTypes.BUSINESS && (
                <div className="plan-badge__suffix">POPULAR</div>
              )}
              <div>
                <div className="plan-badge__label">
                  <div className="plan-badge__name">{currentPlan}</div>
                  <div className="plan-badge__price">
                    ${discountPlanPrices[currentPlan][selectedDuration]}
                    &nbsp;
                    <span>
                      /{selectedDuration === PlanDurations.MONTHLY ? 'month' : 'annually'}
                    </span>
                  </div>
                  {currentPlan === PlanTypes.BUSINESS && (
                    <div className="plan-badge__price-suffix">Per user</div>
                  )}
                  {isSomeSale && (
                    <div
                      className={classNames('plan-badge__defaultPrice-container', {
                        mobile: isMobile,
                      })}
                    >
                      <div className="plan-badge__defaultPrice-price-container">
                        <div className="plan-badge__defaultPrice-price">
                          ${defaultPlanPrices[currentPlan][selectedDuration]}
                        </div>
                      </div>
                      <div className="plan-badge__defaultPrice-discount">
                        {discountByDuration[selectedDuration]}% OFF
                      </div>
                    </div>
                  )}
                </div>
                <div className="plan-badge__options">
                  <ul>
                    {planInformationItems
                      .filter(option => option[`${currentPlan}Value`])
                      .map(option => (
                        <li
                          className={classNames('plan-badge__options-item', {
                            mobile: isMobile,
                          })}
                          key={option.name}
                        >
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
            <div className={classNames('eco-badge', { mobile: isMobile })}>
              <div className="eco-badge__content">
                <ReactSVG src={Leaf} />
                <div>
                  <div className={classNames('eco-badge__math', { mobile: isMobile })}>
                    1 Subscription = 1 Tree Planted
                  </div>
                  <div className={classNames('eco-badge__promise', { mobile: isMobile })}>
                    We’ll plant a tree with your purchase
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames('buynow__slider', { mobile: isMobile })}>
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
