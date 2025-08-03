import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import AppSumoActiveScreen from '../AppSumoActiveScreen';
import BillingDefaultPlanScreen from '../BillingDefaultPlanScreen';
import { User } from 'Interfaces/User';
import LifeTimeDealScreen from '../LifeTimeDealScreen';

const BillingPlan = () => {
  const { appSumoStatus, ltdTierId }: User = useSelector(selectUser);

  if (appSumoStatus) {
    return <AppSumoActiveScreen />;
  }

  if (ltdTierId) {
    return <LifeTimeDealScreen />;
  }

  return <BillingDefaultPlanScreen />;
};

export default BillingPlan;
