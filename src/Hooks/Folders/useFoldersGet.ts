import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { FolderIdPayload } from 'Interfaces/Folder';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: FolderIdPayload) =>
    $actions.folder.getFolder(dispatch, payload),
  );
};
