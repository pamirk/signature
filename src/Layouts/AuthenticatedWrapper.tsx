import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

import Header from 'Components/Header';
import Footer from 'Components/Footer';

function AuthenticatedWrapper({ children, location }: WrapperProps) {
  return (
    <div className="main-layout">
      <Header location={location} />
      <>{children}</>
      <Footer />
    </div>
  );
}

export default AuthenticatedWrapper;
