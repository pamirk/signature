import { useAsyncAction } from 'Hooks/Common';
import { FolderChangePermissionsPayload } from 'Interfaces/Folder';
import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: FolderChangePermissionsPayload) =>
    $actions.folder.changePermissions(dispatch, values),
  );
};
