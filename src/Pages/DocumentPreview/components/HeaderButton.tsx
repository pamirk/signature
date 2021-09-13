import React from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import UISpinner from 'Components/UIComponents/UISpinner';

interface HeaderButtonProps {
  title?: string;
  icon: string;
  iconType?: 'stroke' | 'fill';
  onClick: (args: any) => any;
  disabled?: boolean;
  isLoading?: boolean;
  isMobile?: boolean;
}

const useSpinnerClasses = makeStyles(() => ({
  wrapper: {
    borderRadius: '3px',
  },
}));

const HeaderButton = ({
  title,
  icon,
  onClick,
  isLoading = false,
  disabled = false,
  iconType = 'stroke',
  isMobile,
}: HeaderButtonProps) => {
  const spinnerClasses = useSpinnerClasses();

  return (
    <button
      disabled={disabled}
      className={classNames(
        'documentPreview__document-header-button',
        `documentPreview__document-header-button--${iconType}`,
        { mobile: isMobile },
      )}
      onClick={onClick}
    >
      {isLoading && (
        <UISpinner
          wrapperClassName={classNames(
            'spinner__wrapper spinner__wrapper--overlay',
            'spinner__wrapper spinner__wrapper--full-cover',
            'spinner__wrapper spinner__wrapper--bg-gray',
            spinnerClasses.wrapper,
          )}
        />
      )}
      <ReactSVG src={icon} className="documentPreview__document-header-button-icon" />
      {title}
    </button>
  );
};

export default HeaderButton;
