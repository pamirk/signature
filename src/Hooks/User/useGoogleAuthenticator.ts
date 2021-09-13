import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { CodePayload } from 'Interfaces/Profile';

export default () => {
  const dispatch = useDispatch();

  const [disable, isDisableLoading] = useAsyncAction((payload: CodePayload) =>
    $actions.user.disableGoogleAuthenticator(dispatch, payload),
  );

  const [enable, isEnableLoading] = useAsyncAction(() =>
    $actions.user.enableGoogleAuthenticator(dispatch),
  );

  const [verify, isVerifyLoading] = useAsyncAction((payload: CodePayload) =>
    $actions.user.verifyGoogleCode(dispatch, payload),
  );

  return [
    enable,
    verify,
    disable,
    isDisableLoading || isEnableLoading || isVerifyLoading,
  ] as const;
};
