import {
  DocumentFieldTypes,
  DocumentFieldShape,
  DocumentFieldLabels,
} from 'Interfaces/DocumentFields';
import NameIcon from 'Assets/images/icons/name-icon.svg';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import InIcon from 'Assets/images/icons/in-icon.svg';
import DateIcon from 'Assets/images/icons/date-icon.svg';
import TextIcon from 'Assets/images/icons/text-icon.svg';
import CheckboxIcon from 'Assets/images/icons/checkbox-icon.svg';

export const fieldShapes: DocumentFieldShape[] = [
  {
    label: DocumentFieldLabels.NAME,
    type: DocumentFieldTypes.Name,
    icon: NameIcon,
    iconType: 'stroke',
  },
  {
    label: DocumentFieldLabels.SIGNATURE,
    type: DocumentFieldTypes.Signature,
    icon: SignIcon,
    iconType: 'stroke',
  },
  {
    label: DocumentFieldLabels.INITIALS,
    type: DocumentFieldTypes.Initials,
    icon: InIcon,
    iconType: 'fill',
  },
  {
    label: DocumentFieldLabels.DATE,
    type: DocumentFieldTypes.Date,
    icon: DateIcon,
    iconType: 'stroke',
  },
  {
    label: DocumentFieldLabels.TEXT,
    type: DocumentFieldTypes.Text,
    icon: TextIcon,
    iconType: 'stroke',
  },
  {
    label: DocumentFieldLabels.CHECKBOX,
    type: DocumentFieldTypes.Checkbox,
    icon: CheckboxIcon,
    iconType: 'stroke',
  },
];

export const defaultSizesByFieldType = {
  [DocumentFieldTypes.Name]: {
    width: 120,
    height: 25,
  },
  [DocumentFieldTypes.Signature]: {
    width: 110,
    height: 25,
  },
  [DocumentFieldTypes.Initials]: {
    width: 25,
    height: 25,
  },
  [DocumentFieldTypes.Text]: {
    width: 60,
    height: 25,
  },
  [DocumentFieldTypes.Date]: {
    width: 120,
    height: 25,
  },
  [DocumentFieldTypes.Checkbox]: {
    width: 25,
    height: 25,
  },
};
