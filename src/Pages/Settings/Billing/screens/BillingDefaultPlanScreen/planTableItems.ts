import { PlanTypes, PlanDurations } from 'Interfaces/Billing';

export enum PlanFieldTypes {
  TEXT = 'text',
  BOOLEAN = 'boolean',
}

export const headerItems = {
  [PlanDurations.MONTHLY]: [
    {
      id: 'cfpg',
      header: 'Personal',
      title: 'Personal',
      type: PlanTypes.PERSONAL,
      duration: PlanDurations.MONTHLY,
      description: 'Best for individuals.',
    },
    {
      id: 'mqfm',
      header: 'Business',
      title: 'Business',
      type: PlanTypes.BUSINESS,
      duration: PlanDurations.MONTHLY,
      description: 'Best for businesses and teams.',
    },
  ],
  [PlanDurations.ANNUALLY]: [
    {
      id: 'mb66',
      header: 'Personal',
      title: 'Personal Annually',
      type: PlanTypes.PERSONAL,
      duration: PlanDurations.ANNUALLY,
      description: 'Best for individuals.',
    },
    {
      id: 'dbz2',
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
    personalValue: '5',
    businessValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: 'Templates',
    personalValue: '1',
    businessValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },

  {
    name: 'Google Drive Integration',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Dropbox Integration',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'One Drive Integration',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Box Integration',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Notifications and Reminders',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Audit Log and History',
    personalValue: true,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Team Management',
    personalValue: false,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Custom Business Branding',
    personalValue: false,
    businessValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
];
