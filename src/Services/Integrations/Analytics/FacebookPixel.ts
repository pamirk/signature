import { PlanChangePayload, planTerms } from 'Interfaces/Billing';
import { GOOGLE_PIXEL_ID } from 'Utils/constants';
import { AnalyticsEventsProvider } from './interfaces';

class FacebookPixel implements AnalyticsEventsProvider {
  constructor() {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    //fbq('init', GOOGLE_PIXEL_ID);
  }

  fireRegistrationEvent = () => {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    //fbq('track', 'CompleteRegistration');
  };

  firePlanChangeEvent = (plan: PlanChangePayload) => {
    const planTerm = planTerms[plan.type][plan.duration];
    //@ts-ignore
    // eslint-disable-next-line no-undef
    // fbq('track', 'Subscribe', {
    //   value: `${(planTerm.cost as number).toPrecision(2)}`,
    //   currency: 'USD',
    //   predicted_ltv: '0.00',
    // });
  };
}

export default new FacebookPixel();
