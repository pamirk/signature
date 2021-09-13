import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TemplateMergePayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: TemplateMergePayload) =>
    $actions.document.mergeTemplate(dispatch, payload),
  );
};
