import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { FilePutPayload } from 'Services/AWS';
import { useFileUpload } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useFileUpload<FilePutPayload, ReturnType<typeof $actions.user.putCompanyLogo>>(
    payload => $actions.user.putCompanyLogo(dispatch, payload),
  );
};
