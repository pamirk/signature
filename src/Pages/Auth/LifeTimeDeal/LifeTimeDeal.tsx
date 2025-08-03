import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldTextInput } from 'Components/FormFields';
import { Field, Form } from 'react-final-form';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { required, email } from 'Utils/validation';
import classNames from 'classnames';
import { LtdCheckoutResponse } from 'Interfaces/Billing';
import Toast from 'Services/Toast';
import History from 'Services/History';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { removeEmptyCharacters } from 'Utils/formatters';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { RouteChildrenProps } from 'react-router-dom';
import { ltdIdByNumberMap } from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import usePaypalOrderCapture from 'Hooks/Billing/usePaypalOrderCapture';
import { PaymentBlock } from 'Components/LifeTimeDeal/components';
import UIButton from 'Components/UIComponents/UIButton';
import { useLtdTierGet, usePaymentCheckoutCreate } from 'Hooks/Billing';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useSelector } from 'react-redux';
import { selectLtdTier } from 'Utils/selectors';
import TierSection from './components/TierSection';

const lifeTimeDealPathRegEx = /\/primeclub\/tier-([1-5])?$/g;

type tierNumberType = { tierNumber: string };

const LifeTimeDeal = ({ match }: RouteChildrenProps<tierNumberType>) => {
  const isMobile = useIsMobile();
  const [getLtdTier, isGettingLtdTier] = useLtdTierGet();
  const [
    createLtdPaymentCheckout,
    isCreatingLtdPaymentCheckout,
  ] = usePaymentCheckoutCreate();
  const [capturePaypalOrder] = usePaypalOrderCapture();

  const [checkoutResponse, setCheckoutResponse] = useState<LtdCheckoutResponse>();
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const currentLtd = useSelector(selectLtdTier);
  const tierNumber = match?.params.tierNumber;
  const ltdId = ltdIdByNumberMap.get(Number(tierNumber));

  const initialValues = useMemo(() => {
    const email = sessionStorage.getItem('ltd_email');
    sessionStorage.removeItem('ltd_email');
    return email
      ? {
          email,
        }
      : undefined;
  }, []);

  const handleOpenStripeCheckout = useCallback(async () => {
    if (checkoutResponse?.stripeCheckoutUrl)
      window.location.replace(checkoutResponse.stripeCheckoutUrl);
  }, [checkoutResponse]);

  const handleOpenPaypalCheckout = useCallback(async () => {
    if (checkoutResponse?.paypalOrderId) {
      await capturePaypalOrder({ orderId: checkoutResponse.paypalOrderId });
      History.push(`${UnauthorizedRoutePaths.LTD_PAYMENT_SUCCESS}?tierId=${ltdId}`);
    }
  }, [capturePaypalOrder, checkoutResponse, ltdId]);

  const handleSubmit = useCallback(
    async values => {
      try {
        if (showCheckoutButton) {
          setShowCheckoutButton(false);
        } else {
          const { email } = values;

          if (!ltdId) return;

          const response = await createLtdPaymentCheckout({
            email,
            ltdId,
            successUrl: `${window.location.origin}${UnauthorizedRoutePaths.LTD_PAYMENT_SUCCESS}?tierId=${ltdId}`,
            cancelUrl: `${window.location.href}?email=${email}`,
          });

          if (!isNotEmpty(response)) {
            return Toast.error('Something went wrong. Please try again.');
          }

          setCheckoutResponse(response);

          setShowCheckoutButton(true);
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [createLtdPaymentCheckout, ltdId, showCheckoutButton],
  );

  const handleGetLtdTier = useCallback(async () => {
    if (ltdId) {
      await getLtdTier({ ltdId });
    }
  }, [getLtdTier, ltdId]);

  useEffect(() => {
    handleGetLtdTier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tierNumber || !lifeTimeDealPathRegEx.test(History.location.pathname)) {
      return History.push(
        UnauthorizedRoutePaths.LIFE_TIME_DEAL_TIER.replace(':tierNumber', '1'),
      );
    }
  }, [tierNumber]);

  useEffect(() => {
    if (initialValues) {
      handleSubmit({ email: initialValues.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingLtdTier || !isNotEmpty(currentLtd)) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return (
    <div className="lifeTimeDeal">
      <div className={classNames('lifeTimeDeal__wrapper', { mobile: isMobile })}>
        <div className={classNames('lifeTimeDeal__content', { mobile: isMobile })}>
          <div className={classNames('lifeTimeDeal__content-left', { mobile: isMobile })}>
            <div className={classNames('label', { mobile: isMobile })}>
              <div className="label-title">Get Signaturely Business Lifetime Access</div>
              <div className="label-description">
                By purchasing a Signaturely Lifetime Deal, you gain permanent access to an
                exceptional signature tool. This allows you to effortlessly create,
                manage, and store digital signatures, enhancing the efficiency and
                security of your document workflows. Signaturely&apos;s user-friendly
                platform provides a seamless experience, making it simpler than ever to
                sign documents online and automate your signing processes. Secure your
                lifetime access now and streamline your document management with
                Signaturely&apos;s reliable and advanced signature solution.
              </div>
            </div>
            <Form
              onSubmit={handleSubmit}
              initialValues={initialValues}
              render={({ handleSubmit, submitting }) => (
                <form className={classNames('credentials', { mobile: isMobile })}>
                  <div
                    className={classNames(
                      'credentials__container',
                      'lifeTimeDeal__fields-wrapper',
                    )}
                  >
                    <div className="credentials__label">Your information</div>
                    <div className="credentials-personal__items">
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
                          disabled={showCheckoutButton}
                          onKeyDown={event => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              handleSubmit();
                            }
                          }}
                        />
                      </div>
                      <UIButton
                        className={classNames('lifeTimeDeal__button', {
                          mobile: isMobile,
                        })}
                        handleClick={handleSubmit}
                        priority="primary"
                        title={showCheckoutButton ? 'Change Email' : 'Submit Email'}
                        disabled={
                          submitting || isGettingLtdTier || isCreatingLtdPaymentCheckout
                        }
                        isLoading={isGettingLtdTier || isCreatingLtdPaymentCheckout}
                      />
                    </div>
                  </div>
                  {showCheckoutButton && checkoutResponse && (
                    <div
                      className={classNames(
                        'credentials__container',
                        'lifeTimeDeal__common-button__checkout-wrapper',
                      )}
                    >
                      <PaymentBlock
                        openStripeCheckout={handleOpenStripeCheckout}
                        createPaypalOrder={() => checkoutResponse.paypalOrderId}
                        approvePaypalPayment={handleOpenPaypalCheckout}
                        submitting={submitting}
                      />
                    </div>
                  )}
                </form>
              )}
            />
          </div>
          <div className="lifeTimeDeal__divisor" />
          <TierSection tier={currentLtd} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

export default LifeTimeDeal;
