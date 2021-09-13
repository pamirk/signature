import React from 'react';
import { ReactSVG } from 'react-svg';
// @ts-ignore
import useDropdown from 'use-dropdown';
import TooltipBlock, { TooltipBlockProps } from './TooltipBlock';
import TooltipIcon from 'Assets/images/icons/tooltip-icon.svg';

interface TooltipProps extends TooltipBlockProps {
  children: React.ReactNode;
}

const Tooltip = ({ children, ...blockProps }: TooltipProps) => {
  const [containerRef, isOpen, open, close] = useDropdown();

  return (
    <div ref={containerRef} className="text-tooltip">
      <ReactSVG
        className="text-tooltip__trigger"
        src={TooltipIcon}
        onClick={isOpen ? close : open}
      />
      {isOpen && <TooltipBlock {...blockProps}>{children}</TooltipBlock>}
    </div>
  );
};

export default Tooltip;
