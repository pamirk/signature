import CompanyIcon from 'Assets/images/icons/company-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';
import BillingIcon from 'Assets/images/icons/billing-icon.svg';

interface NavItem {
  path: string;
  classNameMod: string;
  label: string;
  icon: string;
}

export const settingsNavItems: NavItem[] = [
  {
    path: '/settings/company',
    label: 'Company',
    icon: CompanyIcon,
    classNameMod: 'fill',
  },
  {
    path: '/settings/profile',
    label: 'Profile',
    icon: TeamIcon,
    classNameMod: 'stroke',
  },
  {
    path: '/settings/api',
    label: 'API',
    icon: IntegrationsIcon,
    classNameMod: 'stroke',
  },
  {
    path: '/settings/edit-signature',
    label: 'Edit Signature',
    icon: EditIcon,
    classNameMod: 'stroke',
  },
  {
    path: '/settings/billing',
    label: 'Billing',
    icon: BillingIcon,
    classNameMod: 'stroke',
  },
];
