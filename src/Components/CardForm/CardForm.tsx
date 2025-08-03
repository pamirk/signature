import { useCardGet, useSetupCheckoutCreate } from 'Hooks/Billing';
import React, { useCallback, useEffect } from 'react';
import Toast from 'Services/Toast';
import UIButton from 'Components/UIComponents/UIButton';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectCardFormValues } from 'Utils/selectors';
import { isNotEmpty } from 'Utils/functions';
import { useNewTabOpen } from 'Hooks/Common';

export interface CardFormProps {
  cardType?: string;
  isNotHidden?: boolean;
  buttonText?: string;
  handleCardAttach?: (cardToken: string) => void;
  extraButtonRenderProps?: () => React.ReactNode;
  disableButton?: boolean;
}

const CardForm = ({ disableButton }: CardFormProps) => {
  const card = useSelector(selectCardFormValues);
  const [getCard, isGettingCard] = useCardGet();
  const [createCheckout, isCreatingCheckout] = useSetupCheckoutCreate();
  const [openNewTab] = useNewTabOpen();

  const handleCardGet = useCallback(async () => {
    try {
      await getCard(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCardGet();
  }, [handleCardGet]);

  const handleCardCreate = useCallback(async () => {
    try {
      const response = await createCheckout(undefined);

      if (isNotEmpty(response)) {
        openNewTab(response.checkoutUrl);
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [createCheckout, openNewTab]);

  return (
    <div className={classNames('creditCard__initial', { filled: !!card })}>
      <div className="creditCard__data">
        <div className="creditCard__data-title">Current Card:</div>
        {card ? (
          <div className="creditCard__data-requisite">
            <span>{card?.number}</span>
            <span>{card?.expirationDate}</span>
          </div>
        ) : (
          <div className="creditCard__data-requisite">
            <span>No attached card</span>
          </div>
        )}
      </div>
      {!disableButton && (
        <UIButton
          title="Attach Card"
          handleClick={handleCardCreate}
          priority="primary"
          isLoading={isGettingCard || isCreatingCheckout}
          disabled={isGettingCard || isCreatingCheckout}
        />
      )}
    </div>
  );
};

export default CardForm;
