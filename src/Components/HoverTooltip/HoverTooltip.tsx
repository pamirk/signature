import React from 'react';
import classNames from 'classnames';

interface HoverTooltipProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'topRight';
}

export const HoverTooltip = ({ children, position = 'bottom' }: HoverTooltipProps) => {
  return (
    <div className="hoverTooltip">
      <p
        className={classNames('hoverTooltip__wrapper', {
          'hoverTooltip__wrapper--bottom': position === 'bottom',
          'hoverTooltip__wrapper--top': position === 'top',
          'hoverTooltip__wrapper--top right': position === 'topRight',
        })}
      >
        {children}
      </p>
    </div>
  );
};
