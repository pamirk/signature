import { useDispatch } from 'react-redux';
import { DocumentIdPayload } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: DocumentIdPayload) =>
    $actions.document.disableForm(dispatch, values),
  );
};
