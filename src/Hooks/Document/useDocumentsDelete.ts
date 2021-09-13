import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { Document } from 'Interfaces/Document';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((documentIds: Document['id'][]) =>
    $actions.document.deleteDocuments(dispatch, { documentIds }),
  );
};
