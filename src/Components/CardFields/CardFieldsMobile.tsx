import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from 'Components/FormFields/FieldTextInput/FieldTextInput';
import { composeValidators } from 'Utils/functions';
import cardLogoIcons from 'Assets/images/cardLogoIcons';
import { MaskedTextInput } from 'Components/FormFields';
import {
  cardNumberMaskedProps,
  expirationMaskedProps,
  cvvMask,
  postalCodeMask,
} from 'Utils/formatters';
import {
  required,
  cardNumber,
  expirationDate,
  cvv,
  postalCode,
  name,
} from 'Utils/validation';
import ClearableTextInput from 'Components/FormFields/ClearableTextInput';
import UISpinner from 'Components/UIComponents/UISpinner';

interface CardFieldsProps {
  cardType?: string;
  isLoading?: boolean;
}

const CardFieldsMobile = ({ cardType, isLoading }: CardFieldsProps) => {
  const cardLogo = useMemo(() => cardType && cardLogoIcons[cardType], [cardType]);

  return (
    <div className="card-form">
      {isLoading ? (
        <UISpinner
          wrapperClassName="spinner--main__wrapper card-form__spinner"
          width={40}
          height={40}
        />
      ) : (
        <>
          <div className="card-form__group mobile">
            <div className="card-form__field card-form__field--flex card-form__field--cardNumber mobile">
              <Field
                name="number"
                placeholder="1234 5678 9101 1129"
                label="Card Number"
                {...cardNumberMaskedProps}
                icon={cardLogo}
                inputComponent={MaskedTextInput}
                component={ClearableTextInput}
                validate={composeValidators<string>(required, cardNumber)}
              />
            </div>
          </div>
          <div className="card-form__group mobile">
            <div className="card-form__field card-form__field--flex mobile">
              <Field
                name="cardholderName"
                placeholder="Your Name"
                label="Cardholder Name"
                component={FieldTextInput}
                validate={composeValidators<string>(required, name)}
              />
            </div>
          </div>
          <div className="card-form__group mobile">
            <div className="card-form__field card-form__field--postal mobile">
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
            <div className="card-form__field card-form__field--expiration mobile">
              <Field
                name="expirationDate"
                placeholder="01 / 2000"
                label="Expiration"
                {...expirationMaskedProps}
                component={MaskedTextInput}
                validate={composeValidators<string>(required, expirationDate)}
              />
            </div>
            <div className="card-form__field card-form__field--cvv mobile">
              <Field
                name="cvv"
                placeholder="123"
                label="CVV"
                mask={cvvMask}
                inputComponent={MaskedTextInput}
                component={ClearableTextInput}
                validate={composeValidators<string>(required, cvv)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardFieldsMobile;
