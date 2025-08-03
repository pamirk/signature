import { useAsyncAction } from 'Hooks/Common';
import { DocumentActivitiesDownloadPayload } from 'Interfaces/Document';
import { useDispatch } from 'react-redux';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentActivitiesDownloadPayload) =>
    $actions.document.getDocumentActivitiesDownloadUrl(dispatch, payload),
  );
};
