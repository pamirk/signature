import React from 'react';
import { BillingInfo, PlanSection, TrialInfo, PostBillingInfo } from './components';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';

export const SecondStepInfo = () => {
  const { showTrialStep } = useSelector(selectUser);
  return (
    <section className="sign-up-second-step__info-wrapper">
      <PlanSection />
      {showTrialStep ? <BillingInfo /> : <PostBillingInfo />}
      <TrialInfo />
    </section>
  );
};
