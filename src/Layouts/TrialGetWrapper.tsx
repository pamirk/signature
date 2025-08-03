import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

function TrialGetWrapper({ children }: WrapperProps) {
  return (
    <div className="main-layout main-layout--relative">
      <div className="main-layout__withOutSidebar">{children}</div>
    </div>
  );
}

export default TrialGetWrapper;
