import { useDispatch } from 'react-redux';
import { FolderUpdatePayload } from 'Interfaces/Folder';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: FolderUpdatePayload) =>
    $actions.folder.updateFolder(dispatch, values),
  );
};
