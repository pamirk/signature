import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { SigningRemindersUnlinkPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: SigningRemindersUnlinkPayload) =>
    $actions.documentSign.unlinkSigningReminders(dispatch, payload),
  );
};
