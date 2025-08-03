export enum PlanFieldTypes {
  TEXT = 'text',
  BOOLEAN = 'boolean',
}

export enum LtdTiersIds {
  B_TIER_1 = 'prdg',
  B_TIER_2 = 'hmd5',
  B_TIER_3 = '3wt4',
  B_TIER_4 = 'g56t',
  B_TIER_5 = '34mp',
  B_TIER_3_ARCHIVED = 'gm43',
}

export const ltdIdByNumberMap = new Map<number, string>([
  [1, LtdTiersIds.B_TIER_1],
  [2, LtdTiersIds.B_TIER_2],
  [3, LtdTiersIds.B_TIER_3],
  [4, LtdTiersIds.B_TIER_4],
  [5, LtdTiersIds.B_TIER_5],
]);

export const tierNumberById = {
  [LtdTiersIds.B_TIER_1]: 1,
  [LtdTiersIds.B_TIER_2]: 2,
  [LtdTiersIds.B_TIER_3]: 3,
  [LtdTiersIds.B_TIER_4]: 4,
  [LtdTiersIds.B_TIER_5]: 5,
  [LtdTiersIds.B_TIER_3_ARCHIVED]: 2.1,
};

export const popularTiers = [LtdTiersIds.B_TIER_3];

export enum LtdOptionNames {
  USERS = 'Users',
  API_REQUESTS = 'API Requests',
  SIGNATURE_REQUESTS = 'Signature Requests',
  TEMPLATES = 'Templates',
  BULK_SEND_REQUESTS = 'Bulk Send Requests',
  FORMS = 'Forms',
  GOOGLE_DRIVE_INTEGRATION = 'Google Drive Integration',
  DROPBOX_INTEGRATION = 'Dropbox Integration',
  ONE_DRIVE_INTEGRATION = 'One Drive Integration',
  BOX_INTEGRATION = 'Box Integration',
  NOTIFICATIONS_AND_REMINDERS = 'Notifications and reminders',
  AUDIT_LOG_AND_HISTORY = 'Audit log and history',
  TEAM_MANAGEMENT = 'Team management',
  CUSTOM_BUSINESS_BRANDING = 'Custom business branding',
  ALL_INTEGRATIONS = 'All integrations',
  PLAN = 'Plan',
  PRICING = 'Pricing',
}

export interface LtdOptions {
  name: LtdOptionNames;
  value: string | number | boolean;
  type: PlanFieldTypes;
}

export const ltdOptions: LtdOptions[] = [
  {
    name: LtdOptionNames.USERS,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.API_REQUESTS,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.SIGNATURE_REQUESTS,
    value: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.TEMPLATES,
    value: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.BULK_SEND_REQUESTS,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.FORMS,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.GOOGLE_DRIVE_INTEGRATION,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.DROPBOX_INTEGRATION,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.ONE_DRIVE_INTEGRATION,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.BOX_INTEGRATION,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.NOTIFICATIONS_AND_REMINDERS,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.AUDIT_LOG_AND_HISTORY,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.TEAM_MANAGEMENT,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
  {
    name: LtdOptionNames.CUSTOM_BUSINESS_BRANDING,
    value: true,
    type: PlanFieldTypes.BOOLEAN,
  },
];

export const additionalLtdOptions: LtdOptions[] = [
  {
    name: LtdOptionNames.PLAN,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.PRICING,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  ...ltdOptions,
];

export const shortLtdOptions: LtdOptions[] = [
  {
    name: LtdOptionNames.USERS,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.SIGNATURE_REQUESTS,
    value: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.TEMPLATES,
    value: 'Unlimited',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.ALL_INTEGRATIONS,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.NOTIFICATIONS_AND_REMINDERS,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
  {
    name: LtdOptionNames.AUDIT_LOG_AND_HISTORY,
    value: '',
    type: PlanFieldTypes.TEXT,
  },
];
