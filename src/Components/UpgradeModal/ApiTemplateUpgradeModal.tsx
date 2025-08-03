import React, { useCallback } from 'react';
import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import { ApiPlanTypes } from 'Interfaces/Billing';
import { useSelector } from 'react-redux';
import { selectApiPlan, selectLtdTier } from 'Utils/selectors';
import UpgradeModal from './UpgradeModal';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { isNotEmpty } from 'Utils/functions';

const ApiTemplateUpgradeModal = ({ onClose }: BaseModalProps) => {
  const { type: planType, templateLimit, name: planName } = useSelector(selectApiPlan);
  const handleUpgradeClick = useCallback(() => {
    History.push(`${AuthorizedRoutePaths.SETTINGS_API}#api-billing__title`);
  }, []);
  const ltdTier = useSelector(selectLtdTier);

  return (
    <UpgradeModal
      title="Please upgrade API plan to create more templates."
      onClose={onClose}
      onUpgradeClick={handleUpgradeClick}
    >
      {planType === ApiPlanTypes.FREE ? (
        <>
          You&apos;re on the free API plan which includes only one template.
          <br />
          Please click below to upgrade your account to access more templates.
        </>
      ) : (
        <>
          You&apos;re on {planName} which includes only{' '}
          {templateLimit +
            (isNotEmpty(ltdTier) && planType !== ApiPlanTypes.LTD_API_PLAN
              ? ltdTier?.apiPlan?.templateLimit
              : 0)}{' '}
          templates.
          <br />
          Please click below to upgrade your account to access more templates.
        </>
      )}
    </UpgradeModal>
  );
};

export default ApiTemplateUpgradeModal;
