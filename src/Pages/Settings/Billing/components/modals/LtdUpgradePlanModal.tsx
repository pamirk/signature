import { LtdPlanChangeModal } from 'Components/PlanChangeModal';
import { useLtdPlanDurationChange, useSubscriptionDataGet } from 'Hooks/Billing';
import { Plan, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { selectCardFormValues, selectUser, selectUserPlan } from 'Utils/selectors';
import { headerItems } from '../../screens/BillingDefaultPlanScreen/planTableItems';

interface LtdUpgradePlanModalProps {
  onClose: () => void;
  addTeamMembers?: () => void;
  isUpgradingPlan?: boolean;
  quantity?: number;
}

const LtdUpgradePlanModal = ({
  onClose,
  addTeamMembers,
  isUpgradingPlan = false,
  quantity,
}: LtdUpgradePlanModalProps) => {
  const user: User = useSelector(selectUser);
  const cardInitialValues = useSelector(selectCardFormValues);
  const userPlan = useSelector(selectUserPlan);
  const [getSubscriptionData] = useSubscriptionDataGet();

  const [
    changeLtdPlanDuration,
    isChangeLtdPlanDurationLoading,
  ] = useLtdPlanDurationChange();

  const [planToChange, setPlanToUpgrade] = useState<Plan>({
    type: PlanTypes.BUSINESS,
    duration: isUpgradingPlan ? PlanDurations.ANNUALLY : PlanDurations.MONTHLY,
    title: 'Business',
    quantity,
  });
  const [selectedPlanDuration, setSelectedPlanDuration] = useState(
    isUpgradingPlan ? PlanDurations.ANNUALLY : PlanDurations.MONTHLY,
  );

  const handleChangePlan = useCallback(async () => {
    try {
      if (userPlan.duration !== selectedPlanDuration) {
        await changeLtdPlanDuration({ duration: selectedPlanDuration });
      }

      if (addTeamMembers) addTeamMembers();

      if (isUpgradingPlan) {
        Toast.success('Plan has been successfully changed.');
      }

      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addTeamMembers,
    changeLtdPlanDuration,
    isUpgradingPlan,
    selectedPlanDuration,
    userPlan.duration,
  ]);

  const handlePlanDurationChange = useCallback(
    (duration: PlanDurations) => {
      const newPlan = headerItems[duration].find(plan => plan.type === planToChange.type);

      if (!newPlan) return;

      setSelectedPlanDuration(duration);
      setPlanToUpgrade({
        duration: newPlan.duration,
        id: newPlan.id,
        title: newPlan.title,
        type: newPlan.type,
        quantity: planToChange.quantity,
      });
    },
    [planToChange],
  );

  return (
    <LtdPlanChangeModal
      onChangePlan={handleChangePlan}
      targetPlan={planToChange}
      sourcePlan={user.plan}
      onClose={onClose}
      onSelectedDurationChange={handlePlanDurationChange}
      cardInitialValues={cardInitialValues}
      isLoading={isChangeLtdPlanDurationLoading}
      isUpgradingPlan={isUpgradingPlan}
    />
  );
};

export default LtdUpgradePlanModal;
