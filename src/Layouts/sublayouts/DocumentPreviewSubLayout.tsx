import React from 'react';
import { WrapperProps } from 'Interfaces/Common';

export const DocumentPreviewSubLayout = ({ children }: WrapperProps) => {
  return <div className="main-layout__withOutSidebar">{children}</div>;
};
