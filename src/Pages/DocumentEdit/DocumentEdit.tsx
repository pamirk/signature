import React, { useCallback } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import { useDocumentGuard } from 'Hooks/Document';
import { selectDocument } from 'Utils/selectors';
import { Document, DocumentValues, DocumentTypes } from 'Interfaces/Document';

import UISpinner from 'Components/UIComponents/UISpinner';
import SignForm from 'Components/SignForm/SignForm';

interface DocumentRouteParams {
  documentId: Document['id'];
}

const getSignersMinLength = (type: DocumentTypes) => {
  switch (type) {
    case DocumentTypes.TEMPLATE:
    case DocumentTypes.FORM_REQUEST:
    case DocumentTypes.ME: {
      return 1;
    }
    case DocumentTypes.OTHERS: {
      return 2;
    }
    case DocumentTypes.ME_AND_OTHER: {
      return 3;
    }
  }
};

const DocumentEdit = ({ match }: RouteChildrenProps<DocumentRouteParams>) => {
  const documentId = match?.params.documentId || '';
  const document = useSelector(state => selectDocument(state, { documentId }));
  const handleDocumentCheckFailure = useCallback(() => {
    History.replace('/documents');
  }, []);

  const isCheckingDocument = useDocumentGuard({
    documentId,
    onFailure: handleDocumentCheckFailure,
  });

  if (isCheckingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  if (!document) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, ...restDocument } = document;
  const initialValues = {
    ...restDocument,
    signers:
      document.signers.length < getSignersMinLength(document.type)
        ? [...document.signers, { order: document.signers.length }]
        : document.signers,
    recipients: document.recipients,
  } as DocumentValues;

  return <SignForm initialValues={initialValues} />;
};

export default DocumentEdit;
