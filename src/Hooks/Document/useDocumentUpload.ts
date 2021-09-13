import { useDispatch } from 'react-redux';
import { AxiosRequestConfig } from 'axios';
import { $actions } from 'Store/ducks';
import { useFileUpload } from 'Hooks/Common';
import { DocumentUploadPayload } from 'Interfaces/Document';

export default (options?: AxiosRequestConfig) => {
  const dispatch = useDispatch();

  return useFileUpload<
    DocumentUploadPayload,
    ReturnType<typeof $actions.document.uploadDocument>
  >(payload =>
    $actions.document.uploadDocument(dispatch, {
      ...payload,
      options: {
        ...options,
        ...payload.options,
      },
    }),
  );
};
