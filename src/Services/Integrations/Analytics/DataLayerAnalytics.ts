/* eslint-disable */
import { dataLayerPlanNames, PlanChangePayload, PlanTypes } from 'Interfaces/Billing';


class DataLayerAnalytics {
  firePlanChangeEvent = (plan: PlanChangePayload) => {
    const planInfo = plan.type === PlanTypes.FREE? 'Select Free Plan' : dataLayerPlanNames[plan.type][plan.duration]?.title;

    //@ts-ignore
    // eslint-disable-next-line no-undef
    dataLayer.push({
      event: 'subscription',
      PricingPlanName: planInfo,
    })
  };
  fireUnconfirmedRegistrationEvent = () => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    dataLayer.push({
      event:'unconfirmedstatus', 
      CreateFreeAccount: 'Free Account Registration'
    });
  };

  fireAppSumoRegistrationEvent = () => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    dataLayer.push({
      event:'appsumoregistration',
      RegistrationAppSumo: 'AppSumoReg'
    });
  };

  fireConfirmedRegistrationEvent = () => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    dataLayer.push({
      event:'confirmedstatus', 
      ConfirmedAccount: 'Confirmed Account'
    });
  };

  fireGoogleRegistrationEvent = () => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    dataLayer.push({
      event:'confirmedstatus', 
      ConfirmedAccount: 'Confirmed Account (SIGN UP with GOOGLE)'
    });
  };
}

export default new DataLayerAnalytics();
