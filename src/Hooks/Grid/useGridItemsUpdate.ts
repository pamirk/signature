import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { GridUpdatePayload } from 'Interfaces/Grid';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: GridUpdatePayload) =>
    $actions.grid.updateGrid(dispatch, values),
  );
};
