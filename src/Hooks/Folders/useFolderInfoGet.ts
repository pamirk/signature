import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { Folder } from 'Interfaces/Folder';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: Folder['id']) =>
    $actions.folder.getFolderInfo(dispatch, payload),
  );
};
