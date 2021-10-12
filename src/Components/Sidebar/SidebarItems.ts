import SignIcon from 'Assets/images/icons/sign-icon.svg';
import DocumentsIcon from 'Assets/images/icons/documents-icon.svg';
import TemplatesIcon from 'Assets/images/icons/templates-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import SettingsIcon from 'Assets/images/icons/settings-icon.svg';
import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import FormsIcon from 'Assets/images/icons/forms-icon.svg';

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
}

export const sidebarItems: SideBarItem[] = [
  {
    path: '/sign',
    classNameMod: 'stroke',
    label: 'Sign',
    icon: SignIcon,
    subLinks: [
      {
        subPath: '/only-me',
        label: 'Only Me',
      },
      {
        subPath: '/me-and-others',
        label: 'Me & Others',
      },
      {
        subPath: '/only-others',
        label: 'Only Others',
      },
      {
        subPath: '/bulk-send',
        label: 'Bulk Send',
      },
    ],
  },
  {
    path: '/documents',
    classNameMod: 'fill',
    label: 'Documents',
    icon: DocumentsIcon,
    subLinks: [
      {
        subPath: '/documents/completed',
        label: 'Completed',
        status: 'completed',
      },
      {
        subPath: '/documents/awaiting',
        label: 'Awaiting Signature',
        status: 'awaiting',
      },
      {
        subPath: '/documents/draft',
        label: 'Draft',
        status: 'draft',
      },
    ],
  },
  {
    path: '/templates',
    classNameMod: 'fill',
    label: 'Templates',
    icon: TemplatesIcon,
    subLinks: [
      {
        subPath: '/templates/create',
        label: 'Create Template',
      },
      {
        subPath: '/templates',
        label: 'Templates View',
      },
    ],
  },
  {
    path: '/form-requests',
    classNameMod: 'stroke',
    label: 'Forms',
    icon: FormsIcon,
    subLinks: [
      {
        subPath: '/form-requests/active',
        label: 'Live',
        status: 'completed',
      },
      {
        subPath: '/form-requests/draft',
        label: 'Draft',
        status: 'draft',
      },
    ],
  },
/*  {
    path: '/team',
    classNameMod: 'stroke',
    label: 'Team',
    icon: TeamIcon,
    subLinks: [
      {
        subPath: '/team/add-member',
        label: 'Member view',
      },
    ],
  },
  {
    path: '/integrations',
    classNameMod: 'stroke',
    label: 'Integrations',
    icon: IntegrationsIcon,
    subLinks: [],
  },
  {
    path: '/settings',
    classNameMod: 'fill',
    label: 'Settings',
    icon: SettingsIcon,
    subLinks: [
      {
        subPath: '/settings/company',
        label: 'Company',
      },
      {
        subPath: '/settings/profile',
        label: 'Profile',
      },
      /!*       {
        subPath: '/settings/api',
        label: 'API',
      }, *!/
      {
        subPath: '/settings/edit-signature',
        label: 'Edit Signature',
      },
      {
        subPath: '/settings/billing',
        freePlanSubPath: '/settings/billing/plan',
        label: 'Billing',
      },
      {
        subPath: '',
        label: 'Feedback',
        externalUrl: 'https://feedback.signaturely.com/',
      },
      {
        subPath: '',
        label: 'Share & Earn',
        externalUrl: 'https://refer.signaturely.com/',
      },
    ],
  },*/
];
