import React from 'react';
import classNames from 'classnames';
import UISpinner, { UISpinnerProps } from 'Components/UIComponents/UISpinner';

interface OverlaySpinnerProps {
  overlayClassName?: string;
  spinnerProps?: UISpinnerProps;
}

const OverlaySpinner = ({ overlayClassName, spinnerProps }: OverlaySpinnerProps) => (
  <div
    className={classNames(
      'spinner__wrapper',
      'spinner__wrapper--overlay',
      overlayClassName,
    )}
  >
    <UISpinner {...spinnerProps} />
  </div>
);

export default OverlaySpinner;
