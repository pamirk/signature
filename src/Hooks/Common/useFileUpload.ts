import { useState, useCallback } from 'react';
import { useAsyncAction } from 'Hooks/Common';
import Axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Action } from 'Interfaces/Common';

interface CancelUpload {
  (message?: string): void | undefined;
}
interface UploadPayload {
  file: File;
  options?: AxiosRequestConfig;
}

interface UploadAction<TPayload, TResponse> {
  (payload: UploadPayload & TPayload): TResponse;
}

export default <TPayload extends UploadPayload, TResponse>(
  action: Action<TPayload, TResponse>,
) => {
  const [cancelSource, setCancelSource] = useState<CancelTokenSource | null>(null);

  const [uploadFile, isLoading] = useAsyncAction(
    (actionPayload: UploadPayload & TPayload) => {
      const newCancelSource = Axios.CancelToken.source();

      setCancelSource(newCancelSource);

      const payload = {
        ...actionPayload,
        options: {
          ...actionPayload.options,
          cancelToken: newCancelSource.token,
        },
      };

      return action(payload);
    },
  );
  const cancelUpload: CancelUpload = useCallback(
    (message?: string) => cancelSource?.cancel(message),
    [cancelSource],
  );

  return [uploadFile, cancelUpload, isLoading] as const;
};
