import { useFileUpload } from 'Hooks/Common';
import { useDispatch } from 'react-redux';
import { FilePutPayload } from 'Services/AWS';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useFileUpload<FilePutPayload, ReturnType<typeof $actions.user.putCompanyLogo>>(
    payload => $actions.user.putAvatar(dispatch, payload),
  );
};
