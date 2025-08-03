import React from 'react';
import { useSelector } from 'react-redux';
import { selectApiPlan } from 'Utils/selectors';
import { useModal } from './index';
import ApiTemplateUpgradeModal from 'Components/UpgradeModal/ApiTemplateUpgradeModal';

export default () => {
  const apiPlan = useSelector(selectApiPlan);

  const [openApiUpgradeModal, closeApiUpgradeModal] = useModal(
    () => <ApiTemplateUpgradeModal onClose={closeApiUpgradeModal} />,
    [apiPlan],
  );

  return [openApiUpgradeModal, closeApiUpgradeModal];
};
