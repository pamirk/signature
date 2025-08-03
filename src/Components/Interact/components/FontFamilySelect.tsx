import { fontFamilyOptions } from '../../../Services/Fonts';
import UISelect from '../../UIComponents/UISelect';
import React from 'react';

interface FontFamilySelectProps {
  value: string | null | undefined;
  onSelect: (fontFamily: string | null | undefined) => void;
}

const FontFamilySelect = ({ value, onSelect }: FontFamilySelectProps) => (
  <UISelect
    value={value}
    handleSelect={onSelect}
    options={fontFamilyOptions}
    placeholder="Select font family"
  />
);

export default FontFamilySelect;
