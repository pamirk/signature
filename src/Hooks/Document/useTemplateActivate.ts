import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { TemplateActivatePayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: TemplateActivatePayload) =>
    $actions.document.activateTemplate(dispatch, payload),
  );
};
