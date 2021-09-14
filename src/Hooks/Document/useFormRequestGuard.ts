import { useCallback, useEffect, useState } from 'react';
import { Document } from 'Interfaces/Document';
import { useSelector } from 'react-redux';
import { selectDocument } from 'Utils/selectors';
import useFormRequestGet from './useFormRequestGet';

interface DocumentGuardParams {
  documentId?: Document['id'];
  onFailure?: (error) => void;
  onSuccess?: (document: Document) => void;
}

type isCheckingDocument = {} | boolean;

export default ({ documentId, onFailure, onSuccess }: DocumentGuardParams) => {
  const document = useSelector(state => selectDocument(state, { documentId }));
  const [getDocument, isGettingDocument] = useFormRequestGet();
  const [isCheckingDocument, setIsCheckingDocument] = useState<isCheckingDocument>(true);

  const checkDocument = useCallback(async () => {
    try {
      if (!documentId) throw new Error('Document id is not spicified');

      const checkedDocument =
        document || ((await getDocument({ documentId })) as Document);
      onSuccess && onSuccess(checkedDocument);
    } catch (error) {
      onFailure && onFailure(error);
    }
  }, [document, documentId, getDocument, onFailure, onSuccess]);

  useEffect(() => {
    checkDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsCheckingDocument(isGettingDocument);
  }, [isGettingDocument]);

  return isCheckingDocument;
};
