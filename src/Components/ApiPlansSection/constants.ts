import { ApiPlanTypes, PlanDurations, ApiPlanItem } from 'Interfaces/Billing';

type ApiPlanItemCollection = {
  [key in PlanDurations]: ApiPlanItem[];
};

export const apiPlanPriorityByDuration = {
  [PlanDurations.MONTHLY]: {
    [ApiPlanTypes.GOLD]: 1,
    [ApiPlanTypes.PLATINUM]: 2,
    [ApiPlanTypes.TITANIUM]: 3,
  },
  [PlanDurations.ANNUALLY]: {
    [ApiPlanTypes.GOLD]: 4,
    [ApiPlanTypes.PLATINUM]: 5,
    [ApiPlanTypes.TITANIUM]: 6,
  },
  [PlanDurations.FOREVER]: {
    [ApiPlanTypes.TITANIUM]: 7,
  },
};

// Initial api plan prices
export const apiPlanPrices = {
  [ApiPlanTypes.GOLD]: {
    [PlanDurations.MONTHLY]: 49,
    [PlanDurations.ANNUALLY]: 470,
  },
  [ApiPlanTypes.PLATINUM]: {
    [PlanDurations.MONTHLY]: 99,
    [PlanDurations.ANNUALLY]: 950,
  },
  [ApiPlanTypes.TITANIUM]: {
    [PlanDurations.MONTHLY]: 199,
    [PlanDurations.ANNUALLY]: 1910,
  },
};

export const apiPlanItems: ApiPlanItemCollection = {
  [PlanDurations.MONTHLY]: [
    {
      header: 'Gold',
      title: 'Gold',
      price: `$${apiPlanPrices[ApiPlanTypes.GOLD][PlanDurations.MONTHLY]}`,
      type: ApiPlanTypes.GOLD,
      duration: PlanDurations.MONTHLY,
      content: ['50 API Signature Requests per month', '5 Templates'],
    },
    {
      header: 'Platinum',
      title: 'Platinum',
      price: `$${apiPlanPrices[ApiPlanTypes.PLATINUM][PlanDurations.MONTHLY]}`,
      type: ApiPlanTypes.PLATINUM,
      duration: PlanDurations.MONTHLY,
      content: ['150 API Signature Requests per month', '25 Templates'],
    },
    {
      header: 'Titanium',
      title: 'Titanium',
      price: `$${apiPlanPrices[ApiPlanTypes.TITANIUM][PlanDurations.MONTHLY]}`,
      type: ApiPlanTypes.TITANIUM,
      duration: PlanDurations.MONTHLY,
      content: ['500 API Signature Requests per month', 'Unlimited Templates'],
    },
  ],
  [PlanDurations.ANNUALLY]: [
    {
      header: 'Gold',
      title: 'Gold Annually',
      price: `$${apiPlanPrices[ApiPlanTypes.GOLD][PlanDurations.ANNUALLY]}`,
      type: ApiPlanTypes.GOLD,
      duration: PlanDurations.ANNUALLY,
      content: ['50 API Signature Requests per month', '5 Templates'],
    },
    {
      header: 'Platinum',
      title: 'Platinum Annually',
      price: `$${apiPlanPrices[ApiPlanTypes.PLATINUM][PlanDurations.ANNUALLY]}`,
      type: ApiPlanTypes.PLATINUM,
      duration: PlanDurations.ANNUALLY,
      content: ['150 API Signature Requests per month', '25 Templates'],
    },
    {
      header: 'Titanium',
      title: 'Titanium Annually',
      price: `$${apiPlanPrices[ApiPlanTypes.TITANIUM][PlanDurations.ANNUALLY]}`,
      type: ApiPlanTypes.TITANIUM,
      duration: PlanDurations.ANNUALLY,
      content: ['500 API Signature Requests per month', 'Unlimited Templates'],
    },
  ],
  [PlanDurations.FOREVER]: [],
};

export const nonPayedPlansDescription = {
  [ApiPlanTypes.FREE]:
    'Currently you are on the Free plan that includes free test API Calls. Need real API Signature Requests? Please upgrade to one of the plans above',
  [ApiPlanTypes.APPSUMO_STANDARD]:
    'Currently you are in the AppSumo Standard plan that includes up to 25 API requests per month. Want more? You can upgrade at one of the plans above.',
  [ApiPlanTypes.APPSUMO_FULL]:
    'Currently you are in the AppSumo Full plan that includes up to 50 API requests per month. Want more? You can upgrade at one of the plans above.',
};
