import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { DocumentTypes } from 'Interfaces/Document';

import SignForm from 'Components/SignForm';

function OnlyMe() {
  const { email } = useSelector(selectUser);

  return (
    <SignForm
      initialValues={{
        type: DocumentTypes.ME,
        signers: [{ name: 'Me (now)', email, isPreparer: true, order: -1 }],
        recipients: [],
      }}
    />
  );
}

export default OnlyMe;
