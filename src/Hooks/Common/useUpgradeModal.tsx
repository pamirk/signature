import React from 'react';
import { useSelector } from 'react-redux';
import { useModal } from './index';
import { TemplateUpgradeModal } from 'Components/UpgradeModal';
import { selectUserPlan } from 'Utils/selectors';

export default () => {
  const userPlan = useSelector(selectUserPlan);

  const [openUpgradeModal, closeUpgradeModal] = useModal(
    () => <TemplateUpgradeModal onClose={closeUpgradeModal} />,
    [userPlan],
  );

  return [openUpgradeModal, closeUpgradeModal];
};
