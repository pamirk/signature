import { useDispatch } from 'react-redux';
import { EmptyAction } from 'typesafe-actions';
import { rootActions } from 'Store';

interface JoinSocketRoom {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  return [
    ((): EmptyAction<string> =>
      dispatch(rootActions.user.joinSocketRoom())) as JoinSocketRoom,
  ] as const;
};
