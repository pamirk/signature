import { PlanTypes, PlanDurations } from 'Interfaces/Billing';

export enum PlanFieldTypes {
  TEXT = 'text',
  BOOLEAN = 'boolean',
}

export const headerItems = {
  [PlanDurations.MONTHLY]: [
    {
      header: 'Free',
      title: 'Free',
      type: PlanTypes.FREE,
      duration: PlanDurations.MONTHLY,
      description: 'Get up to 3 documents per month signed for free.',
    },
    {
      header: 'Personal',
      title: 'Personal',
      type: PlanTypes.PERSONAL,
      duration: PlanDurations.MONTHLY,
      description: 'Best for individuals.',
    },
    {
      header: 'Business',
      title: 'Business',
      type: PlanTypes.BUSINESS,
      duration: PlanDurations.MONTHLY,
      description: 'Best for businesses and teams.',
    },
  ],
  [PlanDurations.ANNUALLY]: [
    {
      header: 'Free',
      title: 'Free',
      type: PlanTypes.FREE,
      duration: PlanDurations.ANNUALLY,
      description: 'Get up to 3 documents per month signed for free.',
    },
    {
      header: 'Personal',
      title: 'Personal Annually',
      type: PlanTypes.PERSONAL,
      duration: PlanDurations.ANNUALLY,
      description: 'Best for individuals.',
    },
    {
      header: 'Business',
      title: 'Business Annually',
      type: PlanTypes.BUSINESS,
      duration: PlanDurations.ANNUALLY,
      description: 'Best for businesses and teams.',
    },
  ],
};

export const planInformationItems = [
  {
    name: 'Documents per month',
    freeValue: '3',
    personalValue: 'Unlimited',
    businessValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: 'Templates',
    freeValue: '0',
    personalValue: '1',
    businessValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },

  {
    name: 'Google Drive Integration',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Dropbox Integration',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'One Drive Integration',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Box Integration',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Notifications and Reminders',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Audit Log and History',
    freeValue: true,
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Team Management',
    freeValue: false,
    personalValue: false,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Custom Business Branding',
    freeValue: false,
    personalValue: false,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
];

export const planMonthlyInformationItems = [
  {
    name: 'Plan Cost',
    freeValue: 'Free',
    personalValue: '$20 / month',
    businessValue: '$30 per user / month',
    type: PlanFieldTypes.TEXT,
  },
  ...planInformationItems,
];

export const planAnnuallyInformationItems = [
  {
    name: 'Plan Cost',
    freeValue: 'Free',
    personalValue: '$16 / month',
    businessValue: '$24 per user / month',
    type: PlanFieldTypes.TEXT,
  },
  ...planInformationItems,
];
