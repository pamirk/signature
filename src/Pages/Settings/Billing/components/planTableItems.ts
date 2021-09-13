export enum PlanFieldTypes {
  TEXT = 'text',
  BOOLEAN = 'boolean',
}

export const planInformationItems = [
  {
    name: 'Users',
    oneCodeValue: '3',
    twoCodeValue: 'Unlimited Users',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: 'Signature Requests',
    oneCodeValue: 'Unlimited',
    twoCodeValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: 'Templates',
    oneCodeValue: 'Unlimited',
    twoCodeValue: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },

  {
    name: 'Google Drive Integration',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Dropbox Integration',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'One Drive Integration',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Box Integration',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Notifications and Reminders',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Audit Log and History',
    oneCodeValue: true,
    twoCodeValue: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: 'Max Number of Codes',
    oneCodeValue: '',
    twoCodeValue: '2',
    type: PlanFieldTypes.TEXT,
  },
];
