import { useDispatch } from 'react-redux';
import { FormRequestDocumentValues } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: FormRequestDocumentValues) =>
    $actions.document.createDocumentFromFormRequest(dispatch, values),
  );
};
