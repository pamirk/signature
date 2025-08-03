import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { findKey } from 'lodash';
import { SignedUrlResponse } from 'Interfaces/Common';
import { useRequisitePut, useSignedPutUrl } from 'Hooks/User';
import { MIME_TYPES } from 'Utils/constants';
import { selectUser } from 'Utils/selectors';

export default () => {
  const { id: userId } = useSelector(selectUser);
  const [getSignedPutUrl, isPutUrlLoading] = useSignedPutUrl();
  const [putRequisite, isPutRequisiteLoading] = useRequisitePut();

  const uploadToBacket = useCallback(
    async (file: File, id: string) => {
      const fileExt = findKey(MIME_TYPES, mimeType => mimeType === file.type);
      const fileName = `${id}${fileExt}`;
      const key = `requisite/${userId}/${fileName}`;
      const { result: putUrl } = (await getSignedPutUrl({
        key,
      })) as SignedUrlResponse;
      await putRequisite({
        url: putUrl,
        file: file,
      });
      return key;
    },
    [getSignedPutUrl, putRequisite, userId],
  );

  return [uploadToBacket, isPutUrlLoading || isPutRequisiteLoading] as [
    (file: File, id: string) => Promise<string>,
    boolean,
  ];
};
