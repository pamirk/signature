import React, { useEffect, useMemo } from 'react';
import useWootricSurvey from 'Hooks/Common/useWootricSurvey';
import { useSelector } from 'react-redux';
import { User } from 'Interfaces/User';
import { selectDocument, selectShowTrialSuccessPage, selectUser } from 'Utils/selectors';
import {WizardSignForm} from 'Components/WizardSignForm';
import { DocumentTypes, Document } from 'Interfaces/Document';
import { RouteChildrenProps, useLocation } from 'react-router-dom';
import { useDocumentGuard } from 'Hooks/Document';
import UISpinner from 'Components/UIComponents/UISpinner';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

const getSignersMinLength = (type: DocumentTypes) => {
  switch (type) {
    case DocumentTypes.TEMPLATE:
    case DocumentTypes.FORM_REQUEST:
    case DocumentTypes.ME: {
      return 1;
    }
    case DocumentTypes.OTHERS:
    case DocumentTypes.ME_AND_OTHER: {
      return 2;
    }
  }
};

interface DocumentRouteParams {
  documentId: Document['id'];
}

interface DashboardLocationContext {
  showTrialSuccessPage?: boolean;
}

const Dashboard = ({ match }: RouteChildrenProps<DocumentRouteParams>) => {
  const location = useLocation<DashboardLocationContext>();

  const { email, createdAt }: User = useSelector(selectUser);
  const showTrialSuccessPage =
    useSelector(selectShowTrialSuccessPage) || location?.state?.showTrialSuccessPage;

  useWootricSurvey(email as string, createdAt as Date);
  const documentId = useMemo(() => match?.params.documentId, [match]);

  const document = useSelector(state => selectDocument(state, { documentId }));
  const isCheckingDocument = useDocumentGuard({
    documentId,
  });

  const initialValues = useMemo(() => {
    if (document) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fields, ...restDocument } = document;

      return {
        ...restDocument,
        signers:
          document.signers.length < getSignersMinLength(document.type)
            ? [...document.signers, { order: document.signers.length }]
            : document.signers,
        recipients: document.recipients,
      };
    }

    return {
      type: DocumentTypes.ME,
      signers: [
        {
          name: 'Me (Now)',
          email: email,
          order: -1,
          isPreparer: true,
        },
      ],
    };
  }, [document, email]);

  useEffect(() => {
    if (showTrialSuccessPage) {
      History.push(AuthorizedRoutePaths.TRIAL_SUCCESS, { successRequired: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  return (
    <div className="dashboard__wrapper">
      <WizardSignForm initialValues={initialValues} isEditMode={!!documentId} />
    </div>
  );
};

export default Dashboard;
