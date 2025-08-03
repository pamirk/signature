import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import { Document } from 'Interfaces/Document';
import { selectSignToken, selectUser, selectDocument } from 'Utils/selectors';
import { parseJwtToken } from 'Utils/functions';
import { LoginModal, SignUpModal } from './components';
import { SuccessSendModal } from 'Components/DocumentForm';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

enum ModalType {
  AUTHORIZED = 'Authorized',
  LOGIN = 'Login',
  SIGNUP = 'SignUp',
}

interface DocumentSignModalProps {
  documentId?: Document['id'] | null;
  onClose: () => void;
}

const DocumentSignModal = ({ documentId, onClose }: DocumentSignModalProps) => {
  const token: string | undefined = useSelector(selectSignToken);
  const document = useSelector(state => selectDocument(state, { documentId }));
  const { id } = useSelector(selectUser);
  const isAuthorizedUser = useMemo(
    () => (token ? parseJwtToken(token).sub === id : false),
    [id, token],
  );
  const [modalType, setModalType] = useState<ModalType>(
    isAuthorizedUser ? ModalType.AUTHORIZED : ModalType.SIGNUP,
  );

  const handleClose = useCallback(() => {
    onClose();

    History.push(UnauthorizedRoutePaths.BASE_PATH);
  }, [onClose]);

  const handleCloseSignUp = useCallback(() => {
    onClose();

    History.push(UnauthorizedRoutePaths.ABOUT, {
      isSignUpClose: true,
    });
  }, [onClose]);

  switch (modalType) {
    case ModalType.AUTHORIZED:
      return <SuccessSendModal onClose={handleClose} document={document as Document} />;
    case ModalType.LOGIN:
      return (
        <LoginModal
          onClose={handleClose}
          onSignUpClick={() => setModalType(ModalType.SIGNUP)}
        />
      );
    case ModalType.SIGNUP:
      return (
        <SignUpModal
          document={document as Document}
          onClose={handleCloseSignUp}
          onSignInClick={() => setModalType(ModalType.LOGIN)}
        />
      );
    default:
      return null;
  }
};

export default DocumentSignModal;
