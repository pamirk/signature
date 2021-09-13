import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
// @ts-ignore
import JSZipUtils from 'jszip-utils';
import { isEmpty } from 'lodash';
import { $actions } from 'Store/ducks';
import { useDispatch } from 'react-redux';
import Toast from 'Services/Toast';
import { SignedUrlResponse } from 'Interfaces/Common';
import useAsyncAction from './useAsyncAction';
import parsePath from 'path-parse';

interface DownloadPayload<TItem> {
  fileExtractor: (
    item: TItem,
  ) => {
    fileKey: string | null;
    fileName: string | null;
    itemName: string | null;
  };
}

export default <TItem>({ fileExtractor }: DownloadPayload<TItem>) => {
  const dispatch = useDispatch();

  const downloadFiles = useCallback(
    async (items: TItem[]) => {
      const zip = new JSZip();
      await Promise.all(
        items.map(async item => {
          const { fileKey, fileName, itemName } = fileExtractor(item);

          try {
            if (!fileKey || !fileName || !itemName) return null;

            const { result: signedUrl } = (await $actions.user.getSignedGetUrl(dispatch, {
              key: fileKey,
            })) as SignedUrlResponse;

            const data = await JSZipUtils.getBinaryContent(signedUrl);
            const documentId = parsePath(fileKey).name;
            zip.file(`${documentId}/${fileName}`, data);
          } catch (e) {
            Toast.error(`File from ${itemName} not found`);
          }
        }),
      );

      if (!isEmpty(zip.files)) {
        try {
          const blob = await zip.generateAsync({ type: 'blob' });
          saveAs(blob, 'signaturely.zip');
          Toast.success('Files successfully downloaded!');
        } catch (error:any) {
          Toast.error(error.message);
        }
      } else {
        Toast.error('No files to download');
      }
    },
    [fileExtractor, dispatch],
  );

  return useAsyncAction(downloadFiles);
};
