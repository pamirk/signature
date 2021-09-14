import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

import SettingsNavigation from 'Components/SettingsNavigation';

function SettingsWrapper({ children, location }: WrapperProps) {
  return (
    <div className="settings-layout">
      <p className="settings-layout__title">Settings</p>
      <p className="settings-layout__subTitle">
        Browse all your Signaturely settings from here. <br />
        If you need more in-depth help or support, please get in touch.
      </p>
      <div className="settings-layout__nav">
        <SettingsNavigation location={location} />
      </div>
      <div className="settings-layout__content">{children}</div>
    </div>
  );
}

export default SettingsWrapper;
