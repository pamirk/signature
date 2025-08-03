import React from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { ButtonHTMLAttributes } from 'react';
import UISpinner from './UISpinner';

export interface UIButtonProps {
  priority: 'primary' | 'secondary' | 'red' | 'white';
  disabled?: boolean;
  ariaDisabled?: boolean;
  handleClick?: (...args: any[]) => void;
  title?: string;
  type?: ButtonHTMLAttributes<''>['type'];
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
  isLoading?: boolean;
}

function UIButton({
  priority,
  disabled = false,
  ariaDisabled = false,
  handleClick,
  title,
  type = 'button',
  leftIcon,
  rightIcon,
  className,
  isLoading = false,
}: UIButtonProps) {
  const primary = priority === 'primary';
  const secondary = priority === 'secondary';
  const red = priority === 'red';
  const white = priority === 'white';

  return (
    <button
      type={type}
      className={classNames('button', className, {
        'button--primary': primary,
        'button--secondary': secondary,
        'button--red': red,
        'button--white': white,
        'button--disabled': disabled,
        'button--loading': isLoading,
      })}
      onClick={handleClick}
      disabled={disabled && !ariaDisabled}
      aria-disabled={ariaDisabled}
    >
      {isLoading && <UISpinner wrapperClassName="button__spinner" />}
      {leftIcon && <ReactSVG src={leftIcon} className="button__ico" />}
      <p
        className={classNames('button__text', {
          'button__text--loading': isLoading,
        })}
      >
        {title}
      </p>
      {rightIcon && (
        <ReactSVG src={rightIcon} className="button__ico button__ico--after" />
      )}
    </button>
  );
}

export default UIButton;
