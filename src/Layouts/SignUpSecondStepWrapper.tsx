import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

import Header from 'Components/Header';

function SignUpSecondStepWrapper({ children, location }: WrapperProps) {
  return (
    <div className="main-layout main-layout--relative">
      <Header location={location} isActionHidden headerClassName="main-layout__header" />
      <div className="main-layout__withOutSidebar">{children}</div>
    </div>
  );
}

export default SignUpSecondStepWrapper;
