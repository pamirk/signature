import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { isEmpty } from 'lodash';
import { $actions } from 'Store/ducks';
import { useDispatch } from 'react-redux';
import Toast from 'Services/Toast';
import { SignedUrlResponse } from 'Interfaces/Common';
import useAsyncAction from './useAsyncAction';
import parsePath from 'path-parse';
import { formatFileName } from 'Utils/formatters';

interface FileInfo {
  fileKey?: string | null | undefined;
  fileName?: string | null | undefined;
  itemName?: string | null | undefined;
}

type FileExtractor<TItem> = (item: TItem) => FileInfo[];

interface DownloadPayload<TItem> {
  fileExtractors: FileExtractor<TItem>[];
  name?: string;
  hash?: string | null;
}

export default <TItem>({ fileExtractors, name, hash }: DownloadPayload<TItem>) => {
  const dispatch = useDispatch();

  const downloadFiles = useCallback(
    async (items: TItem[]) => {
      const zip = new JSZip();

      const filesInfo: FileInfo[] = [];
      items.forEach(item =>
        fileExtractors.forEach(fileExtractor => filesInfo.push(...fileExtractor(item))),
      );

      const currentDate = new Date();
      const date = new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
      );

      await Promise.all(
        filesInfo.map(async fileInfo => {
          const { fileKey, fileName, itemName } = fileInfo;

          try {
            if (!fileKey || !fileName || !itemName) return null;
            const documentId = parsePath(fileKey).name;
            const { result: signedUrl } = hash
              ? ((await $actions.user.getSignedGetUrlHash(dispatch, {
                  key: fileKey,
                  hash,
                  documentId,
                })) as SignedUrlResponse)
              : ((await $actions.user.getSignedGetUrl(dispatch, {
                  key: fileKey,
                })) as SignedUrlResponse);
            const data = await JSZipUtils.getBinaryContent(signedUrl);

            zip.file(`${documentId}/${formatFileName(fileName)}`, data, { date });
          } catch (e) {
            Toast.error(`File from ${itemName} not found`);
          }
        }),
      );

      if (!isEmpty(zip.files)) {
        try {
          const blob = await zip.generateAsync({ type: 'blob' });
          saveAs(blob, name ? `${name}.zip` : 'signaturely.zip');
          Toast.success('Files successfully downloaded!');
        } catch (error) {
          Toast.error(error.message);
        }
      } else {
        Toast.error('No files to download');
      }
    },
    [fileExtractors, hash, dispatch, name],
  );

  return useAsyncAction(downloadFiles);
};
