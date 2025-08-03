import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TemplatesAllGetPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload?: TemplatesAllGetPayload) =>
    $actions.document.getAllTemplates(dispatch, payload),
  );
};
