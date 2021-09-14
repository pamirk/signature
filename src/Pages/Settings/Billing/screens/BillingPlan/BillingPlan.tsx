import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import AppSumoActiveScreen from '../AppSumoActiveScreen';
import BillingDefaultPlanScreen from '../BillingDefaultPlanScreen';
import { User } from 'Interfaces/User';

const BillingPlan = () => {
  const { appSumoStatus }: User = useSelector(selectUser);

  if (appSumoStatus) {
    return <AppSumoActiveScreen />;
  }

  return <BillingDefaultPlanScreen />;
};

export default BillingPlan;
