import React, { useCallback, useEffect, useState } from 'react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { FieldTextInput, MaskedTextInput } from 'Components/FormFields';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { postalCodeMask } from 'Utils/formatters';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { postalCode, required, name } from 'Utils/validation';
import arrayMutators from 'final-form-arrays';
import UIButton from 'Components/UIComponents/UIButton';
import { CardFormValues, Coupon, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { useCardAttach, useCardGet, useCreateCard, usePlanChange } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import CouponDropDown from './CouponDropDown';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectCardFormValues } from 'Utils/selectors';
import CardForm from 'Components/CardForm';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

export const PostBillingInfo = () => {
  const card = useSelector(selectCardFormValues);
  const createCard = useCreateCard();
  const [attachCard, isAttachingCard] = useCardAttach();
  const [getCard, isGettingCard] = useCardGet();
  const [changePlan, isChangingPlan] = usePlanChange();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const [isOpenCouponDropDown, setOpenCouponDropDown] = useState<boolean>(false);
  const [isCurrentCardFlow, setIsCurrentCardFlow] = useState<boolean>(
    isGettingCard ? true : !!card,
  );

  const navigateToBilling = useCallback(() => {
    History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
  }, []);

  const onSubmit = useCallback(
    async (values: CardFormValues) => {
      try {
        if (!isCurrentCardFlow) {
          const token = await createCard(values);
          token && (await attachCard(token));

          Toast.success('New card attached');
        }

        await changePlan({
          type: PlanTypes.BUSINESS,
          duration: PlanDurations.MONTHLY,
          couponId: appliedCoupon && appliedCoupon.id,
          trial: true,
        });

        History.replace(AuthorizedRoutePaths.TRIAL_SUCCESS, { successRequired: true });
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [isCurrentCardFlow, changePlan, appliedCoupon, createCard, attachCard],
  );

  const handleSetOpenCouponDropDown = useCallback((state: boolean) => {
    setOpenCouponDropDown(state);
  }, []);

  const handleCardGet = useCallback(async () => {
    try {
      const card = await getCard(undefined);

      if (isNotEmpty(card)) {
        setIsCurrentCardFlow(true);
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCardGet();
  }, [handleCardGet]);

  const showCurrentCardBlock = useCallback(() => {
    return (
      <>
        {card && (
          <div
            className={classNames(
              'billing__card billing__trial-attached-card settings__block--full-width',
            )}
          >
            <CardForm disableButton />
          </div>
        )}
      </>
    );
  }, [card]);

  const showNewCardBlock = useCallback(() => {
    return (
      <>
        <div className="card-form__field card-form__field--noMargin card-form__field--flex sign-up-second-step__field">
          <Field
            name="cardholderName"
            placeholder="Your Name"
            label="Full Name on Card"
            component={FieldTextInput}
            validate={composeValidators<string>(required, name)}
            className="form__field--m24"
            inputClassName="form__input--fsBig"
          />
        </div>
        <div className="card-form__field card-form__field--noMargin card-form__field--flex card-form__field--cardNumber sign-up-second-step__field">
          <label className="form__label">Card Number</label>
          <div className="form__input-wrapper form__field--m24">
            <div className="form__input form__input--fsBig">
              <CardNumberElement
                options={{
                  showIcon: true,
                  placeholder: '1234 5678 9101 3333',
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
              <label className="form__label">Expiration Date</label>
              <div className="form__input-wrapper">
                <div className="form__input form__input--fsBig">
                  <CardExpiryElement
                    options={{
                      placeholder: '01 / 29',
                      style: {
                        base: {
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#000',
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
              <label className="form__label">CVV</label>
              <div className="form__input-wrapper">
                <div className="form__input form__input--fsBig">
                  <CardCvcElement
                    options={{
                      placeholder: '123',
                      style: {
                        base: {
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#000',
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
                inputComponent={MaskedTextInput}
                component={ClearableTextInput}
                validate={composeValidators<string>(required, postalCode)}
                inputClassName="form__input--fsBig"
              />
            </div>
          </div>
        </div>
      </>
    );
  }, []);

  return (
    <div className="sign-up-second-step__billing-info">
      <h3 className="sign-up-second-step__section-title sign-up-second-step__section-title--m30">
        Billing Information
      </h3>
      <Form
        onSubmit={onSubmit}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit }: FormRenderProps<CardFormValues>) => {
          return (
            <form className="sign-up-second-step__billing-info-form">
              <div className="card-form">
                {card && (
                  <UIButton
                    title={isCurrentCardFlow ? 'Attach New Card' : 'Use Current Card'}
                    handleClick={() => setIsCurrentCardFlow(!isCurrentCardFlow)}
                    priority="secondary"
                    className="billing__trial-attach-new-card-button"
                  />
                )}
                {isCurrentCardFlow ? showCurrentCardBlock() : showNewCardBlock()}
                <CouponDropDown
                  onUpdateCoupon={coupon => setAppliedCoupon(coupon)}
                  placeholder={'Coupon (Optional)'}
                  isOpen={isOpenCouponDropDown}
                  onSetOpen={handleSetOpenCouponDropDown}
                  buttonTitle={
                    appliedCoupon ? `-${appliedCoupon.percentOff}% added` : 'Apply now'
                  }
                />
                <div
                  className={classNames('sign-up-second-step__buttonWrapper', {
                    openDropDown: isOpenCouponDropDown,
                  })}
                >
                  <UIButton
                    title="Start My 7-day Free Trial"
                    priority="primary"
                    className="centered-text sign-up-second-step__button"
                    handleClick={handleSubmit}
                    isLoading={isGettingCard || isAttachingCard || isChangingPlan}
                    disabled={isGettingCard || isAttachingCard || isChangingPlan}
                  />
                  <div
                    className="billing__trial-continue-free-button"
                    onClick={navigateToBilling}
                  >
                    Continue with the Free Plan for Now
                  </div>
                </div>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};
