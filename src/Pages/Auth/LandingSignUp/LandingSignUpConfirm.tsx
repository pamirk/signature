import React, { useState } from 'react';
import { useDocumentDelete } from 'Hooks/Document';
import { Document } from 'Interfaces/Document';
import { useSelector } from 'react-redux';
import { selectDocument } from 'Utils/selectors';
import { LandingConfirmPage } from './components';
import History from 'Services/History';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { RoutePaths } from 'Interfaces/RoutePaths';
import { DownloadOption } from 'Interfaces/Auth';

interface LandingSignUpConfirmProps {
  documentId: string;
}

const LandingSignUpConfirm = ({
  location,
}: RouteComponentProps<{}, StaticContext, LandingSignUpConfirmProps>) => {
  const [deleteDocument] = useDocumentDelete();
  const [documentId] = useState<Document['id'] | undefined>(location.state?.documentId);

  const document = useSelector(state => selectDocument(state, { documentId }));

  const resetForm = (option: DownloadOption) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    documentId && deleteDocument({ documentId, isLocalDelete: true });
    History.push(RoutePaths.LANDING_SIGNUP_THANKS, {
      documentId,
      option,
    });
  };

  return (
    <div className="sign-up-landing__wrapper">
      <LandingConfirmPage document={document} onFinish={resetForm} />
    </div>
  );
};

export default LandingSignUpConfirm;
