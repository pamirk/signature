import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

import Sidebar from 'Components/Sidebar/Sidebar';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const SidebarSubLayout = ({ location, children }: WrapperProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={classNames('main-layout__content', { mobile: isMobile })}>
      {!isMobile && (
        <div className="main-layout__sidebar">
          <Sidebar location={location} />
        </div>
      )}
      <div className="main-layout__container">{children}</div>
    </div>
  );
};

export default SidebarSubLayout;
