import React, { ButtonHTMLAttributes } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import UISpinner from './UISpinner';
import Cancel from 'Assets/images/icons/cancel.svg';

interface UICancelButtonProps {
  onClick: () => Promise<void> | void;
  type?: ButtonHTMLAttributes<''>['type'];
  disabled?: boolean;
  isLoading?: boolean;
}

const useSpinnerClasses = makeStyles(() => ({
  wrapper: {
    borderRadius: '3px',
  },
}));

const UICancelButton = ({
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
}: UICancelButtonProps) => {
  const spinnerClasses = useSpinnerClasses();

  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames('button cancel', {
        'upload--disabled': disabled,
      })}
      onClick={onClick}
    >
      {isLoading && (
        <UISpinner
          wrapperClassName={classNames(
            'spinner__wrapper spinner__wrapper--overlay',
            'spinner__wrapper spinner__wrapper--full-cover',
            spinnerClasses.wrapper,
          )}
        />
      )}
      {!isLoading && (
        <ReactSVG src={Cancel} className="documentPreview__document-header-button-icon" />
      )}
    </button>
  );
};

export default UICancelButton;
