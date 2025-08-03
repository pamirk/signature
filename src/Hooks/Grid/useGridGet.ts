import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { GridGetPayload } from 'Interfaces/Grid';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: GridGetPayload) =>
    $actions.grid.getGrid(dispatch, payload),
  );
};
