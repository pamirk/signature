import React, { useCallback, useState } from 'react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { FieldTextInput, MaskedTextInput } from 'Components/FormFields';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { postalCodeMask } from 'Utils/formatters';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
import { composeValidators } from 'Utils/functions';
import { postalCode, required, name } from 'Utils/validation';
import arrayMutators from 'final-form-arrays';
import UIButton from 'Components/UIComponents/UIButton';
import { CardFormValues, Coupon, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { useCardAttach, useCreateCard, usePlanChange } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import CouponDropDown from './CouponDropDown';
import classNames from 'classnames';

interface FormValues extends CardFormValues {
  address: string;
  city: string;
  state: string;
}

export const BillingInfo = () => {
  const createCard = useCreateCard();
  const [attachCard, isAttachingCard] = useCardAttach();
  const [changePlan, isChangingPlan] = usePlanChange();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const [isOpenCouponDropDown, setOpenCouponDropDown] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const token = await createCard(values);
        token && (await attachCard(token));

        Toast.success('Card attached');

        await changePlan({
          type: PlanTypes.BUSINESS,
          duration: PlanDurations.MONTHLY,
          couponId: appliedCoupon && appliedCoupon.id,
          trial: true,
        });

        Toast.success('Your trial period has started');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [appliedCoupon, attachCard, changePlan, createCard],
  );

  const handleSetOpenCouponDropDown = useCallback((state: boolean) => {
    setOpenCouponDropDown(state);
  }, []);

  return (
    <div className="sign-up-second-step__billing-info">
      <h3 className="sign-up-second-step__section-title sign-up-second-step__section-title--m30">
        Billing Information
      </h3>
      <Form
        onSubmit={onSubmit}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit }: FormRenderProps<FormValues>) => {
          return (
            <form className="sign-up-second-step__billing-info-form">
              <div className="card-form">
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
                    isLoading={isAttachingCard || isChangingPlan}
                    disabled={isAttachingCard || isChangingPlan}
                  />
                </div>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};
