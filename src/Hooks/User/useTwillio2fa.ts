import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import {
  PhoneCodePayload,
  CodeGeneratePayload,
  PhoneVerifyPayload,
} from 'Interfaces/Profile';

export default () => {
  const dispatch = useDispatch();

  const [disable, isDisableLoading] = useAsyncAction(async (payload: PhoneCodePayload) =>
    $actions.user.disableTwillio2fa(dispatch, payload),
  );

  const [enable, isEnableLoading] = useAsyncAction((payload: CodeGeneratePayload) =>
    $actions.user.generateCode(dispatch, payload),
  );

  const [verify, isVerifyLoading] = useAsyncAction((payload: PhoneVerifyPayload) =>
    $actions.user.verifyPhone(dispatch, payload),
  );

  return [
    enable,
    verify,
    disable,
    isDisableLoading || isEnableLoading || isVerifyLoading,
  ] as const;
};
