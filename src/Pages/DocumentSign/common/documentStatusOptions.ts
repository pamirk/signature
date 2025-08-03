import DocumentCompletedSigningIcon from 'Assets/images/icons/document-completed-signing-icon.svg';
import DocumentSignedIcon from 'Assets/images/icons/document-signed-icon.svg';
import DocumentUnavailableIcon from 'Assets/images/icons/document-unavailable-icon.svg';

interface DocumentSignerAuthorization {
  unauthorized: string;
  authorized: string;
}

interface DocumentStatusPayload {
  icon: string;
  title: string;
}

interface DocumentSinglePayload extends DocumentStatusPayload {
  message: string;
  actionButtonText: string;
}

interface DocumentComplexPayload extends DocumentStatusPayload {
  message: DocumentSignerAuthorization;
  actionButtonText: DocumentSignerAuthorization;
}

interface DocumentStatusOptionsType {
  unavailable: DocumentSinglePayload;
  awaiting: DocumentComplexPayload;
  completed: DocumentComplexPayload;
}

export const documentStatusOptions = {
  unavailable: {
    icon: DocumentUnavailableIcon,
    title: 'This Document Is Not Available',
    message:
      'The document you are trying to access is no longer available for signing; please contact the sender.',
    actionButtonText: 'Log In to View Documents',
  },
  awaiting: {
    icon: DocumentSignedIcon,
    title: 'Access Your Signed Document',
    message: {
      unauthorized:
        'This document has been successfully signed. Sign up for Signaturely to access the signed document or download it from your inbox.',
      authorized:
        'This document has been successfully signed. Download the signed copy from your inbox or log in to your Signaturely account to view the signed document.',
    },
    actionButtonText: {
      unauthorized: 'Sign Up to Access Document',
      authorized: 'Go to dashboard',
    },
  },
  completed: {
    icon: DocumentCompletedSigningIcon,
    title: 'Document Completed Successfully',
    message: {
      unauthorized:
        'Congratulations! This document is fully signed. Sign up for Signaturely to access the signed document or download it from your inbox.',
      authorized:
        'Congratulations! This document is fully signed. Log in to your Signaturely account to access and manage your completed documents.',
    },
    actionButtonText: {
      unauthorized: 'Sign Up to Access Document',
      authorized: 'Go to dashboard',
    },
  },
} as Readonly<DocumentStatusOptionsType>;
