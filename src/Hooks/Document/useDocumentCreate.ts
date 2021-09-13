import { useDispatch } from 'react-redux';
import { DocumentValues } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: DocumentValues) =>
    $actions.document.createDocument(dispatch, { values }),
  );
};
