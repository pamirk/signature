import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { DocumentTypes } from 'Interfaces/Document';

import SignForm from 'Components/SignForm';

function MeAndOthers() {
  const { email, name } = useSelector(selectUser);

  return (
    <SignForm
      initialValues={{
        type: DocumentTypes.ME_AND_OTHER,
        signers: [
          { name: 'Me (now)', email, isPreparer: true, order: -1 },
          { name: name || 'No name', email, order: 1 },
          { order: 2 },
        ],
      }}
    />
  );
}

export default MeAndOthers;
