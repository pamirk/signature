import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store/ducks';
import { Document } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(
    ({ documentId, hash }: { documentId: Document['id']; hash: string }) =>
      $actions.document.getDocumentByHash(dispatch, { documentId, hash }),
  );
};
