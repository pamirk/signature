import {
  DocumentField,
  DocumentFieldUpdatePayload,
  DocumentFieldTypes,
} from 'Interfaces/DocumentFields';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDocument, selectUser } from 'Utils/selectors';
import { getCurrentDate } from 'Utils/functions';
import { User } from 'Interfaces/User';

export default (field: DocumentField) => {
  const document = useSelector(state =>
    selectDocument(state, { documentId: field.documentId }),
  );
  const { name: userName } = useSelector(selectUser) as User;
  const signer = useMemo(
    () => document?.signers.find(signer => signer.id === field.signerId),
    [document, field.signerId],
  );

  const handleSignerChange = useCallback(
    signerId => {
      if (signerId === signer?.id) return;

      let updatePayload = {
        signerId,
        type: field.type,
      } as Partial<DocumentFieldUpdatePayload>;

      if (field.type === DocumentFieldTypes.Signature) {
        updatePayload['availableSignatureTypes'] = field.availableSignatureTypes;
      }

      const nextSigner = document?.signers.find(signer => signer.id === signerId);
      const isChangedToPreparer = !!(!signer?.isPreparer && nextSigner?.isPreparer);
      const isChangedFromPreparer = !!(signer?.isPreparer && !nextSigner?.isPreparer);

      switch (field.type) {
        case DocumentFieldTypes.Name:
        case DocumentFieldTypes.Text:
        case DocumentFieldTypes.Date: {
          if (isChangedToPreparer) {
            updatePayload = {
              ...updatePayload,
              text:
                field.type === DocumentFieldTypes.Date
                  ? getCurrentDate(
                      field.dateFormat as NonNullable<DocumentField['dateFormat']>,
                    )
                  : field.type === DocumentFieldTypes.Name
                  ? userName
                  : null,
            };
          } else if (isChangedFromPreparer) {
            updatePayload = {
              ...updatePayload,
              text: null,
            };
          }

          break;
        }
        case DocumentFieldTypes.Checkbox: {
          if (isChangedToPreparer) {
            updatePayload = {
              ...updatePayload,
              checked: true,
            };
          } else if (isChangedFromPreparer) {
            updatePayload = {
              ...updatePayload,
              checked: false,
            };
          }

          break;
        }
        case DocumentFieldTypes.Initials:
        case DocumentFieldTypes.Signature: {
          if (isChangedFromPreparer) {
            updatePayload = {
              ...updatePayload,
              requisiteId: null,
            };
          }
        }
      }

      return updatePayload;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signer, field.type, field.availableSignatureTypes, field.dateFormat, document],
  );

  return handleSignerChange;
};
