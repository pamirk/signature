import SignIcon from 'Assets/images/icons/sign-icon.svg';
import DocumentsIcon from 'Assets/images/icons/documents-icon.svg';
import TemplatesIcon from 'Assets/images/icons/templates-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import SettingsIcon from 'Assets/images/icons/settings-icon.svg';
import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import FormsIcon from 'Assets/images/icons/forms-icon.svg';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SubLink {
  subPath: string;
  freePlanSubPath?: string;
  label: string;
  status?: string;
  externalUrl?: string;
}

interface SideBarItem {
  path: string;
  classNameMod: string;
  label: string;
  icon: string;
  subLinks: SubLink[];
  iconClassName?: string;
}

export const sidebarItems: SideBarItem[] = [
  {
    path: AuthorizedRoutePaths.SIGN,
    classNameMod: 'stroke',
    label: 'Sign',
    icon: SignIcon,
    subLinks: [],
  },
  {
    path: AuthorizedRoutePaths.DOCUMENTS,
    classNameMod: 'fill',
    label: 'Documents',
    icon: DocumentsIcon,
    subLinks: [
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/completed`,
        label: 'Completed',
        status: 'completed',
      },
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/awaiting`,
        label: 'Awaiting Signature',
        status: 'awaiting',
      },
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/voided`,
        label: 'Voided',
        status: 'declined',
      },
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/draft`,
        label: 'Draft',
        status: 'draft',
      },
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/received`,
        label: 'Received',
        status: 'received',
      },
      {
        subPath: `${AuthorizedRoutePaths.DOCUMENTS}/trash`,
        label: 'Trash',
        status: 'trash',
      },
    ],
  },
  {
    path: `${AuthorizedRoutePaths.TEMPLATES}/active`,
    classNameMod: 'fill',
    label: 'Templates',
    icon: TemplatesIcon,
    subLinks: [
      {
        subPath: `${AuthorizedRoutePaths.TEMPLATES}/create`,
        label: 'Create Template',
      },
      {
        subPath: `${AuthorizedRoutePaths.TEMPLATES}/active`,
        label: 'Templates View',
      },
      {
        subPath: `${AuthorizedRoutePaths.TEMPLATES}/api`,
        label: 'API Templates',
      },
    ],
  },
  {
    path: AuthorizedRoutePaths.FORM_REQUESTS,
    classNameMod: 'stroke',
    label: 'Forms',
    icon: FormsIcon,
    subLinks: [
      {
        subPath: `${AuthorizedRoutePaths.FORM_REQUESTS}/active`,
        label: 'Live',
        status: 'completed',
      },
      {
        subPath: `${AuthorizedRoutePaths.FORM_REQUESTS}/draft`,
        label: 'Draft',
        status: 'draft',
      },
    ],
  },
  {
    path: AuthorizedRoutePaths.TEAM,
    classNameMod: 'stroke',
    label: 'Team',
    icon: TeamIcon,
    subLinks: [
      {
        subPath: `${AuthorizedRoutePaths.TEAM}/add-member`,
        label: 'Member view',
      },
    ],
  },
  {
    path: AuthorizedRoutePaths.INTEGRATIONS,
    classNameMod: 'stroke',
    label: 'Integrations',
    icon: IntegrationsIcon,
    subLinks: [],
  },
  {
    path: AuthorizedRoutePaths.SETTINGS,
    classNameMod: 'fill',
    label: 'Settings',
    icon: SettingsIcon,
    subLinks: [
      {
        subPath: AuthorizedRoutePaths.SETTINGS_COMPANY,
        label: 'Company',
      },
      {
        subPath: AuthorizedRoutePaths.SETTINGS_PROFILE,
        label: 'Profile',
      },
      /*       {
        subPath: '/settings/api',
        label: 'API',
      }, */
      {
        subPath: AuthorizedRoutePaths.SETTINGS_EDIT_SIGNATURE,
        label: 'Edit Signature',
      },
      {
        subPath: AuthorizedRoutePaths.SETTINGS_BILLING,
        freePlanSubPath: AuthorizedRoutePaths.SETTINGS_BILLING_PLAN,
        label: 'Billing',
      },
      {
        subPath: '',
        label: 'Share & Earn',
        externalUrl: 'https://refer.signaturely.com/',
      },
    ],
  },
];
