import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { isEmpty } from 'lodash';
import { $actions } from 'Store/ducks';
import { useDispatch } from 'react-redux';
import Toast from 'Services/Toast';
import { SignedUrlResponse } from 'Interfaces/Common';
import parsePath from 'path-parse';
import { formatFileName } from 'Utils/formatters';
import { chunk } from 'lodash';

interface FileInfo {
  fileKey?: string | null | undefined;
  fileName?: string | null | undefined;
  itemName?: string | null | undefined;
  chunkIndex?: number | null | undefined;
}

type FileExtractor<TItem> = (item: TItem) => FileInfo[];

interface DownloadPayload<TItem> {
  fileExtractors: FileExtractor<TItem>[];
  name?: string;
  hash?: string | null;
  setChunks: (percentage: number, chunkIndex: number) => void;
}

export default <TItem>({
  fileExtractors,
  name,
  hash,
  setChunks,
}: DownloadPayload<TItem>) => {
  const dispatch = useDispatch();
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const downloadFiles = useCallback(
    async (items: TItem[]) => {
      const zip = new JSZip();

      const filesInfoArray: FileInfo[] = [];
      items.forEach(item =>
        fileExtractors.forEach(fileExtractor =>
          filesInfoArray.push(...fileExtractor(item)),
        ),
      );
      const filesCounter = filesInfoArray.filter(filesInfo => !!filesInfo.fileKey).length;

      const currentDate = new Date();
      const date = new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
      );

      for (const filesInfoChunk of chunk(filesInfoArray, 3)) {
        await wait(1000);
        await Promise.all(
          filesInfoChunk.map(async (fileInfo, index) => {
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

              setChunks((100 / filesCounter) * index, fileInfo.chunkIndex ?? 0);
              zip.file(`${documentId}/${formatFileName(fileName)}`, data, { date });
            } catch (e) {
              Toast.error(`File from ${itemName} not found`);
            }
          }),
        );
      }

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
    [fileExtractors, hash, dispatch, setChunks, name],
  );

  return downloadFiles;
};
