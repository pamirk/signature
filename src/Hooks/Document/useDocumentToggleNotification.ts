import { useDispatch } from 'react-redux';
import { DocumentDisableRemindersPayload } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: DocumentDisableRemindersPayload) =>
    $actions.document.toggleEmailNotification(dispatch, values),
  );
};
