import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import usePromotionCodeValidate from 'Hooks/Billing/usePromotionCodeValidate';
import { CodeInput } from '.';
import { isNotEmpty } from 'Utils/functions';
import Toast from 'Services/Toast';
import { ApiPlan, Coupon, Plan } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { AuthStatuses } from 'Interfaces/Auth';

enum PromoCodeStatuses {
  VALID = 'valid',
  INVALID = 'invalid',
}

interface PromoCodeFieldProps {
  plan: Plan | ApiPlan;
  onUpdateCoupon?: (coupon?: Coupon) => void;
  isDisabledWasteText?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  buttonTitle?: string;
  inputText?: string;
  setInputText?: (text: string) => void;
  placeholder?: string;
}

const PromoCodeField = ({
  plan,
  onUpdateCoupon,
  isDisabledWasteText = false,
  className,
  inputClassName,
  buttonClassName,
  buttonTitle,
  inputText,
  setInputText,
  placeholder,
}: PromoCodeFieldProps) => {
  const currentUser: User = useSelector(selectUser);
  const [promotionCode, setPromotionCode] = useState<string>(inputText || '');
  const [promoCodeStatus, setPromoCodeStatus] = useState<PromoCodeStatuses | undefined>();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const [validatePromotionCode, isPromotionCodeValidating] = usePromotionCodeValidate();

  const handleApplyCoupon = useCallback(
    (coupon?: Coupon) => {
      setAppliedCoupon(coupon);
      onUpdateCoupon && onUpdateCoupon(coupon);
    },
    [onUpdateCoupon],
  );

  const handleValidatePromotionCode = useCallback(
    async code => {
      try {
        handleApplyCoupon();
        const coupon = await validatePromotionCode({
          code,
          plan,
          authorized: currentUser?.authStatus === AuthStatuses.AUTHORIZED,
        });

        if (!isNotEmpty(coupon)) {
          return setPromoCodeStatus(PromoCodeStatuses.INVALID);
        }

        handleApplyCoupon(coupon);
        return setPromoCodeStatus(PromoCodeStatuses.VALID);
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [currentUser, handleApplyCoupon, plan, validatePromotionCode],
  );

  const handleSetPromotionCode = useCallback(
    text => {
      setPromotionCode(text);
      if (setInputText) {
        setInputText(text);
      }
    },
    [setInputText],
  );

  return (
    <div className={classNames('billing__plan-modal-promocode-container', className)}>
      {!isDisabledWasteText && (
        <div className={classNames('billing__plan-modal-promocode')}>
          <span>Please enter a coupon</span>
        </div>
      )}
      <div className={classNames('billing__plan-modal-input')}>
        <CodeInput
          onUpgrade={handleValidatePromotionCode}
          buttonTitle={buttonTitle ? buttonTitle : 'Apply'}
          value={promotionCode}
          onChange={handleSetPromotionCode}
          succeeded={promoCodeStatus === 'valid'}
          failure={promoCodeStatus === 'invalid'}
          placeholder={placeholder ? placeholder : 'Enter coupon code'}
          isLoading={isPromotionCodeValidating}
          inputClassName={inputClassName}
          buttonClassName={buttonClassName}
        />
      </div>
      {!isDisabledWasteText &&
        promoCodeStatus === PromoCodeStatuses.VALID &&
        appliedCoupon && (
          <div className="billing__plan-modal-status succeeded">
            Coupon code applied successfully. You got{' '}
            {appliedCoupon.percentOff.toFixed(2)}% off your plan. Enjoy!
          </div>
        )}
      {!isDisabledWasteText && promoCodeStatus === PromoCodeStatuses.INVALID && (
        <div className="billing__plan-modal-status failure">Invalid coupon code</div>
      )}
    </div>
  );
};

export default PromoCodeField;
