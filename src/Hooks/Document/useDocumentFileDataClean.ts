import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { DocumentPartIdPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentPartIdPayload) =>
    $actions.document.cleanFileData(dispatch, payload),
  );
};
