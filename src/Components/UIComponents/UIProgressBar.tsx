import React from 'react';

interface UIProgressBarProps {
  percentage?: number;
}

const UIProgressBar = ({ percentage = 0 }: UIProgressBarProps) => {
  const checkedPercentage = percentage > 100 ? 100 : percentage;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__filter"
        style={{ width: `${checkedPercentage}%` }}
      ></div>
    </div>
  );
};
export default UIProgressBar;
