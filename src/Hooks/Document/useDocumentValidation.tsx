import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Toast from 'Services/Toast';
import History from 'Services/History';
import {
  Document,
  DocumentTypes,
  Signer,
  DocumentBulkSendValues,
  BulkSendValidation,
  CsvEmailError,
} from 'Interfaces/Document';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { email as validateEmail } from 'Utils/validation';

type DocumentValidationError = string | undefined;

interface CheckDocumentValidity {
  (document: Document): string[];
}

export const checkForSignersDuplicates = (
  document: Document,
): DocumentValidationError => {
  const partialSigners = (document.signers || []).map(({ name, email, role }) => {
    return document.type === DocumentTypes.TEMPLATE ||
      document.type === DocumentTypes.FORM_REQUEST
      ? { role }
      : {
          name,
          email,
        };
  });
  const duplicateSigners = _.difference(
    partialSigners,
    _.uniqWith(partialSigners, _.isEqual),
  ) as Signer[];

  if (duplicateSigners.length) return 'One or more signers are identical';
};

export const checkForFileAttachment = (document: Document): DocumentValidationError => {
  if (!(document.parts.every(part => part.filesUploaded) || document.templateId)) {
    switch (document.type) {
      case DocumentTypes.TEMPLATE:
        return `Template must have a file attached`;
      case DocumentTypes.FORM_REQUEST:
        return `Form must have a file attached`;
      default:
        return `Document must have a file or template attached`;
    }
  }
};

export const checkForDocumentFields = (document: Document): DocumentValidationError => {
  const documentType = document.type === DocumentTypes.TEMPLATE ? 'Template' : 'Document';
  if (document.fields && !document.fields.length)
    return `${documentType} must have at least one field`;
};

export const checkForDocumentRequiredField = (
  document: Document,
): DocumentValidationError => {
  if (document.type === DocumentTypes.ME) return;
  const documentType = document.type === DocumentTypes.TEMPLATE ? 'Template' : 'Document';
  const requiredFields = document.fields.filter(field => field.required);
  if (requiredFields && !requiredFields.length)
    return `${documentType} must have at least one required field`;
};

export const checkForCurrentUserPresents = (document: Document, user: User) => {
  const isCurrentUserPresent = !!document.signers?.find(
    signer => signer.email === user.email,
  );
  if (!isCurrentUserPresent) return 'Current user must be in document signers list';
};

export const checkForCurrentUserFields = (document: Document, user: User) => {
  const isCurrentUserAssigned = document.signers.find(signer => {
    const signerField = document.fields.find(
      documentField => documentField.signerId === signer.id,
    );

    return signerField && (signer.isPreparer || signer.email === user.email);
  });

  if (!isCurrentUserAssigned) {
    return 'You have no fields assigned to you';
  }
};

export const checkForOtherSignersFieldsAssign = (document: Document, user: User) => {
  const unusedSigner = document.signers.find(
    signer =>
      signer.userId !== user.id &&
      (signer.name !== user.name || signer.email !== user.email) &&
      !document.fields.find(documentField => documentField.signerId === signer.id),
  );

  if (unusedSigner)
    return `Signer "${unusedSigner.name}" (${unusedSigner.email}) has no fields assigned`;
};

export const checkForUnusedSigners = (document: Document) => {
  const unusedSigner = document.signers?.find(
    signer =>
      !document.fields.find(documentField => documentField.signerId === signer.id),
  );

  if (unusedSigner) {
    const { subjectType, subject } =
      document.type !== DocumentTypes.TEMPLATE &&
      document.type !== DocumentTypes.FORM_REQUEST
        ? {
            subjectType: 'Signer',
            subject: `"${unusedSigner.name}" (${unusedSigner.email})`,
          }
        : {
            subjectType: 'Role',
            subject: unusedSigner.role,
          };
    return `${subjectType} ${subject} has no fields assigned`;
  }
};

export const checkForUnattachedFields = (document: Document): DocumentValidationError => {
  const unattachedField = document.fields.find(documentField => !documentField.signerId);
  const documentType = document.type === DocumentTypes.TEMPLATE ? 'Template' : 'Document';

  if (unattachedField) {
    return `${documentType} has one or more fields without signer`;
  }
};

const navigateToOnlyMe = () => History.push('only-me');

export const getDocumentValidationMeta = (type: DocumentTypes) =>
  type === DocumentTypes.ME_AND_OTHER
    ? {
        signers: {
          minLength: 2,
          showMessage: () =>
            Toast.warn(
              <div>
                Are you the only signer? Please use Only Me option instead.
                <br />
                <span style={{ textDecoration: 'underline' }} onClick={navigateToOnlyMe}>
                  Go to Only Me
                </span>
              </div>,
              { closeOnClick: true },
            ),
        },
      }
    : {
        signers: {
          minLength: 1,
          showMessage: () => Toast.error('Document must have at least one signer'),
        },
      };

export const checkSigners = (
  values: DocumentBulkSendValues,
): (CsvEmailError | undefined)[] => {
  if (values.signers && values.signers.length > 25) {
    return [{ index: 0, message: 'Signers list must contain at most 25 elements' }];
  }

  return values.signers
    ? values.signers.map((signer, index, signers) => {
        if (!signer?.name && !signer?.email) {
          return { index, message: 'Empty line' };
        }

        if (!signer?.name) {
          return { index, message: 'Signer has no name' };
        }

        if (!signer?.email) {
          return { index, message: 'Signer has no email' };
        }

        const isDuplicated = !!signers
          .slice(0, index)
          .find(prevSigner => _.isEqual(prevSigner, signer));

        if (isDuplicated) {
          return { index, message: 'Signer is duplicated' };
        }

        return (
          validateEmail(signer?.email) && {
            message: 'Email is invalid',
            index,
          }
        );
      })
    : [];
};

export const useBulkSendValidation = () => {
  const checkBulkSendValues = useCallback(
    (values: DocumentBulkSendValues) =>
      ({
        errors: checkSigners(values).filter(value => value !== undefined),
      } as BulkSendValidation),
    [],
  );
  return checkBulkSendValues;
};

export const useDocumentValidation = () => {
  const user: User = useSelector(selectUser);

  const checkDocumentValidity: CheckDocumentValidity = useCallback(
    (document: Document) => {
      const validationalDocument = {
        ...document,
        signers: document.signers.filter(signer => !signer.isPreparer),
      } as Document;
      const validationErrors = [
        checkForFileAttachment(validationalDocument),
        checkForSignersDuplicates(validationalDocument),
        checkForDocumentFields(validationalDocument),
        checkForDocumentRequiredField(validationalDocument),
        checkForUnattachedFields(validationalDocument),
      ];

      const documentWithTemplateErrors = [
        checkForSignersDuplicates(validationalDocument),
      ];

      const otherValidationErrors =
        document.type === DocumentTypes.ME_AND_OTHER
          ? [
              checkForCurrentUserPresents(validationalDocument, user),
              checkForCurrentUserFields(document, user),
              checkForOtherSignersFieldsAssign(validationalDocument, user),
            ]
          : [checkForUnusedSigners(validationalDocument)];
      return validationalDocument.templateId
        ? (documentWithTemplateErrors.filter(Boolean) as string[])
        : ([...validationErrors, ...otherValidationErrors].filter(Boolean) as string[]);
    },
    [user],
  );

  return checkDocumentValidity;
};
