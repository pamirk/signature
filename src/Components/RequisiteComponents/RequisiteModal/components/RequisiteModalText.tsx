import React from 'react';
import { fontFamilyByValue, requisiteFontFamilyOptions } from 'Services/Fonts';
import { Requisite, RequisiteType } from 'Interfaces/Requisite';

import UISelect from 'Components/UIComponents/UISelect';
import { RequisiteFieldInput } from 'Components/RequisiteComponents/RequisiteModal/components';
import { useRequisiteTextRef } from 'Hooks/Requisite';

interface RequisiteModalTextProps {
  fontFamilyType: string;
  handleSelect: (string:any) => void;
  handleOnChange: (
    requisiteType: RequisiteType,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  signatureValue: Requisite['text'];
  initialsValue: Requisite['text'];
}

export const RequisiteModalText = ({
  fontFamilyType,
  handleSelect,
  handleOnChange,
  signatureValue,
  initialsValue,
}: RequisiteModalTextProps) => {
  const signatureRef = useRequisiteTextRef({ textValue: signatureValue, fontFamilyType });
  const initialsRef = useRequisiteTextRef({ textValue: initialsValue, fontFamilyType });

  return (
    <div>
      <div className="requisiteModal__field-wrapper">
        <RequisiteFieldInput
          label="Full Name"
          isRequired={true}
          labelClassName="requisiteModal__field-label"
          className="requisiteModal__field"
          onChange={handleOnChange(RequisiteType.SIGN)}
          value={signatureValue}
        />
        <RequisiteFieldInput
          label="Initials"
          isRequired={true}
          labelClassName="requisiteModal__field-label"
          className="requisiteModal__field"
          onChange={handleOnChange(RequisiteType.INITIAL)}
          value={initialsValue}
        />
      </div>
      <p className="requisiteModal__type-select-title">Signature Preview:</p>
      <div className="requisiteModal__area-wrapper tablet-wrapper">
        <div className="requisiteModal__area-container">
          <p className="requisiteModal__area-subtitle">Full Name</p>
          <div className="requisiteModal__area requisiteModal__area requisiteModal__area--type">
            <div
              ref={signatureRef}
              style={{
                fontFamily: fontFamilyByValue[fontFamilyType],
                whiteSpace: 'nowrap',
              }}
            >
              {signatureValue}
            </div>
          </div>
        </div>
        <div className="requisiteModal__area-container">
          <p className="requisiteModal__area-subtitle">Initials</p>
          <div className="requisiteModal__area requisiteModal__area--type">
            <div
              ref={initialsRef}
              style={{
                fontFamily: fontFamilyByValue[fontFamilyType],
                whiteSpace: 'nowrap',
              }}
            >
              {initialsValue}
            </div>
          </div>
        </div>
      </div>

      <p className="requisiteModal__type-select-title">Change Font</p>
      <div className="requisiteModal__type-select">
        <UISelect
          value={fontFamilyType}
          handleSelect={handleSelect}
          options={requisiteFontFamilyOptions}
          placeholder="Select font family"
        />
      </div>
    </div>
  );
};

export default RequisiteModalText;
