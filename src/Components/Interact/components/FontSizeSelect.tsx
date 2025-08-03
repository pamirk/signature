import React from 'react';
import { fontSizeOptions } from 'Services/Fonts';
import UISelect from '../../UIComponents/UISelect';

interface FontSizeSelectProps {
  onSelect: (value: number | null | undefined) => void;
  value: number | null | undefined;
}

const FontSizeSelect = ({ onSelect, value }: FontSizeSelectProps) => (
  <UISelect
    value={value}
    handleSelect={onSelect}
    options={fontSizeOptions}
    placeholder="Select font size"
  />
);

export default FontSizeSelect;
