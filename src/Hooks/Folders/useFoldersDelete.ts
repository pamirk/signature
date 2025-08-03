import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { Folder } from 'Interfaces/Folder';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((folderIds: Folder['id'][]) =>
    $actions.folder.deleteFolders(dispatch, { folderIds }),
  );
};
