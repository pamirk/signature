import { DocumentFieldTypes, DocumentFieldShape } from 'Interfaces/DocumentFields';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import InIcon from 'Assets/images/icons/in-icon.svg';
import DateIcon from 'Assets/images/icons/date-icon.svg';
import TextIcon from 'Assets/images/icons/text-icon.svg';
import CheckboxIcon from 'Assets/images/icons/checkbox-icon.svg';

export const fieldShapes: DocumentFieldShape[] = [
  {
    type: DocumentFieldTypes.Signature,
    icon: SignIcon,
    iconType: 'stroke',
  },
  {
    type: DocumentFieldTypes.Initials,
    icon: InIcon,
    iconType: 'fill',
  },
  {
    type: DocumentFieldTypes.Date,
    icon: DateIcon,
    iconType: 'stroke',
  },
  {
    type: DocumentFieldTypes.Text,
    icon: TextIcon,
    iconType: 'stroke',
  },
  {
    type: DocumentFieldTypes.Checkbox,
    icon: CheckboxIcon,
    iconType: 'stroke',
  },
];

export const defaultSizesByFieldType = {
  [DocumentFieldTypes.Signature]: {
    width: 110,
    height: 25,
  },
  [DocumentFieldTypes.Initials]: {
    width: 110,
    height: 25,
  },
  [DocumentFieldTypes.Text]: {
    width: 56.25,
    height: 18,
  },
  [DocumentFieldTypes.Date]: {
    width: 119,
    height: 33,
  },
  [DocumentFieldTypes.Checkbox]: {
    width: 25,
    height: 25,
  },
};
