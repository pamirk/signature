import React, { useCallback, useState } from 'react';
import { useModal } from 'Hooks/Common';
import { LTDActivateCodeForm } from 'Components/LifeTimeDeal/LTDActivateCodeForm';
import RedeemCodeModal from 'Components/LifeTimeDeal/LTDActivateCodeForm/RedeemCodeModal';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { LtdTier } from 'Interfaces/Billing';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { useLtdCodeRedeem, useLtdCodeValidate } from 'Hooks/Billing';
import { isNotEmpty } from 'Utils/functions';
import Toast from 'Services/Toast';

const LifeTimeDealActivateCode = () => {
  const isMobile = useIsMobile();
  const [validateLtdCode, isValidateLtdCode] = useLtdCodeValidate();
  const [redeemLtdCode, isRedeemLtdCode] = useLtdCodeRedeem();

  const [ltdCode, setLtdCode] = useState<string>();
  const [tier, setTier] = useState<LtdTier>();

  const handleRedeemCode = useCallback(async () => {
    try {
      if (ltdCode) {
        await redeemLtdCode({ code: ltdCode });
        History.push(AuthorizedRoutePaths.SETTINGS_BILLING);
      }
    } catch (error) {
      return Toast.handleErrors(error);
    }
  }, [ltdCode, redeemLtdCode]);

  const [openRedeemCodeModal, closeRedeemCodeModal] = useModal(
    () => (
      <RedeemCodeModal
        tier={tier}
        onClose={closeRedeemCodeModal}
        onConfirm={handleRedeemCode}
        isLoading={isRedeemLtdCode}
      />
    ),
    [tier],
  );

  const handleCheckCode = useCallback(
    async values => {
      try {
        const response = await validateLtdCode({ code: values.code });

        if (!isNotEmpty(response)) {
          return Toast.error('Something went wrong. Please try again.');
        }

        setLtdCode(values.code);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setTier(response);
        openRedeemCodeModal();
      } catch (error) {
        return Toast.handleErrors(error);
      }
    },
    [openRedeemCodeModal, validateLtdCode],
  );

  return (
    <div className={classNames('lifeTimeDeal__common-container', { mobile: isMobile })}>
      <div className="auth">
        <h1 className="auth__title auth__title--bold">Activate your lifetime license</h1>
        <h5 className="auth__title">Enter the license key to redeem your license</h5>
        <LTDActivateCodeForm isLoading={isValidateLtdCode} onSubmit={handleCheckCode} />
      </div>
    </div>
  );
};

export default LifeTimeDealActivateCode;
