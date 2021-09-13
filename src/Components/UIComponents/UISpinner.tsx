import React from 'react';
import classNames from 'classnames';

export interface UISpinnerProps {
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
}

const UISpinner = ({
  width = 21,
  height = 21,
  className,
  wrapperClassName,
}: UISpinnerProps) => {
  return (
    <div className={wrapperClassName}>
      <svg
        className={classNames('spinner', className)}
        width={`${width}px`}
        height={`${height}px`}
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="path"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    </div>
  );
};

export default UISpinner;
