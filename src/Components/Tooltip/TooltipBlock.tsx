// eslint-disable-next-line react/display-name
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useIsMobile } from 'Hooks/Common';

export enum ContentPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface TooltipBlockProps {
  contentPosition?: ContentPosition;
  children: React.ReactNode;
  className?: string;
  disabledMobile?: boolean;
}

const TooltipBlock = forwardRef(
  (
    {
      contentPosition = ContentPosition.TOP,
      children,
      className,
      disabledMobile = false,
    }: TooltipBlockProps,
    ref: any,
  ) => {
    const isMobile = useIsMobile();

    return (
      <div
        ref={ref}
        className={classNames(
          'text-tooltip__container',
          {
            'text-tooltip__container--top': contentPosition === ContentPosition.TOP,
            'text-tooltip__container--bottom': contentPosition === ContentPosition.BOTTOM,
            'text-tooltip__container--left': contentPosition === ContentPosition.LEFT,
            'text-tooltip__container--right': contentPosition === ContentPosition.RIGHT,
            mobile: isMobile && !disabledMobile,
          },
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export default TooltipBlock;
