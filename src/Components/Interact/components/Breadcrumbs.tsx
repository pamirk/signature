import React from 'react';
import { DocumentTypes, SignActionLabel } from 'Interfaces/Document';

export interface Steps {
  title: string;
}

interface BreadcrumbsProps {
  currentStep: number;
  documentType: DocumentTypes;
  onChooseStep: (step: number) => void;
}

function getSignAction(documentType: DocumentTypes) {
  switch (documentType) {
    case DocumentTypes.ME:
      return SignActionLabel.SIGN_DOCUMENT;
    case DocumentTypes.ME_AND_OTHER:
      return SignActionLabel.SIGN_AND_SEND;
    case DocumentTypes.OTHERS:
      return SignActionLabel.SEND;
  }
}

const Breadcrumbs = ({ currentStep, documentType, onChooseStep }: BreadcrumbsProps) => {
  return (
    <div className="interactModal__breadcrumbs">
      <div className="interactModal__breadcrumbs--item" onClick={() => onChooseStep(1)}>
        Upload the Files
      </div>
      <div className="interactModal__breadcrumbs--item" onClick={() => onChooseStep(2)}>
        Choose the Signers
      </div>
      {currentStep === 2 && (
        <div className="interactModal__breadcrumbs--item" onClick={() => onChooseStep(3)}>
          {getSignAction(documentType)}
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
