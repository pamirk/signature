import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';

interface ClearShowTrialSuccessPage {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const clearShowTrialSuccessPage: ClearShowTrialSuccessPage = useCallback(() => {
    dispatch(rootActions.user.clearShowTrialSuccessPage());
  }, [dispatch]);

  return [clearShowTrialSuccessPage] as const;
};
