import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

import Header from 'Components/Header/Header';
import Footer from 'Components/Footer/Footer';
import IdleTimer from 'react-idle-timer';
import { useLogout } from 'Hooks/Auth';
import { IDLE_TIMEOUT_MINUTES } from 'Utils/constants';

const timeout = IDLE_TIMEOUT_MINUTES * 60000;

function AuthenticatedWrapper({ children, location }: WrapperProps) {
  const logout = useLogout();

  const handleIdle = () => {
    logout();
  };
  return (
    <div className="main-layout">
      <Header location={location} />
      <>
        <IdleTimer
          timeout={timeout}
          onIdle={handleIdle}
          crossTab={{
            type: 'localStorage',
            emitOnAllTabs: true,
          }}
        />
        {children}
      </>
      <Footer />
    </div>
  );
}

export default AuthenticatedWrapper;
