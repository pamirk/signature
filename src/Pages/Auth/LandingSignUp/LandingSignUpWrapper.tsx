import React, { useState } from 'react';
import { Document } from 'Interfaces/Document';
import { useSelector } from 'react-redux';
import { selectDocument } from 'Utils/selectors';
import LandingSignUp from './LandingSignUp';
import LandingSignDocument from './LandingSignDocument';

export enum StepType {
  SIGN = 'sign',
  SIGN_UP = 'sign_up',
}

const LandingSignUpWrapper = () => {
  const [stepType, setStepType] = useState<StepType>(StepType.SIGN);
  const [documentId, setDocumentId] = useState<Document['id'] | undefined>(undefined);
  const document = useSelector(state => selectDocument(state, { documentId }));

  return (
    <div className="sign-up-landing__wrapper">
      {stepType === StepType.SIGN && (
        <LandingSignDocument
          document={document}
          documentId={documentId}
          setDocumentId={setDocumentId}
          setStepType={setStepType}
        />
      )}
      {stepType === StepType.SIGN_UP && <LandingSignUp document={document} />}
    </div>
  );
};

export default LandingSignUpWrapper;
