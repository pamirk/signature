import React from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import DocumentIcon from 'Assets/images/icons/document.svg';

interface UIOverlayLoaderProps {
  iconClassName?: string;
  labelClassName?: string;
}

const UIOverlayLoader = ({ iconClassName, labelClassName }: UIOverlayLoaderProps) => {
  return (
    <div className="overlayLoader">
      <ReactSVG
        src={DocumentIcon}
        className={classNames('overlayLoader__icon', iconClassName)}
      />
      <span className={classNames('overlayLoader__text', labelClassName)}>
        Loading...
      </span>
    </div>
  );
};

export default UIOverlayLoader;
