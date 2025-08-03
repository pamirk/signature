import { useAsyncAction } from 'Hooks/Common';
import { DocumentValues } from 'Interfaces/Document';
import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: DocumentValues) =>
    $actions.document.createDocumentByExistTemplate(dispatch, { values }),
  );
};
