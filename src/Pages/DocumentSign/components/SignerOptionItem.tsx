import React from 'react';
import { SignerOption } from 'Interfaces/Document';
import UIRadioBtn from 'Components/UIComponents/UIRadioBtn';

interface SignerOptionItemProps {
  signerOption: SignerOption;
  isSelected: boolean;
  toggleSelect: () => void;
}

const SignerOptionItem = ({
  signerOption,
  isSelected,
  toggleSelect,
}: SignerOptionItemProps) => {
  return (
    <div className="signerOptionModal__item">
      <UIRadioBtn
        label={signerOption.name}
        handleCheck={toggleSelect}
        isChecked={isSelected}
      />
    </div>
  );
};

export default SignerOptionItem;
