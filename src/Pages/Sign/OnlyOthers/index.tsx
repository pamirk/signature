import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { DocumentTypes } from 'Interfaces/Document';

import SignForm from 'Components/SignForm';

function OnlyOthers() {
  const { email } = useSelector(selectUser);

  return (
    <SignForm
      initialValues={{
        type: DocumentTypes.OTHERS,
        signers: [{ name: 'Me (now)', email, isPreparer: true, order: -1 }, { order: 1 }],
      }}
    />
  );
}

export default OnlyOthers;
