import React, { useCallback, useState } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import SelectIcon from 'Assets/images/icons/select-arrow-icon.svg';
import { Coupon, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { PromoCodeField } from 'Pages/Settings/Billing/components';

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

export interface CouponDropDownProps {
  placeholder: string;
  disabled?: boolean;
  onUpdateCoupon: (coupon?: Coupon) => void;
  isOpen: boolean;
  onSetOpen: (state: boolean) => void;
  buttonTitle?: string;
}

function CouponDropDown({
  placeholder,
  disabled = false,
  onUpdateCoupon,
  isOpen,
  onSetOpen,
  buttonTitle,
}: CouponDropDownProps) {
  const [inputText, setInputText] = useState<string>('');
  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      onSetOpen(false);
    } else {
      onSetOpen(true);
    }
  }, [disabled, isOpen, onSetOpen]);

  return (
    <div className="sign-up-second-step__couponDropDown__wrapper">
      <div
        className={classNames('sign-up-second-step__couponDropDown__select', {
          'sign-up-second-step__couponDropDown__select--open': isOpen,
          'sign-up-second-step__couponDropDown__select--disabled': disabled,
        })}
        onClick={toggleDropdown}
      >
        <div className={'sign-up-second-step__couponDropDown__select-inner'}>
          <p className="sign-up-second-step__couponDropDown__select-placeholder">
            {placeholder}
          </p>
        </div>
        <ReactSVG
          src={SelectIcon}
          className="sign-up-second-step__couponDropDown__select-arrow"
        />
      </div>
      {isOpen && (
        <div
          className={classNames('sign-up-second-step__couponDropDown__content-wrapper')}
        >
          <PromoCodeField
            plan={{
              type: PlanTypes.BUSINESS,
              duration: PlanDurations.MONTHLY,
              title: planTitles[PlanTypes.BUSINESS][PlanDurations.MONTHLY],
            }}
            onUpdateCoupon={onUpdateCoupon}
            isDisabledWasteText={true}
            className={'sign-up-second-step__coupon wrapper'}
            inputClassName={'sign-up-second-step__coupon input'}
            buttonClassName={'sign-up-second-step__coupon button'}
            buttonTitle={buttonTitle ? buttonTitle : 'Apply now'}
            inputText={inputText}
            setInputText={setInputText}
            placeholder={'Type coupon'}
          />
        </div>
      )}
    </div>
  );
}

export default CouponDropDown;
