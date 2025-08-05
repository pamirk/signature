import UISpinner from 'Components/UIComponents/UISpinner';
import { useCardGet } from 'Hooks/Billing';
import {
  ApiPlan,
  AppSumoStatus,
  CreateSubscriptionCheckoutPayload,
  GetUpcomingInvoicePayload,
  LtdTypes,
  Plan,
  PlanTypes,
} from 'Interfaces/Billing';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'Services/Toast';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';
import { selectCardFormValues, selectLtdTier, selectUser } from 'Utils/selectors';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { Field } from 'react-final-form';
import { FieldTextInput, MaskedTextInput } from 'Components/FormFields';
import { name, postalCode, required } from 'Utils/validation';
import { postalCodeMask } from 'Utils/formatters';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
// import { User } from '@sentry/react';

interface UpcomingInvoiceProps {
  targetPlan: Plan | ApiPlan;
  sourcePlan: Plan | ApiPlan;
  couponId?: string;
  onCouponAdd?: () => void;
  onCouponClear?: () => void;
  onGetInvoice?: (param: any) => void;
  getUpcomingInvoice: (
    params: CreateSubscriptionCheckoutPayload,
  ) => Promise<{} | GetUpcomingInvoicePayload>;
  isLoadingUpcomingInvoice: boolean;
  isApiPlan?: boolean;
}

const UpcomingInvoice = ({
  targetPlan,
  couponId,
  onCouponAdd,
  onCouponClear,
  onGetInvoice,
  getUpcomingInvoice,
  isLoadingUpcomingInvoice,
  isApiPlan = false,
}: UpcomingInvoiceProps) => {
  const [getCard] = useCardGet();
  const [upcomingInvoice, setUpcomingInvoice] = useState<any>(undefined);
  const card = useSelector(selectCardFormValues);
  const ltdTier = useSelector(selectLtdTier);
  const user: any = useSelector(selectUser);
  const isMobile = useIsMobile();

  const ltdType = useMemo(() => {
    if (isNotEmpty(ltdTier)) return LtdTypes.TIER;
    if (user.appSumoStatus === AppSumoStatus.STANDARD) return LtdTypes.APPSUMO;

    return LtdTypes.NONE;
  }, [ltdTier, user.appSumoStatus]);

  const handleUpcomingInvoiceGet = useCallback(async () => {
    try {
      const invoice = await getUpcomingInvoice({
        ...targetPlan,
        couponId,
      });

      if (isNotEmpty(invoice)) {
        setUpcomingInvoice(invoice);
        onGetInvoice && onGetInvoice(invoice);
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [couponId, getUpcomingInvoice, onGetInvoice, targetPlan]);

  useEffect(() => {
    handleUpcomingInvoiceGet();
    !card && getCard(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponId, targetPlan]);

  if (targetPlan.type === PlanTypes.FREE) {
    return null;
  }

  return (
    <div className="upcomingInvoice">
      {isLoadingUpcomingInvoice || !upcomingInvoice ? (
        <UISpinner />
      ) : (
        <div className="upcomingInvoice__container">
          <div className="upcomingInvoice__tax">
            <div className="upcomingInvoice__tax-price">
              <div>
                <span className="upcomingInvoice__plan-type">
                  {capitalize(targetPlan.type)}
                </span>
              </div>
              <div className="upcomingInvoice__plan-amount">
                ${upcomingInvoice.amount.toFixed(2)} USD
              </div>
            </div>
            <div className="upcomingInvoice__plan-duration">
              ({capitalize(targetPlan.duration)})
            </div>
            {(isApiPlan || ltdType === LtdTypes.NONE) && (
              <div className="upcomingInvoice__tax-coupon">
                <span onClick={onCouponAdd}>
                  {couponId ? 'Coupon applied' : 'Add coupon'}
                </span>
                {couponId && <span onClick={onCouponClear}>Remove</span>}
              </div>
            )}
            <div
              className={classNames('upcomingInvoice__tax-quantity', {
                mobile: isMobile,
              })}
            >
              <div>
                <span className="upcomingInvoice__plan-quantity">{`${
                  upcomingInvoice.quantity
                } ${capitalize(targetPlan.type)} User${
                  upcomingInvoice.quantity > 1 ? 's' : ''
                }`}</span>
                &nbsp;
                {targetPlan.type === PlanTypes.BUSINESS && (
                  <span className="upcomingInvoice__plan-assigned">
                    ({upcomingInvoice.quantity} assigned)
                  </span>
                )}
              </div>
              <div className="upcomingInvoice__plan-amount">
                ${(upcomingInvoice.amount * upcomingInvoice.quantity).toFixed(2)} USD
              </div>
            </div>
            {!!upcomingInvoice.discount && (
              <div className="upcomingInvoice__tax-discount">
                <div className="upcomingInvoice__discount-percent">
                  {upcomingInvoice.discount.toFixed(2)}% Off Discount
                </div>
                <div className="upcomingInvoice__discount-amount">
                  -$
                  {(
                    (upcomingInvoice.discount *
                      upcomingInvoice.amount *
                      upcomingInvoice.quantity) /
                    100
                  ).toFixed(2)}
                  &nbsp;USD
                </div>
              </div>
            )}
            {!!upcomingInvoice.unusedTime && (
              <div className="upcomingInvoice__tax-credit">
                <div>${upcomingInvoice.unusedTime} Credit</div>
                <div className="upcomingInvoice__discount-amount">
                  -${upcomingInvoice.unusedTime} USD
                </div>
              </div>
            )}
          </div>
          <div className="upcomingInvoice__footer">
            <div className="upcomingInvoice__total">
              <div className="upcomingInvoice__total-title">Total</div>
              <div className="upcomingInvoice__total-amount">
                ${Number(Math.max(upcomingInvoice.total, 0)).toFixed(2)} USD
              </div>
            </div>
            <div className="upcomingInvoice__card-details">
              <p className="upcomingInvoice__card-details title">Card Details</p>
              {!card ? (
                <div className="card-form">
                  <div className={`card-form__group${isMobile ? '-mobile' : ''}`}>
                    <div className="card-form__field card-form__field--flex card-form__field--cardNumber">
                      <label className="form__label">Card Number</label>
                      <div className="form__input-wrapper">
                        <div className="form__input">
                          <CardNumberElement
                            options={{
                              showIcon: true,
                              placeholder: '1234 5678 9101 1129',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`card-form__sub-group${isMobile ? '-mobile' : ''}`}>
                      <div className="card-form__field card-form__field--expiration">
                        <label className="form__label">Expiration</label>
                        <div className="form__input-wrapper">
                          <div className="form__input">
                            <CardExpiryElement
                              options={{
                                placeholder: '01 / 29',
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
                    <div className="card-form__field card-form__field--flex">
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
              ) : (
                <>
                  <div className="upcomingInvoice__card-details card_number_text">
                    {card.number}
                  </div>
                  <div className="upcomingInvoice__card-details card_expires_text">
                    Expires {card.expirationDate}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingInvoice;
