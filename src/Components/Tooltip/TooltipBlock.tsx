import React from 'react';
import classNames from 'classnames';

enum ContentPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface TooltipBlockProps {
  contentPosition?: ContentPosition;
  children: React.ReactNode;
}

const TooltipBlock = ({
  contentPosition = ContentPosition.TOP,
  children,
}: TooltipBlockProps) => {
  return (
    <div
      className={classNames('text-tooltip__container', {
        'text-tooltip__container--top': contentPosition === ContentPosition.TOP,
        'text-tooltip__container--bottom': contentPosition === ContentPosition.BOTTOM,
      })}
    >
      {children}
    </div>
  );
};

export default TooltipBlock;
