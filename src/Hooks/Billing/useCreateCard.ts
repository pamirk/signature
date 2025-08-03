import { useCallback } from 'react';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { CardFormValues } from 'Interfaces/Billing';

export default () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCardCreate = useCallback(
    async (billingDetails?: CardFormValues): Promise<string | undefined> => {
      if (!elements || !stripe) {
        return;
      }

      const cardNumber = elements.getElement('cardNumber');

      if (!cardNumber) {
        return;
      }

      const response = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          address: {
            postal_code: billingDetails?.postalCode,
          },
          name: billingDetails?.cardholderName,
        },
      });

      if (response.paymentMethod) {
        return response.paymentMethod.id;
      } else {
        throw response.error;
      }
    },
    [elements, stripe],
  );

  return handleCardCreate;
};
