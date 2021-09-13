import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((url: string) =>
    $actions.requisite.downloadFileByUrl(dispatch, url),
  );
};
