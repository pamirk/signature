import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { RemindersSendPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: RemindersSendPayload) =>
    $actions.documentSign.sendReminders(dispatch, payload),
  );
};
