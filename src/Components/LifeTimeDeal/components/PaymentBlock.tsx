import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';

declare let paypal: any;
const PaypalButton = paypal.Buttons.driver('react', { React, ReactDOM });

interface PaymentBlockProps {
  openStripeCheckout: () => void;
  createPaypalOrder: () => void;
  approvePaypalPayment: (data, actions) => void;
  paymentButtonText?: string;
  footerContainerClassName?: string;
  policyClassName?: string;
  submitting?: boolean;
}

const PaymenBlock = ({
  openStripeCheckout,
  createPaypalOrder,
  approvePaypalPayment,
  paymentButtonText = 'Buy with Credit Card',
  footerContainerClassName,
  policyClassName,
  submitting,
}: PaymentBlockProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={classNames('lifeTimeDeal__footer', footerContainerClassName)}>
      <UIButton
        className={classNames('lifeTimeDeal__button', {
          mobile: isMobile,
        })}
        handleClick={openStripeCheckout}
        priority="primary"
        title={paymentButtonText}
        disabled={submitting}
        isLoading={submitting}
      />
      <div className="common__or lifeTimeDeal__or-divisor">OR</div>

      <PaypalButton
        style={{ shape: 'pill', width: '100%', outerHeight: '42px' }}
        createOrder={createPaypalOrder}
        onApprove={approvePaypalPayment}
      />

      <div className={classNames(policyClassName)}>
        <div
          className={classNames('lifeTimeDeal__footer-policy', {
            mobile: isMobile,
          })}
        >
          By clicking the &quot;{paymentButtonText}&quot; button or PayPal checkout
          button, I agree to the&nbsp;
          <a
            className="lifeTimeDeal__footer-link"
            href="https://signaturely.com/terms/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Terms of Use</span>,&nbsp;
          </a>
          <a
            className="lifeTimeDeal__footer-link"
            href="https://signaturely.com/electronic-signature-disclosure-and-consent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Electronic Signature Disclosure and Consent</span>
          </a>
          &nbsp;and&nbsp;
          <a
            className="lifeTimeDeal__footer-link"
            href="https://signaturely.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Privacy Policy</span>.
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymenBlock;
