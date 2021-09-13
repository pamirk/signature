import { rootActions } from 'Store/ducks';
import { useDispatch } from 'react-redux';
import { EmptyAction } from 'typesafe-actions';
import { SocketConnectPayload } from 'Interfaces/Common';

interface ConnectSocketFunc {
  (payload: SocketConnectPayload): EmptyAction<string>;
}

interface DisconnectSocketFunc {
  (): EmptyAction<string>;
}

export default () => {
  const dispatch = useDispatch();

  return [
    ((payload: SocketConnectPayload): EmptyAction<string> =>
      dispatch(rootActions.user.connectSocket(payload))) as ConnectSocketFunc,
    ((): EmptyAction<string> =>
      dispatch(rootActions.user.disconnectSocket())) as DisconnectSocketFunc,
  ] as const;
};
