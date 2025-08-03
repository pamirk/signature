import CompanyIcon from 'Assets/images/icons/company-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';
import BillingIcon from 'Assets/images/icons/billing-icon.svg';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface NavItem {
  path: string;
  classNameMod: string;
  label: string;
  icon: string;
}

export const settingsNavItems: NavItem[] = [
  {
    path: AuthorizedRoutePaths.SETTINGS_COMPANY,
    label: 'Company',
    icon: CompanyIcon,
    classNameMod: 'fill',
  },
  {
    path: AuthorizedRoutePaths.SETTINGS_PROFILE,
    label: 'Profile',
    icon: TeamIcon,
    classNameMod: 'stroke',
  },
  {
    path: AuthorizedRoutePaths.SETTINGS_API,
    label: 'API',
    icon: IntegrationsIcon,
    classNameMod: 'stroke',
  },
  {
    path: AuthorizedRoutePaths.SETTINGS_EDIT_SIGNATURE,
    label: 'Edit Signature',
    icon: EditIcon,
    classNameMod: 'stroke',
  },
  {
    path: AuthorizedRoutePaths.SETTINGS_BILLING,
    label: 'Billing',
    icon: BillingIcon,
    classNameMod: 'stroke',
  },
];
