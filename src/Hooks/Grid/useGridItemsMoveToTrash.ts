import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { GridItemsDeletePayload } from 'Interfaces/Grid';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: GridItemsDeletePayload) =>
    $actions.grid.moveToTrashGridItems(dispatch, payload),
  );
};
